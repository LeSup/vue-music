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
  "https://y.gtimg.cn/mediastyle/music_v11/extra/default_300x300.jpg?max_age=31536000";

// 公共参数
const commonParams = {
  g_tk: token,
  loginUin: 0,
  hostUin: 0,
  inCharset: "utf8",
  outCharset: "utf-8",
  notice: 0,
  needNewCode: 0,
  format: "json",
  platform: "yqq.json",
};

// 获取一个随机数值
function getRandomVal(prefix = "") {
  return prefix + (Math.random() + "").replace("0.", "");
}

// 获取一个随机 uid
function getUid() {
  const t = new Date().getUTCMilliseconds();
  return "" + ((Math.round(2147483647 * Math.random()) * t) % 1e10);
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
  })
}

// 简化singer
function convertSinger(singerList) {
  return singerList.map(singer => ({
    id: singer.singer_id,
    mid: singer.singer_mid,
    name: singer.singer_name,
    pic: singer.singer_pic.replace(/\.webp$/, '.jpg').replace('150x150', '800x800')
  }));
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
    '_': randomVal,
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
          sliderItem.link = jumpPrefixMap[item.jumptype] + (item.subid || item.id) + ".html";
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
  })
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
    '_': randomKey,
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
  })
})

app.listen(port, (err) => {
  if (err) {
    console.log(err);
    return;
  }

  console.log('server is listening on %d', port);
});
