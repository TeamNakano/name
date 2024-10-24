import fetch from 'node-fetch';
import { getDevice } from '@whiskeysockets/baileys';

let handler = async (m, { conn, command, text }) => {
  if (!text) return conn.reply(m.chat, 'Por favor, proporciona el enlace de la canción de Apple Music.', m);

  await m.react('🕓');

  try {
    let response = await fetch(`https://deliriussapi-oficial.vercel.app/download/applemusicdl?url=${encodeURIComponent(text)}`);
    let result = await response.json();

    if (!result || !result.status) return conn.reply(m.chat, 'No se encontraron resultados o el enlace no es válido.', m);

    const track = result.data;
    let message = `💞 *Descarga Apple Music* ✨\n\n`;
    message += `*» Título* : ${track.name}\n`;
    message += `*» Artista* : ${track.artists}\n`;
    message += `*» Duración* : ${track.duration}\n\n`;

    
    await conn.sendFile(m.chat, track.image, 'cover.jpg', message, m);

    
    let audioResponse = await fetch(track.download);
    let audioBuffer = await audioResponse.buffer();

    await conn.sendFile(m.chat, audioBuffer, `${track.name}.mp3`, '', m);

    await m.react('✅');
  } catch (error) {
    console.error(error);
    await m.react('✖️');
    conn.reply(m.chat, 'Hubo un error al descargar el audio.', m);
  }
};

handler.help = ['applemusicdl *<enlace de Apple Music>*'];
handler.tags = ['downloader'];
handler.command = ['applemusicdl', 'amdl'];
handler.register = true;

export default handler;
