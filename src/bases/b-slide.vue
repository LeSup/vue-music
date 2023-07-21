<template>
  <div class="b-slide" ref="slide">
    <div class="b-slide-group">
      <slot></slot>
    </div>
    <div class="b-slide-dots">
      <div
        class="b-slide-dot"
        :class="{ active: index === current }"
        v-for="(item, index) in $slots.default"
        :key="index"
      ></div>
    </div>
  </div>
</template>

<script>
import BScroll from '@better-scroll/core';
import Slide from '@better-scroll/slide';

BScroll.use(Slide);

// dom 更新时，需要重新刷新bs，否则不会轮播

export default {
  name: 'b-slide',
  data() {
    return {
      current: 0
    };
  },
  mounted() {
    this.init();
  },
  beforeDestroy() {
    this.bs.destroy();
  },
  methods: {
    init() {
      this.bs = new BScroll(this.$refs.slide, {
        click: true,
        scrollX: true,
        scrollY: false,
        momentum: false,
        bounce: false,
        probeType: 2,
        slide: true
      });

      this.bs.on('slidePageChanged', (page) => {
        this.current = page.pageX;
      });
    }
  }
};
</script>

<style lang="less" scoped>
.b-slide {
  position: relative;
}
.b-slide-group {
  display: flex;
  width: max-content;
  height: 100%;
}
.b-slide-dots {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 8px;
  display: flex;
  margin: 0 auto;
  width: max-content;
}
.b-slide-dot {
  width: 8px;
  height: 8px;
  border-radius: 8px;
  background-color: var(--color-text-l);
  &.active {
    width: 16px;
    background-color: var(--color-text);
  }
  &:not(:first-child) {
    margin-left: 4px;
  }
}
</style>
