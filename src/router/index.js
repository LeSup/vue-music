import Vue from 'vue';
import VueRouter from 'vue-router';
import uHome from '@/views/u-home.vue';
import uSinger from '@/views/u-singer.vue';
import uRank from '@/views/u-rank.vue';
import uSearch from '@/views/u-search.vue';
import uMe from '@/views/u-me.vue';
import uAlbum from '@/views/u-album.vue';
import uSingerDetail from '@/views/u-singer-detail.vue';
import uRankDetail from '@/views/u-rank-detail.vue';

Vue.use(VueRouter);

const routes = [{
  path: '/',
  redirect: '/home'
}, {
  path: '/home',
  component: uHome,
  children: [{
    path: ':id',
    component: uAlbum
  }]
}, {
  path: '/singer',
  component: uSinger,
  children: [{
    path: ':id',
    component: uSingerDetail,
  }]
}, {
  path: '/rank',
  component: uRank,
  children: [{
    path: ':id',
    component: uRankDetail,
  }]
}, {
  path: '/search',
  component: uSearch
}, {
  path: '/me',
  component: uMe
}];

export default new VueRouter({
  routes
});
