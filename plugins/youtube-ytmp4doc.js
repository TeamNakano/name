import axios from 'axios';

let handler = async (m, { conn, command, args }) => {
  const url = args[0];
  if (!url) return conn.reply(m.chat, '💞 Ingresa la URL del video de YouTube junto al comando.', m);

  await m.react('🕓');

  try {
    
    const response = await axios.get(`https://api.ryzendesu.vip/api/downloader/ytmp4?url=${encodeURIComponent(url)}`, {
      headers: { accept: 'application/json' }
    });

    const videoUrl = response.data.url;

    if (videoUrl) {
      
      await conn.sendMessage(m.chat, { document: { url: videoUrl }, mimetype: 'video/mp4', fileName: 'Tome su vídeo de Youtube 💞.mp4' }, { quoted: m });
      await m.react('✅');
    } else {
      conn.reply(m.chat, '❌ No se encontró el enlace de descarga del video.', m);
    }
  } catch (error) {
    console.error(error);
    conn.reply(m.chat, '❌ Hubo un error al realizar la descarga. Por favor, intenta de nuevo.', m);
  }
};

handler.help = ['ytmp4doc *<url>*'];
handler.tags = ['download'];
handler.command = /^ytmp4doc$/i;
handler.register = false;

export default handler;
