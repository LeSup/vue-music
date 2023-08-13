export default {
  bind(...rest) {
    console.log('bind', ...rest);
  },
  update(...rest) {
    console.log('update', ...rest);
  },
  unbind(...rest) {
    console.log(...rest);
  }
}