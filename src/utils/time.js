const M = 60;

// 200 => "03:20"
export function format(time = 0) {
  const m = Math.floor(time / M);
  const s = time % M;
  return `${m}`.padStart(2, 0) + ':' + `${s}`.padStart(2, 0);
}
