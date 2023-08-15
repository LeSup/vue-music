<template>
  <div class="b-search">
    <i class="b-search-icon icon-search"></i>
    <input class="b-search-input" :placeholder="placeholder" v-model="text" />
    <i class="b-search-icon icon-dismiss" v-show="value" @click="handleClear"></i>
  </div>
</template>

<script>
import { debounce } from '@/utils';

export default {
  name: 'b-search',
  props: {
    value: {
      type: String,
      default: '',
    },
    placeholder: {
      type: String,
      default: '搜索歌手、歌曲'
    }
  },
  data() {
    return {
      text: ''
    }
  },
  watch: {
    value(val, oldVal) {
      if (val !== oldVal) {
        this.text = val;
      }
    }
  },
  mounted() {
    this.$watch('text', debounce(() => {
      this.$emit('input', this.text);
    }))
  },
  methods: {
    handleClear() {
      this.text = '';
    }
  }
}
</script>

<style lang="less" scoped>
.b-search {
  position: relative;
  height: 32px;
  border-radius: 6px;
  background-color: var(--color-highlight-background);
}
.b-search-input {
  display: block;
  padding: 0 32px;
  width: 100%;
  height: 100%;
  font-size: var(--font-size-medium);
  line-height: 32px;
  color: var(--color-text-l);
  background-color: transparent;
  box-sizing: border-box;
}
.b-search-icon {
  position: absolute;
  color: var(--color-text-l);
}
.icon-search {
  top: 6px;
  left: 6px;
  font-size: var(--font-size-large-x);
}
.icon-dismiss {
  top: 9px;
  right: 6px;
  font-size: var(--font-size-medium);
}
</style>