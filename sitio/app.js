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
  // La conversación empieza aquí y sigue en WhatsApp, donde ella responde.
  var WA = 'https://wa.me/593987999154?text=';
  var atajo = function (txt, msj) { return '<a href="' + WA + encodeURIComponent('Hola Anita, ' + msj) + '" target="_blank" rel="noopener">' + txt + '</a>'; };
  var cont = document.createElement('div');
  cont.className = 'anita';
  cont.innerHTML =
    '<div class="anita-panel" id="anita-panel" role="dialog" aria-labelledby="anita-nombre" hidden>' +
      '<div class="anita-cab"><span class="anita-ava" aria-hidden="true"><i class="ph ph-chat-teardrop-dots"></i></span>' +
        '<div><b id="anita-nombre">Anita</b><span>Club Sprinkloud · responde en WhatsApp</span></div>' +
        '<button class="anita-cerrar" type="button" aria-label="Cerrar"><i class="ph ph-x"></i></button></div>' +
      '<div class="anita-msjs"><p class="burbuja">¡Hola! Soy Anita, de Club Sprinkloud 🌲</p>' +
        '<p class="burbuja">Te ayudo a elegir tu plan, ver los horarios disponibles o resolver tus dudas. ¿Qué necesitas?</p></div>' +
      '<div class="anita-op">' + atajo('Elegir mi plan', 'quiero ayuda para elegir mi plan') +
        atajo('Ver horarios disponibles', 'quiero ver los horarios disponibles') + atajo('Tengo una pregunta', 'tengo una pregunta') + '</div>' +
      '<form class="anita-escribe"><label class="oculto" for="anita-txt">Escríbele a Anita</label>' +
        '<input id="anita-txt" type="text" placeholder="Escribe tu mensaje…" autocomplete="off" maxlength="300">' +
        '<button type="submit" aria-label="Enviar por WhatsApp"><i class="ph ph-paper-plane-right"></i></button></form>' +
    '</div>' +
    '<button class="anita-boton" id="anita-boton" type="button" aria-expanded="false" aria-controls="anita-panel">' +
      '<span class="anita-ava" aria-hidden="true"><i class="ph ph-chat-teardrop-dots"></i></span>' +
      '<span class="anita-hola">¿Te ayudo? <b>Habla con Anita</b></span></button>';
  document.body.appendChild(cont);
  var boton = document.getElementById('anita-boton'), panel = document.getElementById('anita-panel');
  if (boton && panel) {
    var abrir = function (si) {
      panel.hidden = !si;
      boton.setAttribute('aria-expanded', si);
      if (si) document.getElementById('anita-txt').focus({ preventScroll: true }); else boton.focus();
    };
    boton.addEventListener('click', function () { abrir(panel.hidden); });
    panel.querySelector('.anita-cerrar').addEventListener('click', function () { abrir(false); });
    document.addEventListener('keydown', function (ev) { if (ev.key === 'Escape' && !panel.hidden) abrir(false); });
    panel.querySelector('form').addEventListener('submit', function (ev) {
      ev.preventDefault();
      var campo = document.getElementById('anita-txt'), txt = campo.value.trim();
      if (!txt) { campo.focus(); return; }
      window.open(WA + encodeURIComponent('Hola Anita, ' + txt), '_blank', 'noopener');
      campo.value = '';
    });
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
