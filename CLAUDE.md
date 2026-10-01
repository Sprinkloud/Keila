# CLAUDE.md: página_Sprinkloud (repo Sprinkloud/Keila)

Sitio web público del Club Musical Sprinkloud, publicado en https://sprinkloud.vercel.app/ (Vercel despliega desde `main`). Es HTML estático, sin build: la plantilla "Spectral" de HTML5 UP (`assets/`) más páginas propias de teoría musical.

## Estructura

| Ruta | Qué es |
|---|---|
| `index.html`, `material.html`, `metodología.html`, `musicband.html` | Páginas del sitio (plantilla Spectral, jQuery). |
| `Teoría Musical/` | Herramientas interactivas, cada una en un solo HTML con su CSS y JS en línea: `notaspiano.html` (piano de 5 octavas y juego de notas en clave de Sol y Fa, con VexFlow 4.2.2), `notasviolin.html`, `Pentagrama.html`, `Ritmo.html` y `sonidosynotas.html`. |
| `images/` | Fotos y logos. |
| `src/Main.java`, `.idea/` | Restos de un proyecto de IntelliJ; no forman parte del sitio. |

## Juego de notas del piano (`notaspiano.html`)

- `notasPiano`: las teclas de F2 a C6 (26 blancas). Las octavas 1 y 2 se muestran en clave de Fa y las 3 a 5 en clave de Sol. Con este rango, las líneas adicionales de la clave de Fa son solo las de arriba (Do4, Re4, Mi4) y las de Sol llegan hasta Do6.
- Orden de la página: barra con "Volver" y la marca en la otra esquina, título e intro cortos, mensaje y estrellas del juego, pentagrama, piano, y al final el panel del juego (iniciar, modos y acordes). Letras compactas; el pentagrama y el piano mantienen su tamaño.
- `modosJuego`: las notas de cada modo como `[tecla VexFlow, clave]`. Sol: líneas, espacios y líneas adicionales; Fa: lo mismo; `ambas` junta todas. Una nota de línea adicional puede mostrarse en la clave contraria a la de su tecla (por ejemplo Do4 en clave de Fa), por eso el acierto compara solo la altura (`vfKey`).
- El pentagrama doble se dibuja en 340 × 255, pero se muestra recortado con `viewBox="0 28 340 196"` (y `height="196"`): con el rango F2–C6 basta esa franja y el pentagrama se ve más grande (hasta 440 px de ancho) sin ocupar más alto.
- Los pentagramas empiezan en x = 28 para que la llave que une clave de Sol y clave de Fa no quede cortada. Las notas van centradas en cada pentagrama (`dibujarCentrada`), como en la app.
- Plicas con `auto_stem: true` (piano y violín): desde la línea del medio hacia arriba la plica va hacia abajo (Si4 en clave de Sol, Re3 en clave de Fa); por debajo, hacia arriba.
- Aspecto: el mismo sistema visual que la app de violín (tokens de `App_Sprinkloud/DESIGN.md`: papel, musgo, ocre, Fraunces, Caveat y Nunito Sans, con tema oscuro). El pentagrama y las teclas quedan siempre sobre papel claro.
- Tiene que funcionar en cualquier dispositivo. El teclado muestra tantas teclas blancas como quepan (unos 34 px cada una, de 7 a 31) y las flechas mueven una octava. Al elegir un modo se centra en sus notas; en el juego NO se mueve solo: el alumno busca la octava. Cada octava tiene un tinte crema (azulado en los graves, rosado en los agudos: `oct-1` a `oct-5`) y su nombre encima (`NOMBRE_OCTAVA`: 2 octavas abajo, 1 octava abajo, Octava central, 1 octava arriba, 2 octavas arriba). En computadora se ve completo y las flechas se ocultan. El pie de página no es fijo, los toques miden 44 px y el zoom está permitido.

## Violín virtual (`notasviolin.html`)

- **El mismo violín que la app** (pedido de la dueña): la imagen del mástil (`images/violin-mastil.webp` horizontal: `-h.webp`; copias de `App_Sprinkloud/assets/ilustraciones/`) y las notas en un SVG encima (`dibujarViolin`). Misma geometría que la app (`MASTIL`, `posiciones`): las notas siguen las cuerdas de la imagen y van pegadas una a la otra, de la cuerda al aire (encima de la cejilla) al semitono 10. Se toca la nota más cercana al dedo. La imagen nunca se deforma: solo se escala.
- Horizontal en pantallas de más de 760 px (voluta a la izquierda, Mi arriba y Sol abajo); vertical en celulares (Sol a la izquierda, Mi a la derecha). Al cruzar los 760 px se vuelve a dibujar.
- `mapaCuerdas`: las notas de cada cuerda por semitono (nombre, `vfKey`, alteración). Colores de cuerda iguales a los de la app: Sol `#9C5B55`, Re `#C4923A`, La `#647745`, Mi `#567388`.
- Marcas: por defecto solo van en color las notas de la escala de Do mayor (Do4 a Do5) en primera posición (`escalaDo`). "Todas las notas" colorea las naturales de la cuerda al aire al 3.er dedo (semitonos 0 a 5). Las demás van en crema pálido con su nombre. La nota tocada crece (1.3) con el color de su cuerda y un aro oscuro.
- `modosJuego`: Líneas, Espacios, Líneas adicionales (Sol3 a Do4 y La5 a Re6) y Todas, siempre en clave de Sol. El acierto vale en cualquier lugar del violín donde suene esa nota.
- El pentagrama se dibuja en 320 × 155 para que entren Sol3 y Re6 con sus líneas adicionales. La nota va centrada en el pentagrama, como en la app (`dibujarCentrada`: se dibuja en su propio grupo y se mueve al centro, entre la clave y el final).
- En computadora (900 px o más), `.fila-superior` pone el pentagrama a la izquierda y el panel del juego a la derecha; debajo va el violín, con un ancho según el alto de la pantalla (`100dvh - 520px`) para que todo entre sin scroll (probado en 1280×800). En celulares `.fila-superior` es `display: contents` y todo queda en una columna.

## Células rítmicas (`Ritmo.html`)

- App de pantalla completa: el `body` mide 100dvh (flex en columna, sin scroll de página) y reparte el alto entre `.app` y el pie de página, que es una sola línea delgada con los íconos y el copyright. Solo el lienzo tiene scroll propio cuando hay muchos compases. Incluye banco de células (Rítmicas, Largas, Silencios), partitura en compases de 4/4, reproducción con metrónomo y cuenta previa, y dictado rítmico.
- Estilo de la app con modo oscuro; cabecera con Volver, el título y la marca Sprinkloud.
- Las células **no tienen nombre**: sin sílabas ni etiquetas (en `CELLS` solo quedan `id`, `tab` y `notes`). Mientras suena, el círculo marca el pulso y la línea de texto queda vacía.
- Figuras en negro (`--figura`; en modo oscuro, blanco). El resaltado de lo que suena es suave: el compás toma un tinte ocre muy leve y la figura que suena cambia a ocre (sin brillo). Junto a un silencio se deja más aire (`need` 34) para que se lea cada medio pulso. Los compases no llevan el rótulo "Compás N": solo "faltan X" cuando están incompletos y su basurero. Las tarjetas de la paleta no tienen número ni flecha: al tocarlas se añade la célula y suena.
- Pocas opciones: metrónomo siempre activo y cuenta de 4 tiempos en cada play, también en el dictado (sin botones); un solo círculo (`#pulso`) muestra un reloj en reposo, la cuenta previa 1-2-3-4 y después el pulso. Sin frases de ayuda ni "Pulsa reproducir…". Controles: tempo, Repetir y el botón "Pizza"; cada compás tiene su basurero (`removeBar`). Ya no hay botón para borrar todo. Sin Deshacer, Vaciar, Marcar tempo ni barra de estado: los avisos salen en la línea de arriba (`flash`). Retroceso quita la última célula.
- Panel de tarjetas plegable (`plegarPanel`, asa "Tarjetas"): en computadora se pliega a una franja de 40 px a la izquierda; en celulares baja y queda solo el asa. El estado se guarda en `localStorage` (`sprinkloud-ritmo-v1-panel`) y el contenido plegado queda `inert`.
- **Modo pastel** (botón "Pizza"): la paleta muestra solo las células de un pulso (`esDeUnPulso`: 9 rítmicas y 3 de silencios) y oculta pestañas, ayuda y dictado. Al tocar una tarjeta, el lienzo muestra la pizza del club (`images/pizza.webp`, la misma de la app; `pastelHTML`) cortada en una parte por figura, proporcional a su duración, empezando a la izquierda y en el sentido del reloj (un cuarto = arriba a la izquierda); los silencios dejan el plato vacío con borde punteado. Con play, tras la cuenta de 4, la célula suena 4 veces (un compás) y se pinta en ocre la parte que suena y su figura. El botón "Pizza" es siempre celeste (`--celeste`; más oscuro cuando está activo) para que se note que es importante (`activate` con `data-sl`). En celulares el pastel y la figura van lado a lado.
- Las figuras suenan con un tono tipo piano sintetizado (`pianoVoice`): Do5 en el pulso y Sol4 a contratiempo.
- En celulares la paleta ocupa como máximo 38vh y la frase de ayuda se oculta, para que el lienzo sea lo más amplio posible.

## Estrellas del juego (piano y violín)

Mismo código en las dos páginas: 1 estrella con 5 aciertos, 2 con 4 aciertos seguidos y 3 con 6 aciertos seguidos (`contarEstrellas`). Un error corta la racha pero no quita estrellas. Se reinician al iniciar el juego o al cambiar de modo. Entre un acierto y la nota siguiente se ignoran los toques (`esperandoSiguiente`), para que tocar dos veces no cuente doble.

## Pie de página

El mismo en todas las herramientas: solo tres íconos pequeños (18 px, con área de toque de 44 px) de WhatsApp, Instagram y correo, y el copyright. Sin botones grandes ni más enlaces.

## SEO

- `robots.txt` y `sitemap.xml` en la raíz. Al agregar o cambiar una página, se suma o se actualiza su `<url>` con su `lastmod` en el sitemap (con la URL codificada: `Teor%C3%ADa%20Musical/...`).
- Cada herramienta lleva: `<title>` de 60 caracteres como máximo que diga qué es, `description` de 155 como máximo, `link rel="canonical"`, Open Graph y Twitter (`name="twitter:..."`), imagen del mismo dominio, un solo `h1` que describa la herramienta (la marca va aparte) y datos estructurados JSON-LD (`WebApplication` y `BreadcrumbList`). Modelo: `notaspiano.html`.
- Enfocar título, descripción, `h1` y JSON-LD en lo que la gente busca (por ejemplo "aprender figuras musicales y ritmo", no "células rítmicas"). En `Ritmo.html` las tarjetas no muestran nombres, pero su `aria-label` describe las figuras (`describirCelula`: "dos corcheas", "negra con puntillo"…) para lectores de pantalla y buscadores.
- El sitio debe estar dado de alta en Google Search Console con el sitemap enviado.

## Probar en local

`python -m http.server` desde la raíz del repo y abrir `http://localhost:8000/Teor%C3%ADa%20Musical/notaspiano.html`.

## Cuidado en Windows

El repo tiene `images/Ritmo.jpg` e `images/ritmo.jpg`, que en Windows chocan (el sistema no distingue mayúsculas). Git siempre mostrará `images/Ritmo.jpg` como modificado: no hay que incluirlo en los commits.

## Convenciones

- Idioma: español.
- Commit y push solo cuando la dueña lo pida.

## Historial de cambios

### 29 de septiembre de 2026: piano, violín y células rítmicas renovados

Publicado en https://sprinkloud.vercel.app/ (commits `3f6277f` en adelante, en `main`).

**Proyecto**
- Se clonó el repo en `D:\Proyectos_Claude\página_Sprinkloud`, se creó este `CLAUDE.md` y se registró en el índice del workspace.

**Piano (`notaspiano.html`)**
- Modos de juego: clave de Sol (líneas, espacios, líneas adicionales), clave de Fa (lo mismo) y ambas claves.
- El mensaje del juego ya no dice el nombre de la nota: "Toca esta nota en el piano".
- Aspecto de la app de violín: papel crema, musgo y ocre, Fraunces, Caveat y Nunito Sans, tema oscuro y sin emojis.
- Funciona en cualquier dispositivo: el teclado muestra por tramos las teclas que caben, con flechas de octava; el pentagrama se achica con la pantalla.
- Octavas con tinte crema (azulado en los graves, rosado en los agudos) y su nombre encima: "2 octavas abajo" … "Octava central" … "2 octavas arriba".
- En el juego el teclado ya no se mueve solo hacia la nota: el alumno busca la octava.
- Rango de F2 a C6 (26 teclas blancas).
- Orden: "Volver" y la marca Sprinkloud en la misma fila; título corto; mensaje y estrellas; pentagrama y piano primero; al final el panel del juego (modos y acordes). Letras compactas para no hacer scroll.
- SEO: título, descripción, URL canónica, Open Graph, datos estructurados y un `h1` que describe la herramienta.

**Violín (`notasviolin.html`)**
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

**Células rítmicas (`Ritmo.html`)**
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
- En `material.html` el botón que lleva a `Ritmo.html` dice solo "Ritmo"; decir "Figuras musicales y ritmo" ayudaría al SEO.
- Las otras herramientas (`Pentagrama.html`, `sonidosynotas.html`) y las páginas de la plantilla todavía tienen el estilo y el SEO anteriores.
