import { mapState, mapActions } from 'vuex';
import { PlayMode } from '@/store/constants';

export default {
  computed: {
    ...mapState(['playMode']),
    modeCls() {
      switch (this.playMode) {
        case PlayMode.sequence:
          return 'icon-sequence';
        case PlayMode.random:
          return 'icon-random';
        default:
          return 'icon-loop';
      }
    },
    modeTxt() {
      switch (this.playMode) {
        case PlayMode.sequence:
          return '顺序播放';
        case PlayMode.random:
          return '随机播放';
        default:
          return '单曲循环';
      }
    }
  },
  methods: {
    ...mapActions(['toggleMode'])
  }
}
