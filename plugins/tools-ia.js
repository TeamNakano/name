import axios from 'axios';

let handler = async (m, { conn, command, args }) => {
  const query = args.join(' ');
  if (!query) return conn.reply(m.chat, '🚩 Ingresa una pregunta o texto para la IA.', m);

  await m.react('💬');

  try {
    
    const response = await axios.get(`https://widipe.com/gpt4?text=${encodeURIComponent(query)}`, {
      headers: { accept: 'application/json' }
    });

    const aiResponse = response.data.result;

    if (aiResponse) {
      
      await conn.reply(m.chat, aiResponse, m, rcanal);
      await m.react('✅');
    } else {
      conn.reply(m.chat, '❌ No se recibió respuesta de la IA.', m);
    }
  } catch (error) {
    console.error(error);
    conn.reply(m.chat, '❌ Hubo un error al comunicarse con la IA. Intenta de nuevo más tarde.', m);
  }
};

handler.help = ['ai *<texto>*', 'ia *<texto>*'];
handler.tags = ['ai'];
handler.command = /^(ai|ia)$/i;  
handler.register = false;

export default handler;
