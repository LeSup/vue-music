<template>
  <div class="b-scroll" ref="scroll">
    <slot></slot>
  </div>
</template>

<script>
import BScroll from '@better-scroll/core';
import ObserveDOM from '@better-scroll/observe-dom';

BScroll.use(ObserveDOM);

export default {
  name: 'b-scroll',
  props: {
    probeType: {
      type: Number,
      default: 0
    },
    click: {
      type: Boolean,
      default: true
    }
  },
  mounted() {
    this.init();
  },
  beforeDestroy() {
    this.bs.destroy()
  },
  methods: {
    init() {
      this.bs = new BScroll(this.$refs.scroll, {
        observeDOM: true,
        probeType: this.probeType,
        click: this.click
      })

      if (this.$listeners.scroll) {
        this.bs.on('scroll', (position) => {
          this.$emit('scroll', position);
        });
      }
    },
    scrollToElement(...args) {
      this.bs.scrollToElement(...args);
    }
  }
}

</script>

<style lang="less" scoped>
.b-scroll {
  position: relative;
  height: 100%;
}
</style>