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
                @click="clickHotKey(item)"
              >
                {{ item.key }}
              </li>
            </ul>
          </div>
          <div class="search-history">
            <div class="search-history-title">
              <div class="text">搜索历史</div>
              <div class="icon-wrapper" @click="clickClear" v-show="historyList.length">
                <i class="icon icon-clear"></i>
              </div>
            </div>
            <ul class="search-history-list">
              <li class="search-history-item" v-for="item in historyList" :key="item">
                <div class="text" @click="clickItem(item)">{{ item }}</div>
                <div class="icon-wrapper" @click="clickDelete(item)">
                  <i class="icon icon-delete"></i>
                </div>
              </li>
            </ul>
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
import { mapActions, mapState } from 'vuex';
import cSearchResult from '@/components/c-search-result.vue';
import { playerMixin } from '@/mixins';
import { getHotKeys } from '@/services/search';

export default {
  name: 'u-search',
  mixins: [playerMixin],
  data() {
    return {
      search: '',
      hotKeys: [],
      loading: false
    };
  },
  computed: {
    ...mapState(['historyList'])
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
    ...mapActions(['saveHistory', 'removeHistory', 'clearHistory']),
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
    clickHotKey(item) {
      this.search = item.key;
      this.saveHistory(item.key);
    },
    selectSearch() {
      this.saveHistory(this.search);
    },
    clickClear() {
      this.$refs.confirm.show();
    },
    clickItem(item) {
      this.search = item;
    },
    clickDelete(item) {
      this.removeHistory(item);
    },
    confirm() {
      this.clearHistory();
    }
  },
  components: {
    cSearchResult
  }
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
  .icon-wrapper {
    .spread-area();
  }
}
.hot-search-list {
  display: flex;
  flex-wrap: wrap;
  row-gap: 8px;
  column-gap: 8px;
  margin: 8px 0;
  padding: 0 20px;
  overflow: hidden;
}
.hot-search-item {
  flex: 0 0 auto;
  padding: 4px 8px;
  font-size: var(--font-size-small);
  line-height: 1;
  color: var(--color-text-d);
  background-color: var(--color-highlight-background);
  border-radius: 10px;
}
.search-history-list {
  padding: 12px 20px;
}
.search-history-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: var(--color-text-d);
  &:not(:first-child) {
    margin-top: 12px;
  }
  .text {
    flex: 1;
    font-size: var(--font-size-medium);
    .ellipsis();
  }
  .icon-wrapper {
    .spread-area();
    .icon {
      font-size: var(--font-size-small);
    }
  }
}
</style>
