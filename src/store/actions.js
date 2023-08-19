import { shuffle } from '@/utils';
import { search, fancy, play } from '@/utils/cache';
import { findIndex } from '@/utils/array';
import { PlayMode } from './constants';

// 随机播放
export function randomPlay({ commit }, list) {
  commit('setSongList', list);
  commit('setPlayList', shuffle(list));
  commit('setPlayIndex', 0);
  commit('setPlaying', true);
  commit('setPlayMode', PlayMode.random);
}

export function sequencePlay({ commit }, { songs, index }) {
  commit('setSongList', songs);
  commit('setPlayList', songs);
  commit('setPlayIndex', index);
  commit('setPlaying', true);
  commit('setPlayMode', PlayMode.sequence);
}

export function clearPlay({ commit }) {
  commit('setSongList', []);
  commit('setPlayList', []);
  commit('setPlayIndex', -1);
  commit('setPlaying', false);
}

export function removePlay({ commit, state }, index) {
  const { playList, songList, playIndex, playing } = state;
  
  const selectSong = playList[index];
  const songIndex = findIndex(songList, i => i.id === selectSong.id);
  const newSongList = [...songList];
  newSongList.splice(songIndex, 1);
  const newPlayList = [...playList];
  newPlayList.splice(index, 1);
  const newPlayIndex = index < playIndex ? (playIndex - 1) : playIndex;
  const newPlaying = newPlayList.length ? playing : false;

  commit('setSongList', newSongList);
  commit('setPlayList', newPlayList);
  commit('setPlayIndex', newPlayIndex);
  commit('setPlaying', newPlaying);
}

// 播放上一首
export function playPrev({ commit, state }) {
  const { playIndex, playList } = state;
  
  let index,
    len = playList.length;
  if (playIndex === 0) {
    index = len - 1;
  } else {
    index = playIndex - 1;
  }

  commit('setPlayIndex', index);
}

// 播放下一首
export function playNext({ commit, state }) {
  const { playIndex, playList } = state;
  
  let index,
    len = playList.length;
  if (playIndex === len - 1) {
    index = 0;
  } else {
    index = playIndex + 1;
  }

  commit('setPlayIndex', index);
}

// 切换播放模式
export function toggleMode({ commit, state, getters }) {
  const { playMode, songList } = state;
  const { playSong } = getters;

  const mode = (playMode + 1) % 3;
  // 随机模式时，需重新洗牌，并且取到当前播放歌曲的下标
  if (mode === PlayMode.random) {
    const playList = shuffle(songList);
    const playIndex = playList.findIndex(song => song.mid === playSong.mid);
    commit('setPlayList', playList);
    commit('setPlayIndex', playIndex);
  }
  commit('setPlayMode', mode);
}

// 删除列表中重复的项，并在当前项的后面插入
function spliceArray(list, current, insert) {
  // 当前项在列表中的位置
  let cIdx = findIndex(list, i => i.id === current.id);
  // 要插入的项在列表中的位置
  let dIdx = findIndex(list, i => i.id === insert.id);

  let idx
  if (dIdx === -1) {
    idx = cIdx + 1;
  } else {
    if (idx < cIdx) {
      idx = cIdx;
    } else if (idx > cIdx) {
      idx = cIdx + 1;
    }
    if (idx !== cIdx) {
      list.splice(idx, 1);
    }
  }

  if (idx >= 0) {
    list.splice(idx, 0, insert);
  } else {
    idx = cIdx;
  }

  return idx;
}

// 插入歌曲
export function insertSong({ commit, state, getters }, song) {
  const { songList, playList } = state;
  const { playSong } = getters;

  const newPlayList = [...playList];
  let pIdx = spliceArray(newPlayList, playSong, song);

  const newSongList = [...songList];
  spliceArray(newSongList, playSong, song);

  commit('setSongList', newSongList);
  commit('setPlayList', newPlayList);
  commit('setPlayIndex', pIdx);
}

export function saveSearchHistory({ commit }, val) {
  commit('setSearchHistory', search.save(val));
}

export function removeSearchHistory({ commit }, val) {
  commit('setSearchHistory', search.remove(val));
}

export function clearSearchHistory({ commit }) {
  commit('setSearchHistory', search.clear());
}

export function saveFancy({ commit }, val) {
  commit('setFancyList', fancy.save(val));
}

export function removeFancy({ commit }, val) {
  commit('setFancyList', fancy.remove(val));
}

export function savePlayHistory({ commit }, val) {
  commit('setPlayHistory', play.save(val));
}
