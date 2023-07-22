import Vue from 'vue'
import VueLazyload from 'vue-lazyload';
import App from './App.vue'
import store from '@/store';
import router from '@/router';
import * as bases from '@/bases';

import defaultImageUrl from '@/assets/images/default.png';
import '@/assets/styles/index.less';

Vue.use(VueLazyload, {
  loading: defaultImageUrl
});

// 注册组件
for (const [key, value] of Object.entries(bases)) {
  Vue.component(key, value);
}

new Vue({
  store,
  router,
  render: (h) => h(App)
}).$mount('#app')
