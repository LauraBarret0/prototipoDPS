function drawSeries(ctx, data, { padding = 20, strokeWidth = 2, color = "rgba(56,189,248,.95)" } = {}) {
  const W = ctx.canvas.width,
    H = ctx.canvas.height;
  ctx.clearRect(0, 0, W, H);

  const xPad = padding * 1.5,
        yPad = padding * 1.2;

  const xs = data.map(d => d.x),
        ys = data.map(d => d.y);

  const minX = Math.min(...xs),
        maxX = Math.max(...xs),
        minY = Math.min(...ys),
        maxY = Math.max(...ys);

  const xScale = x => xPad + ((x - minX) / (maxX - minX || 1)) * (W - 2 * xPad),
        yScale = y => H - yPad - ((y - minY) / (maxY - minY || 1)) * (H - 2 * yPad);

  // desenha grades
  ctx.lineWidth = 1;
  ctx.strokeStyle = "rgba(148,163,184,.25)";
  const gridN = 5;
  for (let i = 0; i <= gridN; i++) {
    const gx = xPad + (i * (W - 2 * xPad)) / gridN;
    const gy = H - yPad - (i * (H - 2 * yPad)) / gridN;

    ctx.beginPath();
    ctx.moveTo(gx, yPad * 0.6);
    ctx.lineTo(gx, H - yPad * 0.6);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(xPad * 0.8, gy);
    ctx.lineTo(W - xPad * 0.8, gy);
    ctx.stroke();
  }

  // desenha série
  ctx.lineWidth = strokeWidth;
  ctx.strokeStyle = color;
  ctx.beginPath();
  data.forEach((p, i) => {
    const X = xScale(p.x),
          Y = yScale(p.y);
    if (i === 0) ctx.moveTo(X, Y);
    else ctx.lineTo(X, Y);
  });
  ctx.stroke();

  // contorno
  ctx.lineWidth = 1.2;
  ctx.strokeStyle = color.replace("0.95", "0.35");
  ctx.stroke();
}

// -------- Seguidores --------
const elT = document.getElementById("tMeses"),
      elS0 = document.getElementById("s0"),
      elR = document.getElementById("taxa"),
      elPts1 = document.getElementById("pts1"),
      kpiT = document.getElementById("kpiT"),
      kpiF = document.getElementById("kpiF"),
      ctxSeg = document.getElementById("chartSeguidores").getContext("2d");

function renderSeguidores() {
  const T = +elT.value,
        S0 = +elS0.value,
        r = +elR.value,
        N = Math.max(6, Math.min(240, +elPts1.value || 36));
  kpiT.textContent = T;
  const f = t => S0 * Math.pow(1 + r, t);
  const data = Array.from({ length: N + 1 }, (_, i) => ({
    x: i * (T / N),
    y: f(i * (T / N))
  }));
  drawSeries(ctxSeg, data, { color: '#5c9925' });
  kpiF.textContent = Math.round(f(T)).toLocaleString("pt-BR");
}
[elT, elS0, elR, elPts1].forEach(el => el.addEventListener("input", renderSeguidores));
renderSeguidores();

// -------- Engajamento --------
const K = document.getElementById("K"),
      limiteEngaj = document.getElementById("limiteEngaj"),
      ctxEng = document.getElementById("chartEngaj").getContext("2d");

function renderEngaj(){
  const kVal = +K.value;
  limiteEngaj.textContent = kVal;

  const N=36;
  const data = [];
  for(let i=0;i<=N;i++){
    let t = i;
    let yVal = kVal/(1 + 9*Math.exp(-0.4*t));
    data.push({x: t, y: yVal});
  }
  drawSeries(ctxEng, data, { color: "#5c9925" });

  // linha do limite
  ctxEng.beginPath();
  ctxEng.setLineDash([6,4]);
  ctxEng.moveTo(0,ctxEng.canvas.height - 0); 
  ctxEng.lineTo(ctxEng.canvas.width,ctxEng.canvas.height - 0);
  ctxEng.stroke();
  ctxEng.setLineDash([]);
}
K.addEventListener("input", renderEngaj);
renderEngaj();

// -------- Velocidade instantânea --------
const tDer = document.getElementById("tDer"),
      posS = document.getElementById("posS"),
      velV = document.getElementById("velV"),
      ctxDer = document.getElementById("chartDeriv").getContext("2d");

function s(t){ return 0.5*t*t; }
function v(t, dt=0.01){ return (s(t+dt)-s(t-dt))/(2*dt); }

function renderDeriv(){
  const t = +tDer.value;
  posS.textContent = s(t).toFixed(2);
  velV.textContent = v(t).toFixed(2);

  const N=36;
  const data = [];
  for(let i=0;i<=N;i++){
    let t0=i;
    let yVal=v(t0);
    data.push({x: t0, y: yVal});
  }
  drawSeries(ctxDer, data, { color: "#5c9925" });
}
tDer.addEventListener("input", renderDeriv);
renderDeriv();
