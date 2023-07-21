import Vue from 'vue'
import VueLazyload from 'vue-lazyload';
import App from './App.vue'
import router from '@/router';
import defaultImageUrl from '@/assets/images/default.png';

import '@/assets/styles/index.less';

console.log('defaultImageUrl', defaultImageUrl)
Vue.use(VueLazyload, {
  loading: defaultImageUrl
});

new Vue({
  router,
  render: (h) => h(App)
}).$mount('#app')
