/*
 * Sprinkloud · comprobante de práctica (lo usan todas las apps de práctica)
 *
 * - Cuenta los minutos de práctica del día mientras la persona usa la app (pestaña visible y algún toque,
 *   tecla o sonido en el último minuto). Se guarda en este dispositivo: 'sprinkloud-practica'.
 * - Un botón con una camarita arma una imagen de comprobante (nombre, fecha, minutos de hoy contra la meta
 *   de 15, la app y lo que hizo) para mandarla por WhatsApp. En el celular se abre "Compartir"; si no se
 *   puede, se descarga la imagen.
 * - Cada página dice qué app es y qué hizo con: window.SprinkloudPractica = { app: 'Nombre', detalle: () => 'texto' }
 * - Nada sale del dispositivo: no hay servidor ni conexión con ningún sistema.
 */
(function () {
  'use strict';
  var CLAVE = 'sprinkloud-practica', CLAVE_NOMBRE = 'sprinkloud-alumno', META_MIN = 15;
  var hoy = function () { var d = new Date(); return d.getFullYear() + '-' + ('0' + (d.getMonth() + 1)).slice(-2) + '-' + ('0' + d.getDate()).slice(-2); };
  var leer = function (k, def) { try { var v = JSON.parse(localStorage.getItem(k) || 'null'); return v == null ? def : v; } catch (e) { return def; } };
  var guardar = function (k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) { } };
  var info = function () { return window.SprinkloudPractica || { app: document.title.split('|')[0].trim() }; };

  /* ---------- minutos de práctica de hoy ---------- */
  var ultimoUso = Date.now();
  ['pointerdown', 'keydown', 'input', 'change'].forEach(function (ev) { document.addEventListener(ev, function () { ultimoUso = Date.now(); }, true); });
  function registro() {
    var r = leer(CLAVE, null);
    if (!r || r.fecha !== hoy()) r = { fecha: hoy(), seg: 0, apps: {} };
    return r;
  }
  setInterval(function () {
    if (document.visibilityState !== 'visible' || Date.now() - ultimoUso > 60000) return;   // sin uso en el último minuto no cuenta
    var r = registro(), app = info().app;
    r.seg += 5; r.apps[app] = (r.apps[app] || 0) + 5;
    guardar(CLAVE, r);
  }, 5000);

  /* ---------- estilos y botón ---------- */
  var css = document.createElement('style');
  css.textContent =
    '.spk-camara{position:fixed;right:max(16px,env(safe-area-inset-right));bottom:max(16px,env(safe-area-inset-bottom));z-index:50;' +
    'width:56px;height:56px;border-radius:50%;border:0;background:#C4923A;color:#fff;cursor:pointer;display:grid;place-items:center;' +
    'box-shadow:0 6px 18px rgba(58,49,40,.28)}' +
    '.spk-camara svg{width:26px;height:26px}' +
    '.spk-camara:focus-visible{outline:3px solid #48592F;outline-offset:3px}' +
    '.spk-velo{position:fixed;inset:0;z-index:60;background:rgba(30,37,33,.55);display:grid;place-items:center;padding:16px}' +
    '.spk-caja{background:#FBF7EE;color:#3A3128;border-radius:16px;padding:18px;width:min(420px,100%);display:grid;gap:12px;font-family:"Nunito Sans",system-ui,sans-serif}' +
    '.spk-caja h2{margin:0;font-family:Fraunces,Georgia,serif;font-size:21px;color:#48592F}' +
    '.spk-caja p{margin:0;font-size:14px;color:#6D6152}' +
    '.spk-caja input{font:inherit;border:1px solid #DCCFB5;border-radius:10px;padding:10px 12px;min-height:44px;background:#fff;color:#3A3128}' +
    '.spk-caja img{width:100%;border-radius:10px;border:1px solid #DCCFB5}' +
    '.spk-fila{display:flex;gap:8px;flex-wrap:wrap;justify-content:flex-end}' +
    '.spk-btn{font:inherit;font-weight:800;border:1px solid #DCCFB5;background:#FBF7EE;color:#3A3128;border-radius:10px;padding:8px 14px;min-height:44px;cursor:pointer;text-decoration:none;display:inline-flex;align-items:center}' +
    '.spk-btn.si{background:#647745;border-color:#647745;color:#FBF7EE}' +
    '@media print{.spk-camara,.spk-velo{display:none!important}}';
  document.head.appendChild(css);

  var boton = document.createElement('button');
  boton.type = 'button'; boton.className = 'spk-camara';
  boton.setAttribute('aria-label', 'Guardar el comprobante de práctica'); boton.title = 'Comprobante de práctica';
  boton.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 8h3l2-3h6l2 3h3v11H4z"/><circle cx="12" cy="13" r="3.6"/></svg>';
  document.body.appendChild(boton);
  /* una página puede pedir el botón más arriba para no tapar sus controles: SprinkloudPractica.subir (px) */
  if (info().subir) boton.style.bottom = 'calc(max(16px, env(safe-area-inset-bottom)) + ' + Number(info().subir) + 'px)';

  function cerrar(v) { v.remove(); boton.focus(); }
  function ventana(contenido) {
    var v = document.createElement('div');
    v.className = 'spk-velo';
    v.setAttribute('role', 'dialog'); v.setAttribute('aria-modal', 'true');
    var c = document.createElement('div'); c.className = 'spk-caja';
    contenido(c, function () { cerrar(v); });
    v.appendChild(c);
    v.addEventListener('click', function (e) { if (e.target === v) cerrar(v); });
    v.addEventListener('keydown', function (e) { if (e.key === 'Escape') cerrar(v); });
    document.body.appendChild(v);
    var foco = c.querySelector('input, .si'); if (foco) foco.focus();
  }
  function el(tag, attrs, texto) {
    var e = document.createElement(tag);
    Object.keys(attrs || {}).forEach(function (k) { if (k === 'class') e.className = attrs[k]; else e.setAttribute(k, attrs[k]); });
    if (texto != null) e.textContent = texto;
    return e;
  }

  /* ---------- pedir el nombre la primera vez ---------- */
  function pedirNombre(listo) {
    ventana(function (c, fin) {
      var input = el('input', { type: 'text', id: 'spk-nombre', autocomplete: 'given-name', maxlength: '40', 'aria-label': 'Nombre del alumno' });
      input.value = leer(CLAVE_NOMBRE, '');
      var ok = el('button', { type: 'button', class: 'spk-btn si' }, 'Continuar');
      var seguir = function () { var n = input.value.trim(); if (!n) { input.focus(); return; } guardar(CLAVE_NOMBRE, n); fin(); listo(n); };
      ok.addEventListener('click', seguir);
      input.addEventListener('keydown', function (e) { if (e.key === 'Enter') seguir(); });
      var no = el('button', { type: 'button', class: 'spk-btn' }, 'Cancelar');
      no.addEventListener('click', fin);
      var fila = el('div', { class: 'spk-fila' }); fila.append(no, ok);
      c.append(el('h2', {}, 'Comprobante de práctica'), el('p', {}, '¿Cómo se llama el alumno? Se guarda solo en este dispositivo.'), input, fila);
    });
  }

  /* ---------- la imagen ---------- */
  if (window.CanvasRenderingContext2D && !CanvasRenderingContext2D.prototype.roundRect) {
    CanvasRenderingContext2D.prototype.roundRect = function (x, y, w, h) { this.rect(x, y, w, h); };   // navegadores viejos: esquinas rectas
  }
  function partir(ctx, texto, ancho) {
    var palabras = String(texto).split(/\s+/), lineas = [], l = '';
    palabras.forEach(function (p) { var t = l ? l + ' ' + p : p; if (ctx.measureText(t).width > ancho && l) { lineas.push(l); l = p; } else l = t; });
    if (l) lineas.push(l);
    return lineas;
  }
  function imagen(nombre) {
    var W = 1080, H = 1350, c = document.createElement('canvas');
    c.width = W; c.height = H;
    var x = c.getContext('2d'), r = registro(), min = Math.floor(r.seg / 60), i = info();
    var detalle = ''; try { detalle = i.detalle ? i.detalle() : ''; } catch (e) { detalle = ''; }
    var serif = 'Fraunces, Georgia, serif', sans = '"Nunito Sans", system-ui, sans-serif';
    x.fillStyle = '#F6F0E2'; x.fillRect(0, 0, W, H);
    x.fillStyle = '#48592F'; x.fillRect(0, 0, W, 210);
    x.fillStyle = '#FBF7EE'; x.font = '700 64px ' + serif; x.fillText('Sprinkloud', 80, 120);
    x.font = '700 34px ' + sans; x.fillStyle = '#E1E6CF'; x.fillText('Comprobante de práctica', 80, 172);
    x.fillStyle = '#3A3128'; x.font = '700 76px ' + serif;
    partir(x, nombre, W - 160).slice(0, 2).forEach(function (t, k) { x.fillText(t, 80, 340 + k * 86); });
    var f = new Date();
    x.font = '600 36px ' + sans; x.fillStyle = '#6D6152';
    x.fillText(f.toLocaleDateString('es', { weekday: 'long', day: 'numeric', month: 'long' }) + ' · ' + f.toLocaleTimeString('es', { hour: '2-digit', minute: '2-digit' }), 80, 470);
    /* minutos contra la meta */
    x.fillStyle = '#3A3128'; x.font = '700 120px ' + serif; x.fillText(String(min), 80, 650);
    var anchoMin = x.measureText(String(min)).width;
    x.font = '700 42px ' + sans; x.fillStyle = '#6D6152'; x.fillText(min === 1 ? 'minuto de práctica hoy' : 'minutos de práctica hoy', 100 + anchoMin, 640);
    var barra = W - 160, lleno = Math.min(1, min / META_MIN);
    x.fillStyle = '#EFE6D1'; x.beginPath(); x.roundRect(80, 700, barra, 40, 20); x.fill();
    x.fillStyle = lleno >= 1 ? '#647745' : '#C4923A'; x.beginPath(); x.roundRect(80, 700, Math.max(40, barra * lleno), 40, 20); x.fill();
    x.font = '700 38px ' + sans; x.fillStyle = lleno >= 1 ? '#48592F' : '#8F6A2A';
    x.fillText(lleno >= 1 ? '✔ ¡Meta de ' + META_MIN + ' minutos cumplida!' : 'Meta: ' + META_MIN + ' minutos diarios', 80, 800);
    /* la app y lo que hizo */
    x.fillStyle = '#FBF7EE'; x.beginPath(); x.roundRect(60, 860, W - 120, 360, 28); x.fill();
    x.strokeStyle = '#DCCFB5'; x.lineWidth = 3; x.stroke();
    x.fillStyle = '#8F6A2A'; x.font = '800 30px ' + sans; x.fillText('PRACTICÓ CON', 100, 925);
    x.fillStyle = '#3A3128'; x.font = '700 54px ' + serif; x.fillText(i.app, 100, 995);
    x.font = '600 38px ' + sans; x.fillStyle = '#3A3128';
    partir(x, detalle, W - 200).slice(0, 4).forEach(function (t, k) { x.fillText(t, 100, 1065 + k * 50); });
    x.fillStyle = '#6D6152'; x.font = '600 30px ' + sans; x.fillText('sprinkloud.vercel.app · Club musical Sprinkloud 🌲', 80, H - 70);
    return c;
  }

  /* ---------- compartir o guardar ---------- */
  function mostrar(nombre) {
    var canvas = imagen(nombre);
    canvas.toBlob(function (blob) {
      var archivo = new File([blob], 'practica-' + hoy() + '.png', { type: 'image/png' });
      var url = URL.createObjectURL(blob);
      ventana(function (c, fin) {
        var img = el('img', { src: url, alt: 'Comprobante de práctica de ' + nombre });
        var compartir = el('button', { type: 'button', class: 'spk-btn si' }, 'Compartir por WhatsApp');
        var descargar = el('a', { class: 'spk-btn', href: url, download: archivo.name }, 'Guardar imagen');
        var otro = el('button', { type: 'button', class: 'spk-btn' }, 'Cambiar nombre');
        var cerrarB = el('button', { type: 'button', class: 'spk-btn' }, 'Cerrar');
        var puede = navigator.canShare && navigator.canShare({ files: [archivo] });
        compartir.addEventListener('click', function () {
          navigator.share({ files: [archivo], title: 'Práctica de ' + nombre, text: '¡Práctica de hoy de ' + nombre + '! 🎶' }).catch(function () { });
        });
        otro.addEventListener('click', function () { fin(); pedirNombre(mostrar); });
        cerrarB.addEventListener('click', function () { fin(); URL.revokeObjectURL(url); });
        var fila = el('div', { class: 'spk-fila' });
        fila.append(otro, cerrarB, descargar);
        if (puede) fila.append(compartir);
        c.append(el('h2', {}, 'Comprobante de práctica'), img,
          el('p', {}, puede ? 'Compártelo en el grupo de WhatsApp de la clase.' : 'Guarda la imagen y envíala por el grupo de WhatsApp de la clase.'), fila);
      });
    }, 'image/png');
  }
  boton.addEventListener('click', function () {
    var n = leer(CLAVE_NOMBRE, '');
    if (n) mostrar(n); else pedirNombre(mostrar);
  });
})();
