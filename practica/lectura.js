/* Lectura hablada (método Dandelot) para el piano y el violín virtuales.
   Se muestran 8 notas; después de una cuenta de 4, un marcador avanza una nota por pulso y el alumno dice su
   nombre en voz alta, sin parar aunque se equivoque. Al final puede ver los nombres para comprobar.
   Uso: SprinkloudLectura.abrir({ clave: 'treble' | 'bass', notas: ['e/4', 'g/4', ...] })   (necesita VexFlow 4) */
(function () {
  var NOMBRES = { c: 'Do', d: 'Re', e: 'Mi', f: 'Fa', g: 'Sol', a: 'La', b: 'Si' };
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
    '.lh-cuenta{font-family:Fraunces,Georgia,serif;font-size:22px;font-weight:700;color:var(--gold-ink,#8F6A2A);min-height:28px}';
  var dlg, est = { clave: 'treble', pool: [], notas: [], nombres: false, tempo: 60 }, timers = [], audio = null, marca = null, xs = [];

  function nota(k) { return NOMBRES[k.charAt(0)]; }
  function nuevas() {
    var out = [], pool = est.pool;
    for (var i = 0; i < 8; i++) {
      var k; do { k = pool[Math.floor(Math.random() * pool.length)]; } while (pool.length > 1 && out.length && k === out[out.length - 1]);
      out.push(k);
    }
    est.notas = out;
  }
  function dibujar() {
    var VF = Vex.Flow, caja = dlg.querySelector('.lh-papel');
    caja.replaceChildren();
    var ancho = Math.max(300, caja.clientWidth - 12), alto = est.nombres ? 170 : 140;
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
    /* los nombres, todos en una misma fila debajo del pentagrama */
    if (est.nombres) est.notas.forEach(function (k, i) {
      var tx = document.createElementNS('http:/' + '/www.w3.org/2000/svg', 'text');
      tx.setAttribute('x', xs[i] + 6); tx.setAttribute('y', alto - 8); tx.setAttribute('text-anchor', 'middle');
      tx.setAttribute('font-family', 'Nunito Sans, sans-serif'); tx.setAttribute('font-weight', '800'); tx.setAttribute('font-size', '14');
      tx.setAttribute('fill', '#8F6A2A'); tx.textContent = nota(k);
      svg.appendChild(tx);
    });
    marca = document.createElementNS('http:/' + '/www.w3.org/2000/svg', 'rect');
    marca.setAttribute('y', 6); marca.setAttribute('width', 26); marca.setAttribute('height', alto - 12); marca.setAttribute('rx', 6);
    marca.setAttribute('fill', '#C4923A'); marca.setAttribute('opacity', '0'); marca.setAttribute('aria-hidden', 'true');
    svg.insertBefore(marca, svg.firstChild);
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
    if (timers.length) { parar(); dlg.querySelector('.lh-cuenta').textContent = ''; return; }
    audio = audio || new (window.AudioContext || window.webkitAudioContext)();
    if (audio.state === 'suspended') audio.resume();
    var pulso = 60 / est.tempo, t0 = audio.currentTime + .15, cuenta = dlg.querySelector('.lh-cuenta');
    dlg.querySelector('.lh-empezar').textContent = '■ Parar';
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
      cuenta.textContent = '¿Las dijiste sin parar? Toca "Ver nombres" para comprobar.';
    }, (t0 - audio.currentTime + 12 * pulso) * 1000));
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
      '<div class="lh-fila"><button type="button" class="lh-ppal lh-empezar">▶ Empezar</button>' +
      '<label>Velocidad <input type="range" class="lh-tempo" min="40" max="120" value="60" aria-label="Pulsos por minuto"> <span class="lh-bpm">60</span></label></div>' +
      '<div class="lh-fila"><button type="button" class="lh-nombres" aria-pressed="false">Ver nombres</button>' +
      '<button type="button" class="lh-otra">Otra lectura</button><button type="button" class="lh-cerrar">Cerrar</button></div></div>';
    document.body.appendChild(dlg);
    dlg.querySelector('.lh-empezar').addEventListener('click', empezar);
    dlg.querySelector('.lh-tempo').addEventListener('input', function (e) { est.tempo = Number(e.target.value); dlg.querySelector('.lh-bpm').textContent = est.tempo; });
    dlg.querySelector('.lh-nombres').addEventListener('click', function (e) { est.nombres = !est.nombres; e.currentTarget.setAttribute('aria-pressed', est.nombres); parar(); dibujar(); });
    dlg.querySelector('.lh-otra').addEventListener('click', function () { parar(); dlg.querySelector('.lh-cuenta').textContent = ''; est.nombres = false; dlg.querySelector('.lh-nombres').setAttribute('aria-pressed', 'false'); nuevas(); dibujar(); });
    dlg.querySelector('.lh-cerrar').addEventListener('click', function () { dlg.close(); });
    dlg.addEventListener('close', parar);
  }
  window.SprinkloudLectura = {
    abrir: function (o) {
      if (!dlg) crear();
      est.clave = o.clave || 'treble'; est.pool = o.notas.slice(); est.nombres = false;
      dlg.querySelector('.lh-nombres').setAttribute('aria-pressed', 'false');
      dlg.querySelector('.lh-cuenta').textContent = '';
      nuevas();
      dlg.showModal();
      dibujar();
    }
  };
})();
