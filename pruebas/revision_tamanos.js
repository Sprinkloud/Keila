// Uso: con `node servidor-local.js` corriendo, `node pruebas/revision_tamanos.js` (capturas en Libro_Sprinkloud/revision-app/tamanos).
// Revisión de piano, violín y ritmo en 7 tamaños (celular chico, mediano, grande, celular acostado, tableta, tableta
// acostada y computadora): scroll horizontal, elementos que se salen, botones chicos para el dedo, la insignia de estrellas
// encima del pentagrama, y capturas.
const path = require('path');
const { chromium } = require(path.join(__dirname, '../../Libro_Sprinkloud/node_modules/playwright-core'));
const OUT = path.join(__dirname, '..', '..', 'Libro_Sprinkloud', 'revision-app', 'tamanos'); require('fs').mkdirSync(OUT, { recursive: true });
const TAM = [[320, 568, true], [360, 740, true], [390, 844, true], [740, 360, true], [768, 1024, true], [1024, 768, true], [1280, 800, false]];
const APPS = [['piano', 'practica/piano?etapa=2&leccion=3'], ['violin', 'practica/violin?etapa=2&leccion=3'], ['ritmo', 'practica/ritmo?etapa=3&leccion=2']];
(async () => {
  const nav = await chromium.launch({ channel: 'chrome' });
  const hallazgos = [];
  for (const [app, ruta] of APPS) for (const [w, h, movil] of TAM) {
    const ctx = await nav.newContext({ viewport: { width: w, height: h }, isMobile: movil, hasTouch: movil, deviceScaleFactor: 2 });
    const p = await ctx.newPage();
    const errores = [];
    p.on('pageerror', e => errores.push(e.message));
    p.on('console', m => { if (m.type() === 'error' && !/live\.js|8400/.test(m.text())) errores.push(m.text()); });
    await p.goto('http://localhost:8010/' + ruta, { waitUntil: 'load' });
    await p.waitForTimeout(1200);
    await p.evaluate(() => { const d = document.querySelector('dialog.lc'); if (d && d.open) d.querySelector('button').click(); });
    await p.waitForTimeout(600);
    await p.evaluate(() => { try { estrellasGanadas = 3; pintarEstrellas(false); } catch (e) { } try { document.body.classList.add('sonando'); } catch (e) { } });
    await p.waitForTimeout(400);
    const r = await p.evaluate(() => {
      const W = document.documentElement.clientWidth, out = { scrollX: document.documentElement.scrollWidth > W + 1, fuera: [], chicos: [], estrellas: null, solapes: [] };
      const vis = el => { const b = el.getBoundingClientRect(); const cs = getComputedStyle(el); return b.width > 0 && b.height > 0 && cs.visibility !== 'hidden' && cs.display !== 'none' && cs.opacity !== '0'; };
      const imp = el => el.closest('[data-impeccable-live], #impeccable-live, .impeccable-live') || /impeccable/i.test(el.id + ' ' + el.className);
      for (const el of document.querySelectorAll('body *')) {
        if (!vis(el) || imp(el)) continue;
        const b = el.getBoundingClientRect();
        if (b.right > W + 1 && getComputedStyle(el).position !== 'fixed') out.fuera.push(`${el.tagName.toLowerCase()}${el.id ? '#' + el.id : ''}.${String(el.className).split(' ')[0]} (${Math.round(b.right - W)} px)`);
      }
      for (const el of document.querySelectorAll('button, a, [role=button], input, select')) {
        if (!vis(el) || imp(el)) continue;
        const b = el.getBoundingClientRect();
        if (b.width < 40 || b.height < 40) out.chicos.push(`${el.tagName.toLowerCase()}${el.id ? '#' + el.id : ''}.${String(el.className).split(' ')[0]} «${(el.getAttribute('aria-label') || el.textContent).trim().slice(0, 18)}» ${Math.round(b.width)}×${Math.round(b.height)}`);
      }
      const e = document.getElementById('estrellas-juego'), svg = document.querySelector('#pentagrama svg');
      if (e && svg && vis(e)) {
        const a = e.getBoundingClientRect(), s = svg.getBoundingClientRect();
        // ¿la insignia pisa alguna línea del pentagrama? buscamos las líneas horizontales (paths/lines) dentro del svg
        let pisa = false;
        for (const l of svg.querySelectorAll('path, line, rect')) { const lb = l.getBoundingClientRect(); if (lb.width > 40 && lb.height < 3 && !(lb.right < a.left || lb.left > a.right || lb.bottom < a.top || lb.top > a.bottom)) { pisa = true; break; } }
        out.estrellas = { ancho: Math.round(a.width), derecha: Math.round(W - a.right), pisaPentagrama: pisa, sobreSvg: !(a.bottom < s.top) };
      }
      const t = document.getElementById('btn-golpe');
      if (t) { const b = t.getBoundingClientRect(); out.tambor = { visible: getComputedStyle(t).opacity !== '0', x: Math.round(b.x + b.width / 2), abajo: Math.round(innerHeight - b.bottom), dentro: b.bottom <= innerHeight && b.top >= 0 }; }
      return out;
    });
    const tag = `${app} ${w}×${h}`;
    if (r.scrollX) hallazgos.push(`${tag}: scroll horizontal`);
    r.fuera.slice(0, 5).forEach(x => hallazgos.push(`${tag}: se sale ${x}`));
    r.chicos.slice(0, 6).forEach(x => hallazgos.push(`${tag}: botón chico ${x}`));
    if (r.estrellas && r.estrellas.pisaPentagrama) hallazgos.push(`${tag}: la insignia de estrellas pisa el pentagrama`);
    if (r.tambor && (!r.tambor.visible || !r.tambor.dentro)) hallazgos.push(`${tag}: tambor ${JSON.stringify(r.tambor)}`);
    errores.slice(0, 3).forEach(x => hallazgos.push(`${tag}: error ${x.slice(0, 120)}`));
    console.log(tag, JSON.stringify({ estrellas: r.estrellas, tambor: r.tambor, chicos: r.chicos.length, fuera: r.fuera.length }));
    await p.screenshot({ path: path.join(OUT, `${app}-${w}x${h}.png`) });
    await ctx.close();
  }
  await nav.close();
  console.log('\nHALLAZGOS:\n' + (hallazgos.length ? hallazgos.join('\n') : 'ninguno'));
})();
