/*
 * Sprinkloud · escalas para el piano y el violín virtuales (7-nov-2026)
 *
 * Lo usan los juegos de lección que no son «leer una nota»: tocar una escala nota por nota (mayor, menor natural y
 * pentatónicas) y ¿línea o espacio?. Antes, las lecciones de escalas abrían el juego de leer notas: la tarjeta decía
 * «toca la pentatónica» y el juego pedía una nota suelta del pentagrama (reporte de la dueña, 7-nov-2026).
 *
 * SprinkloudEscalas.armar('pentaMenor', 'La4') → [{ midi, nombre: 'La', clave: 'a/4', alt: '' }, …] (cada nota con su letra)
 * SprinkloudEscalas.titulo('mayor', 'Sol4') → 'Sol mayor'
 * SprinkloudEscalas.dibujar(contenedor, notas) → las notas en un pentagrama en clave de sol (VexFlow 4)
 * SprinkloudEscalas.esLinea('e/4') → true (las líneas de la clave de sol: mi, sol, si, re, fa)
 */
(function () {
  'use strict';
  var ES = ['Do', 'Re', 'Mi', 'Fa', 'Sol', 'La', 'Si'], VF = ['c', 'd', 'e', 'f', 'g', 'a', 'b'], NATURAL = [0, 2, 4, 5, 7, 9, 11];
  /* st: semitonos desde la nota casa; g: el grado (letra) de cada nota. Las pentatónicas son sus 5 notas, sin repetir la casa
     arriba: así La pentatónica menor cabe en el teclado del piano virtual (Do4 a Sol5). */
  var TIPOS = {
    mayor: { n: 'mayor', st: [0, 2, 4, 5, 7, 9, 11, 12], g: [0, 1, 2, 3, 4, 5, 6, 7], formula: 'T-T-S-T-T-T-S' },
    menor: { n: 'menor natural', st: [0, 2, 3, 5, 7, 8, 10, 12], g: [0, 1, 2, 3, 4, 5, 6, 7], formula: 'T-S-T-T-S-T-T' },
    pentaMayor: { n: 'pentatónica mayor', st: [0, 2, 4, 7, 9], g: [0, 1, 2, 4, 5], quita: 'sin la 4ª ni la 7ª de la escala mayor' },
    pentaMenor: { n: 'pentatónica menor', st: [0, 3, 5, 7, 10], g: [0, 2, 3, 4, 6], quita: 'sin la 2ª ni la 6ª de la escala menor' }
  };
  var SIG = { '-1': '♭', 0: '', 1: '♯' }, VFALT = { '-1': 'b', 0: '', 1: '#' };
  /* 'Fa♯4', 'Si♭3', 'Sol3' → { l: letra, midi } */
  function raiz(r) {
    var m = String(r).match(/^(Do|Re|Mi|Fa|Sol|La|Si)(♯|♭)?(\d)$/);
    var l = ES.indexOf(m[1]);
    return { l: l, midi: 12 * (Number(m[3]) + 1) + NATURAL[l] + (m[2] === '♯' ? 1 : m[2] === '♭' ? -1 : 0) };
  }
  function armar(tipo, r) {
    var t = TIPOS[tipo], R = raiz(r), oct0 = Math.floor(R.midi / 12) - 1;
    return t.st.map(function (d, k) {
      var l = (R.l + t.g[k]) % 7, real = R.midi + d;
      var oct = oct0 + Math.floor((R.l + t.g[k]) / 7);
      var alt = real - (12 * (oct + 1) + NATURAL[l]);
      return { midi: real, nombre: ES[l] + SIG[alt], clave: VF[l] + '/' + oct, alt: VFALT[alt] };
    });
  }
  function titulo(tipo, r) {
    var nombre = String(r).replace(/\d$/, '');
    return tipo === 'mayor' || tipo === 'menor' ? nombre + ' ' + TIPOS[tipo].n : 'la ' + TIPOS[tipo].n + ' de ' + nombre;
  }
  /* bien (opcional): [true, false, …] pinta cada nota en verde (bien) o rojo (mal) al corregir */
  var VERDE = '#48592F', ROJO = '#9A5245';
  function dibujar(cont, notas, bien) {
    var V = window.Vex.Flow;
    cont.innerHTML = '';
    var r = new V.Renderer(cont, V.Renderer.Backends.SVG);
    r.resize(380, 140);
    var c = r.getContext(); c.setFillStyle('#3A3128'); c.setStrokeStyle('#3A3128');
    var st = new V.Stave(6, 16, 368); st.addClef('treble'); st.setContext(c).draw();
    var ns = notas.map(function (n, i) {
      var x = new V.StaveNote({ keys: [n.clave], duration: 'q', auto_stem: true }); if (n.alt) x.addModifier(new V.Accidental(n.alt), 0);
      if (bien) { var col = bien[i] ? VERDE : ROJO; x.setStyle({ fillStyle: col, strokeStyle: col }); }
      return x;
    });
    var v = new V.Voice({ num_beats: ns.length, beat_value: 4 }).setMode(V.Voice.Mode.SOFT).addTickables(ns);
    new V.Formatter().joinVoices([v]).format([v], 300); v.draw(c, st);
    var svg = cont.querySelector('svg'); svg.setAttribute('viewBox', '0 0 380 140'); svg.removeAttribute('width'); svg.removeAttribute('height'); svg.style.width = '100%'; svg.style.height = 'auto';
    cont.setAttribute('role', 'img'); cont.setAttribute('aria-label', 'Escala: ' + notas.map(function (n, i) { return n.nombre + (bien ? (bien[i] ? ' (bien)' : ' (mal)') : ''); }).join(', '));
  }
  /* Corrección al final (pedido de la dueña, 7-nov-2026): el alumno pone todas las notas y recién ahí se corrige.
     tocadas: los midi que tocó, en orden. Devuelve { bien: [true/false…], aciertos, texto } con cada error explicado. */
  var NOMBRE_MIDI = ['Do', 'Do♯', 'Re', 'Mi♭', 'Mi', 'Fa', 'Fa♯', 'Sol', 'La♭', 'La', 'Si♭', 'Si'];
  function corregir(notas, tocadas, nombreTocada) {
    var bien = notas.map(function (n, i) { return tocadas[i] === n.midi; });
    var aciertos = bien.filter(Boolean).length;
    var errores = notas.map(function (n, i) {
      return bien[i] ? null : 'nota ' + (i + 1) + ': tocaste ' + (nombreTocada ? nombreTocada(tocadas[i]) : NOMBRE_MIDI[((tocadas[i] % 12) + 12) % 12]) + ', era ' + n.nombre;
    }).filter(Boolean);
    return { bien: bien, aciertos: aciertos, texto: aciertos === notas.length ? '¡Todas bien! ' + notas.map(function (n) { return n.nombre; }).join(' · ')
      : 'Bien ' + aciertos + ' de ' + notas.length + '. ' + errores.join('; ') + '.' };
  }
  var LINEAS_SOL = ['e/4', 'g/4', 'b/4', 'd/5', 'f/5'];
  function esLinea(clave) { return LINEAS_SOL.indexOf(clave) >= 0; }
  /* «sube un tono», «sube un semitono» o «sube 3 semitonos» entre dos notas de la escala */
  function paso(st) { return st === 1 ? 'un semitono (la nota de al lado)' : st === 2 ? 'un tono (dos semitonos)' : st + ' semitonos'; }
  window.SprinkloudEscalas = { TIPOS: TIPOS, armar: armar, titulo: titulo, dibujar: dibujar, esLinea: esLinea, paso: paso, corregir: corregir };
})();
