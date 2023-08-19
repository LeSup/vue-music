<template>
  <div class="b-button">
    <slot></slot>
    <span class="b-button-text">{{ text }}</span>
  </div>
</template>

<script>
export default {
  name: 'b-button',
  props: {
    text: {
      type: String,
      default: '随机播放全部'
    }
  }
}
</script>

<style lang="less" scoped>
.b-button {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 136px;
  height: 32px;
  color: var(--color-theme);
  border: 1px solid;
  border-radius: 16px;
  box-sizing: border-box;
}
.icon {
  font-size: var(--font-size-medium);
}
.b-button-text {
  margin-left: 8px;
  font-size: var(--font-size-small);
}
</style>