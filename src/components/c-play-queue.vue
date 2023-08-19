<template>
  <transition name="fade">
    <div class="c-play-queue" v-show="visible" @click="hide">
      <div class="wrapper" @click.stop>
        <div class="main">
          <div class="header">
            <i class="icon" :class="modeCls" @click="toggleMode"></i>
            <span class="text">{{ modeTxt }}</span>
            <i class="icon icon-clear" @click="clearQueue"></i>
          </div>
          <b-scroll class="song-wrapper" ref="scroll">
            <transition-group name="list" tag="ul">
              <li class="song-item" v-for="(item, index) of playList" :key="item.id">
                <i class="icon" :class="{ 'icon-play': index === playIndex }"></i>
                <div class="text" @click="selectItem(index)">{{ item.name }}</div>
                <i class="icon" :class="getFancyCls(item)" @click="toggleFancy(item)"></i>
                <i class="icon icon-delete" @click="removeItem(index)"></i>
              </li>
            </transition-group>
          </b-scroll>
          <div class="operate">
            <b-button class="add-song" text="添加歌曲到队列" @click.native="showAddSong"><i class="icon icon-add"></i></b-button>
          </div>
        </div>
        <div class="close" @click="hide">关闭</div>
      </div>
      <b-confirm ref="confirm" content="是否清空播放列表" @confirm="confirmClear"></b-confirm>
      <c-add-song ref="addSong" />
    </div>
  </transition>
</template>

<script>
import { mapState, mapGetters, mapActions, mapMutations } from 'vuex';
import cAddSong from '@/components/c-add-song.vue';
import { modeMixin, fancyMixin } from '@/mixins';

export default {
  name: 'c-play-queue',
  components: {
    cAddSong
  },
  mixins: [modeMixin, fancyMixin],
  data() {
    return {
      visible: false
    };
  },
  computed: {
    ...mapState(['playList']),
    ...mapGetters(['playIndex']),
  },
  methods: {
    ...mapActions(['clearPlay', 'removePlay']),
    ...mapMutations(['setPlayIndex']),
    show() {
      this.visible = true;
      this.refresh();
    },
    hide() {
      this.visible = false;
    },
    clearQueue() {
      this.$refs.confirm.show();
    },
    confirmClear() {
      this.clearPlay();
    },
    selectItem(index) {
      this.setPlayIndex(index);
    },
    removeItem(index) {
      this.removePlay(index);
    },
    showAddSong() {
      this.$refs.addSong.show();
    },
    refresh() {
      this.$nextTick(() => {
        this.$refs.scroll.refresh();
      });
    }
  }
};
</script>

<style lang="less" scoped>
.fade-enter, .fade-leave-to {
  opacity: 0;
  .wrapper {
    transform: translateY(100%);
  }
}
.c-play-queue {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: var(--color-background-l);
  .backdrop-filter-blur(5px);
  transition: all 0.3s;
}
.wrapper {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  transition: all 0.3s;
}
.main {
  background-color: var(--color-highlight-background);
}
.header {
  display: flex;
  align-items: center;
  column-gap: 8px;
  padding: 0 20px;
  height: 60px;
  .icon {
    &:nth-of-type(1) {
      font-size: 22px;
      color: var(--color-theme);
    }
    &:nth-last-of-type(1) {
      font-size: 16px;
      color: var(--color-text-d);
    }
  }
  .text {
    flex: 1;
    font-size: var(--font-size-medium);
    color: var(--color-text-l);
  }
}
.song-wrapper {
  max-height: 240px;
  overflow: hidden;
}
.song-item {
  display: flex;
  align-items: center;
  column-gap: 8px;
  padding: 0 20px;
  height: 32px;
  line-height: 32px;
  transition: all 0.3s;
  overflow: hidden;
  .icon {
    font-size: 14px;
    color: var(--color-theme);
    &:first-child {
      .square(16px);
      font-size: 16px;
    }
    &.icon-favorite {
      color: var(--color-sub-theme);
    }
  }
  .text {
    flex: 1;
    font-size: var(--font-size-medium);
    line-height: 20px;
    color: var(--color-text-d);
    .ellipsis();
  }
}
.list-enter, .list-leave-to {
  height: 0;
}
.operate {
  height: 72px;
  overflow: hidden;
  .add-song {
    margin: 20px auto 0;
    color: var(--color-text-d);
  }
}
.close {
  height: 50px;
  font-size: var(--font-size-medium);
  line-height: 50px;
  text-align: center;
  background-color: var(--color-background);
}
</style>
