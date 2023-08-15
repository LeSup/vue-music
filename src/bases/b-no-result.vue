<template>
  <div class="b-no-result">
    <div class="container">
      <div class="image"></div>
      <div class="text">{{ text }}</div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'b-no-result',
  props: {
    text: {
      type: String,
      default: '抱歉，暂无搜索结果'
    }
  }
}
</script>

<style lang="less" scoped>
.b-no-result {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  .container {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }
  .image {
    width: 86px;
    height: 90px;
    background-size: 100% 100%;
    .adapt-image('../assets/images/no-result');
  }
  .text {
    margin-top: 30px;
    font-size: var(--font-size-medium);
    color: var(--color-text-d);
  }
}
</style>