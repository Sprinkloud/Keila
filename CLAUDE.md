# CLAUDE.md: página_Sprinkloud (repo Sprinkloud/Keila)

Sitio web público del Club Musical Sprinkloud, publicado en https://sprinkloud.vercel.app/ (Vercel despliega desde `main`). Es HTML estático, sin build: la plantilla "Spectral" de HTML5 UP (`assets/`) más páginas propias de teoría musical.

## Estructura

| Ruta | Qué es |
|---|---|
| `index.html`, `material.html`, `metodologia.html`, `musicband.html` | Páginas del sitio (plantilla Spectral, jQuery). |
| `practica/` | Herramientas interactivas, cada una en un solo HTML con su CSS y JS en línea: `practica/piano.html` (piano de 5 octavas y juego de notas en clave de Sol y Fa, con VexFlow 4.2.2), `practica/violin.html`, `practica/ritmo.html`, `practica/hojas.html`, `practica/oido.html` y `practica/partituras.html`. |
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
| `/practica/hojas/violin/etapa-1-leccion-2` | hoja de una lección (rewrite a `hojas.html`, que lee la ruta). La vieja `/semana-2` también sirve |
| `/practica/ritmo/3-4` | app de ritmo en un compás (rewrite a `ritmo.html`) |
| `/practica/ritmo/latinos` | app de ritmo con la cumbia cargada a tempo 90, lista para dar play. Es el enlace que se manda a quien pide información (respuesta rápida `VApp` y agente de IA) |
| `/practica/oido/segundas-y-terceras` | entrenador en un ejercicio (rewrite a `oido.html`; los nombres están en `EJERCICIOS`) |
| `/practica/partituras/<id>` | una partitura de la biblioteca (rewrite a `partituras.html`, que lee el id de la ruta) |

- Las páginas que se abren en rutas largas usan rutas absolutas para sus archivos (`/images/...`, `/practica/comprobante.js`). Una ruta relativa se rompería en `/practica/hojas/violin/semana-2`.
- Las rutas viejas (`/Teoría Musical/Ritmo.html`, `/metodología.html`, etc.) redirigen con 308 a las nuevas. Los parámetros viejos (`?semana=2&i=violin`, `?compas=3/4`, `?modo=…&nivel=…`) siguen sirviendo, y cada página cambia la barra de direcciones por la ruta limpia.
- `ritmo.html` tiene su propia variable `history` (el historial de ritmos), así que ahí se usa `window.history.replaceState`.
- El panel del maestro y el reporte de la familia (`Registro_Sprinkloud/maestros/`) arman estas mismas rutas. Si cambian aquí, hay que cambiarlas allá.

## Juego de notas del piano (`practica/piano.html`)

- **Teclado de una octava y una quinta** (26-oct-2026): solo Do4 a Sol5, 12 blancas (`TECLADO_DESDE` / `TECLADO_HASTA`, `enTeclado`).
  - La dueña lo pidió porque con tantas octavas los alumnos se confundían y en el celular no cabía.
  - Entran todos los acordes de tres notas. En los de cuatro (7), la nota que pasaría de Sol5 suena una octava más abajo (`obtenerNotasAcorde`). Los acordes funcionan en cualquier tecla.
  - **En el juego cuenta el nombre de la nota** (la letra de `vfKey`), no la octava. Si la nota del pentagrama está en otra octava que la tecla tocada, al acertar sale un recordatorio pequeño (`recordarOctava`, `#recordatorio-octava`), por ejemplo: «En el piano real, este Sol va 1 octava más arriba».
  - Con teclas de 24 px como mínimo entran las 12 en un celular de 360-390 px. En pantallas más angostas vuelven las flechas.
- `notasPiano`: sigue teniendo de F2 a C6, porque el pentagrama muestra notas de todo ese rango. Las octavas 1 y 2 se muestran en clave de Fa y las 3 a 5 en clave de Sol. Con este rango, las líneas adicionales de la clave de Fa son solo las de arriba (Do4, Re4, Mi4) y las de Sol llegan hasta Do6.
- Orden de la página: barra con "Volver" y la marca en la otra esquina, título e intro cortos, mensaje y estrellas del juego, pentagrama, piano, y al final el panel del juego (iniciar, modos y acordes). Letras compactas; el pentagrama y el piano mantienen su tamaño.
- `modosJuego`: las notas de cada modo como `[tecla VexFlow, clave]`. Sol: líneas, espacios y líneas adicionales; Fa: lo mismo; `ambas` junta todas. Una nota de línea adicional puede mostrarse en la clave contraria a la de su tecla (por ejemplo Do4 en clave de Fa), por eso el acierto no depende de la clave. Desde el 26-oct-2026 compara solo el nombre de la nota (ver arriba).
- El pentagrama doble se dibuja en 340 × 255, pero se muestra recortado con `viewBox="0 28 340 196"` (y `height="196"`): con el rango F2–C6 basta esa franja y el pentagrama se ve más grande (hasta 440 px de ancho) sin ocupar más alto.
- Los pentagramas empiezan en x = 28 para que la llave que une clave de Sol y clave de Fa no quede cortada. Las notas van centradas en cada pentagrama (`dibujarCentrada`), como en la app.
- Plicas con `auto_stem: true` (piano y violín): desde la línea del medio hacia arriba la plica va hacia abajo (Si4 en clave de Sol, Re3 en clave de Fa); por debajo, hacia arriba.
- Aspecto: el mismo sistema visual que la app de violín (tokens de `App_Sprinkloud/DESIGN.md`: papel, musgo, ocre, Fraunces, Caveat y Nunito Sans, con tema oscuro). El pentagrama y las teclas quedan siempre sobre papel claro.
- Tiene que funcionar en cualquier dispositivo. El teclado muestra tantas teclas blancas como quepan (24 px cada una como mínimo, de 7 a 12) y las flechas mueven una octava. Al elegir un modo se centra en sus notas; en el juego NO se mueve solo: el alumno busca la octava. Cada octava tiene un tinte crema (azulado en los graves, rosado en los agudos: `oct-1` a `oct-5`) y su nombre encima (`NOMBRE_OCTAVA`: 2 octavas abajo, 1 octava abajo, Octava central, 1 octava arriba, 2 octavas arriba). En computadora se ve completo y las flechas se ocultan. El pie de página no es fijo, los toques miden 44 px y el zoom está permitido.

## Violín virtual (`practica/violin.html`)

- **El mismo violín que la app** (pedido de la dueña): la imagen del mástil (`images/violin-mastil.webp` horizontal: `-h.webp`; copias de `App_Sprinkloud/assets/ilustraciones/`) y las notas en un SVG encima (`dibujarViolin`). Misma geometría que la app (`MASTIL`, `posiciones`): las notas siguen las cuerdas de la imagen y van pegadas una a la otra, de la cuerda al aire (encima de la cejilla) al semitono 10. Se toca la nota más cercana al dedo. La imagen nunca se deforma: solo se escala.
- Horizontal en pantallas de más de 760 px (voluta a la izquierda, Mi arriba y Sol abajo); vertical en celulares (Sol a la izquierda, Mi a la derecha). Al cruzar los 760 px se vuelve a dibujar.
- `mapaCuerdas`: las notas de cada cuerda por semitono (nombre, `vfKey`, alteración). Colores de cuerda iguales a los de la app: Sol `#9C5B55`, Re `#C4923A`, La `#647745`, Mi `#567388`.
- Marcas: por defecto solo van en color las notas de la escala de Do mayor (Do4 a Do5) en primera posición (`escalaDo`). "Todas las notas" colorea las naturales de la cuerda al aire al 3.er dedo (semitonos 0 a 5). Las demás van en crema pálido con su nombre. La nota tocada crece (1.3) con el color de su cuerda y un aro oscuro.
- `modosJuego`: Líneas, Espacios, Líneas adicionales (Sol3 a Do4 y La5 a Re6) y Todas, siempre en clave de Sol. El acierto vale en cualquier lugar del violín donde suene esa nota.
- El pentagrama se dibuja en 320 × 155 para que entren Sol3 y Re6 con sus líneas adicionales. La nota va centrada en el pentagrama, como en la app (`dibujarCentrada`: se dibuja en su propio grupo y se mueve al centro, entre la clave y el final).
- En computadora (900 px o más), `.fila-superior` pone el pentagrama a la izquierda y el panel del juego a la derecha; debajo va el violín, con un ancho según el alto de la pantalla (`100dvh - 520px`) para que todo entre sin scroll (probado en 1280×800). En celulares `.fila-superior` es `display: contents` y todo queda en una columna.

## Afinador de violín (`practica/afinador.html`, ruta `/practica/afinador`)

Pedido de la dueña (28 de octubre de 2026): que alguien que nunca afinó un violín pueda hacerlo solo. Está enlazado en Material, en la columna de violín.
- **Imagen:** el violín de la dueña (`images/violin-partes.webp`, una copia de `App_Sprinkloud/assets/ilustraciones/`), con un SVG encima. **Siempre se ve solo el diapasón de cerca** (`VISTA` = `96 80 232 300`: clavijas, cejilla y la parte de las cintas). La dueña lo pidió así porque en el celular, donde más se usa, el violín entero se veía chico. El nombre de cada cuerda va en vertical, abajo, con su color.
  - Medidas de la imagen (424 × 1064): cejilla en y = 187 y puente en y = 735.
  - Cuerdas de izquierda a derecha: Sol, Re, La y Mi.
  - Clavijas: Re arriba a la izquierda, Sol abajo a la izquierda, La arriba a la derecha y Mi abajo a la derecha (`CUERDAS`).
  - El dibujo tiene afinador fino solo en la cuerda Mi, abajo en el cordal (fuera de la vista). La ayuda lo explica con texto.
- **Libre, sin lección** (pedido de la dueña, 28-oct): el alumno elige qué cuerda afinar entre 4 botones grandes, cada uno con el color de su cuerda (Sol, la más gruesa; Re, la 2.ª; La, la 3.ª; Mi, la más delgada). Cuando la cuerda queda afinada, su botón muestra «✓ afinada». El micrófono se enciende con el primer toque.
  - **Medidor:** **a la izquierda lo grave, en color frío (`--frio`), y a la derecha lo agudo, en color cálido (`--calido`)**. Cada extremo dice qué hacer y debajo, en chico, «grave» o «agudo»: «Ajusta ⬆» a la izquierda y «Afloja ⬇» a la derecha. En las cintas, los extremos dicen solo «Caracol» a la izquierda (grave) y «Puente» a la derecha (agudo), como pidió la dueña: deslizar hacia el puente sube el sonido y hacia el caracol lo baja. El aviso grande toma el mismo color.
  - **Arriba no hay explicaciones** (pedido de la dueña, 28-oct): solo la elección de cuerda, el botón de cintas, el medidor, la nota que suena (sin Hz), «Te escucho», el aviso y una línea corta («Con la clavija, muy poquito» o «Con el afinador fino»). No se dice «pizzicato», porque con el dedo el micrófono casi no oye; las ayudas hablan del arco. **Todas las explicaciones van en las pestañas de abajo**: las cuerdas, ajustar o aflojar, cómo se lee el medidor, cómo girar la clavija y el afinador fino, dónde van las cintas, cómo ponerlas y qué hacer si no escucha. Esas mismas 7 preguntas están en el `FAQPage` del JSON-LD.
  - **Qué dice:**
    - si suena otra cuerda, el nombre de la que suena y dónde está la elegida;
    - «Ajusta» o «Afloja», con la clavija si está a más de 50 cents y con el afinador fino si está cerca (el afinador fino ajusta a la derecha ↻);
    - al terminar cada toque, `finDeGolpe` compara con el anterior y dice «¡Vas bien!» o «Se alejó: gira hacia el otro lado». No se da el sentido de giro de la clavija: el alumno lo descubre con esa tendencia.
  - **Cuándo cuenta como afinada:** ±6 cents en 6 lecturas seguidas.
- **Cintas:** botón «✨ Poner las cintas», con un brillo que gira alrededor para que den ganas de tocarlo. Es un borde `conic-gradient` animado con `@property --giro`, y la chispa titila; con movimiento reducido, todo queda quieto.
  - Cinta 1 = Si (dedo 1), cinta 2 = Do (dedo 2) y cinta 3 = Re (dedo 3), en la cuerda La. La explicación está en las pestañas de abajo, no en el botón.
  - **Las cintas 1 y 2 van juntas, pegadas**, porque entre Si y Do (igual que entre Mi y Fa) los dedos se tocan. La dueña lo pidió así para que el alumno no deje espacio entre los dedos 1 y 2. En el dibujo, la cinta 2 va pegada a la 1 (`ANCHO_CINTA` = 12, más ancha que antes) y la cinta 3 va en Re (semitono 5).
  - Se elige la cinta con chips. En el diapasón se ven las 3 cintas, con un círculo donde va el dedo y una flecha.
  - **Qué dice:** «Desliza hacia el puente» si suena grave y «Desliza hacia el caracol» si suena agudo; en la barra, «Al puente ⬇» y «Al caracol ⬆». Cuando la nota da, avisa que se pegue la cinta derecha, de lado a lado (±10 cents en 5 lecturas).
- **Detección (para que el dispositivo sí escuche el violín):**
  - La nota la saca **pitchy 4.1.0** (MIT, github.com/ianprime0509/pitchy, método McLeod), copiado en `practica/vendor/pitchy.js`, con su dependencia **fft.js 4.0.4** (MIT) en `practica/vendor/fft.js`. Va copiado en el sitio, sin depender de un CDN.
  - Se carga con `<script type="module">` y queda en `window.PitchDetector`. Una lectura vale si la claridad es de 0,88 o más. Si pitchy no cargara, queda la autocorrelación propia como respaldo.
  - El micrófono se pide sin cancelación de eco, sin supresión de ruido y sin control de ganancia. Si el navegador no lo acepta, se pide el micrófono normal.
  - Antes de analizar pasa por un filtro pasa altos de 120 Hz, que quita el zumbido.
  - Escucha muy bajito: el umbral es de 0,0015 RMS, porque el pizzicato suena poco.
  - Usa la mediana de las últimas 5 lecturas. Corrige la octava de arriba o de abajo (±1200 cents).
  - Al volver a la página, reanuda el audio (`visibilitychange`), porque el celular lo suspende.
  - **Barra «🎤 Te escucho»:** muestra el nivel del micrófono.
  - Si no oye nada en 7 s, aparece «No te escucho bien»: acercar el celular a un palmo, tocar más fuerte y no tapar el micrófono.
- **SEO:**
  - título, descripción de 143 caracteres, canonical, Open Graph y Twitter;
  - una frase de introducción visible;
  - la sección «Cómo afinar el violín», con 4 preguntas plegables;
  - JSON-LD con `WebApplication`, `BreadcrumbList` y `FAQPage` con esas mismas preguntas;
  - entrada en el `sitemap.xml`.
- **«Escuchar la nota»:** suena un tono de referencia de 2 s.
- **Cómo se probó:** con un oscilador en lugar del micrófono (`getUserMedia` reemplazado en Playwright), a 1280 × 800 y a 390 × 844, sin desplazamiento horizontal. Se probaron las 4 cuerdas afinadas, un tono a volumen 0,008 (se detecta) y el silencio (a los 7 s sale el consejo). Falta probarlo con un violín de verdad.

## Células rítmicas (`practica/ritmo.html`)

- App de pantalla completa: el `body` mide 100dvh (flex en columna, sin scroll de página) y reparte el alto entre `.app` y el pie de página, que es una sola línea delgada con los íconos y el copyright. Solo el lienzo tiene scroll propio cuando hay muchos compases. Incluye banco de células (Rítmicas, Largas, Silencios), partitura en compases de 4/4, reproducción con metrónomo y cuenta previa, y dictado rítmico.
- Estilo de la app con modo oscuro; cabecera con Volver, el título y la marca Sprinkloud.
- Cada célula muestra su sílaba de la guía (`SILABAS`, botón «Sílabas» para ocultarlas). Mientras suena, el círculo marca el pulso y la línea de texto queda vacía.
- **Consigna** (`.consigna`, 26-oct-2026), una franja ocre entre los controles y la partitura: «👏 Crea tu ritmo con las tarjetas, dale ▶ y palméalo a tiempo: una palmada en cada nota cuando se ilumina». La dueña la pidió porque los alumnos no entendían que tienen que palmear a tiempo. Es la única frase de ayuda fija de la app, y en modo Pizza se oculta.
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

## Partituras con acordes (`practica/partituras.html`)

App pública (pedido de la dueña, 23 de octubre de 2026) para ver canciones de dos formas: **notas** (los nombres Do, Re, Mi en recuadros por compás, cada uno del ancho de lo que dura) o **partitura** (pentagrama con VexFlow, clave de sol y armadura). Para piano y violín.

**25 de octubre de 2026, por pedido de la dueña:**
- Se quitó el editor ("Escribir o editar la partitura") por ahora; su código está en el historial de git (commit `a33e1ab`). Sin editor tampoco se guarda nada desde la página; la biblioteca de la hoja se sigue leyendo.
- Abre en la vista **Notas**; el botón "Notas | Partitura" va primero.
- Los acordes se ven siempre (se quitó "Con / Sin acordes").
- Solo botones, sin textos alrededor: cada control tiene su nombre en `aria-label` para lectores de pantalla.

**Ver**
- Tonalidad: se transpone desde la tonalidad original con `mover(nota, pasos de letra, semitonos)`, la misma idea que `arriba()` de las hojas, así que cada nota queda bien deletreada; `simplificar()` evita dobles alteraciones. Se mueve hacia el lado más cercano (máximo 6 semitonos).
- Acordes: en letras (C, Am, G7) sobre la nota donde cambian; en el pentagrama son `VF.Annotation`.
- Las alteraciones se dibujan según la armadura y lo que ya se alteró en el compás (`armadura()`, becuadro cuando hace falta).
- Escuchar: WebAudio, melodía en triángulo y el acorde suave por debajo; en la vista de notas se ilumina la que suena.

**Canciones del club** (`CANCIONES`): 28 en total, todas tradicionales o clásicas (dominio público), porque la app es pública.
- 23 de octubre de 2026: 10 en Do mayor y 10 en Sol mayor (infantiles, villancicos y tradicionales).
- 25 de octubre de 2026: 8 clásicas famosas que suenan en películas, series y videojuegos: Para Elisa, En la gruta del rey de la montaña, Quinta sinfonía, Pequeña serenata nocturna, Marcha turca, Greensleeves, Korobéiniki (la música del Tetris) y Marcha fúnebre de Chopin (La menor y Do menor; `leerCancion()` acepta `C`, `G`, `Am` y `Cm`).
- **No van canciones con derechos de autor:** la dueña pidió cumbias argentinas, Disney, bachatas y bandas sonoras, pero publicar sus melodías en una página abierta expone al club a reclamos. Feliz Navidad, Mi burrito sabanero y Cielito lindo (en México los derechos duran 100 años después del autor) tampoco.
- Solo se agregan melodías que se puedan escribir con seguridad; mejor menos y correctas.
- **Todas son covers** (pedido de la dueña, 25 de octubre de 2026): `AUTORES` da el autor original de cada una (`[texto, es una persona]`). La hoja dice "Cover · original de Ludwig van Beethoven" o "Cover · canción tradicional francesa"; las tarjetas de la biblioteca también. Decir "cover" da crédito, pero no da permiso para publicar canciones con derechos de autor: la regla de dominio público sigue.

**Pendiente: covers con derechos de autor en MuseScore** (acordado el 25 de octubre de 2026, por probar). Las canciones con derechos (cumbias, Disney, bachatas, bandas sonoras) no van en esta app. Se arreglan a partir de un audio, se escriben en MusicXML, la dueña los revisa y los sube a una cuenta del club en MuseScore, que tiene licencia con las editoriales. Aquí solo va una sección "Covers del club en MuseScore" con enlaces; para incrustarlos hay que permitir `frame-src` de musescore.com en la CSP.

**SEO de las canciones** (25 de octubre de 2026)
- Cada canción es una página para Google: `seo()` pone título ("Para Elisa – cover fácil para piano y violín | Sprinkloud"; sin "| Sprinkloud" si pasa de 65 caracteres), descripción, canónica, Open Graph y una ficha `MusicComposition` (JSON-LD, con `composer` si el autor es una persona).
- La portada `/practica/partituras` muestra la primera canción pero conserva su dirección y su SEO.
- La canónica y `og:url` no van fijas en el HTML: con una fija, Google tomaría todas las canciones como copias de la portada.
- Las tarjetas de la biblioteca son enlaces (`<a href="/practica/partituras/<id>">`) que Google puede seguir.
- Las 28 canciones están en `sitemap.xml`. Al agregar una canción, sumarla al sitemap.
- Van en el código, en un formato corto: `[Acorde]Nota+octava:duración` (por ejemplo `[G7]B4:8.`), `r` = silencio, `.` = puntillo, `|` separa compases. `leerCancion()` las convierte. `ana` = anacrusa en negras (Cumpleaños feliz, Oh Susana, Cuando los santos…).
- Se abren por su nombre (`/practica/partituras/noche-de-paz`) y salen primero en la biblioteca, aunque la hoja esté vacía o sin conexión. Si un maestro guarda una, queda como copia suya en la hoja.
- Al agregar una, revisar que cada compás sume lo que pide el compás (el primero suma la anacrusa) y que el rango no baje de Sol3, la nota más grave del violín.

**Biblioteca** (hoja "Partituras" de la planilla del sistema)
- La API es el proyecto de maestros de Apps Script (`Registro_Sprinkloud/maestros`, sección 8): `?api=partituras` (lista pública), `?api=partitura&id=` (una) y `POST` con `{accion: "guardarPartitura", clave, partitura}`. El POST va como `text/plain` para no disparar el permiso CORS.
- Guardar exige la clave de un maestro: el maestro pega el enlace de su panel (`?m=...`) una vez y queda en `localStorage` (`sprinkloud-maestro-clave`). Si la clave deja de valer, se borra y se vuelve a pedir.
- Si un maestro guarda una partitura de otro, se guarda como copia suya; la original no cambia.
- El servidor valida todo (listas cerradas de compases, duraciones y tipos de acorde, notas de 0 a 6 con octava 2 a 7, máximo 800 notas) y descarta cualquier campo que no conozca.
- La CSP permite `connect-src` a `script.google.com` y `script.googleusercontent.com` solo por esta app.



## Las apps van a juego con la guía (23 de octubre de 2026)

Pedido de la dueña: lo que se enseña en la guía tiene que verse igual en las apps.
- **Sílabas en la app de ritmo** (`SILABAS` en `practica/ritmo.html`): cada célula muestra debajo su sílaba, la misma de la guía y de las hojas (`C` en `practica/hojas.html`). Kodály para lo básico (ta = negra, ti-ti = dos corcheas, sh = silencio, ta-a = blanca, ta-i = negra con puntillo) y Takadimi para semicorcheas, tresillos y 6/8 (ta-ka-di-mi, ta di-mi, ta-ka di, ta-ki-da). Se ven en las tarjetas y en la partitura, también en los ritmos latinos. El botón "Sílabas" las oculta y se recuerda en `localStorage`. Si se agrega una célula, hay que darle su sílaba.
- **Tambor «Toca en cada nota»** (29 de octubre de 2026) en la app de ritmo, debajo de Reproducir, con el botón esponjoso de la app del bosque. En vez de palmear, el alumno toca el tambor en cada nota mientras suena: `golpeRitmo()` compara el golpe con la nota más cercana (±130 ms, `VENTANA`) y la pinta en verde si fue a tiempo. Cuenta al presionar (`pointerdown`), y también vale cualquier tecla mientras suena (menos Espacio, que sigue siendo reproducir/detener, Escape y Tab). Al terminar dice «X de N notas a tiempo»; con Repetir cuenta las vueltas. Sin reproducir, avisa que primero hay que dar ▶.
- En la app de ritmo, en pantallas anchas, las opciones pasan a una segunda fila si no entran (`.transport` con `flex-wrap`); antes se salían de la pantalla.
- **Lectura hablada (Dandelot)** en el piano y el violín virtuales (`practica/lectura.js`, compartido): 8 notas del modo elegido, cuenta de 4, un marcador avanza una nota por pulso y el alumno dice los nombres sin parar; "Ver nombres" los muestra en una fila debajo del pentagrama. En el piano, con "Ambas claves" se elige al azar clave de sol o de fa. Se abre con `SprinkloudLectura.abrir({ clave, notas })`.
- **Micrófono** (25 de octubre de 2026): botón "🎤 Micrófono" en la lectura hablada, solo si el navegador tiene reconocimiento de voz (`SpeechRecognition`: Chrome, Edge y Safari; en Firefox no aparece). Al encenderlo se pide el permiso. Durante la lectura escucha en español (el idioma del navegador si es español) y al final marca cada nota con ✓ o ✗.
  - **Se compara por sonido, no por palabras** (25 de octubre de 2026). El reconocedor (Google en Chrome, Apple en el iPhone) está hecho para dictar palabras: la dueña dijo notas y escribió «tosido». `silabas()` parte lo que escribió en sílabas (to · si · do), después de corregir palabras conocidas (`OIDO`: "rey" = re, "me" = mi). `parecido()` compara cada sílaba con una nota por su vocal y su consonante (`SONIDO`: "to" suena como do, "son" como sol). Si la vocal es la misma pero la consonante no, cuenta como error.
  - `alinear()` empareja en orden las 8 notas con las sílabas oídas (la mejor alineación), así que sobra o falta alguna sin desarmar el resto. No mide el momento exacto de cada nota.
  - Se piden 5 interpretaciones (`maxAlternatives`) y `mejorTexto()` se queda con la que mejor calza con el ejercicio.
  - Debajo se ve "Escuché: «…» → to · si · do": lo que oyó y cómo lo partió. Sirve para ajustar `SONIDO` si con voces reales sigue fallando.
  - Si el reconocedor se corta en un silencio, se vuelve a encender (con 250 ms de respiro) hasta que termina la lectura.
  - **Arreglo del 25 de octubre de 2026** (la dueña probó y "no te escuché"): el reconocedor no acepta `es-419` (español de Latinoamérica, común en Chrome) y fallaba en silencio. `idioma()` usa un código con país (`es-EC`, `es-MX`…) o `es-MX`. Cada error tiene su aviso (`AVISOS`: micrófono bloqueado, navegador sin reconocimiento como Brave u Opera, sin micrófono, idioma). Mientras se lee, "Escucho: «…»" muestra lo que oye tal cual, para saber si llega algo. Si oyó palabras pero ninguna nota, lo dice.
  - El reconocimiento lo hace el navegador (en Chrome, con los servidores de Google); la página no guarda ni envía el audio.

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

## Modo lección (`practica/leccion.js`, 26 de octubre de 2026)

**Etapa y lección, nunca semana (28 de octubre de 2026, pedido de la dueña).** «Semana 9» estresa al alumno que lleva años de clases. Por eso:
- **Lo que se ve:** la tarjeta, el botón «¿Qué hago?», la hoja, el selector de las hojas y el texto del entrenador de oído dicen «Etapa 2 · Lección 3».
- **Enlaces nuevos:**
  - apps: `?etapa=E&leccion=L`;
  - hojas: `/practica/hojas/<ins>/etapa-E-leccion-L`, y con `?modo=leccion` abren en modo lección.
- **`leccion.js`** pasa de etapa y lección a semana con `ETAPAS = [6, 8, 10, 8, 8, 8]` (las lecciones de cada etapa en `Registro_Sprinkloud/Guia.js`; si cambian, actualizarlo). **`hojas.html`** lo calcula desde su `GUIA`.
- **Siguen sirviendo:** los enlaces viejos `?semana=N`, `/semana-N?leccion=1` y `?semana=N&i=…`, que están en los libros ya armados y en mensajes enviados. Al abrir una hoja, la dirección se reescribe con la forma nueva.

Se activa cuando el enlace trae `?semana=N`. Lo usan los enlaces del libro (Libro_Sprinkloud), el mensaje de tareas y el panel del maestro, y el reporte de la familia (Registro_Sprinkloud). La dueña lo pidió porque el alumno llegaba a la app sin saber qué hacer: veía notas que todavía no aprendió (líneas adicionales cuando apenas sabía mi y sol) y no sabía para qué sirve la camarita.

**Qué hace:**
- Muestra una tarjeta (`<dialog class="lc">`) con:
  - la semana, el tema y la meta;
  - en piano y violín, las notas que se practican;
  - 3 pasos para esa app;
  - un paso con la camarita: qué hace y que la imagen se le manda a la maestra.
- Al tocar «Empezar» arranca el juego de notas.
- Deja el botón «Semana N · ¿Qué hago?» para volver a ver la tarjeta: abajo a la izquierda, y en la app de ritmo dentro de la fila de Dictado.

**Cómo deja preparada cada app:**
- **Piano y violín:** el modo de juego `leccion` tiene solo las notas vistas hasta esa semana (`notasPiano`, `notasViolin`) y se esconden los botones de modo:
  - semanas 1 a 7: mi y sol;
  - semana 8: + la;
  - semana 9: do-re-mi (en el violín, re, mi, sol y la);
  - semanas 10 a 19: la escala;
  - semana 20: con líneas adicionales y, en el piano, clave de fa;
  - desde la semana 21: todas, el modo normal.
- **Ritmo:**
  - `state.soloCeldas` deja solo las tarjetas de esa semana y esconde las pestañas;
  - fija el compás, el tempo y un ritmo de ejemplo listo para dar play (tabla `R`);
  - la semana 18 abre la cumbia.
- **Oído:** esconde los otros ejercicios.
- **Hojas:** solo la tarjeta.

**Detalles técnicos:**
- Se carga en el `<head>`, sin `defer`, para leer la dirección antes de que `hojas.html` la reescriba. Prepara la app en el evento `load`.
- La tabla `GUIA` (tema y meta) copia la de `Registro_Sprinkloud/Guia.js`. Si la guía cambia, hay que actualizarla aquí y en `hojas.html`.
- Un modo de juego con una sola nota haría un bucle infinito en `generarSiguienteNotaJuego`, así que cada lista tiene por lo menos 2 notas.

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
  - HSTS, `nosniff`, `X-Frame-Options: DENY`, `Referrer-Policy` y `Permissions-Policy` (sin cámara ni ubicación; el micrófono solo para el propio sitio, `microphone=(self)`, por la lectura hablada).
- **Fotos de stock con guitarras** en `index.html` y `musicband.html` (un cantante con guitarra acústica, un guitarrista eléctrico): el club no enseña guitarra. Pendiente decidir con la dueña si se cambian. Desde el 25 de octubre de 2026 todas las imágenes tienen texto alternativo que describe lo que se ve.
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
