/* Prueba de las hojas de práctica (7-nov-2026): node pruebas/hojas_test.js [semillas por lección, 40 por defecto]
   Arma las 60 lecciones × piano y violín × N semillas con el código de practica/hojas.html (sin navegador: un DOM mínimo
   y VexFlow de mentira) y comprueba:
   - que no falle, que cada ejercicio tenga ítems, que cada ítem tenga algo que responder y que no se repitan ítems;
   - que cada respuesta guardada se acepte (ok(muestra)) y que la de cada lista de opciones esté entre las opciones;
   - que no haya «undefined», «NaN» ni «null» en el texto;
   - y recalcula con teoría las respuestas de los tipos de ejercicio nuevos, con las mismas funciones que comprueban los
     libros (Libro_Sprinkloud/herramientas/comprobar_soluciones.js) o con su propia cuenta (ritmo, pulsos, órdenes).
   Sale con código 1 si algo falla. */
'use strict';
const fs = require('fs'), path = require('path');
const SEMILLAS = Number(process.argv[2]) || 40;

/* ---------- DOM mínimo ---------- */
class Nodo {
  constructor(tag) { this.tagName = String(tag).toUpperCase(); this.attrs = {}; this.children = []; this.parentNode = null; this._text = ''; this.value = ''; this.style = {}; this.className = ''; this.disabled = false;
    const yo = this; this.classList = { add: (...c) => c.forEach(x => { if (!yo.cls().includes(x)) yo.className = (yo.className + ' ' + x).trim(); }), remove: (...c) => { yo.className = yo.cls().filter(x => !c.includes(x)).join(' '); },
      toggle: (c, f) => f ? yo.classList.add(c) : yo.classList.remove(c), contains: c => yo.cls().includes(c) }; }
  cls() { return this.className.split(/\s+/).filter(Boolean); }
  setAttribute(k, v) { this.attrs[k] = String(v); if (k === 'class') this.className = String(v); }
  getAttribute(k) { return this.attrs[k]; }
  append(...hs) { hs.forEach(h => { if (typeof h === 'string') { const t = new Nodo('#text'); t._text = h; h = t; } h.parentNode = this; this.children.push(h); }); }
  prepend(...hs) { const v = this.children; this.children = []; this.append(...hs); this.children.push(...v); }
  appendChild(h) { this.append(h); return h; }
  insertBefore(h, ref) { h.parentNode = this; const i = this.children.indexOf(ref); this.children.splice(i < 0 ? this.children.length : i, 0, h); }
  replaceChildren(...hs) { this.children = []; this.append(...hs); }
  addEventListener() {}
  set textContent(t) { this.children = []; this._text = String(t); }
  get textContent() { return this._text + this.children.map(c => c.textContent).join(' '); }
  todos() { return this.children.flatMap(c => [c].concat(c.todos())); }
  coincide(sel) { const m = sel.match(/^([a-z0-9]*)((?:\.[\w-]+)*)$/i); if (!m) return false;
    return (!m[1] || this.tagName === m[1].toUpperCase()) && m[2].split('.').filter(Boolean).every(c => this.cls().includes(c)); }
  querySelectorAll(sel) { return sel.split(',').map(s => s.trim()).flatMap(s => { const p = s.split(/\s*>\s*|\s+/); let lista = this.todos().filter(n => n.coincide(p[p.length - 1]));
    if (p.length > 1) lista = lista.filter(n => { let a = n.parentNode; while (a && a !== this) { if (a.coincide(p[0])) return true; a = a.parentNode; } return false; }); return lista; }); }
  querySelector(sel) { const r = this.querySelectorAll(sel)[0]; if (r) return r; if (sel === 'svg') { const s = new Nodo('svg'); this.append(s); return s; } return null; }
  closest(sel) { let a = this; while (a) { if (sel.split(',').some(s => a.coincide(s.trim()))) return a; a = a.parentNode; } return null; }
  getBoundingClientRect() { return { top: 0, height: 1 }; }
}
const documento = { createElement: t => new Nodo(t), createElementNS: (_, t) => new Nodo(t), querySelectorAll: () => [] };
/* VexFlow de mentira: todo se puede llamar, construir y sumar */
const VF = new Proxy(function () {}, { get: (t, p) => p === Symbol.toPrimitive ? () => 0 : VF, apply: () => VF, construct: () => VF });

/* ---------- El código de la hoja (como lo copia App_Bosque/herramientas/copiar_motores.py) ---------- */
const html = fs.readFileSync(path.join(__dirname, '..', 'practica', 'hojas.html'), 'utf8').split('\n');
const i0 = html.findIndex(l => l.startsWith('/* ---------- La guía (semana')), i1 = html.findIndex(l => l.startsWith('const tieneHoja'));
const codigo = html.slice(i0, i1 + 1).join('\n');
const H = new Function('document', 'Vex', codigo + '\nreturn { ejerciciosDe, GUIA, SIN_HOJA, armar(s, ins, sem) { semilla = sem; campos = []; idCampo = 0; return { secciones: [].concat(ejerciciosDe(s, ins)), campos }; } };')(documento, { Flow: VF });

/* ---------- La teoría de los libros (comprobar_soluciones.js sin su recorrido de los libros) ---------- */
const comp = fs.readFileSync(path.join(__dirname, '..', '..', 'Libro_Sprinkloud', 'herramientas', 'comprobar_soluciones.js'), 'utf8');
const L = new Function('require', '__dirname', comp.slice(0, comp.indexOf('let errores = 0')) + '\nreturn { CHK, comprobar, nota, nombre, pc, arriba, escala, triada, tipoDe, gradoDe, intervalo, MAYOR, MENOR, ARMONICA, MODOS };')(require, __dirname);
const MODO_ID = { 'Jónico': 'jonico', 'Dórico': 'dorico', 'Frigio': 'frigio', 'Lidio': 'lidio', 'Mixolidio': 'mixolidio', 'Eólico': 'eolico', 'Locrio': 'locrio' };
const notas = s => String(s).split(/\s*[-,·]\s*|\s+/).filter(Boolean);
const SIL = { ta: 1, 'ti-ti': 2, sh: 0, 'ta-a': 1, 'ta-a-a': 1, 'ta-a-a-a': 1, 'ta-i ti': 2, 'ta-ka-di-mi': 4, 'ta di-mi': 3, 'ta-ka di': 3, 'ta di di': 3 };
const PUL = { ta: 1, 'ti-ti': 1, sh: 1, 'ta-a': 2, 'ta-a-a': 3, 'ta-a-a-a': 4, 'ta-i ti': 2, 'ta-ka-di-mi': 1, 'ta di-mi': 1, 'ta-ka di': 1, 'ta di di': 2 };
const FIG = { redonda: 4, blanca: 2, negra: 1, corchea: 0.5, semicorchea: 0.25, 'blanca con puntillo': 3, 'negra con puntillo': 1.5 };
const num = s => Number(String(s).replace(',', '.'));

/* Cada verificador recibe (texto del ítem sin el número, soluciones de sus campos en orden) y devuelve true o un mensaje */
const VERIF = {
  'Escribe la nota de arriba': (t, [r]) => { const m = t.match(/^(\S+) \+ (.+)$/); return m[2] === 'octava' || INTERVALOS_LIBRO[m[2]] ? L.CHK.arriba(t, r) : L.intervalo(L.nota(m[1]), L.nota(r)).nombre === m[2]; },
  'Completa la escala menor armónica': (t, rs, item) => L.CHK.escalaArmonica(t.split(' ')[0], escalaDelItem(item, rs).join(', ')),
  'Escribe el modo': (t, rs, item) => L.comprobar('modo:' + MODO_ID[mayus(t.split(' ')[1])], 'desde ' + t.split(' ')[0], escalaDelItem(item, rs).join(', ')),
  '¿Qué modo es?': (t, [r]) => t.includes('De ') ? true : L.CHK.queModo(t, r.toLowerCase()),
  'La relativa mayor': (t, [r]) => L.CHK.relativa(r, t.split(' ')[0] + ' menor'),
  'El acorde V en menor': (t, [ac, ...ns]) => L.CHK.vMenor('en ' + t.replace(/^V de (\S+) menor$/, '$1'), ac.split(' ')[0] + ': ' + ns.join('-')),
  'Tónica y dominante': (t, [a, b]) => L.CHK.tonDom(t.split(' ')[0], a + ' y ' + b),
  '¿Qué acorde acompaña el compás?': (t, [r]) => { const [ns, ton] = [t.replace(/ \(.*$/, ''), t.match(/\((\S+) mayor\)/)[1]];
    const e = L.escala(L.nota(ton), L.MAYOR), tri = k => [e[k], e[(k + 2) % 7], e[(k + 4) % 7]].map(L.nombre);
    const q = { I: 0, IV: 3, V: 4 }; const ok = Object.keys(q).filter(g => notas(ns).every(n => tri(q[g]).includes(n))); return ok.length === 1 && ok[0] === r; },
  'El otro nombre': (t, [r]) => L.CHK.enarm(t.replace(' =', ''), r),
  'Sube un tono o un semitono': (t, [r]) => { const m = t.match(/^(\S+) \+ un (tono|semitono)$/); return (L.pc(L.nota(r.split(' ')[0])) - L.pc(L.nota(m[1])) + 12) % 12 === (m[2] === 'tono' ? 2 : 1); },
  '¿Qué grado es?': (t, [r]) => { const m = t.match(/^¿Qué grado es (\S+) en (\S+) mayor\?$/); return L.gradoDe(L.nota(m[2]), ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII'].indexOf(r)) === m[1]; },
  '¿Qué nota cambias?': (t, [a, b]) => { const m = t.match(/^Para que (\S+) (mayor|menor) sea \S+ (mayor|menor)$/); return L.triada(L.nota(m[1]), m[2]).map(L.nombre)[1] === a && L.triada(L.nota(m[1]), m[3]).map(L.nombre)[1] === b; },
  'Encuentra el error': (t, [mal, bien]) => { const m = t.match(/^(\S+) mayor: (.*)$/), e = L.escala(L.nota(m[1]), L.MAYOR).map(L.nombre), x = notas(m[2]);
    const k = x.findIndex((n, j) => n !== e[j]); return x.filter((n, j) => n !== e[j]).length === 1 && x[k] === mal && e[k] === bien; },
  '¿Reposo o tensión?': (t, [r]) => { const m = t.match(/^En (\S+) mayor, la frase termina en (\S+)$/); return (L.gradoDe(L.nota(m[1]), 0) === m[2] ? 'Reposo' : L.gradoDe(L.nota(m[1]), 4) === m[2] ? 'Tensión' : '?') === r; },
  'Pasa a acordes': (t, rs) => { const m = t.match(/^(.*) en (\S+) mayor$/); const R = ['I', 'ii', 'iii', 'IV', 'V', 'vi', 'vii°'];
    return m[1].split(' – ').every((g, j) => L.gradoDe(L.nota(m[2]), R.indexOf(g)) === rs[j].split(' ')[0]); },
  'Pasa a números romanos': (t, rs) => { const m = t.match(/^(.*) \((\S+) mayor\)$/); const R = ['I', 'ii', 'iii', 'IV', 'V', 'vi'];
    return m[1].split(' – ').every((a, j) => L.gradoDe(L.nota(m[2]), R.indexOf(rs[j])) === a); },
  '¿Qué nota sube?': (t, [a, b]) => { const n = L.nota(t.split(' ')[0]); return L.escala(n, L.MENOR).map(L.nombre)[6] === a && L.escala(n, L.ARMONICA).map(L.nombre)[6] === b; },
  '¿Está en la pentatónica?': (t, [r]) => { const m = t.match(/^¿Está (\S+) en la pentatónica de (\S+) (mayor|menor)\?$/);
    const e = L.escala(L.nota(m[2]), m[3] === 'menor' ? L.MENOR : L.MAYOR).slice(0, 7).filter((_, k) => m[3] === 'menor' ? k !== 1 && k !== 5 : k !== 3 && k !== 6).map(L.nombre);
    return (e.includes(m[1]) ? 'Sí' : 'No') === r; },
  '¿Qué nota baja?': (t, [a, b]) => { const m = t.match(/^Del (\S+) al (\S+)$/), ea = L.escala(L.nota('Do'), L.MODOS[MODO_ID[mayus(m[1])]]).map(L.nombre), eb = L.escala(L.nota('Do'), L.MODOS[MODO_ID[mayus(m[2])]]).map(L.nombre);
    const k = ea.findIndex((n, j) => n !== eb[j]); return ea.filter((n, j) => n !== eb[j]).length === 1 && ea[k] === a && eb[k] === b && (L.pc(L.nota(a)) - L.pc(L.nota(b)) + 12) % 12 === 1; },
  '¿Mayor o menor?': (t, [r]) => (L.MODOS[MODO_ID[t]][2] === 4 ? 'Mayor' : 'Menor') === r,
  '¿Cuántos sonidos tiene?': (t, [r]) => t.split(' | ').reduce((s, c) => s + SIL[c], 0) === num(r),
  '¿Cuántos sonidos y cuántos pulsos?': (t, [a, b]) => t.split(' | ').reduce((s, c) => s + SIL[c], 0) === num(a) && t.split(' | ').reduce((s, c) => s + PUL[c], 0) === num(b),
  'Escribe lo que falta': (t, [r]) => { const m = t.match(/^(.*) \((\d+) sonidos\)$/); return m[1].split(' | ').reduce((s, c) => s + (c === '___' ? SIL[r] : SIL[c]), 0) === Number(m[2]); },
  'La escalera de sonidos': (t, [fin, dir]) => { const m = t.match(/^Empieza en el (\d), (.*)$/); let p = Number(m[1]);
    m[2].split(' y ').forEach(x => { const [v, n] = x.split(' '); p += v === 'sube' ? +n : -n; }); return p === num(fin) && p >= 1 && p <= 8 && (dir === undefined || (p > Number(m[1]) ? 'Más aguda' : 'Más grave') === dir); },
  'El metrónomo': (t, [r]) => { let m;
    if ((m = t.match(/en (\d+), ¿cuántos pulsos suenan en un minuto/))) return +m[1] === num(r);
    if ((m = t.match(/en (\d+), ¿cuántos pulsos suenan en medio minuto/))) return +m[1] / 2 === num(r);
    if ((m = t.match(/en (\d+), ¿cuántos pulsos suenan en un segundo/))) return +m[1] / 60 === num(r);
    if ((m = t.match(/duran (\d+) pulsos con el metrónomo en (\d+)/))) return +m[1] * 60 / +m[2] === num(r);
    if ((m = t.match(/rápido, (\d+) o (\d+)/))) return Math.max(+m[1], +m[2]) === num(r); return 'pregunta desconocida'; },
  '¿El pulso es parejo?': (t, [r]) => { const g = t.split('●').slice(1, -1).map(x => (x.match(/–/g) || []).length); return (g.every(x => x === g[0]) ? 'Parejo' : 'No es parejo') === r; },
  'Cuenta en el compás': (t, [r]) => { const m = t.match(/En (\d)\/4, en el pulso (\d+)/); return (m[2] - 1) % m[1] + 1 === num(r); },
  'La anacrusa': (t, [r]) => { const m = t.match(/Compás de (\d)\/4 que empieza con (\d)/); return m[1] - m[2] === num(r); },
  '¿Qué compás llena?': (t, [r]) => { const P = { negra: 1, blanca: 2, '2 corcheas': 1, '4 corcheas': 2, redonda: 4, 'blanca con puntillo': 3 }; return t.split(' + ').reduce((s, x) => s + P[x], 0) + '/4' === r; },
  'Suma los pulsos': (t, [r]) => t.split(' + ').reduce((s, x) => s + FIG[x], 0) === num(r),
  '¿Cuántas caben?': (t, [r]) => { const m = t.match(/¿Cuántas (.+?)s? caben en una (.+)\?/); return FIG[m[2]] / FIG[m[1].replace(/s$/, '')] === num(r); },
  '¿Cuántas corcheas faltan?': (t, [r]) => 6 - t.replace('6/8: ', '').split(' + ').reduce((s, x) => s + 2 * FIG[x], 0) === num(r),
  '¿Llena un compás de 4/4?': (t, [p, sn]) => { const NOM = { negra: 'ta', '2 corcheas': 'ti-ti', 'silencio de negra': 'sh', blanca: 'ta-a', 'blanca con puntillo': 'ta-a-a', redonda: 'ta-a-a-a' };
    const cs = t.includes(',') || NOM[t] ? t.split(', ').map(x => NOM[x]) : t.match(/ta-i ti|ta-a-a-a|ta-a-a|ta-a|ti-ti|ta|sh/g); const s = cs.reduce((a, c) => a + PUL[c], 0); return s === num(p) && (s === 4 ? 'Sí' : 'No') === sn; },
  '¿Paso o salto?': (t, [r]) => { const [a, b] = t.split(' → ').map(L.nota); return (Math.abs(b.l - a.l) === 1 ? 'Paso' : 'Salto') === r; },
  'Escribe la forma con letras': (t, [r]) => { const fr = t.split(' · ').map(x => x.replace(/^Frase \d+: /, '')), vistas = []; return fr.map(f => { if (!vistas.includes(f)) vistas.push(f); return 'ABCD'[vistas.indexOf(f)]; }).join('') === r; },
  '¿Dónde está?': (t, [r]) => { const POS = ['línea 1', 'espacio 1', 'línea 2', 'espacio 2', 'línea 3', 'espacio 3', 'línea 4', 'espacio 4', 'línea 5']; let m;
    if ((m = t.match(/más arriba: (.+) o (.+)\?/))) return POS[Math.max(POS.indexOf(m[1]), POS.indexOf(m[2]))] === r.toLowerCase();
    m = t.match(/^(Sube|Baja) un lugar desde (?:la|el) (.+)$/); return POS[POS.indexOf(m[2]) + (m[1] === 'Sube' ? 1 : -1)] === r.toLowerCase(); }
};
const INTERVALOS_LIBRO = { '2ª menor': 1, '2ª mayor': 1, '3ª menor': 1, '3ª mayor': 1, '4ª justa': 1, '5ª justa': 1, '6ª menor': 1, '6ª mayor': 1, '7ª menor': 1, '7ª mayor': 1 };
const mayus = t => t.charAt(0).toUpperCase() + t.slice(1);
/* la escala completa del ítem: los .enunciado de las puntas y las soluciones de los campos del medio */
function escalaDelItem(item, rs) { const r = item.querySelector('.respuestas'); let k = 0; return r.children.filter(c => c.tagName !== 'SPAN' || c.cls().includes('enunciado')).map(c => c.tagName === 'INPUT' ? rs[k++] : c.textContent); }

/* ---------- Recorrido ---------- */
/* los tipos de antes del 7-nov repiten ítems a propósito cuando hay pocas notas (varios()); los nuevos, nunca */
const VIEJOS = /^(Dibuja la nota|Escribe el nombre|¿Sol o mi?|Las notas de la cuerda|Clave de|Líneas|Notas con|Notas en clave|Lectura rápida|¿Línea o espacio?|¿Sube o baja?|Escribe las sílabas|¿Cuántos pulsos)/;
let errores = 0, items = 0, campos = 0, verificados = 0;
const tipos = {};
const falla = m => { if (errores++ < 40) console.log('✗ ' + m); };
for (let s = 1; s <= 60; s++) for (const ins of ['piano', 'violin']) for (let v = 1; v <= SEMILLAS; v++) {
  let r;
  try { r = H.armar(s, ins, s * 9973 + v * 131); } catch (e) { falla(`${s} ${ins} v${v}: ${e.stack.split('\n').slice(0, 3).join(' ')}`); continue; }
  if (!r.secciones.length) falla(`${s} ${ins}: sin ejercicios`);
  for (const sec of r.secciones) {
    const titulo = sec.querySelector('h3').children[0].textContent.trim(), its = sec.querySelectorAll('.items > .item');
    const donde = `${s} ${ins} v${v} «${titulo}»`;
    tipos[titulo] = (tipos[titulo] || 0) + 1;
    if (!its.length) falla(donde + ': sin ítems');
    const vistos = new Set();
    for (const it of its) {
      items++;
      const txt = it.textContent.replace(/\s+/g, ' ').trim();
      if (/undefined|NaN|null|\[object/.test(txt)) falla(`${donde}: texto raro «${txt}»`);
      const suyos = r.campos.filter(c => { let a = c.el; while (a) { if (a === it) return true; a = a.parentNode; } return false; });
      if (!suyos.length) falla(`${donde}: ítem sin nada que responder «${txt}»`);
      const firma = txt.replace(/^\d+ /, '') + suyos.map(c => c.solucion).join('|');
      const conDibujo = it.querySelectorAll('div').some(d => !d.cls().length && d.parentNode === it);
      if (vistos.has(firma) && !conDibujo && !VIEJOS.test(titulo)) falla(`${donde}: ítem repetido «${txt}»`);
      vistos.add(firma);
      for (const c of suyos) {
        campos++;
        if (c.dibujo) continue;
        if (c.el.tagName === 'SELECT') { const ops = c.el.children.map(o => o.attrs.value); if (!ops.includes(c.solucion)) falla(`${donde}: la respuesta «${c.solucion}» no está en las opciones`); if (new Set(ops).size !== ops.length) falla(`${donde}: opciones repetidas`); }
        if (c.solucion === '' || c.solucion == null) falla(`${donde}: solución vacía`);
        if (!c.ok(c.muestra)) falla(`${donde}: no acepta su propia respuesta «${c.muestra}» («${txt}»)`);
        if (c.ok('zzz')) falla(`${donde}: acepta cualquier cosa`);
      }
      const f = VERIF[titulo];
      if (f) {
        const enun = it.querySelector('.enunciado'); const t = enun ? enun.textContent.trim() : '';
        let ok; try { ok = f(t, suyos.map(c => c.muestra), it); } catch (e) { ok = e.message; }
        verificados++;
        if (ok !== true) falla(`${donde}: la teoría no coincide (${ok}) «${t}» → ${suyos.map(c => c.muestra).join(' | ')}`);
      }
    }
  }
}
console.log(`${60 * 2 * SEMILLAS} hojas, ${items} ítems, ${campos} campos; ${verificados} respuestas recalculadas con teoría; ${errores} errores.`);
console.log('Tipos de ejercicio:', Object.keys(tipos).length);
process.exit(errores ? 1 : 0);
