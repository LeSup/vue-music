<template>
  <div>
    <u-svg></u-svg>
    <c-header></c-header>
    <c-nav></c-nav>
    <router-view></router-view>
    <c-player></c-player>
  </div>
</template>

<script>
import uSvg from '@/views/u-svg.vue';
import cHeader from '@/components/c-header.vue';
import cNav from '@/components/c-nav.vue';
import cPlayer from '@/components/c-player.vue';

export default {
  components: {
    uSvg,
    cHeader,
    cNav,
    cPlayer
  }
}
</script>

<style>
</style>