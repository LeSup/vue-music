<template>
  <div class="c-history-list">
    <ul class="search-history-list">
      <li class="search-history-item" v-for="item in list" :key="item">
        <div class="text" @click="clickItem(item)">{{ item }}</div>
        <i class="icon icon-delete" @click="deleteItem(item)"></i>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: 'c-history-list',
  props: {
    list: {
      type: Array,
      default: () => []
    }
  },
  methods: {
    clickItem(item) {
      this.$emit('click', item);
    },
    deleteItem(item) {
      this.$emit('delete', item);
    }
  }
};
</script>

<style lang="less" scoped>
.search-history-list {
  padding: 5px 20px;
}
.search-history-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  column-gap: 8px;
  color: var(--color-text-d);
  &:not(:first-child) {
    margin-top: 8px;
  }
  .text {
    flex: 1;
    font-size: var(--font-size-medium);
    line-height: 24px;
    .ellipsis();
  }
  .icon {
    font-size: var(--font-size-small);
  }
}
</style>
