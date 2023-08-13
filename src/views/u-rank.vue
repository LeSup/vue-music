<template>
  <div class="rank">
    <b-scroll ref="scroll">
      <div>
        <ul class="top-list">
          <li class="top-item" @click="handleClick(item)" v-for="item in topList" :key="item.id">
            <div class="top-item-image">
              <img class="image" v-lazy="item.pic" />
            </div>
            <ul class="top-item-content">
              <li class="song" v-for="(song, index) in item.songList" :key="index">
                {{ index + 1 }}.{{ song.singerName }}-{{ song.songName }}
              </li>
            </ul>
          </li>
        </ul>
      </div>
    </b-scroll>
    <b-loading v-if="!topList.length"></b-loading>
    <router-view></router-view>
  </div>
</template>

<script>
import { mapMutations } from 'vuex';
import { playerMixin } from '@/mixins';
import { getTopList } from '@/services/top-list';

export default {
  name: 'u-rank',
  mixins: [playerMixin],
  data() {
    return {
      topList: []
    };
  },
  created() {
    this.getTopList();
  },
  methods: {
    ...mapMutations(['setRank']),
    handlePlayList(list) {
      const height = list?.length ? 60 : 0;
      const scroll = this.$refs.scroll;
      scroll.$el.style.height = `calc(100% - ${height}px)`;
      scroll.refresh();
    },
    async getTopList() {
      const { topList } = await getTopList();
      this.topList = topList;
    },
    handleClick(item) {
      this.setRank(item);
      this.$router.push({
        path: `/rank/${item.id}`
      });
    }
  }
};
</script>

<style lang="less" scoped>
.rank {
  position: absolute;
  top: 88px;
  left: 0;
  right: 0;
  bottom: 0;
  overflow: hidden;
}
.top-item {
  display: flex;
  padding: 0 20px 20px;
  &:first-child {
    padding-top: 20px;
  }
}
.top-item-image {
  .square(100px);
  .image {
    width: 100%;
    height: 100%;
  }
}
.top-item-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 0 20px;
  min-width: 0;
  font-size: var(--font-size-small);
  line-height: 2em;
  color: var(--color-text-d);
  background-color: var(--color-highlight-background);
  .song {
    .ellipsis();
  }
}
</style>
