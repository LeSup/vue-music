<template>
  <div class="c-list">
    <ul class="c-list-ul">
      <li class="c-list-li" v-for="item of data" :key="item.id">
        <div class="c-list-li-content">
          <div class="title">{{ item.name }}</div>
          <div class="desc">{{ item.singer }}-{{ item.album }}</div>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: 'c-list',
  props: {
    data: {
      type: Array,
      default() {
        return []
      }
    }
  },
}
</script>

<style lang="less" scoped>
.c-list {
  padding: 20px;
  background-color: var(--color-background);
}
.c-list-li:not(:last-child) {
  padding-bottom: 20px;
}
.c-list-li-content {
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