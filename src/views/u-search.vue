<template>
  <div class="u-search">
    <div class="u-search-box">
      <b-search v-model="search"></b-search>
    </div>
    <div class="u-search-container" ref="container">
      <b-scroll ref="history" v-show="!search">
        <div class="history-record">
          <div class="hot-search">
            <div class="hot-search-title">
              <div class="text">热门搜索</div>
            </div>
            <ul class="hot-search-list">
              <li
                class="hot-search-item"
                v-for="item in hotKeys"
                :key="item.id"
                @click="clickHot(item)"
              >
                {{ item.key }}
              </li>
            </ul>
          </div>
          <div class="search-history">
            <div class="search-history-title">
              <div class="text">搜索历史</div>
              <i class="icon icon-clear" @click="clickClear" v-show="searchHistory.length"></i>
            </div>
            <c-history-list :list="searchHistory" @click="clickItem" @delete="deleteItem" />
          </div>
        </div>
      </b-scroll>
      <c-search-result
        v-show="search"
        ref="result"
        :value="search"
        showSinger
        @click="selectSearch"
      ></c-search-result>
      <b-loading v-show="loading"></b-loading>
    </div>
    <b-confirm ref="confirm" content="是否清空所有搜索历史" @confirm="confirm"></b-confirm>
    <router-view></router-view>
  </div>
</template>

<script>
import cSearchResult from '@/components/c-search-result.vue';
import cHistoryList from '@/components/c-history-list.vue';
import { playerMixin, searchMixin } from '@/mixins';
import { getHotKeys } from '@/services/search';

export default {
  name: 'u-search',
  components: {
    cSearchResult,
    cHistoryList
  },
  mixins: [playerMixin, searchMixin],
  data() {
    return {
      hotKeys: [],
      loading: false
    };
  },
  watch: {
    search(val, oldVal) {
      if (!val && oldVal) {
        this.$nextTick(() => {
          this.$refs.history.refresh();
        });
      }
    }
  },
  created() {
    this.getHotKeys();
  },
  methods: {
    handlePlayList(list) {
      const height = list.length ? 60 : 0;
      this.$refs.container.style.bottom = height + 'px';
      if (this.search) {
        this.$refs.result.refresh();
      } else {
        this.$refs.history.refresh();
      }
    },
    async getHotKeys() {
      this.loading = true;
      const { hotKeys } = await getHotKeys();
      this.hotKeys = hotKeys;
      this.loading = false;
    },
    clickHot(item) {
      this.search = item.key;
      this.saveSearchHistory(item.key);
    },
    clickClear() {
      this.$refs.confirm.show();
    },
    confirm() {
      this.clearSearchHistory();
    }
  },
};
</script>

<style lang="less" scoped>
.u-search {
  position: absolute;
  top: 88px;
  left: 0;
  right: 0;
  bottom: 0;
}
.u-search-box {
  padding: 20px;
}
.u-search-container {
  position: absolute;
  top: 72px;
  left: 0;
  right: 0;
  bottom: 0;
  overflow: hidden;
}
.hot-search-title,
.search-history-title {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 32px;
  padding: 0 20px;
  font-size: var(--font-size-medium);
  color: var(--color-text-l);
}
.hot-search-list {
  display: flex;
  flex-wrap: wrap;
  row-gap: 12px;
  column-gap: 12px;
  margin: 8px 0;
  padding: 0 20px;
  overflow: hidden;
}
.hot-search-item {
  flex: 0 0 auto;
  padding: 4px 8px;
  font-size: var(--font-size-medium);
  line-height: 1;
  color: var(--color-text-d);
  background-color: var(--color-highlight-background);
  border-radius: 10px;
}
</style>
