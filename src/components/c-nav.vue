<template>
  <nav class="c-nav">
    <router-link to="/home" tag="div" class="link">
      <span class="link_text">首页</span>
    </router-link>
    <router-link to="/singer" tag="div" class="link">
      <span class="link_text">歌手</span>
    </router-link>
    <router-link to="/rank" tag="div" class="link">
      <span class="link_text">排行</span>
    </router-link>
    <router-link to="/search" tag="div" class="link">
      <span class="link_text">搜索</span>
    </router-link>
  </nav>
</template>

<script>
export default {
  name: 'c-nav'
}
</script>

<style lang="less" scoped>
  .c-nav {
    display: flex;
    height: 44px;
    line-height: 44px;
    text-align: center;
    color: var(--color-text);
  }
  .link {
    flex: 1;
    height: 100%;
  }
  .link_text {
    padding-bottom: 4px;
    font-size: var(--font-size-medium);
  }
  .router-link-active .link_text {
    color: var(--color-theme);
    border-bottom: 2px solid;
  }
</style>