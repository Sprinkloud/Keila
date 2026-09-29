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
- El pentagrama doble se dibuja en 340 × 255 (con `viewBox`, se achica con la pantalla) para que entren hasta tres líneas adicionales arriba de la clave de Sol y dos abajo de la de Fa.
- Aspecto: el mismo sistema visual que la app de violín (tokens de `App_Sprinkloud/DESIGN.md`: papel, musgo, ocre, Fraunces, Caveat y Nunito Sans, con tema oscuro). El pentagrama y las teclas quedan siempre sobre papel claro.
- Tiene que funcionar en cualquier dispositivo. El teclado muestra tantas teclas blancas como quepan (unos 34 px cada una, de 7 a 31) y las flechas mueven una octava. Al elegir un modo se centra en sus notas; en el juego NO se mueve solo: el alumno busca la octava. Cada octava tiene un tinte crema (azulado en los graves, rosado en los agudos: `oct-1` a `oct-5`) y su nombre encima (`NOMBRE_OCTAVA`: 2 octavas abajo, 1 octava abajo, Octava central, 1 octava arriba, 2 octavas arriba). En computadora se ve completo y las flechas se ocultan. El pie de página no es fijo, los toques miden 44 px y el zoom está permitido.

## Violín virtual (`notasviolin.html`)

- `mapaCuerdas`: las cuatro cuerdas con sus notas por semitono (1 a 11). Cada nota se ubica con la variable CSS `--p` (semitono / 13), así que la misma posición sirve en horizontal (`left`) y en vertical (`top`).
- Orden de las cuerdas: Mi arriba, luego La, Re y Sol abajo (en celulares, vertical, al revés: Sol a la izquierda y Mi a la derecha, con `row-reverse`). En pantallas de 760 px o menos el violín se pone vertical, con la cejilla arriba, para que los círculos de 42 px no se enciman.
- Colores de cuerda iguales a los de la app: Sol `#9C5B55`, Re `#C4923A`, La `#647745`, Mi `#567388`. Colores del diapasón de la app: mástil `#2A1F18`, cintas guía crema del ancho de una nota (semitonos 2, 3 y 5). Por defecto solo van en color las notas de la escala de Do mayor (Do4 a Do5) en primera posición (`escalaDo`); el resto se ve tenue. "Todas las notas" colorea solo las naturales de la primera posición (semitonos 0 a 5, de la cuerda al aire al 3.er dedo; sin el 4.º dedo); las alteradas y las posiciones más altas quedan tenues. La cejilla (cuerdas al aire) va en crema `#F6EEDC`.
- `modosJuego`: Líneas, Espacios, Líneas adicionales (Sol3 a Do4 y La5 a Re6) y Todas, siempre en clave de Sol. El acierto vale en cualquier lugar del violín donde suene esa nota.
- El pentagrama se dibuja en 320 × 155 para que entren Sol3 y Re6 con sus líneas adicionales.

## Estrellas del juego (piano y violín)

Mismo código en las dos páginas: 1 estrella con 5 aciertos, 2 con 4 aciertos seguidos y 3 con 6 aciertos seguidos (`contarEstrellas`). Un error corta la racha pero no quita estrellas. Se reinician al iniciar el juego o al cambiar de modo. Entre un acierto y la nota siguiente se ignoran los toques (`esperandoSiguiente`), para que tocar dos veces no cuente doble.

## Pie de página

El mismo en todas las herramientas: solo tres íconos pequeños (18 px, con área de toque de 44 px) de WhatsApp, Instagram y correo, y el copyright. Sin botones grandes ni más enlaces.

## SEO

- `robots.txt` y `sitemap.xml` en la raíz. Al agregar o cambiar una página, se suma o se actualiza su `<url>` con su `lastmod` en el sitemap (con la URL codificada: `Teor%C3%ADa%20Musical/...`).
- Cada herramienta lleva: `<title>` de 60 caracteres como máximo que diga qué es, `description` de 155 como máximo, `link rel="canonical"`, Open Graph y Twitter (`name="twitter:..."`), imagen del mismo dominio, un solo `h1` que describa la herramienta (la marca va aparte) y datos estructurados JSON-LD (`WebApplication` y `BreadcrumbList`). Modelo: `notaspiano.html`.
- El sitio debe estar dado de alta en Google Search Console con el sitemap enviado.

## Probar en local

`python -m http.server` desde la raíz del repo y abrir `http://localhost:8000/Teor%C3%ADa%20Musical/notaspiano.html`.

## Cuidado en Windows

El repo tiene `images/Ritmo.jpg` e `images/ritmo.jpg`, que en Windows chocan (el sistema no distingue mayúsculas). Git siempre mostrará `images/Ritmo.jpg` como modificado: no hay que incluirlo en los commits.

## Convenciones

- Idioma: español.
- Commit y push solo cuando la dueña lo pida.

## Historial de cambios

### 29 de septiembre de 2026: piano y violín renovados

Todo publicado en https://sprinkloud.vercel.app/ (commits `3f6277f` a `99ffb85` en `main`).

**Proyecto**
- Se clonó el repo en `D:\Proyectos_Claude\página_Sprinkloud`, se creó este `CLAUDE.md` y se registró en el índice del workspace.

**Piano (`notaspiano.html`)**
- Modos de juego: clave de Sol (líneas, espacios, líneas adicionales), clave de Fa (lo mismo) y ambas claves.
- El mensaje del juego ya no dice el nombre de la nota: "Toca esta nota en el piano".
- Aspecto de la app de violín: papel crema, musgo y ocre, Fraunces, Caveat y Nunito Sans, tema oscuro y sin emojis.
- Funciona en cualquier dispositivo: el teclado muestra por tramos las teclas que caben, con flechas de octava; el pentagrama se achica con la pantalla.
- Octavas con tinte crema (azulado en los graves, rosado en los agudos) y su nombre encima: "2 octavas abajo" … "Octava central" … "2 octavas arriba".
- En el juego el teclado ya no se mueve solo hacia la nota: el alumno busca la octava.
- SEO: título, descripción, URL canónica, Open Graph, datos estructurados y un `h1` que describe la herramienta.

**Violín (`notasviolin.html`)**
- Aspecto de la app, con los colores de cuerda y del diapasón del violín interactivo de la app.
- Modos de juego en clave de Sol: Líneas, Espacios, Líneas adicionales y Todas.
- En celulares el violín se pone vertical (Sol, Re, La, Mi de izquierda a derecha); en computadora es horizontal (Mi arriba, Sol abajo).
- Por defecto solo van en color las notas de la escala de Do mayor en primera posición. "Todas las notas" marca las naturales de la primera posición hasta el 3.er dedo.
- Cintas guía del ancho de una nota y cejilla (cuerdas al aire) en crema.
- Se corrigieron 9 notas naturales que estaban marcadas como alteradas en `mapaCuerdas`.
- SEO igual que el piano.

**Los dos juegos**
- Estrellas: 1 con 5 aciertos, 2 con 4 aciertos seguidos y 3 con 6 aciertos seguidos, con sonido y animación al ganar cada una.
- Tocar dos veces la misma tecla ya no cuenta doble.
- Pie de página con tres íconos pequeños (WhatsApp, Instagram, correo) y el copyright.

**Sitio**
- Nuevos `robots.txt` y `sitemap.xml` en la raíz.

**Pendiente**
- Dar de alta el sitio en Google Search Console, verificar la propiedad y enviar `sitemap.xml` (lo hace la dueña con su cuenta; si Google entrega un archivo o etiqueta de verificación, se agrega al sitio).
- Las otras herramientas (`Pentagrama.html`, `Ritmo.html`, `sonidosynotas.html`) y las páginas de la plantilla todavía tienen el estilo y el SEO anteriores.
