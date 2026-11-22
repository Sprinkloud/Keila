/* Certificación de maestros Sprinkloud · Nivel 2 «Lectura» (21-nov-2026).
   Las dos lecturas del nivel. Las preguntas y sus respuestas viven en el servidor
   (Registro_Sprinkloud/maestros/CertBanco2.js): si cambia algo aquí, hay que revisar que las preguntas sigan saliendo de este texto.
   Regla de la dueña: ninguna cita bíblica. Se revisa con: node Registro_Sprinkloud/pruebas/revisar_banco.js 2 */
window.CERT_LECTURAS = window.CERT_LECTURAS || {};
window.CERT_LECTURAS[2] = {
  educador: { titulo: 'Enseñar en pasos pequeños', minutos: 9, html: `
    <p>En el nivel 1 aprendiste que la conexión va antes que el contenido. Ahora viene la segunda pregunta de todo maestro: ya me quiere escuchar, ¿y cómo le enseño?</p>
    <p>La respuesta del club cabe en tres palabras: en pasos pequeños.</p>
    <h3>Lo que solo tú puedes hacer</h3>
    <p>Un video puede explicar la clave de sol tan bien como tú. Lo que no puede es mirar a tu alumno: notar que ya se perdió en el segundo compás, que hoy llegó cansado o que está a un pasito de lograrlo.</p>
    <p>Eso es lo que haces tú: elegir el siguiente paso justo para esta persona, y darlo con ella.</p>
    <div class="clave">Tu trabajo no es explicar todo lo que sabes. Es encontrar el paso que tu alumno sí puede dar hoy.</div>
    <h3>Como se aprende a hablar</h3>
    <p>Nadie le explicó a un bebé la gramática completa antes de dejarlo decir «mamá». Dijo una palabra. Después dos juntas. Después una frase. Cada paso era pequeño y cada paso se celebraba.</p>
    <p>Así se enseña música en Sprinkloud. Un solo punto nuevo por vez, repetido hasta que sale fácil, y solo entonces el siguiente. Shinichi Suzuki y Toru Kumon armaron su enseñanza sobre esa misma idea.</p>
    <h3>Mostrar, hacer juntos, hacer solo</h3>
    <p>Cada cosa nueva pasa por tres momentos. Sirven igual para un niño que para un adulto. El primero lo cuidaba mucho María Montessori: mostrar despacio y con pocas palabras.</p>
    <ol>
      <li><b>Yo lo muestro.</b> Lo haces tú, despacio y con pocas palabras, mientras el alumno mira y escucha.</li>
      <li><b>Lo hacemos juntos.</b> Tú tocas o cantas y él te sigue, o tú haces la mitad y él la otra mitad. En línea no se toca a la vez: es la regla del retraso del nivel 1.</li>
      <li><b>Lo haces tú solo.</b> Tú te callas y lo miras. Recién aquí sabes si lo aprendió.</li>
    </ol>
    <p>El error más común es saltarse el segundo momento: explicar y enseguida pedir «ahora tú». El alumno se queda solo antes de tiempo, falla, y cree que el problema es él.</p>
    <h3>Ayuda lo justo, y después suéltalo</h3>
    <p>Lev Vygotsky observó que entre lo que una persona hace sola y lo que todavía no puede hacer hay una zona en el medio: lo que logra con ayuda. Ahí es donde se aprende. Wood, Bruner y Ross le pusieron nombre a esa ayuda: andamiaje. Es como el andamio de una casa en construcción, que sostiene mientras hace falta y después se quita.</p>
    <p>En la clase, el andamio puede ser cantar los nombres de las notas para que él te siga, señalar la nota en la pantalla compartida, marcar tú el pulso o tocar primero para que él repita.</p>
    <p>Lo difícil no es poner la ayuda. Es retirarla. Si siempre cantas las notas por él, nunca vas a saber si las lee. Cada vez que algo le sale, quita un poquito de ayuda: hoy canto todo, mañana solo la primera nota de cada compás, pasado mañana nada.</p>
    <h3>Primero la tecla y el sonido, después el símbolo</h3>
    <p>Un niño no aprende la palabra «manzana» mirando la palabra escrita. Primero la come.</p>
    <p>En música es igual: de lo concreto a lo abstracto. Primero el sonido y la tecla (o la cuerda), después el nombre, y al final el dibujo en el pentagrama. Si el alumno ya tocó y cantó do, re y mi, verlos escritos es reconocer a tres amigos. Si los ve escritos sin haberlos tocado nunca, son tres manchas en unas rayas.</p>
    <p>Por eso los libros del club usan imágenes que se pueden imaginar: el gusanito sobre el alambre y el pajarito entre dos alambres, o la pizza entera que dura un pulso. Úsalas tal cual. Ya están pensadas para ir de lo que se ve a lo que se escribe.</p>
    <h3>Lecciones cortas: para cuando todavía quiere más</h3>
    <p>Charlotte Mason enseñaba con lecciones cortas y atención completa, y cortaba antes de que el niño se cansara. La atención es como un músculo pequeño: se forma con ratos cortos y bien hechos, no con ratos largos y a la fuerza.</p>
    <p>Dentro de una clase, eso quiere decir cambiar de actividad cada pocos minutos: un rato de canción, un rato de lectura, un juego de ritmo, de vuelta a la canción. Y terminar cada cosa cuando todavía le está gustando. Un alumno que se va con ganas de más vuelve con ganas.</p>
    <h3>No preguntes «¿entendiste?»</h3>
    <p>Casi todos responden que sí. Los niños, para agradarte; los adultos, por vergüenza.</p>
    <p>Barak Rosenshine juntó lo que hacen los maestros que mejor enseñan, y una de sus conclusiones es esta: no des por hecho que el silencio es comprensión. Haz una pregunta concreta, que se responda haciendo o diciendo algo.</p>
    <ul>
      <li>En vez de «¿entendiste la clave de sol?»: «Muéstrame en la pantalla dónde vive sol».</li>
      <li>En vez de «¿está claro el compás?»: «Cuenta conmigo este compás. ¿Cuántos pulsos lleva?».</li>
      <li>En vez de «¿alguna duda?»: «Toca solo estas dos notas y dime cuál es más aguda».</li>
    </ul>
    <p>Si responde bien, avanzas. Si no, no pasó nada malo: acabas de descubrir cuál es el paso que faltaba.</p>
    <h3>Cuando no sale, el paso era muy grande</h3>
    <p>Esta es la idea que más cambia a un maestro. Si el alumno no puede, no le falta talento ni ganas: le diste un escalón demasiado alto. Tu trabajo es partirlo en dos.</p>
    <p><b>Con una niña pequeña.</b> Emma tiene que leer una melodía de cuatro compases y se traba en la tercera nota. Lo intenta otra vez y se traba en el mismo lugar. No le pides que empiece de nuevo. Le dices: «Vamos por capas. Primero solo el ritmo, en una sola nota: ta, ta, ti-ti, ta». Le sale. «Ahora digamos los nombres, sin tocar». Le sale. «Ahora tú tocas el primer compás y yo el segundo». Le sale. En cinco minutos toca los cuatro compases, y cree que fue fácil. Fue fácil porque tú lo partiste.</p>
    <p><b>Con un adulto que empieza.</b> Don Ernesto siempre quiso tocar piano y nunca pudo. Hoy quiere leer con las dos manos y se enreda. Se disculpa: «Es que ya estoy viejo para esto». No lo consuelas con palabras. Le achicas el paso: «Hoy solo la mano derecha, y solo dos compases. La izquierda queda para después». Cuando lo logra, se lo dices con el dato: «La semana pasada no leías ninguna de estas notas. Hoy leíste dos compases sin parar».</p>
    <p>Para un adulto que empieza algo que de niño no pudo, cada avance es un pequeño triunfo. Tu trabajo es que tenga uno en cada clase, y que lo vea.</p>
    <h3>Las metas pequeñas del club</h3>
    <p>Lo mismo vale de una clase a la otra. En Sprinkloud no se deja de tarea «practica la canción». Se deja una meta pequeña: una sola cosa concreta, que se puede lograr en una o dos semanas y que se puede comprobar.</p>
    <ul>
      <li>Vaga: «Mejora la lectura». Pequeña: «Nombra sin ayuda sol, mi y la en el pentagrama».</li>
      <li>Vaga: «Estudia la canción». Pequeña: «Toca los dos primeros compases sin parar, tres días de esta semana».</li>
    </ul>
    <p>Una a la vez. Cuando sale, se celebra y viene la siguiente.</p>
    <h3>Cómo sí y cómo no</h3>
    <ul>
      <li><b>Sí:</b> un solo punto nuevo en la clase. <b>No:</b> tres temas nuevos «para aprovechar el tiempo».</li>
      <li><b>Sí:</b> mostrar, hacerlo juntos y solo después pedirlo solo. <b>No:</b> explicar largo y decir «ahora tú».</li>
      <li><b>Sí:</b> primero tocar y cantar, después ver el símbolo. <b>No:</b> empezar por la teoría escrita.</li>
      <li><b>Sí:</b> si se traba, partir el paso en dos. <b>No:</b> repetir lo mismo más fuerte o más veces.</li>
      <li><b>Sí:</b> quitar la ayuda poco a poco. <b>No:</b> ayudar siempre igual, o soltarlo de golpe.</li>
      <li><b>Sí:</b> una pregunta que se responde haciendo. <b>No:</b> «¿entendiste?».</li>
      <li><b>Sí:</b> cambiar de actividad antes de que se canse. <b>No:</b> seguir veinte minutos con lo mismo porque «ya casi sale».</li>
      <li><b>Sí:</b> una meta pequeña y comprobable para la semana. <b>No:</b> «practica mucho».</li>
    </ul>
    <h3>Tu práctica de esta semana</h3>
    <ol>
      <li><b>Un punto por clase.</b> Antes de cada clase, escribe en una línea el único punto nuevo que vas a enseñar. Si escribiste dos, borra uno.</li>
      <li><b>Los tres momentos.</b> Con ese punto, haz a propósito los tres: muéstralo tú, háganlo juntos, y después cállate y míralo hacerlo solo.</li>
      <li><b>Cero «¿entendiste?».</b> Cámbialo cada vez por «muéstrame», «tócalo» o «dime cuál». Y si algo no sale, en vez de repetirlo, pártelo en dos.</li>
    </ol>
    <p>Si todavía no tienes alumnos, hazlo con alguien de tu casa: enséñale algo corto con los tres momentos.</p>
    <p class="fuente">María Montessori (mostrar despacio; de lo concreto a lo abstracto). Lev Vygotsky (la zona de desarrollo próximo). Wood, Bruner y Ross, 1976 (el andamiaje). Charlotte Mason, «Home Education» (lecciones cortas). Shinichi Suzuki, «Educados con amor», y Toru Kumon (pasos pequeños hasta dominar). Barak Rosenshine, «Principios de instrucción», 2012.</p>` },
  herramientas: { titulo: 'La app de tu instrumento, el bosque y MuseScore 4', minutos: 5, html: `
    <p>En este nivel conoces por dentro lo que usa tu alumno para practicar, y aprendes a simplificar una partitura.</p>
    <h3>El piano virtual y el violín virtual</h3>
    <p>Están en el sitio del club, en Material gratis. Si eres maestro de piano, tienes que manejar el piano virtual; si eres de violín, el violín virtual. Los dos funcionan igual:</p>
    <ul>
      <li><b>El juego de notas:</b> aparece una nota en el pentagrama y el alumno la toca en el teclado o en el violín de la pantalla.</li>
      <li><b>Las estrellas:</b> son 5 y se ganan con aciertos y con aciertos seguidos. Un error corta la racha, pero no quita estrellas.</li>
      <li><b>El modo lección:</b> cuando el alumno entra con el enlace de su lección, el juego usa solo las notas que ya vio hasta ahí. El botón «¿Qué hago?» abre una tarjeta con el tema, la meta, las notas de hoy y unos pasos cortos.</li>
      <li><b>La lectura hablada:</b> salen 8 notas, hay una cuenta de 4 y un marcador avanza una nota por pulso mientras el alumno dice los nombres sin parar. Con el botón del micrófono, la app escucha y marca cada nota bien o mal. El micrófono funciona en Chrome, Edge y Safari; en Firefox no aparece.</li>
      <li><b>La camarita:</b> arma una imagen con el nombre del alumno, la fecha y los minutos que practicó hoy, para mandártela.</li>
    </ul>
    <p>En el piano virtual cuenta el nombre de la nota, no la octava. En el violín virtual, el acierto vale en cualquier lugar del violín donde suene esa nota.</p>
    <div class="clave">Antes de mandarle una app a un alumno, ábrela tú con el enlace de su lección y juega una ronda. Así sabes qué va a ver.</div>
    <h3>El bosque de Sprinkloud</h3>
    <p>Es la práctica diaria del alumno, en forma de cuento. Entra con su enlace secreto, el que tú le mandas por WhatsApp desde tu panel.</p>
    <ul>
      <li><b>Qué hace cada día:</b> la práctica de hoy, que son 3 o 4 actividades cortas de su lección. Cada actividad empieza con un ejemplo, y los ejercicios cambian cada día.</li>
      <li><b>Qué lo anima:</b> la fogata, que es su racha de días; los malvaviscos, que son sus monedas; y su casita y su álbum, que decora con lo que compra.</li>
      <li><b>Cómo avanza:</b> pasa a la lección siguiente cuando termina la práctica con 70 % o más en 2 días distintos.</li>
      <li><b>Los libros:</b> en la biblioteca del bosque lee los libros de las etapas a las que ya llegó.</li>
    </ul>
    <p>Por ahora el bosque usa el libro de piano para todos los alumnos, también los de violín.</p>
    <p><b>Qué ves tú en tu panel:</b> su racha y cómo va en la app. «No ha entrado», «Sin practicar» (más de 7 días), «Practica poco» (hace 3 a 7 días), «Empezó a practicar», «Practica y avanza» o «Practica, pero no avanza». Ese último es una señal para ti: está entrando, pero el paso le queda grande.</p>
    <h3>MuseScore 4: quitar y poner notas</h3>
    <p>Simplificar una partitura es aplicar los pasos pequeños al papel: dejas solo lo que tu alumno puede tocar hoy.</p>
    <p><b>Para quitar notas:</b></p>
    <ol>
      <li>Haz clic en la nota que sobra.</li>
      <li>Aprieta <kbd>Supr</kbd> (<i>Del</i>). La nota se borra y en su lugar queda un silencio.</li>
      <li>Para quitar un pedazo entero, haz clic en su primera nota y después <kbd>Mayús</kbd> + clic en la última: queda seleccionado todo el tramo. Con <kbd>Supr</kbd>, todo ese tramo se vuelve silencio.</li>
      <li>Si quieres que esos compases desaparezcan de la partitura, usa <kbd>Herramientas → Eliminar el rango seleccionado</kbd> (<i>Tools → Remove selected range</i>), o <kbd>Ctrl</kbd> + <kbd>Supr</kbd>.</li>
    </ol>
    <p><b>Para poner notas:</b></p>
    <ol>
      <li>Haz clic donde quieres escribir y aprieta la tecla <kbd>N</kbd>, o toca el lápiz de la barra de arriba. Entraste al modo de introducción de notas (<i>note input</i>).</li>
      <li>Elige la duración con un número: <kbd>4</kbd> es corchea, <kbd>5</kbd> es negra y <kbd>6</kbd> es blanca. Los números más chicos son figuras más cortas y los más grandes, más largas.</li>
      <li>Escribe la nota con su letra: <kbd>C</kbd> es do, <kbd>D</kbd> re, <kbd>E</kbd> mi, <kbd>F</kbd> fa, <kbd>G</kbd> sol, <kbd>A</kbd> la y <kbd>B</kbd> si.</li>
      <li>Para un silencio, aprieta <kbd>0</kbd> después de elegir la duración.</li>
      <li>Para salir del modo, aprieta <kbd>N</kbd> otra vez o <kbd>Esc</kbd>.</li>
    </ol>
    <p><b>Para sacar los archivos:</b> <kbd>Archivo → Exportar</kbd> (<i>File → Export</i>) y eliges el formato: PDF para que el alumno imprima, y MP3 para que escuche cómo tiene que sonar.</p>
    <p class="fuente">Los pasos salen del manual oficial de MuseScore Studio 4, que está en inglés. Los nombres de los menús en español pueden cambiar un poco según tu versión.</p>
    <h3>Qué quitar primero</h3>
    <ul>
      <li>Las notas de adorno y las más rápidas.</li>
      <li>Las notas de más en la mano izquierda: deja una sola nota por compás.</li>
      <li>Los saltos grandes: acércalos.</li>
      <li>Y recuerda lo del nivel 1: si todavía no lee, ponle el nombre dentro de cada nota.</li>
    </ul>
    <h3>Tus entregas de este nivel</h3>
    <ol>
      <li>Una canción simplificada para el nivel del libro 2 (si ya tienes alumnos, para uno tuyo), en PDF.</li>
      <li>El MP3 de esa misma canción.</li>
      <li>Un caso escrito: un alumno no entiende la lectura de notas. Cuenta qué pasos pequeños le pones para la próxima clase.</li>
    </ol>` }
};
