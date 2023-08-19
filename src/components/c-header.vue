<template>
  <header class="c-header">
    <div class="logo">
      <div class="logo_image"></div>
      <div class="logo_text">Music</div>
    </div>
    <i class="icon icon-mine" @click="clickMe"></i>
  </header>
</template>

<script>
export default {
  name: 'c-header',
  methods: {
    clickMe() {
      this.$router.push({ path: '/me' });
    }
  }
}
</script>

<style lang="less" scoped>
  .c-header {
    display: flex;
    align-items: center;
    height: 44px;
  }
  .logo {
    display: flex;
    justify-content: center;
    align-items: center;
    margin: 2px auto;
  }
  .logo_image {
    width: 30px;
    height: 32px;
    background-size: 100% 100%;
    .adapt-image('../assets/images/logo');
  }
  .logo_text {
    margin-left: 4px;
    font-size: var(--font-size-large);
    color: var(--color-theme);
  }
  .icon {
    position: absolute;
    top: 13px;
    right: 13px;
    font-size: 18px;
    color: var(--color-theme);
  }
</style>