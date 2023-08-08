import { get } from './base';

export function processSongs(songs) {
  if (!songs.length) {
    return Promise.resolve(songs);
  }

  return get('/api/getSongsUrl', {
    mid: songs.map((song) => song.mid)
  }).then((result) => {
    const { map } = result;
    return songs
      .map((song) => {
        song.url = map[song.mid];
        return song;
      })
      .filter((song) => {
        return song.url?.indexOf('vkey') > -1;
      });
  });
}

const cachedLyric = {};

export function getLyric(song) {
  if (song.lyric) {
    return Promise.resolve(song.lyric);
  }

  const mid = song.mid;
  if (cachedLyric[mid]) {
    return Promise.resolve(cachedLyric[mid]);
  }

  return get('/api/getLyric', { mid }).then((result) => {
    const { lyric } = result || {};
    return (cachedLyric[mid] = lyric || '');
  });
}
