/* Recorre las hojas de práctica en el navegador (7-nov-2026): node pruebas/revisar_hojas.js [320,360] [1-60] [variantes]
   Necesita el servidor local (node servidor-local.js, puerto 8010) y usa playwright-core de Libro_Sprinkloud con el Chrome
   del equipo. Para cada lección × piano y violín × ancho:
   - errores de JavaScript y de la consola;
   - que la página no se corra de costado y que ningún texto se salga de su caja o de la pantalla;
   - responde todo mal («zzz» o la primera opción incorrecta), toca «Revisar» y vuelve a mirar: las respuestas correctas
     que aparecen debajo de las rojas tampoco pueden quedar cortadas;
   - que cada botón y campo mida al menos 44 px de alto (los campos de la hoja, 40).
   Devuelve los hallazgos y sale con código 1 si hay alguno. */
const path = require('path');
const { chromium } = require(path.join(__dirname, '..', '..', 'Libro_Sprinkloud', 'node_modules', 'playwright-core'));
const anchos = (process.argv[2] || '320,360').split(',').map(Number);
const [desde, hasta] = (process.argv[3] || '1-60').split('-').map(Number);
const variantes = Number(process.argv[4]) || 1;
(async () => {
  const nav = await chromium.launch({ channel: 'chrome', headless: true });
  const hallazgos = [];
  for (const w of anchos) {
    const page = await nav.newPage({ viewport: { width: w, height: 740 }, deviceScaleFactor: 1 });
    let donde = '';
    page.on('pageerror', e => hallazgos.push(donde + ' JS: ' + String(e.message).slice(0, 200)));
    page.on('console', m => { if (m.type() === 'error') hallazgos.push(donde + ' consola: ' + m.text().slice(0, 200)); });
    for (let s = desde; s <= hasta; s++) for (const ins of ['piano', 'violin']) for (let v = 1; v <= variantes; v++) {
      donde = w + 'px ' + ins + ' ' + s + (v > 1 ? ' v' + v : '');
      await page.goto('http://localhost:8010/practica/hojas/' + ins + '/semana-' + s + (v > 1 ? '?v=' + v : ''), { waitUntil: 'load' });
      await page.waitForTimeout(150);
      const mirar = async cuando => (await page.evaluate(() => {
        const malos = [], W = document.documentElement.clientWidth;
        if (document.scrollingElement.scrollWidth > W + 1) malos.push('la página se corre de costado (' + document.scrollingElement.scrollWidth + ' > ' + W + ')');
        for (const e of document.querySelectorAll('main *')) {
          if (e.closest('svg') || e.closest('[hidden]') || e.closest('dialog')) continue;
          const b = e.getBoundingClientRect(); if (!b.width) continue;
          const tieneTexto = [...e.childNodes].some(n => n.nodeType === 3 && n.textContent.trim());
          const t = (e.textContent || e.value || '').trim().replace(/\s+/g, ' ').slice(0, 60);
          if (tieneTexto && (b.right > W + 1 || b.left < -1)) malos.push('SE SALE <' + e.tagName.toLowerCase() + ' ' + e.className + '>: ' + t);
          else if (tieneTexto && e.scrollWidth > e.clientWidth + 2 && getComputedStyle(e).display !== 'inline') malos.push('MÁS ANCHO <' + e.tagName.toLowerCase() + ' ' + e.className + '> (' + e.scrollWidth + '>' + e.clientWidth + '): ' + t);
          if (e.matches('select') && e.offsetParent && getComputedStyle(e).opacity !== '0') {   /* la opción elegida tiene que caber en el select */
            const c = document.createElement('span'); c.style.cssText = 'position:absolute;visibility:hidden;white-space:nowrap;font:' + getComputedStyle(e).font;
            c.textContent = e.options[e.selectedIndex] ? e.options[e.selectedIndex].text : ''; document.body.append(c);
            if (c.offsetWidth > e.clientWidth - 6 && b.width < W - 40) malos.push('SELECT CORTADO (' + c.offsetWidth + '>' + e.clientWidth + '): ' + c.textContent);
            c.remove();
          }
          if ((e.matches('button, select') || e.matches('.barra a')) && e.offsetParent && b.height < 43.5) malos.push('BAJITO <' + e.tagName.toLowerCase() + '> ' + Math.round(b.height) + ' px: ' + t);
          if (e.matches('input') && e.offsetParent && b.height < 39.5) malos.push('CAMPO BAJITO ' + Math.round(b.height) + ' px');
        }
        return malos;
      })).map(x => donde + ' ' + cuando + ': ' + x);
      hallazgos.push(...await mirar('al abrir'));
      /* todo mal: «zzz» en los campos y la última opción que no sea la correcta en las listas (se elige la más larga para probar el ancho) */
      await page.evaluate(() => {
        document.querySelectorAll('.hoja input').forEach(i => { i.value = 'zzz'; });
        document.querySelectorAll('.hoja select').forEach(s => { const ops = [...s.options].slice(1); const larga = ops.sort((a, b) => b.text.length - a.text.length)[0]; s.value = larga.value; });
      });
      await page.click('#revisar');
      await page.waitForTimeout(100);
      hallazgos.push(...await mirar('al revisar'));
      const marcadas = await page.evaluate(() => [document.querySelectorAll('.hoja .mal').length, document.querySelectorAll('.hoja .solucion').length]);
      if (marcadas[0] !== marcadas[1]) hallazgos.push(donde + ': ' + marcadas[0] + ' rojas y ' + marcadas[1] + ' respuestas debajo');
    }
    await page.close();
  }
  await nav.close();
  const unicos = [...new Set(hallazgos)];
  console.log(JSON.stringify({ hallazgos: unicos.slice(0, 120), total: unicos.length }, null, 1));
  process.exit(unicos.length ? 1 : 0);
})();
