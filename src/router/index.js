import Vue from 'vue';
import VueRouter from 'vue-router';
import uHome from '@/views/u-home.vue';
import uSinger from '@/views/u-singer.vue';
import uRank from '@/views/u-rank.vue';
import uMe from '@/views/u-me.vue';

Vue.use(VueRouter);

const routes = [{
  path: '/',
  redirect: '/home'
}, {
  path: '/home',
  component: uHome,
}, {
  path: '/singer',
  component: uSinger,
}, {
  path: '/rank',
  component: uRank,
}, {
  path: '/me',
  component: uMe
}];

export default new VueRouter({
  routes
});
