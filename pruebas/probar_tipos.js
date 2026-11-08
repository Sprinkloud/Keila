/* Prueba con clics de los tipos de ejercicio nuevos (7-nov-2026): node pruebas/probar_tipos.js [carpeta de capturas]
   Con el servidor local (puerto 8010). En las lecciones que estrenan un tipo, escribe y elige con el teclado y el mouse
   (fill / selectOption, como el alumno): la mitad de las respuestas bien y la otra mitad mal, toca «Revisar mis respuestas»
   y comprueba que cada campo quede verde o rojo según corresponde, que debajo de cada rojo esté la respuesta correcta,
   que el marcador diga cuántas hay bien, y que al corregir las rojas y revisar otra vez salga «¡Hoja perfecta!».
   Si se da una carpeta, guarda una captura de cada hoja revisada (a 360 px). */
const path = require('path');
const { chromium } = require(path.join(__dirname, '..', '..', 'Libro_Sprinkloud', 'node_modules', 'playwright-core'));
const carpeta = process.argv[2];
const LECCIONES = [[1, 'piano'], [2, 'piano'], [3, 'violin'], [4, 'piano'], [5, 'violin'], [6, 'piano'], [7, 'piano'], [9, 'violin'], [10, 'violin'], [11, 'piano'], [12, 'piano'],
  [13, 'piano'], [14, 'violin'], [15, 'piano'], [16, 'piano'], [18, 'piano'], [19, 'violin'], [20, 'violin'], [21, 'violin'], [21, 'piano'], [22, 'piano'], [23, 'violin'], [24, 'piano'],
  [25, 'piano'], [26, 'violin'], [27, 'piano'], [28, 'piano'], [29, 'piano'], [30, 'violin'], [31, 'piano'], [34, 'piano'], [37, 'violin'], [38, 'piano'], [39, 'piano'], [40, 'violin'],
  [41, 'piano'], [43, 'piano'], [44, 'violin'], [45, 'piano'], [46, 'piano'], [47, 'violin'], [48, 'piano'], [49, 'piano'], [50, 'piano'], [50, 'violin'], [52, 'piano'], [54, 'piano'],
  [57, 'violin'], [59, 'piano'], [60, 'piano']];
(async () => {
  const nav = await chromium.launch({ channel: 'chrome', headless: true });
  const page = await nav.newPage({ viewport: { width: 360, height: 780 } });
  const fallas = []; let revisados = 0;
  page.on('pageerror', e => fallas.push('JS: ' + e.message));
  for (const [s, ins] of LECCIONES) {
    await page.goto('http://localhost:8010/practica/hojas/' + ins + '/semana-' + s, { waitUntil: 'load' });
    await page.waitForTimeout(200);
    /* los campos de la hoja: id, si es lista, la respuesta aceptada y una mala */
    const cs = await page.evaluate(() => campos.filter(c => !c.dibujo).map(c => ({ id: c.el.id, lista: c.el.tagName === 'SELECT', bien: c.muestra,
      mal: c.el.tagName === 'SELECT' ? [...c.el.options].map(o => o.value).find(v => v && v !== c.muestra) : 'zzz', sol: c.solucion })));
    for (const [k, c] of cs.entries()) {
      const v = k % 2 ? c.mal : c.bien;
      if (c.lista) await page.selectOption('#' + c.id, v); else await page.fill('#' + c.id, String(v));
    }
    await page.click('#revisar');
    const r = await page.evaluate(ids => ids.map(id => { const e = document.getElementById(id), caja = e.closest('.respuestas, .item');
      return { ok: e.classList.contains('ok'), mal: e.classList.contains('mal'), sols: [...caja.querySelectorAll('.solucion')].map(x => x.textContent) }; }), cs.map(c => c.id));
    const marcador = await page.textContent('#resultado');
    const dibujos = await page.evaluate(() => campos.filter(c => c.dibujo).length);
    cs.forEach((c, k) => {
      revisados++;
      const debeIrBien = k % 2 === 0 || !c.mal;
      if (debeIrBien && !r[k].ok) fallas.push(`${s} ${ins}: «${c.bien}» quedó en rojo`);
      if (!debeIrBien && !r[k].mal) fallas.push(`${s} ${ins}: «${c.mal}» no quedó en rojo`);
      if (!debeIrBien && !r[k].sols.includes('✓ ' + c.sol)) fallas.push(`${s} ${ins}: falta la respuesta correcta «${c.sol}» debajo`);
    });
    const buenas = cs.filter((c, k) => k % 2 === 0 || !c.mal).length;
    if (!marcador.startsWith(buenas + ' de ' + (cs.length + dibujos))) fallas.push(`${s} ${ins}: el marcador dice «${marcador.slice(0, 40)}» y van ${buenas} bien`);
    if (carpeta) await page.screenshot({ path: path.join(carpeta, `hoja-${s}-${ins}.png`), fullPage: true });
    /* corrige las rojas y vuelve a revisar (los dibujos se tocan donde va la nota no se prueban aquí) */
    for (const [k, c] of cs.entries()) if (k % 2 && c.mal) { if (c.lista) await page.selectOption('#' + c.id, c.bien); else await page.fill('#' + c.id, String(c.bien)); }
    await page.click('#revisar');
    const otra = await page.evaluate(() => [document.querySelectorAll('.hoja .mal:not(.dibujable)').length, document.querySelectorAll('.hoja input.ok, .hoja select.ok').length]);
    if (otra[0] !== 0 || otra[1] !== cs.length) fallas.push(`${s} ${ins}: al corregir quedan ${otra[0]} rojas`);
  }
  await nav.close();
  console.log(JSON.stringify({ hojas: LECCIONES.length, campos: revisados, fallas: fallas.slice(0, 60) }, null, 1));
  process.exit(fallas.length ? 1 : 0);
})();
