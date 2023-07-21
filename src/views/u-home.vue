<template>
  <div class="home">
    <b-scroll>
      <div>
        <div class="slide-wrapper">
          <div class="slide-container">
            <b-slide v-if="sliders.length">
              <div class="slide-item" v-for="item in sliders" :key="item.id">
                <img class="slide-item-image" :src="item.pic" alt="" />
              </div>
            </b-slide>
          </div>
        </div>
        <div class="recommend">
          <h1 class="recommend-title" v-if="albums.length">热门推荐</h1>
          <ul class="recommend-list">
            <li class="recommend-item" v-for="item in albums" :key="item.id">
              <div class="recommend-item-image">
                <img class="image" v-lazy="item.pic" alt="" />
              </div>
              <div class="recommend-item-content">
                <div class="title">{{ item.title }}</div>
                <div class="username">{{ item.username }}</div>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </b-scroll>
    <b-loading v-if="!albums.length"></b-loading>
  </div>
</template>

<script>
import bLoading from '@/bases/b-loading.vue';
import bScroll from '@/bases/b-scroll.vue';
import bSlide from '@/bases/b-slide.vue';
import { getRecommend } from '@/services/recommend';

export default {
  name: 'u-home',
  data() {
    return {
      sliders: [],
      albums: []
    };
  },
  created() {
    this.getRecommend();
  },
  methods: {
    async getRecommend() {
      const { sliders, albums } = await getRecommend();
      this.sliders = sliders;
      this.albums = albums;
    }
  },
  components: {
    bLoading,
    bScroll,
    bSlide
  }
};
</script>

<style lang="less" scoped>
.home {
  height: calc(100vh - 88px);
  overflow: hidden;
}
// 轮播图
.slide-wrapper {
  position: relative;
  padding-top: 40%;
}
.slide-container {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
}
.slide-item {
  width: 100vw;
  height: 100%;
}
.slide-item-image {
  display: block;
  width: 100%;
  height: 100%;
}

// 推荐列表
.recommend-title {
  height: 65px;
  line-height: 65px;
  text-align: center;
  font-size: var(--font-size-medium);
  color: var(--color-theme);
}
.recommend-item {
  display: flex;
  align-items: center;
  padding: 0 20px 20px 20px;
}
.recommend-item-image {
  margin-right: 20px;
  width: 60px;
  height: 60px;
  .image {
    width: 100%;
    height: 100%;
  }
}
.recommend-item-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  line-height: 20px;
  font-size: var(--font-size-medium);
  min-width: 0;
  .title {
    margin-bottom: 10px;
    color: var(--color-text);
    .ellipsis();
  }
  .username {
    color: var(--color-text-l);
    .ellipsis();
  }
}
</style>
