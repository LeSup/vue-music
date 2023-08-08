export default {
  album: state => state.album,
  singer: state => state.singer,
  rank: state => state.rank,
  playSong: state => state.playList[state.playIndex],
  playIndex: state => state.playIndex,
  playing: state => state.playing,
  playMode: state => state.playMode
}
