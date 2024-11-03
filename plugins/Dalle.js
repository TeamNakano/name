import fetch from 'node-fetch';

let handler = async (m, { conn, command, text }) => {
  if (!text) return conn.reply(m.chat, 'Por favor, ingresa un término para generar una imagen.', m);

  await m.react('🕓');

  try {
    
    let response = await fetch(`https://widipe.com/dalle?text=${encodeURIComponent(text)}`, {
      method: 'GET',
      headers: {
        'accept': 'image/jpeg'
      }
    });

    
    let imageBuffer = await response.buffer();

    
    await conn.sendFile(m.chat, imageBuffer, 'dalle-image.jpg', `Imagen generada con el texto: ${text}`, m);
    await m.react('✅');
  } catch (error) {
    console.error(error);
    await conn.reply(m.chat, 'Hubo un error generando la imagen. Inténtalo más tarde.', m);
    await m.react('✖️');
  }
};

handler.help = ['dalle *<texto>*'];
handler.tags = ['ai'];
handler.command = ['dalle'];
handler.register = true;

export default handler;
