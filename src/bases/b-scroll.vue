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
    this.bs?.destroy()
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

      if (this.$listeners.scrollEnd) {
        this.bs.on('scrollEnd', (pos) => {
          // 距离底部50px时触发
          if (this.bs.y < this.bs.maxScrollY + 50) {
            this.$emit('scrollEnd', pos);
          }
        });

        // 修复内容不超出容器高度时，不触发scrollEnd的问题
        this.bs.on('beforeScrollStart', (pos) => {
          const content = this.bs.content;
          if (content.clientHeight < content.parentNode.clientHeight) {
            this.$emit('scrollEnd', pos);
          }
        });
      }
    },
    scrollToElement(...args) {
      this.bs?.scrollToElement(...args);
    },
    refresh() {
      this.bs?.refresh();
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