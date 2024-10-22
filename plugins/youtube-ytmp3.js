import axios from 'axios';

let handler = async (m, { conn, command, args }) => {
  const url = args[0];
  if (!url) return conn.reply(m.chat, '💞 Ingresa la URL del video de YouTube junto al comando.', m);
  
  await m.react('🕓');

  try {
    
    const response = await axios.get(`https://api.ryzendesu.vip/api/downloader/ytmp3?url=${encodeURIComponent(url)}`, {
      headers: { accept: 'application/json' }
    });

    const audioUrl = response.data.url;

    if (audioUrl) {
      
      await conn.sendMessage(m.chat, { audio: { url: audioUrl }, mimetype: 'audio/mpeg' }, { quoted: m });
      await m.react('✅');
    } else {
      conn.reply(m.chat, '❌ No se encontró el enlace de descarga del audio.', m);
    }
  } catch (error) {
    console.error(error);
    conn.reply(m.chat, '❌ Hubo un error al realizar la descarga. Por favor, intenta de nuevo.', m);
  }
}

handler.help = ['ytmp3 *<url>*'];
handler.tags = ['download'];
handler.command = /^ytmp3$/i;
handler.register = false;

export default handler;
