import { search, fancy, play } from '@/utils/cache';
import { PlayMode } from './constants';

export default {
  album: {},
  singer: {},
  rank: {},
  songList: [],
  playList: [],
  playIndex: -1,
  playing: false,
  playMode: PlayMode.sequence,
  searchHistory: search.load(),
  fancyList: fancy.load(),
  playHistory: play.load(),
}
