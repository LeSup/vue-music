import { shuffle } from '@/utils';
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
