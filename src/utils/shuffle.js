export default function shuffle(data) {
  data = data.slice();
  
  for (let i = data.length - 1, j; i > 0; i--) {
    j = Math.floor(Math.random() * i);
    [data[i], data[j]] = [data[j], data[i]];
  }

  return data;
}
