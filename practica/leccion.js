/*
 * Sprinkloud · modo lección (lo usan todas las apps de práctica)
 *
 * Cuando el enlace trae ?etapa=E&leccion=L (el mensaje de tareas de la maestra y el reporte de la familia) o el viejo
 * ?semana=N (los libros y los mensajes ya enviados); en las hojas, /etapa-E-leccion-L?modo=leccion o /semana-N?leccion=1:
 * - muestra una tarjeta con la etapa, la lección y el tema de la guía (nunca el número de semana: estresa), la meta, 3 pasos de qué hacer en ESTA app
 *   y para qué sirve la camarita (comprobante.js);
 * - deja la app preparada solo con lo que el alumno ya aprendió hasta esa semana:
 *     piano y violín: el juego de notas solo con esas notas (sin líneas adicionales si todavía no las vio);
 *     ritmo: el compás, las tarjetas de figuras de esa semana y un ritmo de ejemplo listo para dar play;
 * - deja un botón "Etapa E · Lección L · ¿Qué hago?" para volver a ver los pasos.
 * Se carga en el <head> (sin defer) para leer la dirección antes de que la página la reescriba.
 * La guía (tema y meta) es la de Registro_Sprinkloud/Guia.js; si cambia, actualizar GUIA aquí y en hojas.html.
 */
(function () {
  'use strict';
  /* Lecciones de cada etapa de la guía (Registro_Sprinkloud/Guia.js): la semana N es la lección L de la etapa E.
     Desde el 29-oct-2026 son 60: la etapa 3 tiene 13 (la vieja «Más notas» se separó en 4), la 4 suma el orden de los
     sostenidos y de los bemoles y las inversiones, el círculo de quintas pasó a la 5, la 6 ya no tiene «Dos contra tres»
     y la 7 es el libro de los modos griegos. */
  var ETAPAS = [6, 8, 13, 10, 9, 6, 8];
  function semanaDe(e, l) {
    if (!(e >= 1 && e <= ETAPAS.length && l >= 1 && l <= ETAPAS[e - 1])) return 0;
    for (var s = l, i = 0; i < e - 1; i++) s += ETAPAS[i];
    return s;
  }
  var q = new URLSearchParams(location.search);
  var semana = Number(q.get('semana')) || (q.get('etapa') ? semanaDe(Number(q.get('etapa')), Number(q.get('leccion'))) : 0);
  var rutaHoja = location.pathname.match(/\/hojas\/(piano|violin)\/semana-(\d+)/);
  var rutaNueva = location.pathname.match(/\/hojas\/(piano|violin)\/etapa-(\d+)-leccion-(\d+)/);
  var app = (location.pathname.match(/\/practica\/(piano|violin|ritmo|oido|hojas|armaduras|circulo|acordes|modos)/) || [])[1];
  if (!semana && rutaHoja && /[?&]leccion=1/.test(location.search)) semana = Number(rutaHoja[2]);
  if (!semana && rutaNueva && q.get('modo') === 'leccion') semana = semanaDe(Number(rutaNueva[2]), Number(rutaNueva[3]));
  var etapa = 0, leccion = semana;
  while (etapa < ETAPAS.length && leccion > ETAPAS[etapa]) leccion -= ETAPAS[etapa++];
  var NIVEL = 'Etapa ' + (etapa + 1) + ' · Lección ' + leccion;
  if (!app || !(semana >= 1 && semana <= 60)) return;
  /* el instrumento (en las hojas sale de la dirección) y el texto de cada uno: los temas «piano / violín» de la guía */
  var ins = app === 'violin' || (rutaHoja || rutaNueva || [])[1] === 'violin' || q.get('i') === 'violin' ? 'violin' : 'piano';   // &i=violin: los libros de violín lo mandan a las apps comunes (modos)
  function para(t) { var p = String(t).split(' / '); return p.length === 2 && (app === 'piano' || app === 'violin' || rutaHoja || rutaNueva) ? p[ins === 'violin' ? 1 : 0] : t; }

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
    ['Do-re-mi', 'Ubicar Do, Re y Mi en el pentagrama y en tu instrumento.'],
    ['La escala de Do', 'Leer y tocar las notas de la escala de Do, subiendo y bajando.'],   // 7-nov-2026: también en el violín (do fijo; antes, la escala de Re)
    ['Figuras: redonda, blanca, negra, corchea', 'Saber cuánto dura cada figura.'],
    ['Compás: 2/4, 3/4 y 4/4', 'Marcar el pulso fuerte de cada compás.'],
    ['Primera lectura de 4 compases', 'Leer una melodía de 4 compases sin parar.'],
    ['Dictado rítmico', 'Escuchar un ritmo y escribirlo.'],
    ['El puntillo', 'Leer la blanca con puntillo y la negra con puntillo.'],
    ['Semicorcheas: ta-ka-di-mi', 'Tocar 4 semicorcheas parejas en un pulso.'],
    ['Combinaciones: ta-di-mi y ta-ka-di', 'Leer corchea con dos semicorcheas y al revés.'],
    ['Ligadura y síncopa', 'Tocar una síncopa sin acelerar.'],
    ['Coordinación: pulso y ritmo a la vez', 'Marcar el pulso con una mano y decir el ritmo con la voz.'],
    ['Clave de fa: líneas / Cuerda Sol', 'Leer y tocar las 5 líneas de la clave de fa: sol, si, re, fa, la. / Leer y tocar Sol, La, Si y Do en la cuerda Sol.'],
    ['Clave de fa: espacios / Cuerda Mi', 'Leer y tocar los 4 espacios de la clave de fa: la, do, mi, sol. / Leer y tocar Mi, Fa♯, Sol y La en la cuerda Mi.'],
    ['Líneas adicionales: clave de sol / Líneas adicionales abajo', 'Leer de un vistazo las notas con rayitas en clave de sol. / Leer de un vistazo las notas con rayitas debajo del pentagrama.'],
    ['Líneas adicionales: clave de fa / Líneas adicionales arriba', 'Leer de un vistazo las notas con rayitas en clave de fa. / Leer de un vistazo las notas con rayitas arriba del pentagrama.'],
    ['Lectura con todas las notas', 'Leer una melodía de 8 compases.'],
    ['Las 12 notas: sostenidos, bemoles y becuadro', 'Nombrar las 12 notas y saber qué hace el becuadro.'],
    ['Tono y semitono', 'Distinguir tono y semitono.'],
    ['Intervalos 1: segundas y terceras', 'Reconocer segundas y terceras de oído.'],
    ['Intervalos 2: cuarta, quinta, tritono y octava', 'Reconocer de oído la 4ª, la 5ª, el tritono y la 8ª.'],
    ['Intervalos 3: sextas, séptimas, aumentados y disminuidos', 'Nombrar los intervalos con sus semitonos y reconocer de oído al menos 6.'],
    ['La escala mayor: fórmula e intervalos', 'Construir una escala mayor con T-T-S-T-T-T-S.'],
    ['Escalas de Sol y Fa mayor y su armadura', 'Tocar Sol y Fa mayor y leer la armadura.'],
    ['Orden de los sostenidos: ¿en qué tonalidad estoy?', 'Decir el orden de los sostenidos y descubrir la tonalidad mayor de una armadura.'],
    ['Orden de los bemoles', 'Decir el orden de los bemoles y descubrir la tonalidad mayor de una armadura con bemoles.'],
    ['Triadas mayor y menor', 'Distinguir de oído un acorde mayor de uno menor.'],
    ['Triadas aumentada y disminuida', 'Reconocer las 4 triadas.'],
    ['Inversiones de acordes', 'Reconocer un acorde invertido, su nombre y la nota del bajo (Do/Mi).'],
    ['Armonizar la escala mayor', 'Conocer los 7 acordes de Do mayor.'],
    ['Centro tonal y reposo', 'Reconocer cuándo una canción llega a casa.'],
    ['Progresiones mayores: I, IV, V y vi', 'Acompañar una canción con I, IV, V y vi.'],
    ['Escala menor natural y su relativa', 'Distinguir mayor y menor de oído.'],
    ['Progresiones menores y escala menor armónica', 'Sentir el reposo en un acorde menor: i – iv – V – i (el V es mayor por la 7.ª subida).'],
    ['Círculo de quintas: mayores, menores y sus acordes', 'Ubicar cada tonalidad con su relativa menor y decir sus acordes.'],
    ['Escala pentatónica', 'Tocar la pentatónica mayor y menor.'],
    ['Improvisar con la pentatónica', 'Improvisar 8 compases y terminar en la nota casa.'],
    ['Compás de 6/8', 'Sentir el 6/8 en dos pulsos grandes.'],
    ['Dictado melódico', 'Escribir una melodía corta de oído.'],
    ['Dinámicas (pp a ff), articulaciones y ligaduras', 'Conocer de pp a ff, ligado, staccato y las dos ligaduras.'],
    ['Tempo y términos', 'Tocar en Lento, Andante y Allegro.'],
    ['La forma y las repeticiones (AB, ABA, casillas y calderón)', 'Reconocer las partes de una canción y leer las repeticiones.'],
    ['Lectura a primera vista y anacrusa', 'Leer 8 compases nuevos sin parar.'],
    ['Acorde de séptima de dominante', 'Sentir cómo el V7 pide volver al I.'],
    ['Proyecto: mi primera composición', 'Componer y tocar 8 compases.'],
    ['¿Qué es un modo?', 'Saber qué es un modo y nombrar los 7 con su tecla blanca.'],
    ['El modo eólico: la menor natural', 'Tocar el eólico y compararlo con el jónico.'],
    ['El modo mixolidio', 'Tocar el mixolidio y encontrar su nota característica.'],
    ['El modo dórico', 'Tocar el dórico y encontrar su nota característica.'],
    ['El modo lidio', 'Tocar el lidio y encontrar su nota característica.'],
    ['El modo frigio', 'Tocar el frigio y encontrar su nota característica.'],
    ['El modo locrio', 'Tocar el locrio y entender por qué suena inestable.'],
    ['Los 7 modos, del más brillante al más oscuro', 'Ordenar los 7 modos por su brillo y reconocerlos de oído.']
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
    /* 20 a 23: solo las notas nuevas de cada lección, para aprenderlas de a poco (pedido de la dueña, 29-oct) */
    if (s === 20) return fa(['g/2', 'b/2', 'd/3', 'f/3', 'a/3']);                                 // clave de fa: líneas
    if (s === 21) return fa(['g/2', 'a/2', 'b/2', 'c/3', 'd/3', 'e/3', 'f/3', 'g/3', 'a/3']);       // + los espacios
    if (s === 22) return sol(['a/3', 'b/3', 'c/4', 'a/5', 'b/5']);                                // clave de sol: líneas adicionales
    if (s === 23) return fa(['f/2', 'b/3', 'c/4', 'd/4', 'e/4']);                                 // clave de fa: líneas adicionales
    /* 25 (Las 12 notas): las teclas negras con sus dos nombres y las blancas de la octava central (7-nov-2026) */
    if (s === 25) return [['c/4'], ['c/4', '#'], ['d/4', 'b'], ['d/4'], ['d/4', '#'], ['e/4', 'b'], ['e/4'], ['f/4'], ['f/4', '#'], ['g/4', 'b'], ['g/4'],
      ['g/4', '#'], ['a/4', 'b'], ['a/4'], ['a/4', '#'], ['b/4', 'b'], ['b/4']].map(function (n) { return [n[0], 'treble', n[1]]; });
    return null;   // desde la semana 24: todas (el modo normal de la app)
  }
  function notasViolin(s) {
    if (s <= 7) return ['e/4', 'g/4'];
    if (s === 8) return ['e/4', 'g/4', 'a/4'];
    if (s === 9) return ['c/4', 'd/4', 'e/4', 'g/4', 'a/4'];   // 7-nov-2026: do fijo, como el piano (Do es el dedo 3 de la cuerda Sol)
    if (s <= 19) return ['c/4', 'd/4', 'e/4', 'f/4', 'g/4', 'a/4', 'b/4', 'c/5'];   // la escala de Do (7-nov-2026: el libro pasó a do fijo; antes, la de Re con Fa♯ y Do♯)
    if (s === 20) return ['g/3', 'a/3', 'b/3', 'c/4'];                 // cuerda Sol
    if (s === 21) return ['e/5', 'g/5', 'a/5'];                        // cuerda Mi (sin Fa♯: el juego usa naturales)
    if (s === 22) return ['g/3', 'a/3', 'b/3', 'c/4', 'd/4', 'e/4'];   // líneas adicionales abajo, con las vecinas
    if (s === 23) return ['e/5', 'f/5', 'g/5', 'a/5', 'b/5'];          // líneas adicionales arriba
    /* 25 (Las 12 notas): primera posición, con sostenidos y bemoles («dedos bajos y altos») */
    if (s === 25) return ['d/4', 'd/4:#', 'e/4:b', 'e/4', 'f/4', 'f/4:#', 'g/4:b', 'g/4', 'g/4:#', 'a/4:b', 'a/4', 'a/4:#', 'b/4:b', 'b/4', 'c/5', 'c/5:#', 'd/5:b', 'd/5', 'd/5:#', 'e/5:b', 'e/5'];
    return null;
  }

  /* ---------- Intervalos en el piano (29-oct): las lecciones de intervalos se practican en el teclado ---------- */
  var INTERVALOS = { 26: [1, 2], 27: [1, 2, 3, 4], 28: [5, 6, 7, 12], 29: [8, 9, 10, 11] };   // 26: tono y semitono (7-nov)

  /* ---------- Lecciones del piano y del violín que no son «lee esta nota» (7-nov-2026) ----------
     Antes todas abrían el juego de leer notas, y desde la lección 24 con todas las notas: la de la pentatónica decía
     «toca la pentatónica» y pedía una nota suelta (reporte de la dueña). Ahora cada una abre su ejercicio:
     escala: tocar la escala nota por nota (practica/escalas.js); lineaEspacio: ¿línea o espacio?; tono: tono o semitono
     (en el piano es el juego de intervalos con 1 y 2 semitonos); lectura: la lectura hablada (decir las notas en ritmo,
     sin parar), que es lo que piden las lecciones de lectura de melodías. */
  var ESPECIAL = {
    piano: {
      7: { tipo: 'lineaEspacio' },
      13: { tipo: 'lectura' }, 24: { tipo: 'lectura' }, 50: { tipo: 'lectura' },
      30: { tipo: 'escala', escalas: ['mayor:Sol4', 'mayor:Sol4', 'mayor:Re4', 'mayor:Do4', 'mayor:Mi4'] },
      31: { tipo: 'escala', escalas: ['mayor:Sol4', 'mayor:Fa4'] },
      43: { tipo: 'escala', escalas: ['pentaMayor:Do4', 'pentaMayor:Fa♯4', 'pentaMayor:Sol4', 'pentaMenor:La4', 'pentaMenor:Mi4'] }
    },
    violin: {
      7: { tipo: 'lineaEspacio' }, 26: { tipo: 'tono' },
      13: { tipo: 'lectura' }, 24: { tipo: 'lectura' }, 50: { tipo: 'lectura' },
      30: { tipo: 'escala', escalas: ['mayor:Sol3', 'mayor:Sol3', 'mayor:Re4', 'mayor:La4', 'mayor:Do4'] },
      31: { tipo: 'escala', escalas: ['mayor:Sol3', 'mayor:Fa4'] },
      43: { tipo: 'escala', escalas: ['pentaMayor:Re4', 'pentaMenor:La4', 'pentaMayor:Sol3', 'pentaMenor:Mi4'] }
    }
  };
  /* modos: el ejercicio que pide el libro en cada lección (etapa 7) */
  var MODOS_LECCION = { 53: 'ver', 54: 'oido', 55: 'caracteristica', 56: 'oido', 57: 'oido', 58: 'caracteristica', 59: 'oido', 60: 'oido' };

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
    44: { compas: '4/4', ejemplo: ['pan', 'pan', 'pan', 'pan', 'pan', 'pan', 'pan', 'pan'], tempo: 80, repetir: true },
    /* 7-nov-2026: dinámicas, tempo y forma tienen su propio ritmo de ejemplo y sus pasos */
    47: { compas: '4/4', ejemplo: ['pan', 'pan', 'luna', 'pan', 'pan', 'luna', 'pan', 'bla2'], tempo: 70, repetir: true },
    48: { compas: '4/4', ejemplo: ['pan', 'pan', 'pan', 'pan', 'pan', 'pan', 'pan', 'pan'], tempo: 60, repetir: true },
    49: { compas: '4/4', ejemplo: ['pan', 'luna', 'pan', 'pan', 'luna', 'luna', 'bla2', 'bla2', 'pan', 'pan', 'luna', 'pan', 'bla2', 'pan', 'luna', 'pan', 'pan', 'luna', 'luna', 'bla2'], tempo: 80 },
    45: { compas: '6/8', ejemplo: ['negp6', 'negp6', 'tres8', 'negp6', 'neg8', 'neg8', 'blap6'], tempo: 50 }
  };
  [4, 5, 7, 8, 9, 10].forEach(function (s) { R[s] = R[3]; });
  R[13] = R[11];
  /* desde la semana 20 (salvo las de arriba): todas las tarjetas, con el ejemplo de corcheas y semicorcheas */
  function ritmoDe(s) { return R[s] || { compas: '4/4', ejemplo: ['luna', 'choco', 'luna', 'pan', 'choco', 'luna', 'choco', 'pan'], tempo: 70 }; }

  /* ---------- Los pasos que se muestran ---------- */
  /* fuera del bloque que copia el bosque (App_Bosque/herramientas/copiar_motores.py): ahí no existen app ni semana */
  var especial = (app === 'piano' || app === 'violin') ? ESPECIAL[app][semana] : null;
  var CAMARA = 'Al terminar, toca la <b>camarita</b> 📷 (abajo a la derecha): arma una imagen con tus minutos de práctica de hoy. Mándasela a tu maestra por WhatsApp.';
  function pasos() {
    var instrumento = app === 'violin' ? 'en las cuerdas del violín' : 'en el teclado';
    if (especial && especial.tipo === 'escala') return [
      'Toca <b>Empezar a tocar escalas</b>: te pide una escala (' + (semana === 43 ? 'pentatónica mayor o menor' : semana === 31 ? 'Sol mayor o Fa mayor' : 'mayor, con su fórmula T-T-S-T-T-T-S') + ') y te dice en qué nota empieza.',
      'Tócala ' + instrumento + ', <b>nota por nota, subiendo</b>. Pon todas las notas, aunque dudes.',
      'Al terminar se corrige: en <b>verde</b> lo que tocaste bien y en <b>rojo</b> lo que no, con la nota correcta. Junta las <b>3 estrellas</b> tocándolas sin errores.'];
    if (especial && especial.tipo === 'lineaEspacio') return [
      'Toca <b>Empezar</b>: aparece una nota en el pentagrama.',
      'Cuenta de abajo hacia arriba y toca <b>Línea</b> o <b>Espacio</b>.',
      'Junta las <b>3 estrellas</b>. Después toca notas ' + instrumento + ' y mira dónde se escriben.'];
    if (especial && especial.tipo === 'lectura') return [
      'Toca <b>Empezar</b>: se abre la <b>lectura hablada</b> con una melodía en el pentagrama.',
      'Después de la cuenta (1, 2, 3, 4), <b>di el nombre de cada nota</b> cuando el marcador llegue a ella, sin parar aunque te equivoques.',
      'Lee otra melodía cuantas veces quieras. Después tócala ' + instrumento + ', despacio y de corrido.'];
    if (semana === 26 && (app === 'piano' || app === 'violin')) return [
      'Toca <b>Empezar</b>: se marca una nota y te pide <b>un tono</b> o <b>un semitono</b> más arriba.',
      app === 'piano' ? 'Semitono es la tecla de al lado, blanca o negra; tono es saltarse una tecla.' : 'Semitono es poner el dedo pegado al anterior; tono es dejar espacio entre los dedos.',
      'Toca la nota donde llegas. Junta las <b>3 estrellas</b>.'];
    if (app === 'piano' && INTERVALOS[semana]) return [
      'Toca <b>Empezar</b>: se marca una tecla y te pide un intervalo («Desde Do, toca una 3ª mayor»).',
      'Cuenta los semitonos subiendo tecla por tecla, <b>blancas y negras</b>, y toca la tecla donde llegas.',
      'Al acertar ves la cuenta en cada tecla. Junta las <b>3 estrellas</b>.'];
    if (app === 'piano' || app === 'violin') return [
      'Toca <b>Empezar</b>: aparece una nota en el pentagrama.',
      'Búscala y tócala ' + instrumento + '. Si aciertas, aparece otra.',
      'Junta las <b>3 estrellas</b>: la tercera sale con 6 aciertos seguidos.'];
    /* 10-nov-2026 (la dueña): en vez de palmear o tocar el pecho, el alumno toca el tambor de la pantalla (en la computadora,
       cualquier tecla): así la app sabe si fue a tiempo. */
    const TAMBOR = 'toca el <b>tambor 🥁</b> (en el celular, en la pantalla; en la computadora, cualquier tecla)';
    if (app === 'ritmo') {
      if (semana === 1) return ['Toca <b>Empezar</b> y luego <b>▶ Reproducir</b>: suena el pulso.', 'En cada «ta», ' + TAMBOR + ', sin adelantarte.', 'La nota se pone verde si fue a tiempo. Sigue el pulso unos 30 segundos.'];
      if (semana === 14) return ['Toca <b>Dictado</b> (abajo de las tarjetas): suena un ritmo.', 'Escúchalo con atención y elige la tarjeta que sonó.', 'Haz por lo menos 10 dictados.'];
      if (semana === 18) return ['Toca <b>▶ Reproducir</b>: suena la cumbia.', 'Escucha el pulso y ' + TAMBOR + ' en cada nota, también en el sonido «corrido» (la síncopa).', 'Prueba otros ritmos en «Ritmos latinos…».'];
      if (semana === 6) return ['Toca <b>▶ Reproducir</b>: el ostinato (ta, ti-ti, ta, sh) se repite sin parar.', 'Mientras se repite, ' + TAMBOR + ' en cada nota, diciendo sus sílabas.', 'Sigue varias vueltas sin perder el pulso: las notas a tiempo se ponen verdes.'];
      if (semana === 19) return ['Toca <b>▶ Reproducir</b>: el círculo marca el pulso y se ilumina cada nota.', 'Mira el círculo: marca el <b>pulso</b>. Mientras tanto, ' + TAMBOR + ' en cada nota: ese es el <b>ritmo</b>.', 'Las notas a tiempo se ponen verdes y las que se pasaron, rojas.'];
      if (semana === 47) return ['Toca <b>▶ Reproducir</b>: el ritmo se repite.', 'En cada nota, ' + TAMBOR + ' a tiempo.', '<b>Crea tu propio ritmo</b> con las tarjetas, dale ▶ y tócalo igual.'];
      if (semana === 48) return ['Toca <b>▶ Reproducir</b>: el pulso está en <b>60, Lento</b>. Camina al pulso.', 'Mueve el tempo a <b>90 (Andante)</b> y después a <b>130 (Allegro)</b>, y en cada uno ' + TAMBOR + ' en cada pulso.', 'Fíjate: mientras más grande el número, más rápido el pulso.'];
      if (semana === 49) return ['Toca <b>▶ Reproducir</b>: suena la forma <b>ABA</b>: la parte A (compases 1 y 2), la B (3 y 4) y otra vez A (5 y 6).', 'En la parte A, ' + TAMBOR + ' en cada nota; en la parte B, solo escucha.', 'Arma tu propia forma con las tarjetas: una A, una B distinta y otra vez A.'];
      if (semana === 52) return ['<b>Crea un ritmo de 2 compases</b> con las tarjetas y dale ▶.', 'Repítelo cuatro veces (8 compases) y tócalo en tu instrumento con notas de tu escala.', 'Termina en la nota casa y ponle nombre a tu canción.'];
      if (semana === 44) return ['Toca <b>▶ Reproducir</b>: el pulso se repite como base.', 'Mientras suena, improvisa en tu instrumento con la pentatónica.', 'Termina siempre en la nota casa.'];
      return ['Toca <b>▶ Reproducir</b>: después de la cuenta (1, 2, 3, 4) se ilumina cada nota.', '<b>Toca a tiempo</b>: cuando se ilumina cada nota, ' + TAMBOR + ', diciendo su sílaba (ta, ti-ti…).',
        '<b>Crea tu propio ritmo</b> tocando las tarjetas, dale ▶ y tócalo igual en el tambor.' + (semana === 11 ? ' Con <b>Pizza</b> ves cuánto dura cada figura.' : '')];
    }
    if (app === 'armaduras') return [
      'Elige un ejercicio arriba: ordenar, descubrir la tonalidad o contar las alteraciones.',
      'Toca tu respuesta. Debajo aparece la regla para recordarla.',
      'Cambia de ejercicio: practicar de varias maneras ayuda a recordarlo.'];
    if (app === 'circulo') return ['Elige un ejercicio arriba: dónde va cada tonalidad, sus vecinas, su relativa o sus 6 acordes.', 'Toca en el círculo. Debajo aparece la regla.', 'Cambia de ejercicio: practicar de varias maneras ayuda a recordarlo.'];
    if (app === 'acordes' && semana === 37) return ['Escucha el acorde y míralo en el pentagrama: es la triada de un grado de Do mayor.', 'Elige su nombre: Do, Rem, Mim, Fa, Sol, Lam o Si°.', 'Debajo aparece por qué: sus tres notas y si es mayor, menor o disminuido.'];
    if (app === 'acordes') return ['Escucha el acorde y míralo en el pentagrama.', 'Di qué inversión es, cuál es el acorde y cómo se escribe con barra.', 'Cambia de ejercicio arriba: practicar de varias maneras ayuda a recordarlo.'];
    if (app === 'modos') {
      var ej = MODOS_LECCION[semana];
      var primero = ej === 'ver' ? 'Mira la escala de teclas blancas y di <b>qué modo es</b> según la nota donde empieza.'
        : ej === 'caracteristica' ? 'Mira el modo en el pentagrama y elige su <b>nota característica</b>.'
        : 'Toca 🔊 Escuchar: suena un modo desde Do. Elige <b>qué modo es</b> de oído: primero ¿mayor o menor?, después su nota característica.';
      return [primero, 'Toca tu respuesta. Debajo aparece la regla.', 'Solo salen los modos que ya aprendiste, y el nuevo sale más seguido.' + (ins === 'piano' ? ' En «Toca el modo» lo tocas en el teclado.' : '')];
    }
    if (app === 'oido' && semana === 39) return ['Toca el botón grande: suena la casa (I) y después otro acorde.', 'Di cuál es: <b>I, IV, V o vi</b>. El vi suena menor; el V pide volver a casa.', 'Toca <b>Siguiente</b> y sigue hasta acertar 10.'];
    if (app === 'oido' && semana === 41) return ['Toca el botón grande: suena una progresión en menor (i – iv – V…).', 'Si termina en casa, en el acorde menor, es <b>reposo</b>: pon las manos en el pecho. Si pide seguir, es <b>tensión</b>.', 'Toca <b>Siguiente</b> y sigue hasta acertar 10.'];
    if (app === 'oido' && semana === 46) return ['Toca el botón grande: suena una melodía de 4 notas que empieza en Do.', 'Cántala y piensa: ¿sube o baja?, ¿paso o salto? Elige la melodía que sonó.', 'Escríbela en el pentagrama y tócala en tu instrumento.'];
    if (app === 'oido') return ['Toca el botón grande para <b>escuchar</b>.', 'Elige tu respuesta.', 'Toca <b>Siguiente</b> y sigue hasta acertar 10.'];
    return ['Resuelve todos los ejercicios aquí mismo.', 'Al terminar, toca <b>Revisar mis respuestas</b>: en <b>verde</b> lo que está bien y en <b>rojo</b> lo que no, con la respuesta correcta debajo.', 'Corrige y revisa otra vez, o toca <b>Otra hoja</b> para practicar con ejercicios nuevos.'];
  }
  function queNotas() {
    var lista = app === 'piano' ? notasPiano(semana) : app === 'violin' ? notasViolin(semana) : null;
    if (!lista || (especial && especial.tipo !== 'lectura')) return '';
    var vistos = [];
    lista.forEach(function (n) {
      var k = (typeof n === 'string' ? n : n[0]).charAt(0), alt = typeof n === 'string' ? (n.split(':')[1] || '') : (n[2] || '');
      var nom = NOMBRE[k] + (alt === '#' ? '♯' : alt === 'b' ? '♭' : '');
      if (vistos.indexOf(nom) < 0) vistos.push(nom);
    });
    return (semana >= 20 && semana <= 23 ? 'Hoy practicas solo las notas nuevas: <b>' : 'Hoy practicas solo las notas que ya conoces: <b>') + vistos.join(', ') + '</b>.';
  }

  /* ---------- Preparar cada app (se llama cuando la página ya terminó de cargar) ---------- */
  function preparar() {
    try {
      if (especial && especial.tipo !== 'lectura' && typeof prepararLeccion === 'function' && !(app === 'piano' && especial.tipo === 'tono')) { prepararLeccion(especial); return; }
      if (app === 'piano' && INTERVALOS[semana] && typeof seleccionarModo !== 'undefined') {
        if (semana === 26) intervalosTono = true;
        intervalosJuego = INTERVALOS[semana]; seleccionarModo('intervalos');
        var pi = document.getElementById('panel-modos'); if (pi) pi.style.display = 'none';
      }
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
      if (app === 'armaduras' && typeof prepararLeccion === 'function') prepararLeccion(semana === 33 ? 'bemoles' : 'sostenidos');
      if (app === 'modos' && typeof prepararLeccion === 'function') prepararLeccion(semana >= 53 ? Math.min(7, semana - 52) : 7, MODOS_LECCION[semana], ins);   // los modos aprendidos y el ejercicio de la lección
      if (app === 'acordes' && typeof prepararLeccion === 'function') prepararLeccion(semana === 37 ? 'grados' : 'inversiones');
      if (app === 'oido') { var m = document.getElementById('modos'); if (m) { m.style.display = 'none'; if (m.nextElementSibling && m.nextElementSibling.classList.contains('desliza')) m.nextElementSibling.style.display = 'none'; } }
    } catch (e) { /* si la app cambió, al menos se muestra la tarjeta */ }
  }
  function empezar() {
    try {
      if (especial && especial.tipo === 'lectura' && typeof abrirLectura === 'function') { abrirLectura(); return; }
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
      '<p class="lc-sem">' + NIVEL + '</p>' +
      '<h2 id="lc-titulo">' + para(g[0]) + '</h2>' +
      '<p class="lc-meta">Tu meta: ' + para(g[1]) + '</p>' +
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
    chip.textContent = NIVEL + ' · ¿Qué hago?';
    /* en la app de ritmo va en la fila de Dictado (abajo flotaría sobre las tarjetas); en las demás, abajo a la izquierda */
    var fila = app === 'ritmo' && document.querySelector('.panel-foot');
    chip.addEventListener('click', function () { mostrar(false); });
    if (fila) { chip.classList.add('en-fila'); chip.textContent = '¿Qué hago?'; fila.insertBefore(chip, fila.firstChild); } else document.body.appendChild(chip);
    mostrar(true);
  });
})();
