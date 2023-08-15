export default function debounce(fn, delay = 300) {
  let timer;
  return function debounced() {
    window.clearTimeout(timer);

    timer = window.setTimeout(() => {
      fn();
    }, delay);
  }
}
