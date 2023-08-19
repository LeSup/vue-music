<template>
  <transition name="slide">
    <div class="c-add-song" v-show="visible" @click.stop>
      <header class="header">
        <h1 class="title">添加歌曲到对列</h1>
        <i class="icon icon-close" @click="hide"></i>
      </header>
      <div class="search-wrapper">
        <b-search v-model="search" placeholder="搜索歌手"></b-search>
      </div>
      <div v-show="!search">
        <div class="switch-wrapper">
          <b-switch :value="active" :list="switchList" @change="changeSwitch"></b-switch>
        </div>
        <div class="content">
          <b-scroll v-show="active === 0" ref="scrollPlay">
            <c-list :data="playHistory" @click="clickPlay"></c-list>
          </b-scroll>
          <b-scroll v-show="active === 1" class="search-history-wrapper" ref="scrollSearch">
            <c-history-list :list="searchHistory" @click="clickItem" @delete="deleteItem" />
          </b-scroll>
        </div>
      </div>
      <div class="search-result-wrapper" v-show="search">
        <c-search-result :value="search" />
      </div>
      <b-top-tip ref="topTip" text="已添加一首歌曲" />
    </div>
  </transition>
</template>

<script>
import { mapState, mapActions } from 'vuex';
import cList from '@/components/c-list.vue';
import cHistoryList from '@/components/c-history-list.vue';
import cSearchResult from '@/components/c-search-result.vue';
import { searchMixin } from '@/mixins';

export default {
  name: 'c-add-song',
  components: {
    cList,
    cHistoryList,
    cSearchResult
  },
  mixins: [searchMixin],
  data() {
    return {
      visible: false,
      active: 0
    };
  },
  computed: {
    ...mapState(['playHistory'])
  },
  created() {
    this.switchList = [
      {
        key: 'play',
        value: '最近播放'
      },
      {
        key: 'search',
        value: '搜索历史'
      }
    ];
  },
  methods: {
    ...mapActions(['insertSong']),
    show() {
      this.visible = true;
      this.refresh();
    },
    hide() {
      this.visible = false;
    },
    changeSwitch(active) {
      this.active = active;
      this.refresh();
    },
    clickPlay(item) {
      this.insertSong(item);
      this.$refs.topTip.show();
    },
    refresh() {
      this.$nextTick(() => {
        if (!this.active) {
          this.$refs.scrollPlay.refresh();
        } else {
          this.$refs.scrollSearch.refresh();
        }
      });
    }
  }
};
</script>

<style lang="less" scoped>
.slide-enter,
.slide-leave-to {
  transform: translateX(100%);
}
.c-add-song {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: var(--color-background);
  transition: all 0.3s;
}
.header {
  position: relative;
  height: 44px;
  padding: 0 44px;
  .title {
    font-size: var(--font-size-large);
    line-height: 44px;
    text-align: center;
    color: var(--color-text);
  }
  .icon {
    position: absolute;
    top: 13px;
    right: 20px;
    font-size: 18px;
    color: var(--color-theme);
  }
}
.search-wrapper {
  padding: 20px;
}
.switch-wrapper {
  display: flex;
  justify-content: center;
}
.content {
  position: absolute;
  top: 160px;
  left: 0;
  right: 0;
  bottom: 0;
  overflow: hidden;
}
.search-history-wrapper {
  margin-top: 12px;
}
.search-result-wrapper {
  position: absolute;
  top: 116px;
  left: 0;
  right: 0;
  bottom: 0;
  overflow: hidden;
}
</style>
