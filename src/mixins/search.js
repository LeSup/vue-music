import { mapState, mapActions } from 'vuex'

export default {
  data() {
    return {
      search: ''
    }
  },
  computed: {
    ...mapState(['searchHistory'])
  },
  methods: {
    ...mapActions(['saveSearchHistory', 'removeSearchHistory', 'clearSearchHistory']),
    selectSearch() {
      this.saveSearchHistory(this.search);
    },
    clickItem(item) {
      this.search = item;
    },
    deleteItem(item) {
      this.removeSearchHistory(item);
    }
  }
}