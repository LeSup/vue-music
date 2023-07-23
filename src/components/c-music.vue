<template>
  <div class="c-music">
    <header class="header">
      <i class="header-icon icon-back" @click="back"></i>
      <h1 class="header-title">{{title}}</h1>
    </header>
    <div class="pic" :class="{active: fixed}" :style="picStyle" ref="pic">
      <div class="pic-blur" ref="blur"></div>
      <div class="pic-button" v-show="!fixed">
        <b-button @click.native="handlePlay">
          <i class="icon icon-play"></i>
        </b-button>
      </div>
    </div>
    <div class="song-wrapper">
      <b-scroll :probeType="3" @scroll="handleScroll" class="song-list">
        <c-list :data="songs" :rank="rank"></c-list>
      </b-scroll>
      <!-- 绝对定位的父级是绝对定位时，存在bug -->
      <b-loading v-if="!songs.length"></b-loading>
    </div>
  </div>
</template>

<script>
import cList from '@/components/c-list.vue';

const MAX_BLUR = 10;
const HEADER_HEIGHT = 40;

export default {
  name: 'c-music',
  props: {
    title: {
      type: String,
      default: ''
    },
    pic: {
      type: String,
      default: ''
    },
    songs: {
      type: Array,
      default() {
        return []
      }
    },
    rank: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      fixed: false
    };
  },
  computed: {
    picStyle() {
      return { backgroundImage: `url(${this.pic})` }
    }
  },
  created() {
    // 向下滚动高度=图片高度
    this.maxScrollDownHeight = window.innerWidth * 0.7;
    // 向上滚动高度=图片高度-header高度
    this.maxScrollUpHeight = this.maxScrollDownHeight - HEADER_HEIGHT;
  },
  methods: {
    back() {
      this.$router.go(-1);
    },
    handleScroll(position) {
      const { y } = position;
      if (y < 0) {
        this._scrollUp(y);
      } else {
        this._scrollDown(y);
      }
    },
    handlePlay() {
      console.log(123);
    },
    _scrollUp(y) {
      let blur = 0, fixed = false;

      blur = Math.min(MAX_BLUR, -y / this.maxScrollUpHeight * MAX_BLUR);
      if (-y > this.maxScrollUpHeight) {
        fixed = true;
      }

      this.fixed = fixed;
      this.$refs.blur.style['backdrop-filter'] = `blur(${blur}px)`;
    },
    _scrollDown(y) {
      // 放大图片：滚动高度/图片高度
      const scale = 1 + Math.min(1, y / this.maxScrollDownHeight);

      this.$refs.pic.style.transform = `scale(${scale})`;
    }
  },
  components: {
    cList
  }
}
</script>

<style lang="less" scoped>
.c-music {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: var(--color-background);
  overflow: hidden;
}

.header {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  padding: 0 40px;
  height: 40px;
  line-height: 40px;
  text-align: center;
  z-index: 2;
}
.header-icon {
  position: absolute;
  top: 10px;
  left: 10px;
  font-size: 20px;
  color: var(--color-theme);
}
.header-title {
  font-size: var(--font-size-large);
  color: var(--color-text);
  .ellipsis();
}

.pic {
  position: relative;
  height: 70vw;
  transform-origin: top center;
  background-size: 100%;
  &.active {
    height: 40px;
    z-index: 1;
  }
}
.pic-blur {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  // 防止图片过白时，header文字看不见
  background-color: var(--color-background-d);
  
}
.pic-button {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 20px;
  display: flex;
  justify-content: center;
}

.song-wrapper {
  position: absolute;
  top: 70vw;
  left: 0;
  right: 0;
  bottom: 0;
}
</style>