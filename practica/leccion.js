/*
 * Sprinkloud · modo lección (lo usan todas las apps de práctica)
 *
 * Cuando el enlace trae ?semana=N (desde el libro, el mensaje de tareas de la maestra o el panel del maestro):
 * - muestra una tarjeta con la semana y el tema de la guía, la meta, 3 pasos de qué hacer en ESTA app
 *   y para qué sirve la camarita (comprobante.js);
 * - deja la app preparada solo con lo que el alumno ya aprendió hasta esa semana:
 *     piano y violín: el juego de notas solo con esas notas (sin líneas adicionales si todavía no las vio);
 *     ritmo: el compás, las tarjetas de figuras de esa semana y un ritmo de ejemplo listo para dar play;
 * - deja un botón "Semana N · ¿Qué hago?" para volver a ver los pasos.
 * Se carga en el <head> (sin defer) para leer la dirección antes de que la página la reescriba.
 * La guía (tema y meta) es la de Registro_Sprinkloud/Guia.js; si cambia, actualizar GUIA aquí y en hojas.html.
 */
(function () {
  'use strict';
  var semana = Number(new URLSearchParams(location.search).get('semana'));
  var rutaHoja = location.pathname.match(/\/hojas\/(piano|violin)\/semana-(\d+)/);
  var app = (location.pathname.match(/\/practica\/(piano|violin|ritmo|oido|hojas)/) || [])[1];
  if (!semana && rutaHoja && /[?&]leccion=1/.test(location.search)) semana = Number(rutaHoja[2]);
  if (!app || !(semana >= 1 && semana <= 48)) return;

  /* [tema, meta] de cada semana */
  var GUIA = [null,
    ['El pulso', 'Mantener el pulso 30 segundos con el metrónomo a 80, con palmas y en el pecho.'],
    ['Largo y corto: ta y ti-ti', 'Decir y palmear ritmos de 4 pulsos con ta (negra) y ti-ti (corcheas).'],
    ['El silencio', 'Respetar el silencio de negra (sh) dentro de un ritmo de 4 pulsos.'],
    ['Agudo y grave', 'Distinguir si un sonido sube o baja.'],
    ['Sol-mi: primeras notas cantadas', 'Cantar sol-mi y encontrarlas en tu instrumento.'],
    ['Ostinato y conjunto', 'Mantener un ritmo repetido mientras otro suena distinto.'],
    ['El pentagrama', 'Saber si una nota está en una línea o en un espacio.'],
    ['Clave de sol: sol, mi, la', 'Leer sol, mi y la en clave de sol.'],
    ['Do-re-mi', 'Ubicar do, re y mi en el pentagrama y en tu instrumento.'],
    ['La escala de Do', 'Leer y tocar las notas de la escala.'],
    ['Figuras: redonda, blanca, negra, corchea', 'Saber cuánto dura cada figura.'],
    ['Compás: 2/4, 3/4 y 4/4', 'Marcar el pulso fuerte de cada compás.'],
    ['Primera lectura de 4 compases', 'Leer una melodía de 4 compases sin parar.'],
    ['Dictado rítmico', 'Escuchar un ritmo y escribirlo.'],
    ['El puntillo', 'Leer la blanca con puntillo y la negra con puntillo.'],
    ['Semicorcheas: ta-ka-di-mi', 'Tocar 4 semicorcheas parejas en un pulso.'],
    ['Combinaciones: ta di-mi y ta-ka di', 'Leer corchea con dos semicorcheas y al revés.'],
    ['Ligadura y síncopa', 'Tocar una síncopa sin acelerar.'],
    ['Coordinación: pulso y ritmo a la vez', 'Marcar el pulso con una mano y decir el ritmo con la voz.'],
    ['Más notas en el pentagrama', 'Leer las notas de tu instrumento sin contar líneas.'],
    ['Lectura con todas las notas', 'Leer una melodía de 8 compases.'],
    ['Las 12 notas: sostenidos y bemoles', 'Nombrar y tocar las 12 notas.'],
    ['Tono y semitono', 'Distinguir tono y semitono.'],
    ['Intervalos 1: segundas y terceras', 'Reconocer segundas y terceras de oído.'],
    ['Intervalos 2: cuarta, quinta, tritono y octava', 'Reconocer de oído la 4ª, la 5ª, el tritono y la 8ª.'],
    ['Intervalos 3: sextas y séptimas', 'Reconocer de oído al menos 6 intervalos.'],
    ['La escala mayor: fórmula e intervalos', 'Construir una escala mayor con T-T-S-T-T-T-S.'],
    ['Escalas de Sol y Fa mayor y su armadura', 'Tocar Sol y Fa mayor y leer la armadura.'],
    ['Círculo de quintas', 'Ordenar las tonalidades y sus alteraciones.'],
    ['Triadas mayor y menor', 'Distinguir de oído un acorde mayor de uno menor.'],
    ['Triadas aumentada y disminuida', 'Reconocer las 4 triadas.'],
    ['Armonizar la escala mayor', 'Conocer los 7 acordes de Do mayor.'],
    ['Centro tonal y reposo', 'Reconocer cuándo una canción llega a casa.'],
    ['Progresiones mayores: I, IV, V y vi', 'Acompañar una canción con I, IV, V y vi.'],
    ['Escala menor natural y su relativa', 'Distinguir mayor y menor de oído.'],
    ['Progresiones menores', 'Sentir el reposo en un acorde menor.'],
    ['Escala pentatónica', 'Tocar la pentatónica mayor y menor.'],
    ['Improvisar con la pentatónica', 'Improvisar 8 compases y terminar en la nota casa.'],
    ['Compás de 6/8', 'Sentir el 6/8 en dos pulsos grandes.'],
    ['Dictado melódico', 'Escribir una melodía corta de oído.'],
    ['Dinámicas y articulaciones', 'Tocar fuerte, suave, ligado y staccato.'],
    ['Tempo y términos', 'Tocar en Lento, Andante y Allegro.'],
    ['La forma: AB y ABA', 'Reconocer las partes de una canción.'],
    ['Lectura a primera vista', 'Leer 8 compases nuevos sin parar.'],
    ['Dos contra tres', 'Hacer 2 contra 3 con las manos.'],
    ['Acorde de séptima de dominante', 'Sentir cómo el V7 pide volver al I.'],
    ['Inversiones de acordes', 'Reconocer un acorde en sus inversiones.'],
    ['Proyecto: mi primera composición', 'Componer y tocar 8 compases.']
  ];

  /* ---------- Notas del juego (piano y violín): solo las que ya se vieron ---------- */
  var NOMBRE = { c: 'Do', d: 'Re', e: 'Mi', f: 'Fa', g: 'Sol', a: 'La', b: 'Si' };
  function notasPiano(s) {
    var sol = function (ks) { return ks.map(function (k) { return [k, 'treble']; }); };
    var fa = function (ks) { return ks.map(function (k) { return [k, 'bass']; }); };
    if (s <= 7) return sol(['e/4', 'g/4']);
    if (s === 8) return sol(['e/4', 'g/4', 'a/4']);
    if (s === 9) return sol(['c/4', 'd/4', 'e/4', 'g/4', 'a/4']);
    if (s <= 19) return sol(['c/4', 'd/4', 'e/4', 'f/4', 'g/4', 'a/4', 'b/4', 'c/5']);
    if (s === 20) return sol(['a/3', 'b/3', 'c/4', 'd/4', 'e/4', 'f/4', 'g/4', 'a/4', 'b/4', 'c/5', 'd/5', 'e/5', 'f/5', 'a/5', 'b/5', 'c/6'])
      .concat(fa(['g/2', 'a/2', 'b/2', 'c/3', 'd/3', 'e/3', 'f/3', 'g/3', 'a/3']));
    return null;   // desde la semana 21: todas (el modo normal de la app)
  }
  function notasViolin(s) {
    if (s <= 7) return ['e/4', 'g/4'];
    if (s === 8) return ['e/4', 'g/4', 'a/4'];
    if (s === 9) return ['d/4', 'e/4', 'g/4', 'a/4'];
    if (s <= 19) return ['d/4', 'e/4', 'g/4', 'a/4', 'b/4', 'd/5'];   // escala de Re sin las notas con sostenido (el juego usa naturales)
    return null;
  }

  /* ---------- Ritmo: compás, tarjetas permitidas y un ritmo de ejemplo ---------- */
  var R = {
    1: { compas: '4/4', celdas: ['pan'], ejemplo: ['pan', 'pan', 'pan', 'pan', 'pan', 'pan', 'pan', 'pan'], tempo: 80, repetir: true },
    2: { compas: '4/4', celdas: ['pan', 'luna'], ejemplo: ['pan', 'luna', 'pan', 'pan', 'luna', 'luna', 'pan', 'pan'], tempo: 70 },
    3: { compas: '4/4', celdas: ['pan', 'luna', 's4'], ejemplo: ['pan', 'luna', 's4', 'pan', 'luna', 'pan', 's4', 'pan'], tempo: 70 },
    6: { compas: '4/4', celdas: ['pan', 'luna', 's4'], ejemplo: ['pan', 'luna', 'pan', 's4', 'pan', 'luna', 'pan', 's4'], tempo: 70, repetir: true },
    11: { compas: '4/4', celdas: ['pan', 'luna', 's4', 'bla2', 'red'], ejemplo: ['red', 'bla2', 'bla2', 'pan', 'pan', 'pan', 'pan', 'luna', 'luna', 'luna', 'luna'], tempo: 70 },
    12: { compas: '3/4', celdas: ['pan', 'luna', 's4', 'bla2'], ejemplo: ['pan', 'pan', 'pan', 'bla2', 'pan', 'pan', 'luna', 'pan', 'bla2', 's4'], tempo: 80 },
    14: { compas: '4/4', celdas: ['pan', 'luna', 's4', 'bla2'], ejemplo: [], tempo: 70 },
    15: { compas: '3/4', celdas: ['pan', 'luna', 's4', 'bla2', 'bla3', 'lee', 'y'], ejemplo: ['lee', 'y', 'pan', 'pan', 'luna', 'luna', 'bla3'], tempo: 70 },
    16: { compas: '4/4', celdas: ['pan', 'luna', 'choco', 's4', 'bla2'], ejemplo: ['luna', 'choco', 'luna', 'pan', 'choco', 'luna', 'choco', 'pan'], tempo: 60 },
    17: { compas: '4/4', celdas: ['pan', 'luna', 'choco', 'gran', 'cama', 's4', 'bla2'], ejemplo: ['pan', 'gran', 'cama', 'pan', 'cama', 'gran', 'bla2'], tempo: 60 },
    18: { latino: 'Cumbia', tempo: 90, repetir: true },
    19: { compas: '4/4', celdas: ['pan', 'luna', 'choco', 'gran', 'cama', 's4', 'bla2'], ejemplo: ['pan', 'luna', 'gran', 'bla2', 'cama', 'pan', 's4', 'pan'], tempo: 60 },
    38: { compas: '4/4', ejemplo: ['pan', 'pan', 'pan', 'pan', 'pan', 'pan', 'pan', 'pan'], tempo: 80, repetir: true },
    39: { compas: '6/8', ejemplo: ['negp6', 'negp6', 'tres8', 'negp6', 'neg8', 'neg8', 'blap6'], tempo: 50 }
  };
  [4, 5, 7, 8, 9, 10].forEach(function (s) { R[s] = R[3]; });
  R[13] = R[11];
  /* desde la semana 20 (salvo las de arriba): todas las tarjetas, con el ejemplo de corcheas y semicorcheas */
  function ritmoDe(s) { return R[s] || { compas: '4/4', ejemplo: ['luna', 'choco', 'luna', 'pan', 'choco', 'luna', 'choco', 'pan'], tempo: 70 }; }

  /* ---------- Los pasos que se muestran ---------- */
  var CAMARA = 'Al terminar, toca la <b>camarita</b> 📷 (abajo a la derecha): arma una imagen con tus minutos de práctica de hoy. Mándasela a tu maestra por WhatsApp.';
  function pasos() {
    var instrumento = app === 'violin' ? 'en las cuerdas del violín' : 'en el teclado';
    if (app === 'piano' || app === 'violin') return [
      'Toca <b>Empezar</b>: aparece una nota en el pentagrama.',
      'Búscala y tócala ' + instrumento + '. Si aciertas, aparece otra.',
      'Junta las <b>3 estrellas</b>: la tercera sale con 6 aciertos seguidos.'];
    if (app === 'ritmo') {
      if (semana === 1) return ['Toca <b>Empezar</b> y luego <b>▶ Reproducir</b>: suena el pulso.', 'Da una palmada en cada «ta», sin adelantarte.', 'Ahora márcalo en el pecho (derecha, izquierda) durante 30 segundos.'];
      if (semana === 14) return ['Toca <b>Dictado</b> (abajo de las tarjetas): suena un ritmo.', 'Repítelo en el pecho y elige la tarjeta que sonó.', 'Haz por lo menos 10 dictados.'];
      if (semana === 18) return ['Toca <b>▶ Reproducir</b>: suena la cumbia.', 'Marca el pulso con la cabeza y aplaude en el sonido «corrido» (la síncopa).', 'Prueba otros ritmos en «Ritmos latinos…».'];
      if (semana === 38) return ['Toca <b>▶ Reproducir</b>: el pulso se repite como base.', 'Mientras suena, improvisa en tu instrumento con la pentatónica.', 'Termina siempre en la nota casa.'];
      return ['Toca <b>▶ Reproducir</b>: después de la cuenta (1, 2, 3, 4) se ilumina cada nota.', '<b>Palmea a tiempo</b>: una palmada justo cuando se ilumina cada nota, diciendo su sílaba (ta, ti-ti…).',
        '<b>Crea tu propio ritmo</b> tocando las tarjetas, dale ▶ y palméalo igual.' + (semana === 11 ? ' Con <b>Pizza</b> ves cuánto dura cada figura.' : '')];
    }
    if (app === 'oido') return ['Toca el botón grande para <b>escuchar</b>.', 'Elige tu respuesta.', 'Toca <b>Siguiente</b> y sigue hasta acertar 10.'];
    return ['Resuelve cada ejercicio aquí mismo (o toca <b>Imprimir</b> y hazlo en papel).', 'Toca <b>Revisar mis respuestas</b>.', 'Corrige lo que salga en rojo y vuelve a revisar.'];
  }
  function queNotas() {
    var lista = app === 'piano' ? notasPiano(semana) : app === 'violin' ? notasViolin(semana) : null;
    if (!lista) return '';
    var vistos = [];
    lista.forEach(function (n) { var k = (typeof n === 'string' ? n : n[0]).charAt(0); if (vistos.indexOf(NOMBRE[k]) < 0) vistos.push(NOMBRE[k]); });
    return semana === 20 ? '' : 'Hoy practicas solo las notas que ya conoces: <b>' + vistos.join(', ') + '</b>.';
  }

  /* ---------- Preparar cada app (se llama cuando la página ya terminó de cargar) ---------- */
  function preparar() {
    try {
      if (app === 'piano' && typeof modosJuego !== 'undefined') {
        var p = notasPiano(semana);
        if (p) { modosJuego.leccion = p; seleccionarModo('leccion'); var pm = document.getElementById('panel-modos'); if (pm) pm.style.display = 'none'; }
      }
      if (app === 'violin' && typeof modosJuego !== 'undefined') {
        var v = notasViolin(semana);
        if (v) { modosJuego.leccion = v; seleccionarModo('leccion'); var b = document.querySelector('.btn-modo'); if (b && b.parentElement) b.parentElement.style.display = 'none'; }
      }
      if (app === 'ritmo' && typeof state !== 'undefined') {
        var c = ritmoDe(semana);
        if (c.latino) { setTempo(c.tempo); cargarLatino(LATINOS.findIndex(function (r) { return r.name === c.latino; })); }
        else {
          if (c.compas && c.compas !== state.compas) setCompas(c.compas);
          state.soloCeldas = c.celdas || null;
          var tabs = document.querySelector('.tabs'); if (tabs) tabs.style.display = c.celdas ? 'none' : '';
          state.comp = (c.ejemplo || []).slice();
          setTempo(c.tempo || state.tempo);
          renderPalette(); renderScore();
        }
        state.loop = !!c.repetir;
        var bl = document.getElementById('btn-loop'); if (bl) bl.setAttribute('aria-pressed', state.loop);
      }
      if (app === 'oido') { var m = document.getElementById('modos'); if (m) { m.style.display = 'none'; if (m.nextElementSibling && m.nextElementSibling.classList.contains('desliza')) m.nextElementSibling.style.display = 'none'; } }
    } catch (e) { /* si la app cambió, al menos se muestra la tarjeta */ }
  }
  function empezar() {
    try {
      if ((app === 'piano' || app === 'violin') && typeof juegoActivo !== 'undefined' && !juegoActivo) toggleJuego();
    } catch (e) { }
  }

  /* ---------- Tarjeta y botón "¿Qué hago?" ---------- */
  var CSS = '' +
    '.lc{border:0;border-radius:18px;padding:0;width:min(460px,calc(100vw - 24px));max-height:calc(100dvh - 24px);background:var(--surface,#FBF7EE);color:var(--ink,#3A3128);box-shadow:0 20px 60px rgba(0,0,0,.25);font-family:"Nunito Sans",system-ui,sans-serif}' +
    '.lc::backdrop{background:rgba(30,37,33,.55)}' +
    '.lc-in{padding:20px 20px 18px;display:grid;gap:12px}' +
    '.lc-sem{margin:0;font-size:12px;font-weight:800;letter-spacing:.08em;text-transform:uppercase;color:var(--gold-ink,#8F6A2A)}' +
    '.lc h2{margin:0;font-family:Fraunces,Georgia,serif;font-size:23px;line-height:1.15;color:var(--pine,#48592F)}' +
    '.lc p{margin:0;font-size:15px;line-height:1.45}' +
    '.lc-meta{color:var(--ink-2,#6D6152)}' +
    '.lc ol{margin:0;padding:0;list-style:none;counter-reset:p;display:grid;gap:9px}' +
    '.lc li{counter-increment:p;position:relative;padding-left:36px;font-size:15px;line-height:1.4}' +
    '.lc li::before{content:counter(p);position:absolute;left:0;top:-1px;width:26px;height:26px;border-radius:50%;background:var(--accent,#647745);color:var(--on-accent,#FBF7EE);font-weight:800;font-size:14px;display:grid;place-items:center}' +
    '.lc li.lc-cam::before{content:"📷";background:var(--gold,#C4923A)}' +
    '.lc b{color:var(--pine,#48592F)}' +
    '.lc button{font:inherit;font-weight:800;border-radius:999px;padding:10px 18px;min-height:46px;cursor:pointer;border:0;background:var(--accent,#647745);color:var(--on-accent,#FBF7EE);width:100%;font-size:16px}' +
    '.lc button:focus-visible,.lc-chip:focus-visible{outline:3px solid var(--gold,#C4923A);outline-offset:2px}' +
    '.lc-chip{position:fixed;left:max(16px,env(safe-area-inset-left));bottom:max(16px,env(safe-area-inset-bottom));z-index:50;font:800 14px "Nunito Sans",system-ui,sans-serif;' +
    'border:1px solid var(--line,#DCCFB5);background:var(--surface,#FBF7EE);color:var(--pine,#48592F);border-radius:999px;padding:10px 16px;min-height:44px;cursor:pointer;box-shadow:0 6px 18px rgba(58,49,40,.18)}' +
    '.lc-chip{white-space:nowrap}.lc-chip.en-fila{position:static;box-shadow:none;padding:8px 14px;flex:0 0 auto}' +
    '@media print{.lc-chip{display:none}}';

  function mostrar(primeraVez) {
    var g = GUIA[semana], dlg = document.querySelector('dialog.lc');
    if (!dlg) {
      var st = document.createElement('style'); st.textContent = CSS; document.head.appendChild(st);
      dlg = document.createElement('dialog'); dlg.className = 'lc'; dlg.setAttribute('aria-labelledby', 'lc-titulo');
      document.body.appendChild(dlg);
      dlg.addEventListener('close', function () { if (dlg.dataset.primera === '1') { dlg.dataset.primera = ''; empezar(); } });
    }
    var notas = queNotas();
    dlg.innerHTML = '<div class="lc-in">' +
      '<p class="lc-sem">Semana ' + semana + '</p>' +
      '<h2 id="lc-titulo">' + g[0] + '</h2>' +
      '<p class="lc-meta">Tu meta: ' + g[1] + '</p>' +
      (notas ? '<p>' + notas + '</p>' : '') +
      '<ol>' + pasos().map(function (t) { return '<li>' + t + '</li>'; }).join('') + '<li class="lc-cam">' + CAMARA + '</li></ol>' +
      '<form method="dialog"><button type="submit">' + (primeraVez ? 'Empezar' : 'Seguir') + '</button></form></div>';
    dlg.dataset.primera = primeraVez ? '1' : '';
    if (typeof dlg.showModal === 'function') dlg.showModal(); else dlg.setAttribute('open', '');
  }

  window.addEventListener('load', function () {
    preparar();
    var chip = document.createElement('button');
    chip.type = 'button'; chip.className = 'lc-chip';
    chip.textContent = 'Semana ' + semana + ' · ¿Qué hago?';
    /* en la app de ritmo va en la fila de Dictado (abajo flotaría sobre las tarjetas); en las demás, abajo a la izquierda */
    var fila = app === 'ritmo' && document.querySelector('.panel-foot');
    chip.addEventListener('click', function () { mostrar(false); });
    if (fila) { chip.classList.add('en-fila'); chip.textContent = '¿Qué hago?'; fila.insertBefore(chip, fila.firstChild); } else document.body.appendChild(chip);
    mostrar(true);
  });
})();
