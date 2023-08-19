import { mapState, mapActions } from 'vuex'

export default {
  computed: {
    ...mapState(['fancyList'])
  },
  methods: {
    ...mapActions(['saveFancy', 'removeFancy']),
    _isFancy(val) {
      return this.fancyList.some(i => i.id === val.id);
    },
    getFancyCls(val) {
      return this._isFancy(val) ? 'icon-favorite' : 'icon-not-favorite';
    },
    toggleFancy(val) {
      if (this._isFancy(val)) {
        this.removeFancy(val);
      } else {
        this.saveFancy(val);
      }
    }
  }
}
