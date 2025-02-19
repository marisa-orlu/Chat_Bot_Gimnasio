const { createBot, createProvider, createFlow, addKeyword, addAnswer } = require('@bot-whatsapp/bot');

const QRPortalWeb = require('@bot-whatsapp/portal');
const BaileysProvider = require('@bot-whatsapp/provider/baileys');
const MockAdapter = require('@bot-whatsapp/database/mock');

//Flujos hijos: flujoInformacionPrecio,
// flujoContacto, flujoHumano,flujoDespedida,flujoActividades
//Sub Hijos: flujoInfoBienvenida, flujoInfoOfertas, flujoInfoEstudiantes, flujoDuda


const flujoAgradecimiento = addKeyword('Gracias', 'gracias', 'Gracias!', '¡Gracias!', 'gracias!', '¡gracias!', 'Muchas gracias', 'muchas gracias','GracIas')
    .addAnswer('🌟¡Gracias a ti por confiar en nosotros!🌟')

const flujoInformacion = addKeyword('informacion', 'información', 'Informacion', 'Información', 'inf', 'info').addAnswer(
    ['*Información sobre nuestro gimnasio* 🏋️‍♂️💪\n\n' +
        '🌟 *Bienvenido a nuestro gimnasio* 🌟\n' +

        '💡 *¿Por qué elegirnos?* \n' +
        '- 🏋️‍♂️ *Equipos de última generación* para entrenamiento cardiovascular, fuerza y resistencia.\n' +
        '- 🧘‍♀️ *Clases grupales* de Yoga, Zumba, Spinning y más, para que entrenes mientras te diviertes.\n' +
        '- 💪 *Entrenadores certificados* que te guiarán en cada paso de tu camino hacia el éxito.\n' +
        '- 🏅 *Ambiente motivador* y amigable donde todos pueden sentirse cómodos.\n\n',
        '_Para volver al menu principal introduce *"volver"*_ 🔄'
    ])

const flujoHumano = addKeyword('humano', 'Humano', 'Humanos').addAnswer('Redirigiendo hacia uno de nuestros empleados... 👨‍💼')

const flujoDespedida = addKeyword(['adios', 'adiós', 'bye', 'salir', 'hasta luego', 'nos vemos'])
    .addAnswer([
        '👋 ¡Hasta luego! Esperamos verte pronto en el gimnasio. 💪🔥',
        'Recuerda que el esfuerzo de hoy es el éxito de mañana. ¡Sigue entrenando! 🏋️‍♂️'
    ]);

const flujoInfoBienvenida = addKeyword(['A']).addAnswer(
    '🎁 *Descuento de Bienvenida* 🎁\n\n' +
    'Obtén un 20% de descuento en tu primera membresía. ¡Aprovecha esta oportunidad!');

const flujoInfoOfertas = addKeyword(['B']).addAnswer(
    '💪 *Oferta 2x1* 💪\n\n' +
    'Trae a un amigo y ambos obtienen acceso gratuito por una semana. ¡No entrenes solo!');

const flujoInfoEstudiantes = addKeyword(['C']).addAnswer(
    '🎓 *Descuento para Estudiantes* 🎓\n\n' +
    'Todos los estudiantes tienen un 15% de descuento en nuestras membresías. ¡Entrena mientras estudias!');

const flujoDuda = addKeyword(['1'])
    .addAnswer([
        '🤔 *Tienes dudas sobre alguna oferta* 🤔\n\n' +
        'Elige una de estas opciones:\n' +
        '📌 *A* - Descuento de Bienvenida 🎁\n' +
        '📌 *B* - Oferta 2x1 💪\n' +
        '📌 *C* - Descuento para Estudiantes 🎓\n\n' +
        'Responde con la letra de tu opción:',
    ],
        { capture: true },
        async (ctx, { flowDynamic, fallBack }) => {
            // Comprobar si la respuesta es válida
            let mensaje = '';
            if (ctx.body === 'A' || ctx.body === 'a') {
                mensaje = flujoInfoBienvenida;
            } else if (ctx.body === 'B' || ctx.body === 'b') {
                mensaje = flujoInfoOfertas;
            } else if (ctx.body === 'C' || ctx.body === 'c') {
                mensaje = flujoInfoEstudiantes;
            } else {
                // Si la opción es incorrecta, vuelve a preguntar
                await flowDynamic('⚠️ *Opción inválida*. Por favor, elige una opción válida (A, B o C).');
                // Usamos fallBack() para permitir que el flujo espere otra respuesta del usuario
                return fallBack(); // No retornamos, sino que regresamos al punto de la pregunta
            }
            // Si la respuesta es válida, muestra el mensaje adecuado
            await flowDynamic(mensaje) +
                '_Para volver al menu principal introduce *"volver"*_ 🔄'
        },
        [flujoInfoBienvenida, flujoInfoOfertas, flujoInfoEstudiantes]
        
    );

const flujoOfertas = addKeyword(['Ofertas', 'ofertas', 'Oferta', 'oferta'])
    .addAnswer([
        '🎉 *Promociones y Ofertas Especiales* 🎉\n\n',
        '¡Tenemos varias ofertas increíbles para ti! 💥\n\n',
        '- *Descuento de bienvenida* 🎁: Obtén un 20% de descuento en tu primera membresía.\n',
        '- *Oferta 2x1* 💪: Trae a un amigo y ambos obtienen acceso gratuito por una semana.\n',
        '- *Descuento por estudiantes* 🎓: Todos los estudiantes tienen un 15% de descuento en nuestras membresías.\n\n',
        'Si tienes alguna duda sobre una oferta, introduce *"1"* para más información.\n\n',
        '_Para volver al menú principal, introduce *"volver"* 🔄_'
    ],
        { capture: true }, // Captura la respuesta del usuario
        (ctx) => {
            if (ctx.body === '1') {
                return flujoDuda; // Retorna el flujoDuda cuando el usuario escribe "1"
            }
        }
    );


const flujoActividades = addKeyword(['Actividades', 'actividades', 'Actividad', 'actividad'])
    .addAnswer([
        '🏋️‍♀️ *Actividades del Gimnasio* 🏋️‍♂️\n\n',
        'En nuestro gimnasio ofrecemos una amplia gama de actividades. 💪\n\n',
        '- *Clases de Yoga* 🧘‍♀️: Lunes, Miércoles y Viernes, de 8:00 AM a 9:00 AM.\n',
        '- *Entrenamiento Funcional* 💥: Martes y Jueves, de 6:00 PM a 7:00 PM.\n',
        '- *Spinning* 🚴‍♀️: Lunes y Miércoles, de 7:00 AM a 8:00 AM.\n',
        '\n¡Elige la actividad que más te guste y empieza a entrenar hoy! 😁',
        '_Para volver al menu principal introduce *"volver"*_ 🔄'
    ]);


const flujoInformacionPrecio = addKeyword('precios', 'precio', 'Precio', 'Precios')
    .addAnswer('🎁 *Nuestros Bonos* 🎁')
    .addAnswer(
        '💥 *Bono General* 💥\n' +
        '📝 *Precio:* 30€  \n⏳ *Duración:* Mensual\n' +
        '\n🌟 *Incluye:* Acceso total al gimnasio.\n\n' +
        '¡Disfruta de la libertad de entrenar en cualquier momento! 💪🔥'
    )
    .addAnswer(
        '🏋️‍♂️ *Bono Fitness* 🏋️‍♀️\n' +
        '📝 *Precio:* 40€  \n⏳ *Duración:* Mensual\n' +
        '\n💪 *Incluye:* Acceso completo al gimnasio + Evaluación física anual.\n\n' +
        '¡Perfecto para monitorear tu progreso! 🔥💥'
    )
    .addAnswer(
        '💎 *Bono Premium* 💎\n' +
        '📝 *Precio:* 50€  \n⏳ *Duración:* Mensual\n' +
        '\n🎓 *Incluye:* Clases grupales, asesoramiento personalizado y zona premium.\n\n' +
        '¡Ideal para maximizar tu rendimiento! 💥💪'
    )
    .addAnswer(
        '🎓 *Bono Estudiante* 🎓\n' +
        '📝 *Precio:* 25€ (descuento para estudiantes)  \n⏳ *Duración:* Mensual\n' +
        '\n🌟 *Incluye:* Acceso completo a todas las áreas del gimnasio.\n\n' +
        '¡Mantén tu cuerpo en forma mientras estudias! 📚💪' +
        '\n\n_Para volver al menu principal introduce *"volver"*_ 🔄'
    );

const flujoContacto = addKeyword('contacto', 'Contacto')
    .addAnswer([
        '📞 *Datos de Contacto* 📞\n',
        '📱 *Número de Teléfono:* +123 456 7890',
        '📧 *Correo Electrónico:* contacto@gimnasio.com',
        '📍 *Ubicación:* Calle Ficticia #123, Ciudad Fit\n',
        '📲 *Síguenos en nuestras redes sociales* 📲\n' +
        '🔵 (https://www.facebook.com/)\n' +
        '🟣 (https://www.instagram.com/)\n' +
        '⚫(https://www.tiktok.com/)\n',
        'Si deseas chatear con un humano, introduce la palabra *"humano"* y le redirigiremos al chat con uno de nuestros trabajadores 👨‍💼',
        '\n\n_Para volver al menú principal introduce *"volver"*_ 🔄'
    ]);

const flujoHorarios = addKeyword('horarios', 'Horarios', 'horario')
    .addAnswer([
        '⏰ *Horarios de Atención* ⏰\n\n',
        '🕘 Lunes a Viernes: 6:00 AM - 10:00 PM\n',
        '🕘 Sábados: 7:00 AM - 8:00 PM\n',
        '🕘 Domingos: 8:00 AM - 4:00 PM\n',
        '_Para volver al menu principal introduce *"volver"*_ 🔄'
    ]);


const flujoAsesoria = addKeyword(['plan', 'asesoria', 'personalizado'])
    .addAnswer(
        '🏋️‍♂️ *Asesoría Personalizada* 🏋️‍♀️\n\n' +
        'Dime cuál es tu objetivo principal:\n' +
        '*"A"* Perder peso\n' +
        '*"B"* Ganar músculo\n' +
        '*"C"* Mejorar resistencia\n\n' +
        'Responde con el número de tu objetivo: ',
        { capture: true },
        async (ctx, { flowDynamic, fallBack }) => {
            // Comprobar si la respuesta es válida
            let mensaje = '';
            if (ctx.body === 'A' || ctx.body === 'a') {
                mensaje = '🔥 ¡Perfecto! Te recomendamos nuestro plan de entrenamiento para pérdida de peso. 💪';
            } else if (ctx.body === 'B' || ctx.body === 'b') {
                mensaje = '💪 ¡Genial! Nuestro programa de hipertrofia es ideal para ganar músculo.';
            } else if (ctx.body === 'C' || ctx.body === 'c') {
                mensaje = '🏃‍♂️ ¡Excelente! Tenemos rutinas para mejorar tu resistencia y rendimiento.';
            } else {
                // Si la opción es incorrecta, vuelve a preguntar
                await flowDynamic('⚠️ *Opción inválida*. Por favor, elige una opción válida (A, B o C).');
                // Usamos fallBack() para permitir que el flujo espere otra respuesta del usuario
                return fallBack(); // No retornamos, sino que regresamos al punto de la pregunta
            }
            // Si la respuesta es válida, muestra el mensaje adecuado
            await flowDynamic(mensaje) +
                '_Para volver al menu principal introduce *"volver"*_ 🔄'

        }
    );

//Flujos padres: flowBienvenida, flujoMenu, flujoAgradecimiento

const flowBienvenida = addKeyword(['hola', 'buenas', 'buenos dias', 'Hello', 'hello', 'holaa'])
    .addAnswer('✨ ¡Bienvenido al gimnasio! ✨\n\nEscribe *"menu"* para ver nuestras opciones. 💪');

const flujoMenu = addKeyword(['menu', 'menú', 'Menu', 'Menú', 'Volver', 'volver'])
    .addAnswer([
        'Te proporciono el menú para que puedas interactuar con el: \n',
        '🏋️‍♂️ *Menú del Gimnasio* 🏋️‍♀️\n\n',
        '-Escribe *"informacion"* para conocer más sobre nosotros. ℹ️\n',
        '-Escribe *"contacto"* para ver nuestros datos de contacto. 📞\n',
        '-Escribe *"horarios"* para conocer nuestros horarios de atención. ⏰\n',
        '-Escribe *"precios"* para consultar precios. 💸\n',
        '-Escribe *"ofertas"* para ver las promociones y descuentos actuales. 💥\n',
        '-Escribe *"actividades"* para conocer las actividades que ofrecemos. 🏋️‍♀️\n',
        '-Escribe *"asesoria"* para recibir una guía personalizada y alcanzar tus metas. 💪\n',
        '-Escribe *"adios"* para despedirte y cerrar la conversación. 👋✨\n',
        '\n¡Elige una opción y te ayudaré con gusto! 😊'
    ],
        { capture: true }, //Para coger la respuesta del ususario
        async (ctx, { fallBack }) => { //Este if comprueba si es diferentes a estas palabras returna el menu y sino entra en los flujos hijos
            if (!['informacion', 'contacto', 'horarios', 'humano', 'información', 'horario',
                'contactos', 'precios', 'precio', 'Precios', 'Ofertas', 'ofertas', 'Oferta', 'oferta',
                'Actividades', 'actividades', 'Actividad', 'actividad', 'adios', 'Adios', 'Adiós', 'adiós', 'asesoria',
                'Asesoria', 'inf', 'info'].includes(ctx.body)) {
                return fallBack()
            }
            console.log(`El usuario respondió ${ctx.body}`)
        },
        [flujoInformacion, flujoContacto, flujoHorarios, flujoHumano, flujoInformacionPrecio, flujoOfertas, flujoActividades, flujoDespedida, flujoAsesoria]
    );

const main = async () => {
    const adapterDB = new MockAdapter();
    const adapterFlow = createFlow([
        flowBienvenida,
        flujoMenu,
        flujoContacto,
        flujoHorarios,
        flujoHumano,
        flujoInformacionPrecio,
        flujoActividades,
        flujoDespedida,
        flujoAsesoria,
        flujoInformacion,
        flujoAgradecimiento,
        flujoDuda
    ]);
    const adapterProvider = createProvider(BaileysProvider);

    createBot({
        flow: adapterFlow,
        provider: adapterProvider,
        database: adapterDB,
    });

    QRPortalWeb();
};

main();