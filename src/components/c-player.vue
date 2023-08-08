<template>
  <transition appear name="fade" v-if="playSong">
    <div class="c-player">
      <div class="player" v-show="fullScreen">
        <div class="bottom" :style="bottomPic">
          <div class="bottom-filter"></div>
        </div>
        <header class="header">
          <i class="header-icon icon-back" @click="toggleFullScreen"></i>
          <div class="header-title">
            <h1 class="primary">{{ playSong.name }}</h1>
            <h2 class="minor">{{ playSong.singer }}</h2>
          </div>
        </header>
        <main class="middle">
          <div
            class="middle-swipe"
            @touchstart="handleTouchStart"
            @touchmove="handleTouchMove"
            @touchend="handleTouchEnd"
          >
            <div class="middle-swipe-l" ref="swipeL">
              <div class="l-cd-wrapper">
                <div class="l-cd-image">
                  <img
                    class="image rotating"
                    :class="{ 'rotating--paused': !this.playing }"
                    :src="playSong.pic"
                  />
                </div>
              </div>
              <div class="l-txt" v-show="!loading" v-html="curTxt"></div>
            </div>
            <div class="middle-swipe-r" ref="swipeR">
              <b-scroll ref="scroll" v-if="lyricLines.length">
                <ul class="lyric-list">
                  <li
                    ref="lyricItem"
                    class="lyric-item"
                    :class="{ active: curLine === index }"
                    v-for="(item, index) in lyricLines"
                    :key="index"
                  >
                    <span v-html="item.txt"></span>
                  </li>
                </ul>
              </b-scroll>
              <div class="no-lyric" v-else v-html="curTxt"></div>
            </div>
            <div class="middle-swipe-dots">
              <i class="dot" :class="{ active: swipe === 'cd' }"></i
              ><i class="dot" :class="{ active: swipe === 'lyric' }"></i>
            </div>
          </div>
        </main>
        <footer class="footer">
          <div class="footer-progress">
            <div class="time time--l">{{ playedDuration }}</div>
            <b-progress-bar class="progress" :value="percent" @change="handleChange"></b-progress-bar>
            <div class="time time--r">{{ songDuration }}</div>
          </div>
          <div class="footer-controls">
            <i class="icon" :class="modeCls" @click="toggleMode"></i>
            <i class="icon icon-prev" @click="playPrev"></i>
            <i class="icon" :class="playCls" @click="handlePlay"></i>
            <i class="icon icon-next" @click="playNext"></i>
            <i class="icon icon-not-favorite"></i>
          </div>
        </footer>
      </div>
      <div class="mini" v-show="!fullScreen" @click="toggleFullScreen">
       <div class="mini-container">
        <div class="mini-cd">
          <img
            class="image rotating"
            :class="{ 'rotating--paused': !this.playing }"
            :src="playSong.pic"
          />
        </div>
        <div class="mini-desc">
          <div class="mini-title">{{ playSong.name }}</div>
          <div class="mini-lyric">
            <transition name="text-scroll" mode="out-in">
              <p class="txt" :key="curTxt" v-html="curTxt"></p>
            </transition>
          </div>
        </div>
        <div class="mini-control" @click.stop="handlePlay">
          <b-play-progress :percent="percent" :playing="playing"></b-play-progress>
        </div>
        <div class="mini-control">
          <div class="icon icon-playlist"></div>
        </div>
       </div>
      </div>
      <audio
        ref="audio"
        :src="playSong.url"
        @timeupdate="handleTimeUpdate"
        @canplay="handleCanplay"
        @ended="handleEnd"
      />
    </div>
  </transition>
</template>

<script>
import { mapGetters, mapMutations, mapActions } from 'vuex';
import LyricParser from 'lyric-parser';
import { getLyric } from '@/services/song';
import { format } from '@/utils';
import { PlayMode } from '@/store/constants';

export default {
  name: 'c-player',
  data() {
    return {
      fullScreen: true,
      lyricLines: [],
      curLine: 0,
      percent: 0,
      swipe: 'cd',
      loading: false,
    };
  },
  computed: {
    ...mapGetters(['playSong', 'playing', 'playMode']),
    bottomPic() {
      return { backgroundImage: `url(${this.playSong.pic})` };
    },
    playedDuration() {
      return format(Math.floor(this.percent * this.playSong.duration));
    },
    songDuration() {
      return format(this.playSong.duration);
    },
    modeCls() {
      switch (this.playMode) {
        case PlayMode.sequence:
          return 'icon-sequence';
        case PlayMode.random:
          return 'icon-random';
        default:
          return 'icon-loop';
      }
    },
    playCls() {
      return this.playing ? 'icon-play' : 'icon-pause';
    },
    miniPlayCls() {
      return this.playing ? 'icon-play-mini' : 'icon-pause-mini';
    },
    curTxt() {
      if (this.loading) {
        return '歌词加载中，请稍后';
      } else {
        if (!this.lyricLines.length) {
          return '此歌曲为纯音乐，请欣赏';
        } else {
          return this.lyricLines[this.curLine]?.txt;
        }
      }
    }
  },
  watch: {
    playSong(val, oldVal) {
      // 通过 mid 判断下是否是同一歌曲
      if (val?.mid === oldVal?.mid) {
        return;
      }
      this.clear();
      this.getLyric(val);
    }
  },
  mounted() {
    this.canplay = false; // 歌曲能否播放
    this.currentTime = 0; // 歌曲播放时长
    this.lyricParser = null; // 歌词解析器
    this.clientWidth = window.innerWidth;
    this.clientHeight = window.innerHeight;
  },
  methods: {
    ...mapMutations(['setPlaying']),
    ...mapActions(['playPrev', 'playNext', 'toggleMode']),
    async getLyric(song) {
      this.loading = true;
      const lyric = await getLyric(song);
      song.lyric = lyric;
      this.initLyricParser(lyric);
      this.loading = false;
    },
    initLyricParser(lyric) {
      const lyricParser = new LyricParser(lyric, this.lyricParserCb);
      this.lyricLines = lyricParser.lines;
      if (this.canplay) {
        lyricParser.seek(this.currentTime);
      }
      this.lyricParser = lyricParser;
      console.log(lyricParser);
    },
    handleChange(percent) {
      const currentTime = Math.floor(this.playSong.duration * percent);
      this.percent = percent;
      this.currentTime = currentTime * 1000;
      this.$refs.audio.currentTime = currentTime;
      this.togglePlay(true);
    },
    handlePlay() {
      this.togglePlay(!this.playing);
    },
    toggleFullScreen() {
      this.fullScreen = !this.fullScreen;
    },
    /* audio事件 */
    handleCanplay() {
      if (this.canplay) {
        return;
      }
      this.canplay = true;
      this.togglePlay(true);
    },
    handleEnd() {
      if (PlayMode.loop === this.playMode) {
        this.handleChange(0);
      } else {
        this.playNext();
      }
    },
    handleTimeUpdate(e) {
      if (!this.canplay) {
        return;
      }
      const { currentTime, duration } = e.target;
      this.percent = currentTime / duration;
      this.currentTime = currentTime * 1000;
    },
    /* audio事件 */
    /* 唱片、歌词滑动事件 */
    handleTouchStart(e) {
      this.touch = {
        pageX: e.touches[0].pageX,
        pageY: e.touches[0].pageY,
        ratio: 0, // 滑动距离占页面宽度比
        moved: false // 歌词页面是否移动过
      };
    },
    handleTouchMove(e) {
      const { pageX, pageY } = this.touch;
      const touch = e.touches[0];
      const deltaX = touch.pageX - pageX;
      const deltaY = touch.pageY - pageY;
      if (Math.abs(deltaY) >= Math.abs(deltaX)) {
        return;
      }

      
      const swipe = this.swipe;
      let opacity, translateX;
      // 左滑，唱片逐渐透明、歌词向左移动
      if (swipe === 'cd' && deltaX < 0) {
        opacity = Math.max(0, (this.clientWidth + deltaX) / this.clientWidth);
        translateX = Math.max(-this.clientWidth, deltaX);
      // 右滑，唱片慢慢显示、歌词向右移动
      } else if (swipe === 'lyric' && deltaX > 0) {
        opacity = Math.min(1, deltaX / this.clientWidth);
        translateX = Math.min(deltaX - this.clientWidth, 0);
      }

      if (opacity || translateX) {
        this.$refs.swipeL.style.opacity = opacity;
        this.$refs.swipeR.style.transform = `translateX(${translateX}px)`;
        this.$refs.swipeL.style.transition = 'unset';
        this.$refs.swipeR.style.transition = 'unset';
        this.touch.moved = true;
      }
      this.touch.ratio = Math.abs(deltaX / this.clientWidth);
    },
    handleTouchEnd() {
      const { moved, ratio } = this.touch;
      if (moved) {
        let swipe = this.swipe,
          opacity,
          translateX;

        if ((swipe === 'cd' && ratio >= 0.4) || (swipe === 'lyric' && ratio < 0.4)) {
          opacity = 0;
          translateX = -this.clientWidth;
          swipe = 'lyric';
        } else {
          opacity = 1;
          translateX = 0;
          swipe = 'cd';
        }

        this.$refs.swipeL.style.opacity = opacity;
        this.$refs.swipeR.style.transform = `translateX(${translateX}px)`;
        this.$refs.swipeL.style.transition = 'all 0.3s';
        this.$refs.swipeR.style.transition = 'all 0.3s';
        this.swipe = swipe;
      }
    },
    /* 唱片、歌词滑动事件 */
    lyricParserCb({ lineNum }) {
      this.curLine = lineNum;
      if (lineNum > 6) {
        this.$refs.scroll.scrollToElement(this.$refs.lyricItem[lineNum - 6], 100);
      }
    },
    togglePlay(bool) {
      if (bool) {
        this.setPlaying(true);
        this.$refs.audio.play();
        this.lyricParser?.seek(this.currentTime);
      } else {
        this.setPlaying(false);
        this.$refs.audio.pause();
        this.lyricParser?.stop();
      }
    },
    // 切换歌曲前的清理操作
    clear() {
      this.canplay = false;
      this.currentTime = 0;
      // 暂停歌曲滚动，且置空（以防存在多个parser）
      this.lyricParser?.stop();
      this.lyricParser = null;
      this.lyricLines = [];
      this.percent = 0;
    }
  }
};
</script>

<style lang="less" scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3;
}
.fade-enter,
.fade-leave-to {
  opacity: 0;
}
.player {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
}
// 底片
.bottom {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-position: center center;
  background-size: cover;
  &-filter {
    height: 100%;
    .backdrop-filter-blur(16px);
    background-color: var(--color-background-d);
  }
}
.header {
  position: relative;
  padding: 0 40px;
}
.header-icon {
  position: absolute;
  top: 10px;
  left: 10px;
  font-size: 20px;
  color: var(--color-theme);
  transform: rotate(-90deg);
}
.header-title {
  text-align: center;
  color: var(--color-text);
  .primary {
    height: 44px;
    font-size: var(--font-size-large);
    line-height: 44px;
  }
  .minor {
    font-size: var(--font-size-medium);
    line-height: 1;
  }
}

.middle {
  position: absolute;
  top: 58px;
  left: 0;
  right: 0;
  bottom: calc(96px + 10vw);
}
.middle-swipe {
  position: relative;
  display: flex;
  padding-bottom: 20px;
  height: 100%;
  box-sizing: border-box;
  overflow: hidden;
}
.middle-swipe-l,
.middle-swipe-r {
  position: relative;
  flex-shrink: 0;
  width: 100vw;
  height: 100%;
  overflow: hidden;
}
.middle-swipe-r {
  margin: 20px 0;
  height: calc(100% - 40px);
}
.l-cd-wrapper {
  position: relative;
  margin: 32px auto;
  padding-top: 80vw;
  width: 80vw;
}
.l-cd-image {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  .image {
    width: 100%;
    height: 100%;
    border: 10px solid var(--color-text-d);
    border-radius: 50%;
    box-sizing: border-box;
  }
}
.l-txt {
  padding: 0 20px;
  height: 32px;
  text-align: center;
  font-size: var(--font-size-medium);
  line-height: 32px;
  color: var(--color-text);
  .ellipsis();
}
.middle-swipe-dots {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 6px;
  display: flex;
  margin: 0 auto;
  width: max-content;
  .dot {
    width: 8px;
    height: 8px;
    border-radius: 4px;
    background-color: var(--color-text-d);
    &:last-child {
      margin-left: 4px;
    }
    &.active {
      width: 16px;
      background-color: var(--color-text);
    }
  }
}
.lyric-list,.no-lyric {
  padding: 0 20px;
  text-align: center;
  font-size: var(--font-size-medium);
  line-height: 32px;
  color: var(--color-text-l);
}
.lyric-list .active {
  color: var(--color-text);
}
.no-lyric {
  position: absolute;
  top: 50%;
  left: 0;
  right: 0;
  transform: translateY(-50%);
  color: var(--color-text);
}

.footer {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0vw;
  margin: 20px 0 10vw;
}
.footer-progress {
  display: flex;
  align-items: center;
  margin: 0 10vw 20px;
  .time {
    font-size: var(--font-size-small);
    &--l {
      margin-right: 6px;
    }
    &--r {
      margin-left: 6px;
    }
  }
  .progress {
    flex: 1;
  }
}
.footer-controls {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 0 10vw;
  color: var(--color-theme);
  .icon {
    font-size: 30px;
    &:nth-child(3) {
      font-size: 40px;
    }
  }
  .icon-favorite {
    color: var(--color-sub-theme);
  }
}

.mini {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: var(--color-background);
}
.mini-container {
  display: flex;
  align-items: center;
  margin: 0 20px;
  height: 60px;
}
.mini-cd {
  .square(40px);
  .image {
    display: block;
    width: 100%;
    height: 100%;
    border-radius: 50%;
  }
}
.mini-desc {
  flex: 1;
  margin-left: 10px;
  min-width: 0;
}
.mini-title {
  font-size: var(--font-size-medium);
  color: var(--color-text);
  .ellipsis();
}
.mini-lyric {
  margin-top: 8px;
  height: 18px;
  line-height: 18px;
  font-size: var(--font-size-small);
  color: var(--color-text-l);
  overflow: hidden;
  .txt {
    transition: all 0.1s;
    .ellipsis();
  }
}
.text-scroll-enter {
  transform: translateY(18px);
}
.text-scroll-leave-to {
  transform: translateY(-18px);
}
.mini-control {
  margin-left: 10px;
  font-size: 24px;
  color: var(--color-theme);
}

.rotating {
  animation: rotate 20s 0s linear infinite;
  &--paused {
    animation-play-state: paused;
  }
}
@keyframes rotate {
  to {
    transform: rotate(0deg);
  }
  from {
    transform: rotate(-360deg);
  }
}
</style>
