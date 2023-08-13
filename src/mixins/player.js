import { mapState } from 'vuex';

export default {
  computed: {
    ...mapState(['playList'])
  },
  watch: {
    playList(val) {
      this.handlePlayList(val);
    }
  },
  mounted() {
    this.handlePlayList(this.playList);
  },
  activated() {
    this.handlePlayList(this.playList);
  },
  methods: {
    handlePlayList() {
      throw new Error('component must implement handlePlayList method');
    }
  }
}
