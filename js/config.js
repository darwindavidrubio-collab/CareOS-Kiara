// ============================================================================
// CareOS v1.0 — Configuración Personalizada para Kiara (Kiarita <3)
// ============================================================================
// Todo el contenido romántico, playlists y datos están centralizados aquí.
// ============================================================================

export const CONFIG = {
  nombre: "Kiara",
  apodo: "Kiarita",
  version: "v10.10-love",

  whatsapp: {
    numero: "573128293812",
    mensajeEmergencia: "Soporte técnico de CareOS 🚨: necesito que mi novio venga a consentir a su princesa ya mismo 🥺💗",
    prefijoCupon: "Hola mi amor, acabo de canjear mi cupón en CareOS:"
  },

  // Secuencia de arranque (Terminal Boot)
  bootLines: [
    { text: "> iniciando CareOS v10.10...", status: "" },
    { text: "> buscando a la princesa más hermosa del mundo...", status: "[KIARA ♡]" },
    { text: "> detectando cólicos y activando protocolo de alivio...", status: "[MODO CUIDADO]" },
    { text: "> cargando el aroma de tu perfume y tus besos en papel...", status: "[10/10]" },
    { text: "> compilando abrazos tibios y besitos en la frente...", status: "[OK]" },
    { text: "> bienvenida, mi princesa {NOMBRE} <3", status: "", highlight: true }
  ],

  // Opciones del chequeo de ánimo (Fase 1.5)
  moods: [
    {
      id: "bien",
      emoji: "💗",
      label: "Dentro de todo, bien",
      themeSuggestion: "rosado",
      recommendedModule: "module-audio",
      response: "Me alegra muchísimo saber eso, mi princesa. Igual hoy tienes permiso oficial para quedarte entre las cobijas, escuchar tu música favorita y dejarte consentir por mí todo el día."
    },
    {
      id: "dolor",
      emoji: "🥺",
      label: "Con dolorcito",
      themeSuggestion: "lluvia",
      recommendedModule: "module-heat",
      response: "Ay mi Kiarita hermosa, cuánto daría por estar ahí mismo a tu lado haciéndote cariñitos hasta quitarte ese dolor. Ponte cómoda, abrígate con tu compresa calientita y cierra los ojos: imagina que te estoy abrazando bien fuerte."
    },
    {
      id: "cansada",
      emoji: "😴",
      label: "Muy cansada",
      themeSuggestion: "lluvia",
      recommendedModule: "module-breathe",
      response: "Tu cuerpo está trabajando mucho hoy, mi amor. Suéltalo todo, pon una de tus playlists suavecitas y descansa sin pensar en nada más; yo cuido tu sueño desde aquí."
    },
    {
      id: "sensible",
      emoji: "🌧️",
      label: "Sensible / mimosa",
      themeSuggestion: "lluvia",
      recommendedModule: "module-love",
      response: "Ven acá conmigo en pensamiento 🫂. Hoy se vale querer mil mimos extra. Abre tus cartitas aquí abajo para que sientas que estoy acostado justo al ladito tuyo."
    }
  ],

  // Playlists favoritas de Kiara y recomendaciones mias
  playlists: [
    {
      id: "fav-kiara-1",
      etiqueta: "Tus Favoritas mi princesa✨",
      emoji: "💗",
      url: "https://open.spotify.com/playlist/0tUplncas5gIr02MCPI5FU",
      defaultForTheme: "rosado"
    },
    {
      id: "fav-kiara-2",
      etiqueta: "Rincón de Kiarita",
      emoji: "🌸",
      url: "https://open.spotify.com/playlist/0DXcrwuT09tyRly2Qc7dHy"
    },
    {
      id: "para-ti-1",
      etiqueta: "De mí para ti 🌙",
      emoji: "🌙",
      url: "https://open.spotify.com/playlist/37i9dQZF1E4yvvexSNPVOh",
      defaultForTheme: "lluvia"
    },
    {
      id: "para-ti-2",
      etiqueta: "Para abrazarte",
      emoji: "☁️",
      url: "https://open.spotify.com/playlist/37i9dQZF1E4APEZVcjnAID"
    }
  ],

  // Carta principal de "Sobrecarga de Amor"
  cartaLarga: {
    titulo: "Para mi princesa Kiara, mi 10/10 <3",
    parrafos: [
      "Mi Kiarita hermosa, sé que hoy es uno de esos días pesados en los que tu cuerpo te pide una pausa, y como me encantaría poder aparecer en un segundo al lado de tu cama para abrazarte y cuidarte, programé este pequeño refugio para que me sientas ahí mismo contigo.",
      "Mientras hacía esto para ti, abrí la cajita que me regalaste y sentí ese perfume tuyo que tanto me vuelve loco, leí tus cartas y vi esos besos tuyos plasmados en papel… y te juro que sentí como si estuvieras aquí a mi lado dándomelos de verdad.",
      "Entonces cerré los ojos y volví a nuestra cita de aquel 10 de septiembre: nuestro 10/10 amor. Te volví a ver con ese vestido blanco que te quedaba increible mi niña, y entonces te recordé sosteniendo tus flores mientras nos reíamos de todo. Tambien recordé mis manos poniéndote ese collar tan divino que llevabas y todos los besos tan lindos que nos dimos… porque hasta cuando la pizza sale mal como ese dia jajaj, cualquier lugar contigo se convierte en el momento más perfecto e inolvidable de mi vida.", 
      "Hoy quiero devolverte un poquito de toda esa magia que tú me das quiero que cierres los ojitos, acomodes tu almohada y sientas que te estoy abrazando por la cintura, haciéndote mimos despacio y cuidándote hasta que se te pase cualquier malestar.",  
      "Te amo mi vida, no tienes que poder con todo hoy al mismo tiempo, mi princesa. Descansa, pon tu música favorita y canjea todos los cupones que quieras, que yo estoy al otro lado de la pantalla feliz de consentirte."
    ],
    firma: "Siempre a tu lado, tu boo que te ama demasiado 💗" 
  },

  // Cartas cortas "Ábrelas cuando..."
  cartasAbrelas: [
    {
      id: "duela",
      etiqueta: "Ábrela cuando te duela mucho",
      icono: "🩹",
      titulo: "Cierra los ojos, estoy ahí contigo",
      parrafos: [
        "Mi princesa hermosa, sé que los cólicos son súper injustos y agotadores, hazte bolita de lado en la cama, hazte una compresa calientita en la barriguita e intenta relajarte.",
        "Ahora imagina que estoy acostado justo detrás de ti, abrigándote con mis brazos y haciéndote cariñitos muy suaves en la espalda y en el cabello, respira despacito conmigo, no estás sola, mi Kiarita <3."  
      ]
    },
    {
      id: "extranes",
      etiqueta: "Ábrela cuando me extrañes",
      icono: "💌",
      titulo: "Tu perfume y tus besos en papel",
      parrafos: [
        "Te apuesto lo que quieras a que en este preciso instante yo también te estoy pensando, cada vez que te extraño, abro tu cajita para oler tu perfume y miro tus besos en papel sintiendo que estás pegadita a mí.",
        "Ahora te toca a ti cerrar los ojos tres segundos: siente cómo te tomo de la mano en el carro, cómo nos reímos juntos de cualquier cosa y cómo te doy uno de esos besos largos y lentos como en aquella cita. Ya falta menos para el próximo beso mi amor."
      ]
    },
    {
      id: "dormir",
      etiqueta: "Ábrela cuando no puedas dormir",
      icono: "🌙",
      titulo: "Arrullo para mi Kiarita",
      parrafos: [
        "Deja el celular a un ladito después de leer esto ¿sí, mi amor? Hoy tu cuerpo ya hizo suficiente y merece descansar profundo.",
        "Relaja tus manitos, escucha la lluvia caer. Imagina que te arropo bien hasta los hombros, te doy un beso con mucho amor en la frente y me quedo cuidando tus sueños toda la noche. Y si quieres escuchar mi voz hasta quedarte dormida, canjea ya mismo tu cupón de buenas noches."  
      ] 
    },
    {
      id: "dudes",
      etiqueta: "Ábrela cuando te sientas sensible",
      icono: "🌷",
      titulo: "La niña del vestido blanco",
      parrafos: [
        "En estos días las hormonas hacen que todo se sienta mucho más pesado y sensible, y está completamente bien si hoy solo quieres estar mimosa o llorar un poquito.",
        "Pero nunca se te olvide cómo te veo yo: para mí siempre eres esa mujer radiante de vestido blanco que me dejó sin palabras con solo mirarla, la dueña de mis flores, de mis risas favoritas y de todo mi corazón. Eres mi 10/10 hoy y todos los días, mi princesa."
      ]
    }
  ],

  // Checklist diario de mimos (Fase 4.7)
  checklist: [
    { id: "agua", texto: "Tomar un vasito de agua fresca", detalle: "Para mantener hidratada a mi princesa" },
    { id: "te", texto: "Tomar algo calientito (té o aromática)", detalle: "Calorcito suave por dentro" },
    { id: "compresa", texto: "Poner la compresa tibia en la pancita", detalle: "15 minutos de alivio y calma" },
    { id: "descanso", texto: "Quedarme acostadita sin culpa un buen rato", detalle: "Modo princesa consentida al 100%" },
    { id: "comer", texto: "Comer algo rico que sí me provoque hoy", detalle: "Prometido que mejor que aquella pizza 🍕😂" }
  ],

  // Cupones canjeables (Sección 4.8)
  cupones: [
    {
      id: "peli",
      codigo: "COUPON_ID: 0001",
      emoji: "🎬",
      titulo: "Videollamada de película",
      descripcion: "Elegimos una peli y la vemos juntos a distancia",
      detalleExtra: "Tú tienes el control remoto absoluto, Amooor. Yo pongo la compañía para ti, solo para ti.",
      mensajeWa: "Hola mi amor, canjeé mi cupón en CareOS: 🎬 Videollamada de película. ¿Estas libre? 💗"
    },
    {
      id: "audio-amor",
      codigo: "COUPON_ID: 0002",
      emoji: "🎧",
      titulo: "Audio de amor",
      descripcion: "Un audio largo solo para ti, con todo lo que siento",
      detalleExtra: "Para que cierres los ojitos en la cama y sientas que te estoy hablando al oído.",
      mensajeWa: "Hola mi amor, canjeé mi cupón en CareOS: 🎧 Audio de amor. Quiero escucharte decirme cosas bonitas 🥺💗"
    },
    {
      id: "buenas-noches",
      codigo: "COUPON_ID: 0003",
      emoji: "🌙",
      titulo: "Audio de buenas noches",
      descripcion: "Te acompaño a dormir con mi voz",
      detalleExtra: "Te hablo bajito y te consiento hasta que tus ojitos se cierren solos.",
      mensajeWa: "Hola mi amor, canjeé mi cupón en CareOS: 🌙 Audio de buenas noches. ¿Me acompañas a dormir hoy? 💗"
    },
    {
      id: "videollamada",
      codigo: "COUPON_ID: 0004",
      emoji: "💬",
      titulo: "Videollamada sin prisa",
      descripcion: "Hablamos de lo que quieras, el tiempo que quieras",
      detalleExtra: "Sin mirar el reloj: para reírnos como siempre, contarnos todo o solo mirarnos.",
      mensajeWa: "Hola mi amor, canjeé mi cupón en CareOS: 💬 Videollamada sin prisa. Te extraño, ¿hablamos un ratito? <3"
    },
    {
      id: "mensaje-dia",
      codigo: "COUPON_ID: 0005",
      emoji: "💌",
      titulo: "Carta sorpresa",
      descripcion: "Una carta nueva escrita desde cero solo para ti",
      detalleExtra: "Inspirada en ti, en tu perfume y en todo lo que me haces sentir.",
      mensajeWa: "Hola mi amor, canjeé mi cupón en CareOS: 💌 Carta sorpresa. Quiero leer una cartita nueva para tu princesa 🥺💗"
    },
    {
      id: "playlist",
      codigo: "COUPON_ID: 0006",
      emoji: "🎶",
      titulo: "Canciones que me recuerdan a ti",
      descripcion: "Una selección musical nueva dedicada a Kiarita",
      detalleExtra: "Canciones elegidas una por una pensando en nosotros dos.",
      mensajeWa: "Hola mi amor, canjeé mi cupón en CareOS: 🎶 Canciones que me recuerdan a ti. Sorpréndeme con una cancion que te recuerde a mi🥺"
    },
    {
      id: "abrazo",
      codigo: "COUPON_ID: 0007",
      emoji: "🫂",
      titulo: "Abrazo virtual largo",
      descripcion: "Videollamada de \"solo estar juntos\" mientras descansas",
      detalleExtra: "Cero presión de hablar si tienes dolor o sueño. Solo sentir que estoy ahí al ladito tuyo acompañándote.",
      mensajeWa: "Hola mi amor, canjeé mi cupón en CareOS: 🫂 Abrazo virtual largo. Solo quiero sentirte cerquita mientras descanso 🥺💗"
    },
    {
      id: "serie",
      codigo: "COUPON_ID: 0008",
      emoji: "📺",
      titulo: "Maratón de serie a distancia",
      descripcion: "Capítulos sincronizados, mi princesa elige la serie",
      detalleExtra: "3, 2, 1... ¡Play! Nos vemos todos los episodios que quieras seguidos.",
      mensajeWa: "Hola mi amor, canjeé mi cupón en CareOS: 📺 Maratón de serie a distancia. Ve preparando todo que yo elijo la serie ✨"
    }
  ],

  // Easter egg `git log`: la historia de ustedes en commits
  gitLog: [
    {
      hash: "10sep10",
      tipo: "feat",
      fecha: "Cita 10/10",
      mensaje: "feat(cita): 10 de septiembre — los dos de blanco, flores para mi princesa y risas en el carro"
    },
    {
      hash: "c0ll4r9",
      tipo: "style",
      fecha: "Momento",
      mensaje: "style(vestido-blanco): ayudarte a ponerte tu collar mientras te veías increíblemente hermosa"
    },
    {
      hash: "b3s0s77",
      tipo: "gift",
      fecha: "Tesoros",
      mensaje: "feat(regalos): tu cajita con tu perfume, tu carta, tus besos en papel y mi Hot Wheels favorito"
    },
    {
      hash: "p1zz400",
      tipo: "fix",
      fecha: "Anécdota",
      mensaje: "fix(cena): la pizza estuvo fatal, pero nuestros besos hicieron la noche inolvidable (10/10)"
    },
    {
      hash: "k14r4l0",
      tipo: "care",
      fecha: "Hoy",
      mensaje: "chore(mimos): despliegue de CareOS para cuidar y abrazar a mi Kiarita hermosa (HEAD -> main)"
    }
  ]
};
