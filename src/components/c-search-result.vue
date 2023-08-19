<template>
  <b-scroll class="c-search-result" ref="scroll" @scrollEnd="handleScrollEnd">
    <ul class="result-list">
      <li class="result-item" v-for="item of songs" :key="item.id" @click="handleClick(item)">
        <i class="icon" :class="getIconCls(item)"></i>
        <p class="text">{{ item.name }}</p>
      </li>
      <li class="result-item" v-show="hasMore">
        <p class="text more">下拉加载更多</p>
      </li>
    </ul>
    <b-loading v-show="loading"></b-loading>
    <b-no-result v-show="!songs.length"></b-no-result>
  </b-scroll>
</template>
<script>
import { mapActions, mapMutations } from 'vuex';
import { getSearch } from '@/services/search';
import { processSongs } from '@/services/song';

const TYPE_SINGER = 'singer';

export default {
  name: 'c-search-result',
  props: {
    value: String,
    showSinger: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      songs: [],
      hasMore: false,
      loading: false,
      page: 1,
    }
  },
  watch: {
    value() {
      this.clear();
      this.getSearch(false);
    }
  },
  methods: {
    ...mapMutations(['setSinger']),
    ...mapActions(['insertSong']),
    async getSearch(insert) {
      this.loading = true;
      const { hasMore, songs = [], singer } = await getSearch(this.value, this.page, this.showSinger);
      const result = await processSongs(songs || []);
      if (singer) {
        result.unshift({...singer, type: TYPE_SINGER});
      }
      if (insert) {
        this.songs = [...this.songs, ...result];
      } else {
        this.songs = result;
      }
      this.hasMore = hasMore;
      this.loading = false;
    },
    handleScrollEnd() {
      if (!this.hasMore) {
        return;
      }
      this.page++;
      this.getSearch(true);
    },
    handleClick(item) {
      if (item.type === TYPE_SINGER) {
        this.setSinger(item);
        this.$router.push({ path: `/search/${item.mid}`});
      } else {
        this.insertSong(item);
      }
      this.$emit('click');
    },
    getIconCls(item) {
      return item.type === TYPE_SINGER ? 'icon-mine' : 'icon-music';
    },
    refresh() {
      this.$refs.scroll.refresh();
    },
    clear() {
      this.songs = [];
      this.hasMore = false;
      this.page = 1;
    }
  }
}
</script>

<style lang="less" scoped>
.c-search-result {
  position: relative;
}
.result-list {
  padding: 0 20px 12px;
}
.result-item {
  display: flex;
  align-items: center;
  height: 24px;
  font-size: var(--font-size-medium);
  line-height: 24px;
  color: var(--color-text-l);
  .icon {
    margin-right: 8px;
  }
  .text {
    flex: 1;
    .ellipsis();
  }
  .more {
    text-align: center;
  }
  &:not(:first-child) {
    margin-top: 12px;
  }
}
</style>