<template>
  <transition appear name="slide">
    <c-music :title="album.title" :pic="album.pic" :songs="songs"></c-music>
  </transition>
</template>

<script>
import { mapGetters } from 'vuex';
import cMusic from '@/components/c-music.vue';
import { getAlbum } from '@/services/recommend';
import { processSongs } from '@/services/song';

export default {
  name: 'u-album',
  data() {
    return {
      songs: []
    };
  },
  computed: {
    ...mapGetters(['album'])
  },
  created() {
    if (!this.album.id) {
      this.$router.replace({
        path: '/home'
      });
      return;
    }
    this.getAlbum();
  },
  methods: {
    async getAlbum() {
      let { songs } = await getAlbum(this.album);
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
