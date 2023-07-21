<template>
  <div>
    <c-header></c-header>
    <c-nav></c-nav>
    <router-view></router-view>
  </div>
</template>

<script>
import cHeader from '@/components/c-header.vue';
import cNav from '@/components/c-nav.vue';

export default {
  components: {
    cHeader,
    cNav
  }
}
</script>

<style>
</style>