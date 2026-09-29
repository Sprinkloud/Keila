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

- `notasPiano`: las teclas de Do2 a Mi6. Las octavas 1 y 2 se muestran en clave de Fa y las 3 a 5 en clave de Sol.
- `modosJuego`: las notas de cada modo como `[tecla VexFlow, clave]`. Sol: líneas, espacios y líneas adicionales; Fa: lo mismo; `ambas` junta todas. Una nota de línea adicional puede mostrarse en la clave contraria a la de su tecla (por ejemplo Do4 en clave de Fa), por eso el acierto compara solo la altura (`vfKey`).
- El pentagrama doble se dibuja en 340 × 255 (con `viewBox`, se achica con la pantalla) para que entren hasta tres líneas adicionales arriba de la clave de Sol y dos abajo de la de Fa.
- Aspecto: el mismo sistema visual que la app de violín (tokens de `App_Sprinkloud/DESIGN.md`: papel, musgo, ocre, Fraunces, Caveat y Nunito Sans, con tema oscuro). El pentagrama y las teclas quedan siempre sobre papel claro.
- Tiene que funcionar en cualquier dispositivo. El teclado muestra tantas teclas blancas como quepan (unos 34 px cada una, de 7 a 31) y las flechas mueven una octava. Al elegir un modo se centra en sus notas, y en el juego se mueve solo si la nota pedida queda fuera. En computadora (1100 px o más) se ve completo y las flechas se ocultan. El pie de página no es fijo, los toques miden 44 px y el zoom está permitido.

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
