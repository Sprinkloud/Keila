# CLAUDE.md: página_Sprinkloud (repo Sprinkloud/Keila)

Sitio web público del Club Musical Sprinkloud, publicado en https://sprinkloud.vercel.app/ (Vercel despliega desde `main`). Es HTML estático, sin build: la plantilla "Spectral" de HTML5 UP (`assets/`) más páginas propias de teoría musical.

## Estructura

| Ruta | Qué es |
|---|---|
| `index.html`, `material.html`, `metodologia.html`, `musicband.html` | Páginas del sitio (plantilla Spectral, jQuery). |
| `practica/` | Herramientas interactivas, cada una en un solo HTML con su CSS y JS en línea: `practica/piano.html` (piano de 5 octavas y juego de notas en clave de Sol y Fa, con VexFlow 4.2.2), `practica/violin.html`, `practica/ritmo.html`, `practica/hojas.html` y `practica/oido.html`. |
| `images/` | Fotos y logos. `logo-sprinkloud.png` (1200×630, fondo blanco) es la imagen para compartir de las páginas que no tienen una propia. |
| `vercel.json` | Rutas limpias, redirecciones de las rutas viejas y encabezados de seguridad (ver "Rutas" y "Seguridad"). |
| `servidor-local.js` | Servidor para probar el sitio como en Vercel. No se publica (`.vercelignore`, igual que este archivo). |

## Material (`material.html`)

Dos columnas (en celular, una debajo de otra): **Práctico**, con las herramientas del sitio por instrumento (piano, violín, y piano y violín), y **Libros**, con los PDF de Google Drive. Por pedido de la dueña (22 de octubre de 2026) se quitaron "Sujetar el violín" y "Notas en el violín" (Genially) y se borró la página "Sonido & Notas"; su ruta redirige a `/material`. Era la única que usaba Tailwind, así que `cdn.tailwindcss.com` salió de la CSP.

## Rutas

Las rutas son cortas, en minúsculas, sin acentos, sin espacios y sin `.html` (`cleanUrls`), porque van en los mensajes de WhatsApp:

| Ruta | Archivo |
|---|---|
| `/`, `/material`, `/metodologia`, `/musicband` | páginas del sitio |
| `/practica/piano`, `/practica/violin`, `/practica/ritmo`, `/practica/oido`, `/practica/hojas` | herramientas |
| `/practica/hojas/violin/semana-2` | hoja de una semana (rewrite a `hojas.html`, que lee la ruta) |
| `/practica/ritmo/3-4` | app de ritmo en un compás (rewrite a `ritmo.html`) |
| `/practica/ritmo/latinos` | app de ritmo con la cumbia cargada a tempo 90, lista para dar play. Es el enlace que se manda a quien pide información (respuesta rápida `VApp` y agente de IA) |
| `/practica/oido/segundas-y-terceras` | entrenador en un ejercicio (rewrite a `oido.html`; los nombres están en `EJERCICIOS`) |

- Las páginas que se abren en rutas largas usan rutas absolutas para sus archivos (`/images/...`, `/practica/comprobante.js`). Una ruta relativa se rompería en `/practica/hojas/violin/semana-2`.
- Las rutas viejas (`/Teoría Musical/Ritmo.html`, `/metodología.html`, etc.) redirigen con 308 a las nuevas. Los parámetros viejos (`?semana=2&i=violin`, `?compas=3/4`, `?modo=…&nivel=…`) siguen sirviendo, y cada página cambia la barra de direcciones por la ruta limpia.
- `ritmo.html` tiene su propia variable `history` (el historial de ritmos), así que ahí se usa `window.history.replaceState`.
- El panel del maestro y el reporte de la familia (`Registro_Sprinkloud/maestros/`) arman estas mismas rutas. Si cambian aquí, hay que cambiarlas allá.

## Juego de notas del piano (`practica/piano.html`)

- `notasPiano`: las teclas de F2 a C6 (26 blancas). Las octavas 1 y 2 se muestran en clave de Fa y las 3 a 5 en clave de Sol. Con este rango, las líneas adicionales de la clave de Fa son solo las de arriba (Do4, Re4, Mi4) y las de Sol llegan hasta Do6.
- Orden de la página: barra con "Volver" y la marca en la otra esquina, título e intro cortos, mensaje y estrellas del juego, pentagrama, piano, y al final el panel del juego (iniciar, modos y acordes). Letras compactas; el pentagrama y el piano mantienen su tamaño.
- `modosJuego`: las notas de cada modo como `[tecla VexFlow, clave]`. Sol: líneas, espacios y líneas adicionales; Fa: lo mismo; `ambas` junta todas. Una nota de línea adicional puede mostrarse en la clave contraria a la de su tecla (por ejemplo Do4 en clave de Fa), por eso el acierto compara solo la altura (`vfKey`).
- El pentagrama doble se dibuja en 340 × 255, pero se muestra recortado con `viewBox="0 28 340 196"` (y `height="196"`): con el rango F2–C6 basta esa franja y el pentagrama se ve más grande (hasta 440 px de ancho) sin ocupar más alto.
- Los pentagramas empiezan en x = 28 para que la llave que une clave de Sol y clave de Fa no quede cortada. Las notas van centradas en cada pentagrama (`dibujarCentrada`), como en la app.
- Plicas con `auto_stem: true` (piano y violín): desde la línea del medio hacia arriba la plica va hacia abajo (Si4 en clave de Sol, Re3 en clave de Fa); por debajo, hacia arriba.
- Aspecto: el mismo sistema visual que la app de violín (tokens de `App_Sprinkloud/DESIGN.md`: papel, musgo, ocre, Fraunces, Caveat y Nunito Sans, con tema oscuro). El pentagrama y las teclas quedan siempre sobre papel claro.
- Tiene que funcionar en cualquier dispositivo. El teclado muestra tantas teclas blancas como quepan (unos 34 px cada una, de 7 a 31) y las flechas mueven una octava. Al elegir un modo se centra en sus notas; en el juego NO se mueve solo: el alumno busca la octava. Cada octava tiene un tinte crema (azulado en los graves, rosado en los agudos: `oct-1` a `oct-5`) y su nombre encima (`NOMBRE_OCTAVA`: 2 octavas abajo, 1 octava abajo, Octava central, 1 octava arriba, 2 octavas arriba). En computadora se ve completo y las flechas se ocultan. El pie de página no es fijo, los toques miden 44 px y el zoom está permitido.

## Violín virtual (`practica/violin.html`)

- **El mismo violín que la app** (pedido de la dueña): la imagen del mástil (`images/violin-mastil.webp` horizontal: `-h.webp`; copias de `App_Sprinkloud/assets/ilustraciones/`) y las notas en un SVG encima (`dibujarViolin`). Misma geometría que la app (`MASTIL`, `posiciones`): las notas siguen las cuerdas de la imagen y van pegadas una a la otra, de la cuerda al aire (encima de la cejilla) al semitono 10. Se toca la nota más cercana al dedo. La imagen nunca se deforma: solo se escala.
- Horizontal en pantallas de más de 760 px (voluta a la izquierda, Mi arriba y Sol abajo); vertical en celulares (Sol a la izquierda, Mi a la derecha). Al cruzar los 760 px se vuelve a dibujar.
- `mapaCuerdas`: las notas de cada cuerda por semitono (nombre, `vfKey`, alteración). Colores de cuerda iguales a los de la app: Sol `#9C5B55`, Re `#C4923A`, La `#647745`, Mi `#567388`.
- Marcas: por defecto solo van en color las notas de la escala de Do mayor (Do4 a Do5) en primera posición (`escalaDo`). "Todas las notas" colorea las naturales de la cuerda al aire al 3.er dedo (semitonos 0 a 5). Las demás van en crema pálido con su nombre. La nota tocada crece (1.3) con el color de su cuerda y un aro oscuro.
- `modosJuego`: Líneas, Espacios, Líneas adicionales (Sol3 a Do4 y La5 a Re6) y Todas, siempre en clave de Sol. El acierto vale en cualquier lugar del violín donde suene esa nota.
- El pentagrama se dibuja en 320 × 155 para que entren Sol3 y Re6 con sus líneas adicionales. La nota va centrada en el pentagrama, como en la app (`dibujarCentrada`: se dibuja en su propio grupo y se mueve al centro, entre la clave y el final).
- En computadora (900 px o más), `.fila-superior` pone el pentagrama a la izquierda y el panel del juego a la derecha; debajo va el violín, con un ancho según el alto de la pantalla (`100dvh - 520px`) para que todo entre sin scroll (probado en 1280×800). En celulares `.fila-superior` es `display: contents` y todo queda en una columna.

## Células rítmicas (`practica/ritmo.html`)

- App de pantalla completa: el `body` mide 100dvh (flex en columna, sin scroll de página) y reparte el alto entre `.app` y el pie de página, que es una sola línea delgada con los íconos y el copyright. Solo el lienzo tiene scroll propio cuando hay muchos compases. Incluye banco de células (Rítmicas, Largas, Silencios), partitura en compases de 4/4, reproducción con metrónomo y cuenta previa, y dictado rítmico.
- Estilo de la app con modo oscuro; cabecera con Volver, el título y la marca Sprinkloud.
- Las células **no tienen nombre**: sin sílabas ni etiquetas (en `CELLS` solo quedan `id`, `tab` y `notes`). Mientras suena, el círculo marca el pulso y la línea de texto queda vacía.
- Figuras en negro (`--figura`; en modo oscuro, blanco). El resaltado de lo que suena es suave: el compás toma un tinte ocre muy leve y la figura que suena cambia a ocre (sin brillo). Junto a un silencio se deja más aire (`need` 34) para que se lea cada medio pulso. Los compases no llevan el rótulo "Compás N": solo "faltan X" cuando están incompletos y su basurero. Las tarjetas de la paleta no tienen número ni flecha: al tocarlas se añade la célula y suena.
- Pocas opciones: metrónomo siempre activo y cuenta de 4 tiempos en cada play, también en el dictado (sin botones); un solo círculo (`#pulso`) muestra un reloj en reposo, la cuenta previa 1-2-3-4 y después el pulso. Sin frases de ayuda ni "Pulsa reproducir…". Controles: tempo, Repetir y el botón "Pizza"; cada compás tiene su basurero (`removeBar`). Ya no hay botón para borrar todo. Sin Deshacer, Vaciar, Marcar tempo ni barra de estado: los avisos salen en la línea de arriba (`flash`). Retroceso quita la última célula.
- Panel de tarjetas plegable (`plegarPanel`, asa "Tarjetas"): en computadora se pliega a una franja de 40 px a la izquierda; en celulares baja y queda solo el asa. El estado se guarda en `localStorage` (`sprinkloud-ritmo-v1-panel`) y el contenido plegado queda `inert`.
- **Modo pastel** (botón "Pizza"): la paleta muestra solo las células de un pulso (`esDeUnPulso`: 9 rítmicas y 3 de silencios) y oculta pestañas, ayuda y dictado. Al tocar una tarjeta, el lienzo muestra la pizza del club (`images/pizza.webp`, la misma de la app; `pastelHTML`) cortada en una parte por figura, proporcional a su duración, empezando a la izquierda y en el sentido del reloj (un cuarto = arriba a la izquierda); los silencios dejan el plato vacío con borde punteado. Con play, tras la cuenta de 4, la célula suena 4 veces (un compás) y se pinta en ocre la parte que suena y su figura. El botón "Pizza" es siempre celeste (`--celeste`; más oscuro cuando está activo) para que se note que es importante (`activate` con `data-sl`). En celulares el pastel y la figura van lado a lado.
- Las figuras suenan con un tono tipo piano sintetizado (`pianoVoice`): Do5 en el pulso y Sol4 a contratiempo.
- En celulares la paleta ocupa como máximo 38vh y la frase de ayuda se oculta, para que el lienzo sea lo más amplio posible.

## Hojas de práctica (`practica/hojas.html`)

Hojas de teoría para escribir: una por cada semana de la guía de Sprinkloud (48 semanas, ver `Registro_Sprinkloud/guia-teoria-musical.md`). Sirven para resolver en el dispositivo o para imprimir en A4.

**Datos y parámetros**
- `GUIA`: semana, etapa, tema y objetivo. Se copia de `Registro_Sprinkloud/Guia.js`, reemplazando el arreglo que sigue a `/*GUIA*/`. Si cambia la guía, hay que volver a copiarlo.
- Parámetros de la URL:
  - `?semana=N`;
  - `&i=piano|violin`: en piano se agrega la clave de fa;
  - `&v=N`: variante. "Otra hoja" suma 1 y genera otros ejercicios con la misma semilla, así que el mismo enlace muestra siempre la misma hoja.

**Ejercicios**
- Los tipos están en `T`:
  - notas: nombrar, dibujar (se toca el pentagrama), línea o espacio, sube o baja;
  - ritmo: sílabas (Kodály, Takadimi), duración, pulsos que faltan;
  - secuencias de notas, tono o semitono, intervalos;
  - escalas mayor y menor, armaduras, círculo de quintas;
  - triadas, qué acorde es, armonizar, grados, relativas, pentatónica, V7, inversiones;
  - términos.
- `ejerciciosDe(semana, instrumento)` dice qué lleva cada semana.
- **Solo ejercicios que se pueden resolver aquí y revisar** (pedido de la dueña, 23 de octubre de 2026). Se quitaron las preguntas abiertas con renglones ("dibuja un círculo…" en un cuadro de texto) y los pentagramas en blanco, que en el celular no se podían usar.
- **Semanas sin hoja:** `SIN_HOJA = [1, 38, 40, 43, 45, 48]` (pulso con el cuerpo, improvisar, dictado melódico, la forma, dos contra tres, componer). No tienen un ejercicio escrito lógico, así que la página muestra un aviso, el selector dice "(sin hoja)" y se ocultan Otra hoja, Imprimir y Revisar. Esas semanas se practican solo con su app. La misma lista está en `Registro_Sprinkloud/maestros/Maestro.html` y `Reporte.html`, que no mandan el enlace de la hoja en esas semanas.
- `el()` aplana los hijos con `flat(Infinity)`. Antes aplanaba un solo nivel, y las secuencias y escalas (semanas 9, 10, 22, 27, 28, 29 y 35) mostraban "[object HTMLSpanElement]" en vez de las notas y los campos.
- La teoría se calcula; no hay respuestas escritas a mano:
  - `arriba(nota, pasos de letra, semitonos)` deletrea bien cada nota;
  - `escala`, `triada` y `tipoGrado` salen de ahí.
- `distintos()` evita repetir preguntas dentro de una hoja.

**Revisar y mostrar respuestas**
- "Revisar" corrige cada respuesta:
  - `leerNota` acepta "re bemol", "Reb", "D♭" y "C#";
  - `leerAcorde` acepta "Rem", "re menor", "Si°" y "Si dim";
  - `leerNumero` acepta "0,5" y "1/2";
  - las sílabas se comparan sin espacios ni guiones.
- "Ver respuestas" muestra las soluciones, para el maestro o la familia.

**Impresión**
- Oculta los controles y muestra "Nombre" y "Fecha".
- Cada ejercicio indica si se escribe en hoja pautada o rayada.
- Los pentagramas y renglones quedan vacíos para escribir a mano.

**Probado (22 de octubre de 2026)**
- Las 48 semanas × 2 instrumentos × 3 variantes se arman sin errores.
- Las 938 soluciones se aceptan y "zzz" se rechaza.
- Sin desborde horizontal a 375 px en ninguna semana.
- El dibujo acierta en la línea o el espacio correcto.

VexFlow le pone ancho en línea al SVG. `pentagrama()` lo quita para que el CSS lo escale.

## Entrenador de oído (`practica/oido.html`)

Herramienta para el "minuto de oído" de la clase por videollamada. Se comparte en pantalla, con botones grandes y sin librerías externas: el piano está sintetizado con WebAudio, la misma voz de `practica/ritmo.html`.

**Ejercicios** (`MODOS`). Cada uno dice en qué semanas de la guía se usa:
- ¿Sube o baja? (semana 4).
- Intervalos (24 a 26), con nivel "segundas y terceras", "cuartas, quintas y octavas" o "todos", y forma melódica o armónica.
- ¿Mayor o menor? (30 y 35).
- Las 4 triadas (31).
- ¿Tensión o reposo? (33 y 46): una progresión I, IV o vi, V7 que termina en I (reposo) o en V (tensión).

**Cómo funciona**
- Después de responder, un teclado (`teclado()`) muestra qué notas sonaron, con su nombre.
- El marcador lleva aciertos, intentos y racha.
- Se puede abrir en un ejercicio con `?modo=intervalos&nivel=todos`.
- Atajos: espacio = escuchar, Enter = siguiente.
- Guarda el último ejercicio en `localStorage` (`sprinkloud-oido`).

**Probado (22 de octubre de 2026)**
- 75 preguntas: la respuesta correcta coincide con las notas que suenan.
- Sin errores de consola con la CSP.
- Sin desborde a 320, 390 y 1280 px.

## Comprobante de práctica (`practica/comprobante.js`)

Lo cargan las 5 apps de práctica: ritmo, oído, hojas, piano y violín virtuales.

**Minutos de práctica**
- Cuenta los minutos del día solo mientras la persona usa la app: pestaña visible y algún toque, tecla o cambio en el último minuto.
- Se guardan en el dispositivo (`sprinkloud-practica`).

**La camarita**
- Es un botón flotante que arma una imagen PNG de 1080×1350:
  - el nombre del alumno, que se pide una vez y se guarda en `sprinkloud-alumno`;
  - la fecha;
  - los minutos de hoy con una barra hacia la meta de 15;
  - la app y lo que hizo.
- En el celular se comparte con `navigator.share` (WhatsApp). Si no se puede, se guarda la imagen.

**Para que una página lo use**
- Define `window.SprinkloudPractica = { app, detalle(), subir? }` antes de cargar `practica/comprobante.js`.
- `subir` levanta el botón para que no tape controles; `practica/ritmo.html` lo usa en pantallas de 900 px o menos.
- Nada sale del dispositivo.

**Enlaces que abren cada app en su ejercicio:** `/practica/ritmo/3-4` y `/practica/oido/<ejercicio>` (ver "Rutas").

**Ritmos latinos** (`LATINOS` en `practica/ritmo.html`):
- salsa (clave 3-2), son (clave 2-3), reggaetón (dembow), cumbia, bachata, bolero;
- habanera y tango, sanjuanito;
- pasillo, vals criollo;
- huapango, son jarocho, joropo.

Están en la pantalla vacía y en la lista "Ritmos latinos…" del banco de tarjetas. Al elegir uno, la app cambia sola al compás que usa.

## Compases en la app de ritmo (`practica/ritmo.html`)

**Compases** (`COMPASES`): el selector "Compás", junto al tempo, ofrece 4/4, 3/4, 2/4 y 6/8.
- Cada compás define su largo y su pulso en negras.
- En 6/8 el pulso es la negra con puntillo: el tempo cuenta esos pulsos y la luz marca 1-2.
- `negraSeg()` convierte el tempo a segundos por negra.
- La cuenta previa es de un compás si tiene 3 o 4 pulsos, y de dos compases si tiene 2.
- Cambiar de compás vacía el ritmo.

**Tarjetas**
- En 6/8 se ven solo las tarjetas de la pestaña `seis`, sin pestañas: tres corcheas, negra con puntillo, negra y corchea, corchea y negra, blanca con puntillo, silencio de negra con puntillo, y silencio de corchea con negra.
- En los demás compases se ocultan las tarjetas más largas que el compás (`visibles()`).
- `beatsLabel` nombra las duraciones en pulsos del compás: en 6/8 la corchea es "⅓ de pulso".
- Los silencios con puntillo dibujan su punto.
- `EXAMPLES` tiene ejemplos por compás.
- El modo Pizza sigue siendo en negras.

## Estrellas del juego (piano y violín)

Mismo código en las dos páginas: 1 estrella con 5 aciertos, 2 con 4 aciertos seguidos y 3 con 6 aciertos seguidos (`contarEstrellas`). Un error corta la racha pero no quita estrellas. Se reinician al iniciar el juego o al cambiar de modo. Entre un acierto y la nota siguiente se ignoran los toques (`esperandoSiguiente`), para que tocar dos veces no cuente doble.

## Pie de página

El mismo en todas las herramientas: solo tres íconos pequeños (18 px, con área de toque de 44 px) de WhatsApp, Instagram y correo, y el copyright. Sin botones grandes ni más enlaces.

## Seguridad

El sitio es público y estático: no tiene servidor, formularios, llaves ni conexión con los sistemas internos (registro, panel de maestros, Meta). Así se mantiene.
- **`vercel.json` envía estos encabezados en cada página:**
  - **CSP:**
    - el código solo puede venir del sitio y de `cdn.jsdelivr.net`, `cdnjs.cloudflare.com` y `cdn.tailwindcss.com`;
    - los estilos, del sitio, de Google Fonts y de cdnjs;
    - la página no puede conectarse a ningún otro servidor (`connect-src 'self'`);
    - no se permiten formularios (`form-action 'none'`), marcos ni que otra página la meta en un marco.
  - HSTS, `nosniff`, `X-Frame-Options: DENY`, `Referrer-Policy` y `Permissions-Policy` (sin cámara, micrófono ni ubicación).
- **Si una herramienta nueva necesita otro CDN, una imagen externa o el micrófono,** hay que agregarlo a la CSP o a `Permissions-Policy`. Si no, el navegador lo bloquea sin avisar.
- **Librerías externas:** siempre con versión fija (nunca `@latest` ni sin versión) y con `integrity` (SRI) y `crossorigin="anonymous"`.
  - El CDN de Tailwind no envía CORS, así que lleva la versión fija pero sin SRI.
  - Para calcular el sello: `curl -sL <url> | openssl dgst -sha384 -binary | openssl base64 -A`.
- **Enlaces externos:** con `target="_blank" rel="noopener noreferrer"`.
- **Archivos fuera del repo:** `.gitignore` deja fuera `.idea/`, `.vscode/` y `src/`. Se quitaron del repo el 22 de octubre de 2026, porque `workspace.xml` tenía rutas de la computadora.
- **Historial revisado el 22 de octubre de 2026:** sin llaves, tokens ni contraseñas.

## SEO

- `robots.txt` y `sitemap.xml` en la raíz. Al agregar o cambiar una página, se suma o se actualiza su `<url>` con su `lastmod` en el sitemap (con la ruta limpia, por ejemplo `/practica/ritmo`).
- Cada herramienta lleva: `<title>` de 60 caracteres como máximo que diga qué es, `description` de 155 como máximo, `link rel="canonical"`, Open Graph y Twitter (`name="twitter:..."`), imagen del mismo dominio, un solo `h1` que describa la herramienta (la marca va aparte) y datos estructurados JSON-LD (`WebApplication` y `BreadcrumbList`). Modelo: `practica/piano.html`.
- Enfocar título, descripción, `h1` y JSON-LD en lo que la gente busca (por ejemplo "aprender figuras musicales y ritmo", no "células rítmicas"). En `practica/ritmo.html` las tarjetas no muestran nombres, pero su `aria-label` describe las figuras (`describirCelula`: "dos corcheas", "negra con puntillo"…) para lectores de pantalla y buscadores.
- El sitio debe estar dado de alta en Google Search Console con el sitemap enviado.

## Probar en local

`node servidor-local.js` desde la raíz del repo y abrir `http://localhost:8010/practica/piano`. Aplica las mismas rutas y encabezados que Vercel; `python -m http.server` no entiende las rutas limpias.

## Cuidado en Windows

El repo tiene `images/Ritmo.jpg` e `images/ritmo.jpg`, que en Windows chocan (el sistema no distingue mayúsculas). Git siempre mostrará `images/Ritmo.jpg` como modificado: no hay que incluirlo en los commits.

## Convenciones

- Idioma: español.
- Commit y push solo cuando la dueña lo pida.

## Historial de cambios

### 22 de octubre de 2026: hojas de práctica, seguridad y SEO

- **Nueva:** `practica/hojas.html`, con las hojas de práctica de las 48 semanas de la guía.
- **Se eliminó `Pentagrama.html`,** por pedido de la dueña. Además estaba rota: sus dos copias de VexFlow daban 404 y usaba `vexflow.Flow`.
- **Seguridad:** `vercel.json`, librerías con versión fija y SRI, y `.gitignore`. Se quitaron `.idea/` y `src/` del repo.
- **Portada:** "Empieza ahora" y "Habla con un asesor" van directo a WhatsApp con el mensaje "Hola, quiero información sobre las clases de música 🎶". Antes iban a beacons.ai, donde estaba el cuestionario.
- **Pie de página:**
  - se arreglaron los enlaces `https://https://wa.me` (tenían el ícono de Twitter);
  - quedaron WhatsApp, Instagram y correo;
  - el copyright dice "Club musical Sprinkloud".
- **Se quitaron:**
  - `fbq('track','Contact')`, que daba error porque el píxel de Meta no está instalado;
  - el formulario comentado de `material.html` (`send.php` no funciona en Vercel).
- **SEO en index, material, metodología y music band:**
  - `lang="es"`;
  - título y descripción enfocados en "clases de piano y violín online";
  - canónica, Open Graph y Twitter con una imagen que existe;
  - JSON-LD: `EducationalOrganization` con los cursos de piano y violín, y `WebSite`.
- **`practica/sonidos-y-notas.html`:** su canónica apuntaba a `tusonidoynotas.com`, así que Google no la mostraba como página del sitio. Además mencionaba guitarra.
- **Probado** con los encabezados de `vercel.json` en un servidor local: las 9 páginas a 1280 y 390 px, sin errores de consola ni desbordes.

### 29 de septiembre de 2026: piano, violín y células rítmicas renovados

Publicado en https://sprinkloud.vercel.app/ (commits `3f6277f` en adelante, en `main`).

**Proyecto**
- Se clonó el repo en `D:\Proyectos_Claude\página_Sprinkloud`, se creó este `CLAUDE.md` y se registró en el índice del workspace.

**Piano (`practica/piano.html`)**
- Modos de juego: clave de Sol (líneas, espacios, líneas adicionales), clave de Fa (lo mismo) y ambas claves.
- El mensaje del juego ya no dice el nombre de la nota: "Toca esta nota en el piano".
- Aspecto de la app de violín: papel crema, musgo y ocre, Fraunces, Caveat y Nunito Sans, tema oscuro y sin emojis.
- Funciona en cualquier dispositivo: el teclado muestra por tramos las teclas que caben, con flechas de octava; el pentagrama se achica con la pantalla.
- Octavas con tinte crema (azulado en los graves, rosado en los agudos) y su nombre encima: "2 octavas abajo" … "Octava central" … "2 octavas arriba".
- En el juego el teclado ya no se mueve solo hacia la nota: el alumno busca la octava.
- Rango de F2 a C6 (26 teclas blancas).
- Orden: "Volver" y la marca Sprinkloud en la misma fila; título corto; mensaje y estrellas; pentagrama y piano primero; al final el panel del juego (modos y acordes). Letras compactas para no hacer scroll.
- SEO: título, descripción, URL canónica, Open Graph, datos estructurados y un `h1` que describe la herramienta.

**Violín (`practica/violin.html`)**
- Aspecto de la app, con los colores de cuerda de la app.
- Modos de juego en clave de Sol: Líneas, Espacios, Líneas adicionales y Todas.
- En celulares el violín se pone vertical (Sol, Re, La, Mi de izquierda a derecha); en computadora es horizontal (Mi arriba, Sol abajo).
- Por defecto solo van en color las notas de la escala de Do mayor en primera posición. "Todas las notas" marca las naturales de la primera posición hasta el 3.er dedo.
- Violín: la misma imagen y las mismas notas pegadas que la app.
- Se corrigieron 9 notas naturales que estaban marcadas como alteradas en `mapaCuerdas`.
- Marca Sprinkloud en la esquina, junto a "Volver", y encabezado compacto.
- La nota que se toca se agranda con el color de su cuerda y un aro oscuro (ya no se pinta de ocre, que se confundía con la cuerda Re); igual en las cuerdas al aire.
- En computadora: pentagrama y juego lado a lado; el violín mantiene su proporción real y en pantallas grandes crecen las notas y sus nombres.
- SEO igual que el piano.

**Piano y violín**
- Estrellas: 1 con 5 aciertos, 2 con 4 aciertos seguidos y 3 con 6 aciertos seguidos, con sonido y animación al ganar cada una.
- Tocar dos veces la misma tecla ya no cuenta doble.
- Pie de página con tres íconos pequeños (WhatsApp, Instagram, correo) y el copyright.

**Células rítmicas (`practica/ritmo.html`)**
- Estilo de la app, marca Sprinkloud en la esquina y pie de página en una línea; la página cabe en la pantalla sin scroll (solo el lienzo se desplaza).
- Células sin nombre: sin sílabas ni etiquetas ni números; las tarjetas solo muestran la figura y su duración, sin flecha (al tocarlas se añade la célula y suena).
- Figuras en negro; la que suena cambia a ocre y el compás toma un tinte ocre muy suave. Sin el rótulo "Compás N".
- Metrónomo y cuenta de 4 tiempos siempre, en cada play y en el dictado. Un solo círculo: reloj en reposo, cuenta 1-2-3-4 y después el pulso.
- Sonido tipo piano para las figuras.
- Controles mínimos: tempo, Repetir y Pizza; basurero en cada compás. Se quitaron Marcar tempo, Metrónomo, Cuenta previa, Deshacer, Vaciar, el basurero general, la barra de estado y las frases de ayuda.
- Más aire junto a los silencios (silencio de corchea + corchea se lee como medio pulso y medio pulso).
- Panel de tarjetas plegable en computadora y en celular.
- Modo pastel (botón celeste): solo las células de un pulso; al elegir una, el lienzo muestra la pizza del club con sus partes (de izquierda a derecha, como el reloj) y con play se pinta en ocre la parte que suena.
- SEO enfocado en "aprender figuras musicales y ritmo", con descripción oculta de las figuras de cada tarjeta para buscadores y lectores de pantalla.

**Sitio**
- Nuevos `robots.txt` y `sitemap.xml` en la raíz.

**Pendiente**
- Dar de alta el sitio en Google Search Console, verificar la propiedad y enviar `sitemap.xml` (lo hace la dueña con su cuenta; si Google entrega un archivo o etiqueta de verificación, se agrega al sitio).
- Las páginas de la plantilla todavía tienen el estilo y el SEO anteriores.
