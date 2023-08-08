<template>
  <div class="b-progress">
    <div ref="track" class="b-progress-track" @click.stop="handleClick">
      <div ref="trackBar" class="b-progress-track-bar"></div>
    </div>
    <div
      ref="thumb"
      class="b-progress-thumb"
      @touchstart.stop="handleTouchStart"
      @touchmove.stop="handleTouchMove"
      @touchend.stop="handleTouchEnd"
    ></div>
  </div>
</template>

<script>
export default {
  name: 'b-progress-bar',
  model: {
    prop: 'value',
    event: 'change'
  },
  props: {
    value: Number
  },
  watch: {
    value(val) {
      if (this.touch.flag) {
        return;
      }
      this.setPos(val);
    }
  },
  created() {
    this.trackX = 0;
    this.trackWidth = 0;
    this.touch = {};
  },
  mounted() {
    this.init();
  },
  methods: {
    init() {
      // 获取进度轨道 rect
      const track = this.$refs.track;
      const { x, width } = track.getBoundingClientRect();
      this.trackX = x;
      this.trackWidth = width;
    },
    handleClick(e) {
      const pageX = e.pageX;
      const percent = (pageX - this.trackX) / this.trackWidth;
      this.$emit('change', percent);
    },
    handleTouchStart(e) {
      this.touch = {
        pageX: e.touches[0].pageX,
        value: this.value,
        percent: 0,
        flag: true
      };
    },
    handleTouchMove(e) {
      const { flag, pageX, value } = this.touch;
      if (flag) {
        const deltaX = e.touches[0].pageX - pageX;
        let percent = value + deltaX / this.trackWidth;
        percent = Math.min(1, Math.max(0, percent));

        this.touch.percent = percent;
        this.setPos(percent);
      }
    },
    handleTouchEnd() {
      const { flag, percent } = this.touch;
      if (flag) {
        this.touch.flag = false;
        this.$emit('change', percent);
      }
    },
    setPos(value) {
      this.$refs.trackBar.style.right = `${(1 - value) * 100}%`;
      this.$refs.thumb.style.transform = `translateX(${this.trackWidth * value}px)`;
    }
  }
};
</script>

<style lang="less" scoped>
.b-progress {
  position: relative;
  padding: 0 8px;
  height: 16px;
}
.b-progress-track {
  position: relative;
  top: 6px;
  height: 4px;
  border-radius: 2px;
  background-color: var(--color-background-l);
}
.b-progress-track-bar {
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  border-radius: 2px;
  background-color: var(--color-theme);
}
.b-progress-thumb {
  position: absolute;
  top: 0;
  left: 0;
  width: 10px;
  height: 10px;
  border: 3px solid var(--color-text);
  background-color: var(--color-theme);
  border-radius: 8px;
}
</style>
