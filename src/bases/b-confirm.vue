<template>
  <transition name="fade">
    <div class="b-confirm" v-show="visible">
      <div class="container">
        <div class="content">
          <div class="title">{{ content }}</div>
          <div class="operate">
            <div class="operate-button" @click.stop="cancel">取消</div>
            <div class="operate-button" @click.stop="confirm">确认</div>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
export default {
  name: 'b-confirm',
  props: {
    content: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      visible: false
    }
  },
  methods: {
    cancel() {
      this.$emit('cancel');
      this.hide();
    },
    confirm() {
      this.$emit('confirm');
      this.hide();
    },
    show() {
      this.visible = true;
    },
    hide() {
      this.visible = false;
    }
  }
}
</script>

<style lang="less" scoped>
.fade-enter-active {
  animation: fade 0.3s;
  .content {
    animation: zoom 0.3s;
  }
}
.fade-leave-active {
  animation: fade 0.3s reverse;
  .content {
    animation: zoom 0.3s reverse;
  }
}
.b-confirm {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 99;
  background-color: var(--color-background-d);
  .backdrop-filter-blur(5px);
  .container {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }
  .content {
    width: 270px;
    border-radius: 12px;
    background-color: var(--color-highlight-background);
  }
  .title {
    padding: 20px 16px;
    font-size: var(--font-size-large);
    line-height: 22px;
    color: var(--color-text-l);
    text-align: center;
  }
  .operate {
    display: flex;
    font-size: var(--font-size-medium-x);
    line-height: 22px;
    color: var(--color-text-d);
    text-align: center;
    border-top: 1px solid var(--color-background-l);
  }
  .operate-button {
    flex: 1;
    padding: 10px 0;
    &:first-child {
      border-right: 1px solid var(--color-background-l);
    }
  }
}
@keyframes fade {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}
@keyframes zoom {
  0% {
    transform: scale(0);
  }
  60% {
    transform: scale(1.1);
  }
  100% {
    transform: scale(1);
  }
}
  
</style>