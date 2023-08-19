<template>
  <transition name="slide" appear>
    <div class="u-me">
      <header class="header">
        <i class="icon icon-back" @click="back"></i>
        <b-switch :value="active" :list="switchList" @change="changeSwitch" />
      </header>
      <div class="button-wrapper">
        <b-button @click.native="clickButton">
          <i class="icon icon-play"></i>
        </b-button>
      </div>
      <div class="content" ref="content">
        <b-scroll ref="scrollFancy" v-show="!active">
          <c-list :data="fancyList" @click="clickItem" />
        </b-scroll>
        <b-scroll ref="scrollPlay" v-show="active">
          <c-list :data="playHistory" @click="clickItem" />
        </b-scroll>
      </div>
    </div>
  </transition>
</template>

<script>
import { mapState, mapActions } from 'vuex';
import cList from '@/components/c-list.vue';
import { playerMixin } from '@/mixins';

export default {
  name: 'u-me',
  components: {
    cList
  },
  mixins: [playerMixin],
  data() {
    return {
      active: 0
    }
  },
  computed: {
    ...mapState(['fancyList', 'playHistory'])
  },
  created() {
    this.switchList = [
      {
        key: 'fancy',
        value: '我喜欢的'
      },
      {
        key: 'play',
        value: '最近播放'
      }
    ];
  },
  methods: {
    ...mapActions(['randomPlay', 'insertSong']),
    handlePlayList(list) {
      const height = list?.length ? 60 : 0;
      this.$refs.content.style.bottom = height + 'px';
      this.refresh();
    },
    back() {
      this.$router.go(-1);
    },
    changeSwitch(active) {
      this.active = active;
      this.refresh();
    },
    clickButton() {
      const list = this.active ? this.playHistory : this.fancyList;
      this.randomPlay(list);
    },
    clickItem(item) {
      this.insertSong(item);
    },
    refresh() {
      this.$nextTick(() => {
        if (!this.active) {
          this.$refs.scrollFancy.refresh();
        } else {
          this.$refs.scrollPlay.refresh();
        }
      });
    }
  }
}

</script>

<style lang="less" scoped>
.slide-enter, .slide-leave-to {
  transform: translateX(100%);
}
.u-me {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: var(--color-background);
  transition: all 0.3s;
  z-index: 1;
}
.header {
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 44px;
  .icon {
    position: absolute;
    top: 13px;
    left: 13px;
    font-size: 18px;
    color: var(--color-theme);
  }
}
.button-wrapper {
  display: flex;
  justify-content: center;
  margin: 20px 0;
}
.content {
  position: absolute;
  top: 116px;
  left: 0;
  right: 0;
  bottom: 0;
  overflow: hidden;
}
</style>