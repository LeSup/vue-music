<template>
  <div class="c-list">
    <ul class="c-list-ul">
      <li class="c-list-li" @click="handleClick(item, index)" v-for="(item, index) of data" :key="item.id">
        <div class="c-list-li-rank" v-if="rank">{{ index + 1 }}</div>
        <div class="c-list-li-content">
          <div class="title">{{ item.name }}</div>
          <div class="desc">{{ getDesc(item) }}</div>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: 'c-list',
  props: {
    rank: {
      type: Boolean,
      default: false
    },
    data: {
      type: Array,
      default() {
        return [];
      }
    }
  },
  methods: {
    handleClick(...rest) {
      this.$emit('click', ...rest);
    },
    getDesc(item) {
      return [item.singer, item.album].filter(_ => _).join('-')
    }
  }
};
</script>

<style lang="less" scoped>
.c-list {
  padding: 20px;
  background-color: var(--color-background);
}
.c-list-li {
  display: flex;
  align-items: center;
  &:not(:last-child) {
    padding-bottom: 20px;
  }
  &:nth-child(1) {
    .c-list-li-rank {
      .adapt-image('../assets/images/first');
      color: transparent;
    }
  }
  &:nth-child(2) {
    .c-list-li-rank {
      .adapt-image('../assets/images/second');
      color: transparent;
    }
  }
  &:nth-child(3) {
    .c-list-li-rank {
      .adapt-image('../assets/images/third');
      color: transparent;
    }
  }
}
.c-list-li-rank {
  margin-right: 20px;
  .square(26px);
  font-size: var(--font-size-medium-x);
  line-height: 26px;
  text-align: center;
  color: var(--color-theme);
  background-size: 100% 100%;
}
.c-list-li-content {
  flex: 1;
  min-width: 0;
  font-size: var(--font-size-medium);
  line-height: 24px;
  .title {
    color: var(--color-text);
    .ellipsis();
  }
  .desc {
    margin-top: 4px;
    color: var(--color-text-d);
    .ellipsis();
  }
}
</style>
