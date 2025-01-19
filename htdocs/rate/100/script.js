const element = document.getElementById("r");
let n = parseFloat(element.textContent)
let r = n;

async function fetchData() {
  const response = await fetch(`${location.origin}/rate/rate.json`, { signal: AbortSignal.timeout(500) });
  const rs = await response.text();
  const data = await Math.round(JSON.parse(rs)["100"] * 100) / 100;
  r = data;
}

setInterval(fetchData, 500);
setInterval(() => {
  n += (r - n) / 64
  let i = Math.round(n * 100) / 100;
  element.textContent = i.toFixed(2)
})