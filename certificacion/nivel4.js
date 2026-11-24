/* Certificación de maestros Sprinkloud · Nivel 4 (libro 4: Intervalos, escalas y acordes).
   Las dos lecturas del nivel. Las preguntas y sus respuestas viven en el servidor
   (Registro_Sprinkloud/maestros/CertBanco4.js): si cambia una lectura, hay que revisar que las preguntas sigan saliendo de ella. */
window.CERT_LECTURAS = window.CERT_LECTURAS || {};
window.CERT_LECTURAS[4] = {
  educador: { titulo: 'Motivar sin presionar', minutos: 9, html: `
    <p>La información ya es gratis: cualquier pantalla explica un acorde, a cualquier hora. Si el alumno solo necesitara eso, no te necesitaría a ti.</p>
    <p>Te necesita para otra cosa: para tener ganas de volver. Una pantalla no se alegra cuando por fin le sale el compás difícil, ni nota que hoy llegó cansado. Tú sí.</p>
    <div class="clave">La motivación no se exige ni se compra. Se cuida. Y se cuida en cada clase, con cosas pequeñas.</div>

    <h3>Las tres cosas que todo alumno necesita</h3>
    <p>Dos investigadores, Edward Deci y Richard Ryan, pasaron décadas estudiando por qué la gente sigue haciendo algo por gusto. Su respuesta, la teoría de la autodeterminación, cabe en tres necesidades:</p>
    <ol>
      <li><b>Elegir:</b> sentir que lo que hace es suyo, que tuvo voz en ello.</li>
      <li><b>Sentirse capaz:</b> comprobar, hoy, que puede con algo que ayer no podía.</li>
      <li><b>Sentirse cerca:</b> saber que le importa a la persona que le enseña.</li>
    </ol>
    <p>En un estudio con personas que habían estudiado un instrumento y lo dejaron, contaron que, en la época en que lo dejaron, sentían menos esas tres cosas que cuando más metidas estaban en la música: elegían menos, se sentían menos capaces y menos acompañadas.</p>
    <p>Mira tus clases con esas tres preguntas. ¿Qué eligió hoy mi alumno? ¿Qué le salió hoy que antes no le salía? ¿Supo que me alegra verlo?</p>

    <h3>Elegir: la canción correcta</h3>
    <p>La forma más fácil de darle voz al alumno es la canción. Pero no le preguntes «¿cuál es tu canción favorita?»: es una pregunta enorme, a muchos los deja en blanco, y cuando responden suele ser una canción muy difícil o imposible de conseguir.</p>
    <p>Lo que sí funciona: <b>tú le preparas 2 o 3 opciones y él escoge una.</b> Cada opción le conviene (está a su nivel y sirve para lo que está aprendiendo) y le puede gustar (por su edad, por lo que escucha, por lo que te contó). Si un día llega diciendo «quiero tocar esta», búscala y adáptala.</p>
    <p>En una investigación sobre la práctica en casa, una alumna de clarinete estudió mucho más, usó mejores estrategias y aguantó más tiempo cuando la pieza la había elegido ella. Era la misma niña y el mismo instrumento. Lo que cambió fue de quién era la canción.</p>
    <p>La canción correcta tiene dos condiciones, y las dos pesan igual:</p>
    <ul>
      <li><b>Le importa.</b> La escuchó en una película, la canta su abuela, la bailó en una fiesta.</li>
      <li><b>Está a su nivel.</b> Casi ninguna partitura que se encuentra por ahí lo está. Por eso la adaptas tú en MuseScore 4: le pones el nombre a las notas, la cambias de tonalidad, le quitas notas.</li>
    </ul>
    <div class="clave">Regla del club: si un alumno no avanza con una canción aunque lo intentaste de varias maneras, casi siempre la partitura está sobre su nivel o la canción no significa nada para él. Se simplifica la partitura o se cambia la canción.</div>
    <p>Hay que empujar al alumno a ser constante y a terminar lo que empezó. Pero después de intentarlo todo, no arriesgamos perderlo por insistir. Un mes atorado en la misma página le enseña una sola cosa: que no puede. Y eso es lo contrario de lo que vino a aprender.</p>

    <h3>Sentirse capaz: metas pequeñas</h3>
    <p>Nadie se siente capaz frente a una canción entera. Se siente capaz frente a cuatro compases. Así se avanza en Sprinkloud: una sola cosa concreta, que se puede lograr en una o dos semanas. Cuando sale, viene la siguiente.</p>
    <p><b>Con una niña pequeña.</b> Lucía tiene 7 años y hoy le toca la mano izquierda. En vez de «vamos a aprender la canción», le dices: «Hoy vamos a conquistar solo estos dos acordes: Do y Sol. Cuando te salgan tres veces seguidas, los tocas mientras yo canto la melodía». A los diez minutos le salen. Ella toca y tú cantas siguiéndola. Lucía se va sabiendo que hoy pudo.</p>
    <p><b>Con un adulto que empieza.</b> Don Ernesto tiene 58 años. De niño quiso aprender piano y en su casa no se pudo. Llega a cada clase pidiendo perdón por sus dedos. Para él, tocar ocho compases de la canción que le cantaba su mamá no es un ejercicio: es un pequeño triunfo que esperó cincuenta años. Tu trabajo es que lo note: «Hace un mes buscabas cada nota. Hoy tocaste la frase entera sin parar». Un adulto necesita que alguien le muestre su avance, porque él solo ve lo que le falta.</p>

    <h3>Lo que dices cuando sale bien</h3>
    <p>En unos experimentos muy conocidos de Claudia Mueller y Carol Dweck, a unos niños se les elogió la inteligencia («qué listo eres») y a otros el esfuerzo («trabajaste mucho en esto»). Después, los primeros tendieron a evitar los retos difíciles, por miedo a dejar de parecer listos. Los segundos los buscaron.</p>
    <p>En la clase de música pasa igual. «Qué talento tienes» suena lindo, pero deja al alumno cuidando una etiqueta. Mejor elogia lo que hizo y cómo lo hizo:</p>
    <ul>
      <li>«Lo tocaste lento primero y por eso ahora te sale.»</li>
      <li>«Te equivocaste, volviste dos compases atrás y lo arreglaste tú solo.»</li>
      <li>«Se nota que esta semana lo practicaste un poquito cada día.»</li>
    </ul>

    <h3>Premios: con cuidado</h3>
    <p>Un sticker de vez en cuando no le hace daño a nadie. El problema aparece cuando cada cosa se paga: «si practicas, te doy…». Una revisión grande de estudios, de Deci, Koestner y Ryan, encontró que los premios materiales que el niño ya espera tienden a bajarle las ganas propias. Deja de tocar porque le gusta y empieza a tocar por el premio. Y cuando el premio se acaba, se acaba la práctica.</p>
    <p>Lo que sí alimenta las ganas es gratis: tu alegría sincera, un reconocimiento concreto y la satisfacción de que le salió.</p>

    <h3>Cómo dejar la tarea</h3>
    <p>La tarea también puede cuidar la motivación o gastarla. Una revisión de técnicas de estudio, de John Dunlosky y sus colegas, encontró que dos de las más útiles son también las más sencillas:</p>
    <ul>
      <li><b>Recordar sin mirar.</b> Sacar algo de la memoria lo fija mejor que volver a leerlo. «Antes de abrir la partitura, intenta tocar el comienzo de memoria. Después mira y corrige.»</li>
      <li><b>Repartir la práctica.</b> Diez minutos en cinco días distintos rinden más que cincuenta minutos el día antes de la clase.</li>
    </ul>
    <p>Por eso una buena tarea es <b>una sola</b>, es <b>corta</b> y dice exactamente qué hacer: «Los compases 5 a 8, tres veces lento, cada día. Primero de memoria y después mirando». Una tarea así se puede cumplir. Y cumplirla es otra forma de sentirse capaz.</p>

    <h3>Cómo sí y cómo no</h3>
    <ul>
      <li><b>Sí:</b> ofrecer 2 o 3 canciones a su nivel y dejar que elija. <b>No:</b> imponer el repertorio «porque así es el método», ni preguntarle «¿cuál es tu favorita?» y pasar días buscándola.</li>
      <li><b>Sí:</b> adaptar la partitura a su nivel. <b>No:</b> darle la original «para que se esfuerce».</li>
      <li><b>Sí:</b> cambiar de canción cuando ya se intentó de todo. <b>No:</b> dejarlo un mes en la misma página.</li>
      <li><b>Sí:</b> una meta pequeña por semana. <b>No:</b> «para la próxima, la canción completa».</li>
      <li><b>Sí:</b> elogiar lo que hizo y cómo. <b>No:</b> «eres un genio» o «tienes talento».</li>
      <li><b>Sí:</b> mostrarle cuánto avanzó. <b>No:</b> compararlo con otro alumno.</li>
      <li><b>Sí:</b> alegrarte con él. <b>No:</b> pagarle cada práctica con un premio.</li>
      <li><b>Sí:</b> una tarea corta y clara. <b>No:</b> «practica todo lo que vimos».</li>
    </ul>

    <h3>Cuando no practicó</h3>
    <p>Va a pasar, con niños y con adultos. No practicar casi nunca es flojera: es que la tarea era muy grande, que la canción no le dice nada o que tuvo una semana difícil. Lo recibes igual de bien, practican juntos una meta pequeña y te preguntas qué de las tres necesidades faltó. La culpa no hace practicar a nadie. Las ganas, sí.</p>

    <h3>Tu práctica de esta semana</h3>
    <ol>
      <li><b>Deja elegir.</b> En cada clase, ofrece una elección de verdad: entre 2 o 3 canciones, o con cuál parte empezamos hoy.</li>
      <li><b>Nombra un avance.</b> A cada alumno, dile una cosa concreta que hoy le salió y antes no. A los adultos, sin falta.</li>
      <li><b>Revisa tus canciones.</b> Busca en tu cuaderno al alumno que lleva más tiempo con la misma canción. Antes de su próxima clase, simplifícale la partitura o llévale otra opción.</li>
    </ol>
    <p class="fuente">Deci y Ryan, teoría de la autodeterminación. Evans, McPherson y Davidson (2013), sobre quienes dejan el instrumento. Renwick y McPherson (2002), sobre el repertorio elegido por el alumno. Mueller y Dweck (1998), sobre el elogio. Deci, Koestner y Ryan (1999), sobre los premios. Dunlosky y colegas (2013), sobre las técnicas de estudio.</p>` },

  herramientas: { titulo: 'Partituras con acordes, la app de acordes y MuseScore 4', minutos: 5, html: `
    <p>En el libro 4 el alumno descubre los acordes. Estas herramientas sirven para que los vea, los oiga y los use en una canción que le guste.</p>

    <h3>La app «Partituras con acordes»</h3>
    <p>Está en el sitio del club, en Material, y sirve para piano y para violín. Es una biblioteca de canciones que el alumno puede ver, escuchar y cambiar de tonalidad.</p>
    <ul>
      <li><b>Dos vistas.</b> «Notas» muestra los nombres (Do, Re, Mi) en recuadros, un grupo por compás, y cada recuadro mide lo que dura la nota. «Partitura» muestra el pentagrama, con su clave de sol y su armadura. La app abre en Notas: es la vista para quien todavía no lee con soltura.</li>
      <li><b>Los acordes se ven siempre,</b> en letras (C, Am, G7), justo encima de la nota donde cambian.</li>
      <li><b>Tonalidad.</b> Puedes pasar la canción a otra tonalidad y la app escribe bien cada nota y su armadura.</li>
      <li><b>Escuchar.</b> Suena la melodía con el acorde suave por debajo. En la vista de notas se ilumina la que está sonando.</li>
    </ul>
    <p>Cada canción tiene su propia dirección, así que le puedes mandar al alumno el enlace directo a la suya.</p>

    <h3>Por qué solo hay canciones tradicionales y clásicas</h3>
    <p>La biblioteca tiene canciones infantiles, villancicos, tradicionales y piezas clásicas famosas. Todas son de dominio público y cada una dice quién es su autor original.</p>
    <p>No vas a encontrar ahí canciones de moda, de películas ni de artistas actuales. La app es una página abierta a todo el mundo, y publicar ahí una canción con derechos de autor expone al club a reclamos.</p>
    <div class="clave">Si tu alumno elige una canción con derechos de autor, no la busques en la app: búscala con la cuenta de MuseScore del club (o súbele un PDF o una imagen para que la convierta), adáptala en MuseScore 4 y entrégale su PDF y su MP3.</div>

    <h3>La app de acordes e inversiones</h3>
    <p>Trabaja con los acordes de Do mayor, dibujados en el pentagrama y con sonido. Tiene estos ejercicios:</p>
    <ul>
      <li><b>¿Qué inversión es?</b></li>
      <li><b>¿Qué acorde es?</b> Con una trampa a propósito: la nota del bajo no siempre es la fundamental.</li>
      <li><b>Cómo se escribe con barra</b> (Do/Mi, Do/Sol).</li>
      <li><b>Los 7 acordes de Do,</b> con su grado.</li>
    </ul>
    <p>Úsala después de explicar las inversiones (Etapa 4 · Lección 9) y los acordes de la escala (Etapa 4 · Lección 10).</p>

    <h3>La app de armaduras</h3>
    <p>Acompaña las lecciones del orden de los sostenidos y de los bemoles (Etapa 4 · Lecciones 5 y 6). Tiene cuatro ejercicios: ordenar los sostenidos o los bemoles, descubrir en qué tonalidad mayor está una armadura, decir cuántas alteraciones tiene una tonalidad y encontrar la relativa menor.</p>
    <p>En el ejercicio de ordenar, la app pide una cantidad (por ejemplo, los 4 primeros sostenidos), va anotando lo que el alumno toca en «Tu orden» y al final pone debajo «El orden» correcto, para que compare solo.</p>

    <h3>MuseScore 4: escribir los acordes sobre la melodía</h3>
    <p>Una partitura con la melodía y sus acordes le sirve al alumno de piano para acompañarse con la mano izquierda, y al de violín para tocar sobre el MP3 con los acordes. Así se escriben:</p>
    <ol>
      <li>Haz clic en la nota donde empieza el acorde.</li>
      <li>Presiona <kbd>Ctrl + K</kbd> (en Mac, <kbd>Cmd + K</kbd>). Aparece un cursor encima del pentagrama.</li>
      <li>Escribe el acorde con letras: <kbd>C</kbd>, <kbd>Am</kbd>, <kbd>G7</kbd>. El sostenido se escribe con <kbd>#</kbd> y el bemol con una <kbd>b</kbd> minúscula: <kbd>Bb</kbd> es Si bemol.</li>
      <li>Presiona la <kbd>barra espaciadora</kbd> para saltar a la nota o al tiempo siguiente, y escribe el próximo acorde.</li>
      <li>Para un acorde invertido usa la barra: <kbd>C/E</kbd> es Do con Mi en el bajo.</li>
      <li>Presiona <kbd>Esc</kbd> para terminar.</li>
    </ol>
    <p>MuseScore escribe los acordes con letras. Recuérdale al alumno la equivalencia: C es Do, D es Re, E es Mi, F es Fa, G es Sol, A es La y B es Si. Una «m» después de la letra quiere decir menor: Am es La menor.</p>
    <p><b>Si cambias la tonalidad</b> con <kbd>Herramientas → Transportar</kbd> (<i>Tools → Transpose</i>), los acordes cambian junto con las notas. En esa ventana hay una casilla para transportar también los símbolos de acorde: revisa que esté marcada.</p>
    <p class="fuente">Los pasos salen del manual oficial de MuseScore, que está en inglés. Los nombres de los menús en español pueden cambiar un poco según tu versión.</p>

    <h3>Cómo elegir los acordes de una canción</h3>
    <p>Lo dice la lección 10 del libro: en toda escala mayor, los acordes I, IV y V son mayores. En Do mayor son Do, Fa y Sol; en Sol mayor, Sol, Do y Re. Con esos tres se acompaña la gran mayoría de las canciones que piden los alumnos. Para un alumno que empieza, deja un solo acorde por compás.</p>

    <h3>Tus entregas de este nivel</h3>
    <ol>
      <li>Una canción <b>elegida por un alumno tuyo</b>, adaptada a su nivel y con sus acordes escritos, en PDF.</li>
      <li>El MP3 de esa misma canción, para que escuche cómo tiene que sonar.</li>
      <li>Un caso escrito: «Un alumno lleva un mes con la misma canción: qué revisas y qué cambias».</li>
    </ol>` }
};
