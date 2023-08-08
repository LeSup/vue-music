<template>
  <div class="b-play-progress">
    <svg class="icon">
      <use :href="iconHref" />
    </svg>
    <svg class="progress">
      <circle class="progress__circle" cx="16" cy="16" r="12" :stroke-dasharray="strokeDasharray" />
    </svg>
  </div>
</template>

<script>
export default {
  props: {
    playing: [Boolean],
    percent: [Number]
  },
  computed: {
    iconHref() {
      return this.playing ? '#icon_pause_thin' : '#icon_play_thin';
    },
    /**
     * 圆形进度条实现
     * 1、底层是播放、暂停svg图标
     * 2、上层是圆形svg，通过设置其描边虚线长度、间距实现
     */
    strokeDasharray() {
      const len = Math.PI * 12 * 2;
      return `${len * this.percent}, ${len}`;
    }
  }
}

</script>
<style lang="less" scoped>
.b-play-progress {
  position: relative;
    
  .icon {
    width: 32px;
    height: 32px;
    color: var(--color-theme);
    fill: currentColor;
    stroke: currentColor;
    stroke-width: 0;
  }
  .progress {
    position: absolute;
    top: 0;
    left: 0;
    z-index: 2;
    width: 32px;
    height: 32px;
    transform: rotate(-90deg);
  }
  .progress__circle {
    fill: none;
    stroke: var(--color-theme);
    stroke-width: 2px;
  }
}
</style>