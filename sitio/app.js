/* 1. Aparecer al entrar en pantalla (una vez), escalonado dentro de cada grupo.
   2. La escena 3D del hero sigue apenas al mouse (solo con mouse fino y sin movimiento reducido). */
(function () {
  var reducido = matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reducido || !('IntersectionObserver' in window)) {
    document.querySelectorAll('.revela').forEach(function (e) { e.classList.add('visto'); });
  } else {
    var obs = new IntersectionObserver(function (entradas) {
      entradas.forEach(function (en) {
        if (!en.isIntersecting) return;
        var t = en.target;
        var hermanos = Array.prototype.filter.call(t.parentElement.children, function (x) { return x.classList.contains('revela'); });
        t.style.transitionDelay = (hermanos.indexOf(t) * 70) + 'ms';
        t.classList.add('visto');
        // el retraso es solo para la entrada: después, el hover responde al instante
        setTimeout(function () { t.style.transitionDelay = ''; }, 900 + hermanos.length * 70);
        obs.unobserve(t);
      });
    }, { threshold: .2 });
    document.querySelectorAll('.revela').forEach(function (e) { obs.observe(e); });
  }

  // Anita, la asistente de WhatsApp del club, en todas las páginas del sitio (se arma aquí: un solo lugar).
  // La conversación empieza aquí y sigue en WhatsApp, donde ella responde (pedido de la dueña, 2-nov):
  //  · «Elegir mi plan» muestra los 3 planes; al tocar uno, WhatsApp con ese plan para Anita.
  //  · «Ver horarios disponibles» muestra un calendario de esta semana (o de la próxima, el fin de semana) con las horas
  //    libres del sistema (?api=horarios de la web app de maestros: solo días y horas); al elegir, WhatsApp con esa hora.
  //  · A los pocos segundos en la página se abre sola con los planes, para llevar a pagar (una vez por visita).
  var WA = 'https://wa.me/593987999154?text=';
  var API_HORARIOS = 'https://script.google.com/macros/s/AKfycbyyS3H2cdaXUz9zj1oilSdmsrF6ANcy0zPkGD4NuZZNUMj7QdO8A29pioM-jYNlf7YL/exec?api=horarios';
  var ABRIR_SOLA_MS = 10000;
  var PLANES = [
    { nombre: 'Ritmo', detalle: '4 clases de 30 min', precio: 30 },
    { nombre: 'Melodía', detalle: '4 clases de 60 min · recomendado', precio: 64 },
    { nombre: 'Armonía', detalle: '4 de 60 min + 4 de teoría', precio: 92 }
  ];
  // quién da cada instrumento (dueña, 3-nov-2026); en el sistema es MAESTRA_DE (maestros/Código.js, sección 9f)
  var INSTRUMENTOS = { piano: { nombre: 'Piano', maestra: 'Keila Espín' }, violin: { nombre: 'Violín', maestra: 'Jova' } };
  var CORTO = { 'Lunes': 'Lun', 'Martes': 'Mar', 'Miércoles': 'Mié', 'Jueves': 'Jue', 'Viernes': 'Vie', 'Sábado': 'Sáb', 'Domingo': 'Dom' };
  var esc = function (t) { return String(t).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); };
  var wa = function (msj) { window.open(WA + encodeURIComponent('Hola Anita, ' + msj), '_blank', 'noopener'); };

  var cont = document.createElement('div');
  cont.className = 'anita';
  cont.innerHTML =
    '<div class="anita-panel" id="anita-panel" role="dialog" aria-labelledby="anita-nombre" hidden>' +
      '<div class="anita-cab"><span class="anita-ava" aria-hidden="true"><i class="ph ph-chat-teardrop-dots"></i></span>' +
        '<div><b id="anita-nombre">Anita</b><span>Club Sprinkloud · responde en WhatsApp</span></div>' +
        '<button class="anita-cerrar" type="button" aria-label="Cerrar"><i class="ph ph-x"></i></button></div>' +
      '<div id="anita-vista" aria-live="polite"></div>' +
      '<form class="anita-escribe"><label class="oculto" for="anita-txt">Escríbele a Anita</label>' +
        '<input id="anita-txt" type="text" placeholder="Escribe tu mensaje…" autocomplete="off" maxlength="300">' +
        '<button type="submit" aria-label="Enviar por WhatsApp"><i class="ph ph-paper-plane-right"></i></button></form>' +
    '</div>' +
    '<button class="anita-boton esponja esponja-blanca brilla" id="anita-boton" type="button" aria-expanded="false" aria-controls="anita-panel">' +
      '<span class="anita-ava" aria-hidden="true"><i class="ph ph-chat-teardrop-dots"></i></span>' +
      '<span class="anita-hola">¿Te ayudo? <b>Habla con Anita</b></span></button>';
  document.body.appendChild(cont);
  var boton = document.getElementById('anita-boton'), panel = document.getElementById('anita-panel'), vista = document.getElementById('anita-vista');
  var tocada = false;   // si la persona ya la abrió, no se abre sola

  var burbujas = function (lista) { return '<div class="anita-msjs">' + lista.map(function (t) { return '<p class="burbuja">' + t + '</p>'; }).join('') + '</div>'; };
  var volver = '<button class="anita-volver" type="button" data-ir="inicio"><i class="ph ph-caret-left"></i> Volver</button>';

  var vistas = {
    inicio: function () {
      vista.innerHTML = burbujas(['¡Hola! Soy Anita, de Club Sprinkloud 🌲', 'Te ayudo a elegir tu plan, ver los horarios disponibles o resolver tus dudas. ¿Qué necesitas?']) +
        '<div class="anita-op"><button type="button" data-ir="planes">Elegir mi plan</button><button type="button" data-ir="horarios">Ver horarios disponibles</button>' +
        '<button type="button" data-wa="tengo una pregunta">Tengo una pregunta</button></div>';
    },
    planes: function (auto) {
      vista.innerHTML = (auto ? '' : volver) +
        burbujas(auto ? ['¡Hola! Soy Anita 🌲', '¿Empezamos? Elige tu plan y te ayudo a pagar en un minuto 💳'] : ['¿Qué plan te gustaría? 🎶']) +
        '<div class="anita-planes">' + PLANES.map(function (p, i) {
          return '<button class="anita-plan" type="button" data-plan="' + i + '"><b>' + p.nombre + '</b><span>' + p.detalle + '</span><strong>USD ' + p.precio + '</strong></button>';
        }).join('') + '</div><p class="cal-nota">Al mes. El primer pago suma USD 10 de inscripción.</p>' +
        (auto ? '<div class="anita-op"><button type="button" data-ir="horarios">Ver horarios disponibles</button></div>' : '');
    },
    // primero el instrumento: cada uno tiene su maestra (piano: Keila Espín; violín: Jova), con sus propios horarios
    horarios: function () {
      vista.innerHTML = volver + burbujas(['¿Qué quieres aprender? 🎶']) +
        '<div class="anita-planes">' + Object.keys(INSTRUMENTOS).map(function (k) {
          return '<button class="anita-plan" type="button" data-ins="' + k + '"><b>' + INSTRUMENTOS[k].nombre + '</b><span>Con ' + INSTRUMENTOS[k].maestra + '</span></button>';
        }).join('') + '</div>';
    },
    calendario: function (ins) {
      instrumento = ins;
      vista.innerHTML = '<button class="anita-volver" type="button" data-ir="horarios"><i class="ph ph-caret-left"></i> Volver</button>' +
        burbujas(['Horarios de ' + INSTRUMENTOS[ins].nombre.toLowerCase() + ' con ' + INSTRUMENTOS[ins].maestra + '. Elige el tuyo 📅']) +
        '<div class="cal-dias" id="cal-dias"></div><div class="cal-horas" id="cal-horas"><div class="cal-carga"></div></div><p class="cal-nota" id="cal-nota"></p>';
      cargarHorarios(ins).then(pintarCalendario, function () {
        document.getElementById('cal-horas').innerHTML = '';
        document.getElementById('cal-nota').innerHTML = 'No pude ver los horarios ahora. <button class="enlace" type="button" data-wa="quiero ver los horarios disponibles">Pídeselos a Anita</button>';
      });
    }
  };
  var ir = function (nombre, auto) { vistas[nombre](auto); };

  var horarios = {}, instrumento = 'piano';
  var cargarHorarios = function (ins) {
    if (horarios[ins]) return Promise.resolve(horarios[ins]);
    var ctl = 'AbortController' in window ? new AbortController() : null;
    var t = ctl && setTimeout(function () { ctl.abort(); }, 15000);
    return fetch(API_HORARIOS + '&instrumento=' + ins, ctl ? { signal: ctl.signal } : {}).then(function (r) { return r.json(); }).then(function (d) {
      if (t) clearTimeout(t);
      if (!d || !d.dias) throw new Error('sin datos');
      horarios[ins] = d; return d;
    });
  };
  var pintarCalendario = function (d) {
    var dias = document.getElementById('cal-dias'), horas = document.getElementById('cal-horas'), nota = document.getElementById('cal-nota');
    if (!dias) return;
    var elegido = d.dias.findIndex(function (x) { return x.horas.length; });
    var pintar = function () {
      dias.innerHTML = d.dias.map(function (x, i) {
        return '<button class="cal-dia" type="button" data-dia="' + i + '" aria-pressed="' + (i === elegido) + '"' + (x.horas.length ? '' : ' disabled') +
          ' aria-label="' + esc(x.dia + ' ' + x.numero) + '"><small>' + esc(CORTO[x.dia] || x.dia) + '</small><b>' + esc(x.numero) + '</b></button>';
      }).join('');
      var dia = d.dias[elegido];
      horas.innerHTML = dia ? dia.horas.map(function (h) { return '<button class="cal-hora" type="button" data-hora="' + esc(h) + '">' + esc(h) + '</button>'; }).join('') : '';
      nota.textContent = elegido < 0 ? 'Esta semana ya no quedan horarios libres. Escríbele a Anita y te ayuda.' :
        (d.semana === 'proxima' ? 'Semana que viene. ' : 'Esta semana. ') + 'Clases de 60 min; si eliges Ritmo, son de 30.';
    };
    dias.onclick = function (ev) { var b = ev.target.closest('[data-dia]'); if (b && !b.disabled) { elegido = Number(b.dataset.dia); pintar(); } };
    horas.onclick = function (ev) {
      var b = ev.target.closest('[data-hora]'); if (!b) return;
      var x = d.dias[elegido];
      wa('quiero clases de ' + INSTRUMENTOS[instrumento].nombre.toLowerCase() + ' con ' + INSTRUMENTOS[instrumento].maestra + ' el ' + x.dia.toLowerCase() + ' ' + x.numero + ' a las ' + b.dataset.hora + '. ¿Está disponible? Quiero elegir mi plan.');
    };
    pintar();
  };

  var abrir = function (si, vistaInicial, auto) {
    if (si) ir(vistaInicial || 'inicio', auto);
    panel.hidden = !si;
    boton.setAttribute('aria-expanded', si);
    if (si && !auto) { var f = vista.querySelector('button'); if (f) f.focus({ preventScroll: true }); }
    if (!si && !auto) boton.focus();
  };
  boton.addEventListener('click', function () { tocada = true; abrir(panel.hidden); });
  panel.querySelector('.anita-cerrar').addEventListener('click', function () { tocada = true; abrir(false); });
  document.addEventListener('keydown', function (ev) { if (ev.key === 'Escape' && !panel.hidden) abrir(false); });
  vista.addEventListener('click', function (ev) {
    var b = ev.target.closest('button'); if (!b) return;
    tocada = true;
    if (b.dataset.ir) ir(b.dataset.ir);
    else if (b.dataset.ins) ir('calendario', b.dataset.ins);
    else if (b.dataset.wa) wa(b.dataset.wa);
    else if (b.dataset.plan) {
      var p = PLANES[Number(b.dataset.plan)];
      wa('quiero el plan ' + p.nombre + ': ' + p.detalle.split(' · ')[0] + ' por USD ' + p.precio + ' al mes (más USD 10 de inscripción). ¿Me ayudas a pagar?');
    }
  });
  // los botones de la página que abren a Anita en una vista (por ejemplo, «Ver horarios» en los planes)
  document.querySelectorAll('[data-anita]').forEach(function (b) {
    b.addEventListener('click', function () { tocada = true; abrir(true, b.dataset.anita); });
  });
  panel.querySelector('form').addEventListener('submit', function (ev) {
    ev.preventDefault();
    var campo = document.getElementById('anita-txt'), txt = campo.value.trim();
    if (!txt) { campo.focus(); return; }
    wa(txt);
    campo.value = '';
  });
  // se abre sola una vez por visita, con los planes (no en la bienvenida: ahí ya pagaron)
  var yaSeAbrio = false;
  try { yaSeAbrio = sessionStorage.getItem('anita-sola') === '1'; } catch (e) { }
  if (!yaSeAbrio && !/^\/bienvenida/.test(location.pathname)) {
    setTimeout(function () {
      if (tocada || !panel.hidden || document.hidden) return;
      abrir(true, 'planes', true);
      try { sessionStorage.setItem('anita-sola', '1'); } catch (e) { }
    }, ABRIR_SOLA_MS);
  }

  var escena = document.querySelector('.escena-3d');
  if (!escena || reducido || !matchMedia('(hover: hover) and (pointer: fine)').matches) return;
  var hero = document.querySelector('.hero'), pedido = 0;
  hero.addEventListener('pointermove', function (ev) {
    if (pedido) return;
    pedido = requestAnimationFrame(function () {
      pedido = 0;
      var r = hero.getBoundingClientRect();
      var x = (ev.clientX - r.left) / r.width - .5, y = (ev.clientY - r.top) / r.height - .5;
      escena.style.transform = 'rotateY(' + (-16 + x * 8).toFixed(2) + 'deg) rotateX(' + (6 - y * 6).toFixed(2) + 'deg)';
    });
  });
  hero.addEventListener('pointerleave', function () { escena.style.transform = ''; });
})();
