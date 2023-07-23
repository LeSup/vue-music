<template>
  <transition appear name="slide">
    <c-music :title="rank.name" :pic="rank.pic" :songs="songs" rank></c-music>
  </transition>
</template>

<script>
import { mapGetters } from 'vuex';
import cMusic from '@/components/c-music.vue';
import { getTopDetail } from '@/services/top-list';

export default {
  name: 'u-rank-detail',
  data() {
    return {
      songs: []
    };
  },
  computed: {
    ...mapGetters(['rank'])
  },
  created() {
    if (!this.rank.id) {
      this.$router.replace({
        path: '/rank'
      });
      return;
    }
    this.getTopDetail();
  },
  methods: {
    async getTopDetail() {
      const { songs } = await getTopDetail(this.rank);
      this.songs = songs;
    }
  },
  components: {
    cMusic
  }
}
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