// Comprueba en un celular simulado (táctil) que el tambor de la app de ritmo queda abajo y al centro, sin tapar
// «¿Qué hago?», la camarita ni el pie. Uso: con `node servidor-local.js` corriendo, `node pruebas/tambor_movil.js [salida.png]`.
const path = require('path');
const { chromium } = require(path.join(__dirname, '../../Libro_Sprinkloud/node_modules/playwright-core'));
(async () => {
  const nav = await chromium.launch({ channel: 'chrome' });
  for (const [w, h] of [[360, 740], [390, 844]]) {
    const ctx = await nav.newContext({ viewport: { width: w, height: h }, hasTouch: true, isMobile: true, deviceScaleFactor: 2 });
    const p = await ctx.newPage();
    await p.goto('http://localhost:8010/practica/ritmo?etapa=1&leccion=2', { waitUntil: 'load' });
    await p.waitForTimeout(1500);
    await p.keyboard.press('Escape').catch(() => {});
    /* 13-nov-2026: en el celular el tambor solo se ve mientras suena el ritmo (body.sonando) */
    const antes = await p.evaluate(() => { const t = document.getElementById('btn-golpe'); const cs = getComputedStyle(t); return { opacidad: cs.opacity, toca: cs.pointerEvents }; });
    await p.evaluate(() => document.body.classList.add('sonando'));
    await p.waitForTimeout(500);
    const r = await p.evaluate(() => {
      const caja = s => { const e = document.querySelector(s); if (!e) return null; const b = e.getBoundingClientRect(); return { x: Math.round(b.x), y: Math.round(b.y), w: Math.round(b.width), h: Math.round(b.height) }; };
      return { tambor: caja('#btn-golpe'), chip: caja('.lc-chip'), camara: caja('.spk-camara'), pie: caja('#footer'), fila: caja('.panel-foot'), alto: innerHeight, ancho: innerWidth,
        scrollX: document.documentElement.scrollWidth > innerWidth };
    });
    const t = r.tambor, centro = t.x + t.w / 2;
    const choca = b => b && !(b.x + b.w <= t.x || t.x + t.w <= b.x || b.y + b.h <= t.y || t.y + t.h <= b.y);
    console.log(`${w}x${h}: antes de play opacidad ${antes.opacidad} (toca: ${antes.toca}); con play: tambor ${t.w}x${t.h} centro x=${centro} (pantalla ${r.ancho / 2}), abajo a ${r.alto - (t.y + t.h)} px;`,
      `choca con ¿Qué hago?: ${choca(r.chip)}, camarita: ${choca(r.camara)}, pie: ${choca(r.pie)}, fila Dictado: ${choca(r.fila)}; desborde horizontal: ${r.scrollX}`);
    if (w === 390) await p.screenshot({ path: process.argv[2] || 'tambor-movil.png' });
    await ctx.close();
  }
  await nav.close();
})();
