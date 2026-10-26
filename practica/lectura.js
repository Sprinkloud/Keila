/* Lectura hablada (método Dandelot) para el piano y el violín virtuales.
   Se muestran 8 notas; después de una cuenta de 4, un marcador avanza una nota por pulso y el alumno dice su
   nombre en voz alta, sin parar aunque se equivoque. Al final puede ver los nombres para comprobar.
   Con "Micrófono" (si el navegador tiene reconocimiento de voz: Chrome, Edge, Safari) se escucha lo que dice y cada
   nota se marca bien o mal. Se compara el orden de los nombres, no el momento exacto en que se dijo cada uno.
   Uso: SprinkloudLectura.abrir({ clave: 'treble' | 'bass', notas: ['e/4', 'g/4', ...] })   (necesita VexFlow 4) */
(function () {
  var NOMBRES = { c: 'Do', d: 'Re', e: 'Mi', f: 'Fa', g: 'Sol', a: 'La', b: 'Si' };
  /* Cómo suele escribir el reconocedor de voz cada nombre de nota */
  var OIDO = { do: 'Do', dos: 'Do', doh: 'Do', re: 'Re', rey: 'Re', reh: 'Re', mi: 'Mi', me: 'Mi', mis: 'Mi', fa: 'Fa', far: 'Fa', fah: 'Fa',
    sol: 'Sol', sole: 'Sol', sold: 'Sol', la: 'La', lah: 'La', si: 'Si', see: 'Si' };
  var SILABAS = ['sol', 'do', 're', 'mi', 'fa', 'la', 'si'];
  var Reconocedor = window.SpeechRecognition || window.webkitSpeechRecognition;
  var CSS = '' +
    '.lh{border:0;border-radius:18px;padding:0;width:min(760px,calc(100vw - 24px));max-height:calc(100dvh - 24px);background:var(--surface,#FBF7EE);color:var(--ink,#3A3128);box-shadow:0 20px 60px rgba(0,0,0,.25)}' +
    '.lh::backdrop{background:rgba(30,37,33,.55)}' +
    '.lh-in{padding:18px 18px 16px;display:grid;gap:12px}' +
    '.lh h2{margin:0;font-family:Fraunces,Georgia,serif;font-size:22px;color:var(--pine,#48592F)}' +
    '.lh p{margin:0;color:var(--ink-2,#6D6152);font-size:15px}' +
    '.lh-papel{background:#FFFDF8;border:1px solid var(--line,#DCCFB5);border-radius:12px;padding:6px;min-height:150px}' +
    '.lh-papel svg{display:block;width:100%;height:auto}' +
    '.lh-fila{display:flex;flex-wrap:wrap;gap:10px;align-items:center}' +
    '.lh button{font:inherit;font-weight:800;border:1px solid var(--line,#DCCFB5);background:var(--surface,#FBF7EE);color:inherit;border-radius:10px;padding:8px 14px;min-height:44px;cursor:pointer}' +
    '.lh button.lh-ppal{background:var(--accent,#647745);border-color:var(--accent,#647745);color:var(--on-accent,#FBF7EE)}' +
    '.lh button[aria-pressed=true]{background:var(--accent-soft,#E1E6CF);border-color:var(--accent,#647745)}' +
    '.lh label{display:flex;gap:8px;align-items:center;font-weight:700;font-size:14px;color:var(--ink-2,#6D6152)}' +
    '.lh input[type=range]{width:120px}' +
    '.lh-cuenta{font-family:Fraunces,Georgia,serif;font-size:22px;font-weight:700;color:var(--gold-ink,#8F6A2A);min-height:28px}' +
    '.lh-escucho{font-size:14px;color:var(--ink-2,#6D6152);min-height:20px}';
  var dlg, est = { clave: 'treble', pool: [], notas: [], nombres: false, tempo: 60, mic: false, resultado: null },
    timers = [], audio = null, marca = null, xs = [], rec = null, oido = { activo: false, texto: '' };

  function nota(k) { return NOMBRES[k.charAt(0)]; }
  function nuevas() {
    var out = [], pool = est.pool;
    for (var i = 0; i < 8; i++) {
      var k; do { k = pool[Math.floor(Math.random() * pool.length)]; } while (pool.length > 1 && out.length && k === out[out.length - 1]);
      out.push(k);
    }
    est.notas = out; est.resultado = null;
  }
  function dibujar() {
    var VF = Vex.Flow, caja = dlg.querySelector('.lh-papel');
    caja.replaceChildren();
    var ancho = Math.max(300, caja.clientWidth - 12), alto = est.resultado ? 190 : est.nombres ? 170 : 140;
    var r = new VF.Renderer(caja, VF.Renderer.Backends.SVG);
    r.resize(ancho, alto);
    var ctx = r.getContext();
    ctx.setFillStyle('#2B241C'); ctx.setStrokeStyle('#2B241C');
    var st = new VF.Stave(4, 14, ancho - 10).addClef(est.clave).addTimeSignature('4/4');
    st.setContext(ctx).draw();
    var notas = est.notas.map(function (k) {
      return new VF.StaveNote({ keys: [k], duration: 'q', clef: est.clave, auto_stem: true });
    });
    var tick = notas.slice(0, 4).concat([new VF.BarNote()], notas.slice(4));
    var voz = new VF.Voice({ num_beats: 8, beat_value: 4 }).setMode(VF.Voice.Mode.SOFT);
    voz.addTickables(tick);
    new VF.Formatter().joinVoices([voz]).format([voz], st.getNoteEndX() - st.getNoteStartX() - 10);
    voz.draw(ctx, st);
    xs = notas.map(function (n) { return n.getAbsoluteX(); });
    var svg = caja.querySelector('svg');
    svg.setAttribute('viewBox', '0 0 ' + ancho + ' ' + alto); svg.style.width = ''; svg.style.height = '';
    svg.setAttribute('role', 'img'); svg.setAttribute('aria-label', 'Ocho notas para leer en voz alta');
    var texto = function (x, y, t, color, tam) {
      var tx = document.createElementNS('http:/' + '/www.w3.org/2000/svg', 'text');
      tx.setAttribute('x', x); tx.setAttribute('y', y); tx.setAttribute('text-anchor', 'middle');
      tx.setAttribute('font-family', 'Nunito Sans, sans-serif'); tx.setAttribute('font-weight', '800'); tx.setAttribute('font-size', tam || '14');
      tx.setAttribute('fill', color); tx.textContent = t;
      svg.appendChild(tx);
    };
    /* los nombres, todos en una misma fila debajo del pentagrama; con micrófono, debajo va ✓ o ✗ */
    if (est.nombres || est.resultado) est.notas.forEach(function (k, i) {
      var bien = est.resultado ? est.resultado[i] : null;
      texto(xs[i] + 6, est.resultado ? alto - 28 : alto - 8, nota(k), bien === null ? '#8F6A2A' : bien ? '#48592F' : '#9A5245');
      if (est.resultado) texto(xs[i] + 6, alto - 6, bien ? '✓' : '✗', bien ? '#48592F' : '#9A5245', '17');
    });
    marca = document.createElementNS('http:/' + '/www.w3.org/2000/svg', 'rect');
    marca.setAttribute('y', 6); marca.setAttribute('width', 26); marca.setAttribute('height', alto - 12); marca.setAttribute('rx', 6);
    marca.setAttribute('fill', '#C4923A'); marca.setAttribute('opacity', '0'); marca.setAttribute('aria-hidden', 'true');
    svg.insertBefore(marca, svg.firstChild);
  }

  /* ---------- Micrófono: lo que dijo, como lista de nombres de notas ---------- */
  function limpio(s) { return String(s).toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, ''); }
  /** "do re mi", "domi", "rey" → ['Do', 'Re', 'Mi'...]; lo que no es una nota se ignora. */
  function notasDichas(texto) {
    var out = [];
    limpio(texto).split(/[^a-z]+/).forEach(function (p) {
      if (!p) return;
      if (OIDO[p]) { out.push(OIDO[p]); return; }
      /* sílabas pegadas ("domi", "solla"): se separan si la palabra entera está hecha de nombres de notas */
      var partes = [], resto = p;
      while (resto) {
        var s = SILABAS.filter(function (x) { return resto.indexOf(x) === 0; })[0];
        if (!s) { partes = null; break; }
        partes.push(OIDO[s]); resto = resto.slice(s.length);
      }
      if (partes) out = out.concat(partes);
    });
    return out;
  }
  /** Qué notas del ejercicio dijo bien y en orden (la subsecuencia común más larga). */
  function comparar(esperadas, dichas) {
    var n = esperadas.length, m = dichas.length, L = [], i, j;
    for (i = 0; i <= n; i++) { L.push([]); for (j = 0; j <= m; j++) L[i].push(0); }
    for (i = n - 1; i >= 0; i--) for (j = m - 1; j >= 0; j--)
      L[i][j] = esperadas[i] === dichas[j] ? 1 + L[i + 1][j + 1] : Math.max(L[i + 1][j], L[i][j + 1]);
    var bien = esperadas.map(function () { return false; });
    i = 0; j = 0;
    while (i < n && j < m) {
      if (esperadas[i] === dichas[j]) { bien[i] = true; i++; j++; }
      else if (L[i + 1][j] >= L[i][j + 1]) i++; else j++;
    }
    return bien;
  }
  /* El reconocedor no acepta "es-419" (español de Latinoamérica, común en Chrome): se usa el país si lo tiene, si no es-MX */
  var PAISES = /^es-(EC|MX|ES|US|AR|CO|CL|PE|VE|BO|UY|PY|CR|DO|GT|HN|NI|PA|PR|SV)$/i;
  function idioma() {
    var lista = [].concat(navigator.languages || [], navigator.language || []);
    for (var i = 0; i < lista.length; i++) if (PAISES.test(lista[i])) return lista[i];
    return 'es-MX';
  }
  var AVISOS = {
    'not-allowed': 'El micrófono está bloqueado. Permítelo en el candado de la barra de direcciones y vuelve a intentar.',
    'service-not-allowed': 'Este navegador no deja usar el reconocimiento de voz. Prueba en Google Chrome, Edge o Safari.',
    'network': 'Este navegador no tiene reconocimiento de voz (pasa en Brave u Opera). Prueba en Google Chrome, Edge o Safari.',
    'audio-capture': 'No encuentro un micrófono. Revisa que esté conectado.',
    'language-not-supported': 'El reconocimiento de voz no acepta el idioma de este navegador. Prueba en Google Chrome.'
  };
  function escuchar() {
    rec = new Reconocedor();
    rec.lang = idioma();
    rec.continuous = true; rec.interimResults = true;
    oido = { activo: true, texto: '', partes: [], corriendo: false, error: '' };
    var escucho = dlg.querySelector('.lh-escucho');
    rec.onstart = function () { oido.corriendo = true; };
    rec.onresult = function (e) {
      var t = [];
      for (var i = 0; i < e.results.length; i++) t.push(e.results[i][0].transcript);
      oido.texto = (oido.partes.join(' ') + ' ' + t.join(' ')).trim();
      /* lo que oye, tal cual: así se sabe si al micrófono le llega algo */
      escucho.textContent = 'Escucho: «' + oido.texto.slice(-80) + '»';
    };
    rec.onerror = function (e) {
      if (AVISOS[e.error]) { oido.activo = false; oido.error = e.error; escucho.textContent = AVISOS[e.error]; }
      /* "no-speech" y "aborted" no son fallas: el reconocedor se vuelve a encender en onend */
    };
    /* el reconocedor a veces se corta en un silencio: mientras dure la lectura, se vuelve a encender (con un respiro) */
    rec.onend = function () {
      oido.corriendo = false;
      if (oido.activo) { oido.partes = [oido.texto]; setTimeout(function () { if (oido.activo) try { rec.start(); } catch (x) {} }, 250); return; }
      evaluar();
    };
    try { rec.start(); } catch (x) { escucho.textContent = 'No se pudo encender el micrófono: ' + x.message; }
  }
  function evaluar() {
    if (oido.evaluado) return;
    oido.evaluado = true;
    var dichas = notasDichas(oido.texto), cuenta = dlg.querySelector('.lh-cuenta');
    if (oido.error) { cuenta.textContent = ''; return; }   /* el aviso del error ya está en pantalla */
    if (!oido.texto) { cuenta.textContent = 'No me llegó nada por el micrófono. Revisa que sea el micrófono correcto y habla cerca.'; return; }
    if (!dichas.length) { cuenta.textContent = 'Escuché «' + oido.texto.slice(0, 60) + '», pero ningún nombre de nota. Di solo los nombres: do, re, mi…'; return; }
    est.resultado = comparar(est.notas.map(nota), dichas);
    var ok = est.resultado.filter(Boolean).length;
    cuenta.textContent = ok === 8 ? '¡8 de 8! Muy bien 🎉' : ok + ' de 8. Repasa las marcadas en rojo y vuelve a intentar.';
    dibujar();
  }
  function dejarDeEscuchar() {
    if (!rec) return;
    var seguia = oido.activo;
    oido.activo = false;
    if (!seguia && oido.error) { dlg.querySelector('.lh-cuenta').textContent = ''; return; }   /* el aviso del error ya está en pantalla */
    /* si el reconocedor ya estaba apagado, no va a avisar "end": se revisa ya */
    if (!oido.corriendo) { evaluar(); return; }
    try { rec.stop(); } catch (x) { evaluar(); }
    setTimeout(evaluar, 2500);   /* por si el navegador nunca avisa que terminó */
  }

  function click(t, fuerte) {
    var o = audio.createOscillator(), g = audio.createGain();
    o.frequency.value = fuerte ? 1500 : 1000;
    g.gain.setValueAtTime(fuerte ? .5 : .3, t); g.gain.exponentialRampToValueAtTime(.001, t + .06);
    o.connect(g); g.connect(audio.destination); o.start(t); o.stop(t + .07);
  }
  function parar() {
    timers.forEach(clearTimeout); timers = [];
    if (marca) marca.setAttribute('opacity', '0');
    dlg.querySelector('.lh-empezar').textContent = '▶ Empezar';
  }
  function empezar() {
    if (timers.length) { parar(); oido.activo = false; if (rec) try { rec.abort(); } catch (x) {} dlg.querySelector('.lh-cuenta').textContent = ''; return; }
    audio = audio || new (window.AudioContext || window.webkitAudioContext)();
    if (audio.state === 'suspended') audio.resume();
    if (est.resultado) { est.resultado = null; dibujar(); }
    var pulso = 60 / est.tempo, t0 = audio.currentTime + .15, cuenta = dlg.querySelector('.lh-cuenta');
    dlg.querySelector('.lh-escucho').textContent = '';
    dlg.querySelector('.lh-empezar').textContent = '■ Parar';
    if (est.mic) escuchar();
    else dlg.querySelector('.lh-escucho').textContent = '';
    for (var i = 0; i < 12; i++) {
      (function (i) {
        click(t0 + i * pulso, i % 4 === 0);
        timers.push(setTimeout(function () {
          if (i < 4) { cuenta.textContent = String(i + 1); return; }
          cuenta.textContent = '¡Di la nota!';
          marca.setAttribute('x', xs[i - 4] - 7); marca.setAttribute('opacity', '.28');
        }, (t0 - audio.currentTime + i * pulso) * 1000));
      })(i);
    }
    timers.push(setTimeout(function () {
      parar();
      if (est.mic) { cuenta.textContent = 'Revisando…'; setTimeout(dejarDeEscuchar, 1200); }   /* un respiro para la última nota */
      else cuenta.textContent = '¿Las dijiste sin parar? Toca "Ver nombres" para comprobar.';
    }, (t0 - audio.currentTime + 12 * pulso) * 1000));
  }
  /** Al encender el micrófono se pide el permiso una vez, antes de empezar a leer. */
  function alternarMic(boton) {
    if (est.mic) { est.mic = false; boton.setAttribute('aria-pressed', 'false'); dlg.querySelector('.lh-escucho').textContent = ''; return; }
    var listo = function () { est.mic = true; boton.setAttribute('aria-pressed', 'true'); dlg.querySelector('.lh-escucho').textContent = 'Micrófono listo: toca Empezar y di los nombres.'; };
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) { listo(); return; }
    navigator.mediaDevices.getUserMedia({ audio: true }).then(function (s) { s.getTracks().forEach(function (t) { t.stop(); }); listo(); },
      function () { dlg.querySelector('.lh-escucho').textContent = 'No se pudo usar el micrófono. Permítelo en el candado de la barra de direcciones.'; });
  }
  function crear() {
    var s = document.createElement('style'); s.textContent = CSS; document.head.appendChild(s);
    dlg = document.createElement('dialog');
    dlg.className = 'lh';
    dlg.setAttribute('aria-labelledby', 'lh-titulo');
    dlg.innerHTML = '<div class="lh-in">' +
      '<h2 id="lh-titulo">Lectura hablada (Dandelot)</h2>' +
      '<p>Di en voz alta el nombre de cada nota, una por pulso, sin parar aunque te equivoques. Primero suena una cuenta de 4.</p>' +
      '<div class="lh-papel"></div>' +
      '<div class="lh-cuenta" aria-live="polite"></div>' +
      '<div class="lh-escucho" aria-live="polite"></div>' +
      '<div class="lh-fila"><button type="button" class="lh-ppal lh-empezar">▶ Empezar</button>' +
      (Reconocedor ? '<button type="button" class="lh-mic" aria-pressed="false" title="Escucha lo que dices y marca cada nota">🎤 Micrófono</button>' : '') +
      '<label>Velocidad <input type="range" class="lh-tempo" min="40" max="120" value="60" aria-label="Pulsos por minuto"> <span class="lh-bpm">60</span></label></div>' +
      '<div class="lh-fila"><button type="button" class="lh-nombres" aria-pressed="false">Ver nombres</button>' +
      '<button type="button" class="lh-otra">Otra lectura</button><button type="button" class="lh-cerrar">Cerrar</button></div></div>';
    document.body.appendChild(dlg);
    dlg.querySelector('.lh-empezar').addEventListener('click', empezar);
    if (Reconocedor) dlg.querySelector('.lh-mic').addEventListener('click', function (e) { alternarMic(e.currentTarget); });
    dlg.querySelector('.lh-tempo').addEventListener('input', function (e) { est.tempo = Number(e.target.value); dlg.querySelector('.lh-bpm').textContent = est.tempo; });
    dlg.querySelector('.lh-nombres').addEventListener('click', function (e) { est.nombres = !est.nombres; e.currentTarget.setAttribute('aria-pressed', est.nombres); parar(); dibujar(); });
    dlg.querySelector('.lh-otra').addEventListener('click', function () { parar(); dlg.querySelector('.lh-cuenta').textContent = ''; dlg.querySelector('.lh-escucho').textContent = ''; est.nombres = false; dlg.querySelector('.lh-nombres').setAttribute('aria-pressed', 'false'); nuevas(); dibujar(); });
    dlg.querySelector('.lh-cerrar').addEventListener('click', function () { dlg.close(); });
    dlg.addEventListener('close', function () { parar(); oido.activo = false; if (rec) try { rec.abort(); } catch (x) {} });
  }
  window.SprinkloudLectura = {
    abrir: function (o) {
      if (!dlg) crear();
      est.clave = o.clave || 'treble'; est.pool = o.notas.slice(); est.nombres = false;
      dlg.querySelector('.lh-nombres').setAttribute('aria-pressed', 'false');
      dlg.querySelector('.lh-cuenta').textContent = '';
      dlg.querySelector('.lh-escucho').textContent = '';
      nuevas();
      dlg.showModal();
      dibujar();
    },
    /* para probar sin micrófono */
    _notasDichas: notasDichas, _comparar: comparar
  };
})();
