<template>
  <transition name="slide">
    <div class="b-top-tip" v-show="visible" @click.stop="hide">
      <div class="content">
        <i class="icon icon-ok"></i>
        <span class="text">{{ text }}</span>
      </div>
    </div>
  </transition>
</template>

<script>
export default {
  name: 'b-top-tip',
  props: {
    text: String,
    delay: {
      type: Number,
      default: 3000
    }
  },
  data() {
    return {
      visible: false
    };
  },
  methods: {
    show() {
      this.visible = true;
      this.setTimer();
    },
    hide() {
      this.visible = false;
      this.clearTimer();
    },
    setTimer() {
      this.clearTimer();
      this.timer = setTimeout(() => {
        this.hide();
      }, this.delay);
    },
    clearTimer() {
      clearTimeout(this.timer);
    }
  }
};
</script>

<style lang="less" scoped>
.slide-enter, .slide-leave-to {
  transform: translateY(-100%);
}
.b-top-tip {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  background-color: var(--color-background-d);
  .backdrop-filter-blur(5px);
  transition: all 0.3s;
}
.content {
  display: flex;
  justify-content: center;
  align-items: center;
  column-gap: 8px;
  height: 44px;
  font-size: var(--font-size-medium);
  .icon {
    color: var(--color-theme);
  }
  .text {
    color: var(--color-text-ll);
  }
}
</style>
