<template>
  <transition appear name="slide">
    <c-music :title="singer.name" :pic="singer.pic" :songs="songs"></c-music>
  </transition>
</template>

<script>
import { mapGetters } from 'vuex';
import cMusic from '@/components/c-music.vue';
import { getSingerDetail } from '@/services/singer';
import { processSongs } from '@/services/song';

export default {
  name: 'u-singer-detail',
  data() {
    return {
      songs: []
    };
  },
  computed: {
    ...mapGetters(['singer'])
  },
  created() {
    if (!this.singer.mid) {
      this.$router.replace({
        path: '/singer'
      });
      return;
    }
    this.getSingerDetail();
  },
  methods: {
    async getSingerDetail() {
      let { songs } = await getSingerDetail(this.singer);
      songs = await processSongs(songs);
      this.songs = songs;
    }
  },
  components: {
    cMusic
  }
};
</script>

<style lang="less" scoped>
.slide-enter-active,
.slide-leave-active {
  transition: transform 0.3s;
}
.slide-enter,
.slide-leave-to {
  transform: translateX(100%);
}
</style>
