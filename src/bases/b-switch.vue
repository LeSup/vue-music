<template>
  <div class="b-switch">
    <ul class="switch-list">
      <li
        v-for="(item, index) of list"
        :key="item.key"
        class="switch-item"
        :class="getActiveCls(index)"
        @click="toggle(index)"
      >
        {{ item.value }}
      </li>
    </ul>
  </div>
</template>
<script>
export default {
  name: 'b-switch',
  model: {
    prop: 'value',
    event: 'change'
  },
  props: {
    value: Number,
    list: {
      type: Array,
      default: () => []
    }
  },
  methods: {
    toggle(index) {
      this.$emit('change', index);
    },
    getActiveCls(index) {
      return index === this.value ? 'active' : '';
    }
  }
};
</script>
<style lang="less" scoped>
.b-switch {
  width: 240px;
  height: 32px;
  border: 1px solid var(--color-highlight-background);
  border-radius: 5px;
  box-sizing: border-box;
}
.switch-list {
  display: flex;
  height: 100%;
}
.switch-item {
  flex: 1;
  line-height: 32px;
  font-size: var(--font-size-medium);
  color: var(--color-text-l);
  text-align: center;
  &.active {
    color: var(--color-text);
    background-color: var(--color-highlight-background);
  }
}
</style>
