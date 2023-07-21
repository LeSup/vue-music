<template>
  <div class="singer">
    <b-scroll :probeType="3" @scroll="handleScroll" ref="scroll">
      <div class="container">
        <div class="group" ref="group" v-for="item in singers" :key="item.title">
          <h2 class="group-title">{{ item.title }}</h2>
          <ul class="singer-list">
            <li class="singer-item" v-for="singer in item.list" :key="singer.id">
              <div class="singer-item-avatar">
                <img class="image" v-lazy="singer.pic" />
              </div>
              <div class="singer-item-content">
                <div class="name">{{ singer.name }}</div>
              </div>
            </li>
          </ul>
        </div>
      </div>
      <h2 class="sticky" :style="{ transform: `translateY(${translateY}px)` }" v-show="title">
        {{ title }}
      </h2>
      <div class="shortcut">
        <ul
          class="shortcut-list"
          @touchstart.stop="handleTouchstart"
          @touchmove.stop="handleTouchmove"
          @touchend.stop="handleTouchend"
        >
          <li
            class="shortcut-item"
            :class="{ active: highlight === index }"
            v-for="(item, index) in singers"
            :key="item.title"
            :data-index="index"
          >
            {{ item.title }}
          </li>
        </ul>
      </div>
    </b-scroll>
    <b-loading v-if="!singers.length"></b-loading>
  </div>
</template>

<script>
import bScroll from '@/bases/b-scroll.vue';
import bLoading from '@/bases/b-loading.vue';
import { getSingerList } from '@/services/singer';

const TITLE_HEIGHT = 30;
const SHORTCUT_ITEM_HEIGHT = 18;

export default {
  name: 'u-singer',
  data() {
    return {
      singers: [],
      // 置顶的title
      title: '',
      // 下个title将上个title顶上去的高度
      translateY: 0,
      // 哪个shortcut下的单词高亮
      highlight: 0
    };
  },
  watch: {
    singers() {
      this.$nextTick(() => {
        this.computeGroupsHeight();
      });
    }
  },
  created() {
    // group的高度区间
    this.groupsHeight = [];
    this.touch = {};
    this.getSingerList();
  },
  methods: {
    async getSingerList() {
      const { singers } = await getSingerList();
      this.singers = singers;
    },
    computeGroupsHeight() {
      const groups = this.$refs.group;

      const groupsHeight = [0];
      groups.reduce((t, c) => {
        t += c.clientHeight;
        groupsHeight.push(t);
        return t;
      }, 0);

      this.groupsHeight = groupsHeight;
    },
    handleScroll(position) {
      const groupsHeight = this.groupsHeight;
      const posY = -position.y;

      // 根据滚动高度判断在哪个group
      // 1.置顶其title
      // 2.剩余高度不足时（posY - height < titleHeight），设定偏移值
      let index, translateY, highlight;
      for (let i = 0, len = groupsHeight.length - 1; i < len; i++) {
        const current = groupsHeight[i];
        const next = groupsHeight[i + 1];
        if (posY < 0) {
          highlight = 0;
        } else if (posY >= current && posY < next) {
          index = i;
          translateY = Math.min(0, next - posY - TITLE_HEIGHT);
          highlight = i;
        } else if (i === len - 1 && posY > next) {
          highlight = i + 1;
        }
      }

      // 值不变时，不更新响应式数据
      if (typeof index === 'number') {
        this.title = this.singers[index].title;
        this.translateY = translateY;
      } else {
        this.title = '';
        this.translateY = 0;
      }
      this.highlight = highlight;
    },
    handleTouchstart(e) {
      // 获取点击项
      const index = +e.target.dataset.index;
      this.touch = {
        flag: true,
        pageY: e.touches[0].pageY,
        highlight: index // 基准index
      };
      this.shortcutCb(index);
    },
    handleTouchmove(e) {
      const { flag, pageY, highlight } = this.touch;

      let index;
      if (flag) {
        const max = this.singers.length - 1;
        const delta = e.touches[0].pageY - pageY;
        index = highlight + Math.ceil(delta / SHORTCUT_ITEM_HEIGHT);
        // 将index限制在[0, max]内
        index = Math.max(0, Math.min(index, max));
      }

      if (typeof index === 'number') {
        this.shortcutCb(index);
      }
    },
    handleTouchend() {
      this.touch.flag = false;
    },
    // 点击shortcut后的回调
    // 1.高亮shortcut项
    // 2.将列表滚动到指定位置
    shortcutCb(index) {
      this.highlight = index;
      this.$refs.scroll.scrollToElement(this.$refs.group[index], 0);
    }
  },
  components: {
    bScroll,
    bLoading
  }
};
</script>

<style lang="less" scoped>
.singer {
  height: calc(100vh - 88px);
  overflow: hidden;
}
.group-title,
.sticky {
  padding-left: 20px;
  height: 30px;
  line-height: 30px;
  font-size: var(--font-size-small);
  color: var(--color-text-l);
  background-color: var(--color-highlight-background);
}
.sticky {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
}
.singer-list .singer-item:last-child {
  padding-bottom: 20px;
}
.singer-item {
  display: flex;
  align-items: center;
  padding: 20px 0 0 30px;
}
.singer-item-avatar {
  .square(50px);
  .image {
    width: 100%;
    height: 100%;
    border-radius: 50%;
  }
}
.singer-item-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  margin-left: 20px;
  min-width: 0;
  .name {
    font-size: var(--font-size-medium);
    color: var(--color-text-l);
    .ellipsis();
  }
}

// 快捷方式
.shortcut {
  position: absolute;
  top: 50%;
  right: 4px;
  transform: translateY(-50%);
  padding: 10px 0;
  border-radius: 10px;
  background-color: var(--color-background-d);
}
.shortcut-list {
  width: 20px;
  text-align: center;
}
.shortcut-item {
  padding: 3px;
  line-height: 1;
  font-size: var(--font-size-small);
  color: var(--color-text-l);
  &.active {
    color: var(--color-theme);
  }
}
</style>
