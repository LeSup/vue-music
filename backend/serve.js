const express = require('express');
const pinyin = require('pinyin');
const cookieParser = require('cookie-parser');
const axios = require('axios');
const getSecuritySign = require('./sign.js');

const ERR_OK = 0;
const token = 5381;
const port = process.env.PORT || 9000;
const dev = process.env.NODE_ENV === 'development';

// 歌曲图片加载失败时使用的默认图片
const fallbackPicUrl =
  'https://y.gtimg.cn/mediastyle/music_v11/extra/default_300x300.jpg?max_age=31536000';

// 公共参数
const commonParams = {
  g_tk: token,
  loginUin: 0,
  hostUin: 0,
  inCharset: 'utf8',
  outCharset: 'utf-8',
  notice: 0,
  needNewCode: 0,
  format: 'json',
  platform: 'yqq.json'
};

// 获取一个随机数值
function getRandomVal(prefix = '') {
  return prefix + (Math.random() + '').replace('0.', '');
}

// 获取一个随机 uid
function getUid() {
  const t = new Date().getUTCMilliseconds();
  return '' + ((Math.round(2147483647 * Math.random()) * t) % 1e10);
}

function get(url, params) {
  return axios.get(url, {
    headers: {
      referer: 'https://y.qq.com/',
      origin: 'https://y.qq.com/'
    },
    params: Object.assign({}, commonParams, params)
  });
}

function post(url, params) {
  return axios.post(url, params, {
    referer: 'https://y.qq.com/',
    origin: 'https://y.qq.com/',
    'Content-Type': 'application/x-www-form-urlencoded'
  });
}

// 简化singer
function convertSinger(singerList) {
  return singerList.map((singer) => ({
    id: singer.singer_id,
    mid: singer.singer_mid,
    name: singer.singer_name,
    pic: singer.singer_pic.replace(/\.webp$/, '.jpg').replace('150x150', '800x800')
  }));
}

// 合并歌手
function mergeSinger(singer) {
  if (!singer) {
    return '';
  }

  return singer.map(item => item.name).join('/');
}

// 构造歌曲列表
function handleSongList(list) {
  const songList = [];

  list.forEach((item) => {
    const info = item.songInfo || item;

    // 过滤付费歌曲和获取不到时长的歌曲
    if (info.pay.pay_play !== 0 || !info.interval) {
      return;
    }

    songList.push({
      id: info.id,
      mid: info.mid,
      name: info.name,
      singer: mergeSinger(info.singer),
      url: '', // 播放地址，
      duration: info.interval,
      pic: info.album.mid
        ? `https://y.gtimg.cn/music/photo_new/T002R800x800M000${info.album.mid}.jpg?max_age=2592000`
        : fallbackPicUrl,
      album: info.album.name
    });
  });

  return songList;
}

const app = express();

app.use(cookieParser());

// 注册推荐列表接口
app.get('/api/getRecommend', (req, res) => {
  const url = 'https://u.y.qq.com/cgi-bin/musics.fcg';

  const data = JSON.stringify({
    comm: { ct: 24 },
    recomPlaylist: {
      method: 'get_hot_recommend',
      param: { async: 1, cmd: 2 },
      module: 'playlist.HotRecommendServer'
    },
    focus: {
      module: 'music.musicHall.MusicHallPlatform',
      method: 'GetFocus',
      param: {}
    }
  });

  const randomVal = getRandomVal('recom');
  const sign = getSecuritySign(data);

  get(url, {
    sign,
    _: randomVal,
    data
  }).then((response) => {
    const data = response.data;

    if (data.code === ERR_OK) {
      const focusList = data.focus.data.shelf.v_niche[0].v_card;
      const sliders = [];
      const jumpPrefixMap = {
        10002: 'https://y.qq.com/n/yqq/album/',
        10014: 'https://y.qq.com/n/yqq/playlist/',
        10012: 'https://y.qq.com/n/yqq/mv/v/'
      };

      // 处理轮播数据
      const len = Math.min(focusList.length, 10);
      for (let i = 0; i < len; i++) {
        const item = focusList[i];
        const sliderItem = {};
        // 轮播包含id、pic、link字段
        sliderItem.id = item.id;
        sliderItem.pic = item.cover;
        if (jumpPrefixMap[item.jumptype]) {
          sliderItem.link = jumpPrefixMap[item.jumptype] + (item.subid || item.id) + '.html';
        } else if (item.jumptype === 3001) {
          sliderItem.link = item.id;
        }

        sliders.push(sliderItem);
      }

      // 处理推荐歌单数据
      const albumList = data.recomPlaylist.data.v_hot;
      const albums = [];
      for (let i = 0, len = albumList.length; i < len; i++) {
        const item = albumList[i];
        const albumItem = {};

        albumItem.id = item.content_id;
        albumItem.username = item.username;
        albumItem.title = item.title;
        albumItem.pic = item.cover;

        albums.push(albumItem);
      }

      res.json({
        code: ERR_OK,
        result: {
          sliders,
          albums
        }
      });
    } else {
      res.json(data);
    }
  });
});

// 注册歌单专辑接口
app.get('/api/getAlbum', (req, res) => {
  const data = {
    req_0: {
      module: 'srf_diss_info.DissInfoServer',
      method: 'CgiGetDiss',
      param: {
        disstid: Number(req.query.id),
        song_begin: 0,
        song_num: 100
      }
    },
    comm: {
      g_tk: token,
      uin: '0',
      format: 'json',
      platform: 'h5'
    }
  };

  const randomVal = getRandomVal();
  const sign = getSecuritySign(JSON.stringify(data));
  const url = `https://u.y.qq.com/cgi-bin/musics.fcg?=${randomVal}&sign=${sign}`;

  post(url, data).then((response) => {
    const data = response.data;
    if (data.code === ERR_OK) {
      const list = data.req_0.data.songlist;
      const songList = handleSongList(list);

      res.json({
        code: ERR_OK,
        result: {
          songs: songList
        }
      });
    } else {
      res.json(data);
    }
  });
});

// 注册歌手列表接口
app.get('/api/getSingerList', (req, res) => {
  const url = 'https://u.y.qq.com/cgi-bin/musics.fcg';
  const HOT_NAME = '热';

  const data = JSON.stringify({
    comm: { ct: 24, cv: 0 },
    singerList: {
      module: 'Music.SingerListServer',
      method: 'get_singer_list',
      param: { area: -100, sex: -100, genre: -100, index: -100, sin: 0, cur_page: 1 }
    }
  });

  const randomKey = getRandomVal('getUCGI');
  const sign = getSecuritySign(data);

  get(url, {
    sign,
    _: randomKey,
    data
  }).then((response) => {
    const data = response.data;
    if (data.code === ERR_OK) {
      const singerList = data.singerList.data.singerlist;

      /**
       * [key]: {
       *   title: key,
       *   list: [singer]
       * }
       */
      const singerMap = {};

      for (let i = 0, len = singerList.length; i < len; i++) {
        const singer = singerList[i];
        // 朴树 [ [ 'pǔ' ], [ 'shù' ] ]
        const p = pinyin(singer.singer_name);
        if (!p || !p.length) {
          continue;
        }

        const key = p[0][0].slice(0, 1).toUpperCase();
        if (key) {
          if (!singerMap[key]) {
            singerMap[key] = {
              title: key,
              list: []
            };
          }
          singerMap[key].list.push(convertSinger([singer])[0]);
        }
      }

      const singers = [];
      for (const key in singerMap) {
        const item = singerMap[key];
        if (/[a-zA-Z]/.test(key)) {
          singers.push(item);
        }
      }

      singers.sort((a, b) => a.title.charCodeAt(0) - b.title.charCodeAt(0));
      singers.unshift({
        title: HOT_NAME,
        list: convertSinger(singerList.slice(0, 10))
      });

      res.json({
        code: ERR_OK,
        result: { singers }
      });
    } else {
      res.json(data);
    }
  });
});

// 注册歌手详情接口
app.get("/api/getSingerDetail", (req, res) => {
  const url = "https://u.y.qq.com/cgi-bin/musics.fcg";

  const data = JSON.stringify({
    comm: { ct: 24, cv: 0 },
    singerSongList: {
      method: "GetSingerSongList",
      param: { order: 1, singerMid: req.query.mid, begin: 0, num: 100 },
      module: "musichall.song_list_server",
    },
  });

  const randomKey = getRandomVal("getSingerSong");
  const sign = getSecuritySign(data);

  get(url, {
    sign,
    "-": randomKey,
    data,
  }).then((response) => {
    const data = response.data;
    if (data.code === ERR_OK) {
      const list = data.singerSongList.data.songList;
      const songList = handleSongList(list);

      res.json({
        code: ERR_OK,
        result: {
          songs: songList,
        },
      });
    } else {
      res.json(data);
    }
  });
});

// 注册歌曲url接口
app.get('/api/getSongsUrl', (req, res) => {
  const mid = req.query.mid;

  let midGroup = [];
  // 第三方接口只支持最多处理 100 条数据，所以如果超过 100 条数据，我们要把数据按每组 100 条切割，发送多个请求
  if (mid.length > 100) {
    const group = Math.ceil(mid.length / 100);
    for (let i = 0; i < group; i++) {
      midGroup.push(mid.slice(i * 100, (i + 1) * 100));
    }
  } else {
    midGroup = [mid];
  }

  // 歌曲url获取成功后保存
  const urlMap = {};

  // 分组请求歌曲url，成功后保存至map
  function process(mid) {
    const data = {
      req_0: {
        module: "vkey.GetVkeyServer",
        method: "CgiGetVkey",
        param: {
          guid: getUid(),
          songmid: mid,
          songtype: new Array(mid.length).fill(0),
          uin: "0",
          loginflag: 0,
          platform: "23",
          h5to: "speed",
        },
      },
      comm: {
        g_tk: token,
        uin: "0",
        format: "json",
        platform: "h5",
      },
    };

    const sign = getSecuritySign(JSON.stringify(data));
    const randomVal = getRandomVal();
    const url = `https://u.y.qq.com/cgi-bin/musics.fcg?_=${randomVal}&sign=${sign}`;

    return post(url, data)
      .then(response => {
        const data = response.data;
        if (data.code === ERR_OK) {
          const midInfo = data.req_0.data.midurlinfo;
          const sip = data.req_0.data.sip;
          const domain = sip[sip.length - 1];

          // 保存歌曲url至map
          midInfo.forEach(info => {
            urlMap[info.songmid] = domain + info.purl;
          })
        }
      })
  }

  // 并行请求midGroup
  Promise
    .all(midGroup.map(mid => process(mid)))
    .then(() => {
      res.json({
        code: ERR_OK,
        result: {
          map: urlMap
        }
      });
    });
});

app.listen(port, (err) => {
  if (err) {
    console.log(err);
    return;
  }

  console.log('server is listening on %d', port);
});
