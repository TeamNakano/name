import fetch from 'node-fetch';
import { getDevice } from '@whiskeysockets/baileys';

let handler = async (m, { conn, command, text, usedPrefix }) => {
  if (!text) return conn.reply(m.chat, 'Ingresa el texto de lo que quieras buscar', m);

  await m.react('🕓');

  const deviceType = await getDevice(m.key.id);
  try {
    
    let response = await fetch(`https://deliriussapi-oficial.vercel.app/search/spotify?q=${encodeURIComponent(text)}&limit=20`);
    let data = await response.json();
    let results = data.data;

    if (!results || results.length === 0) return conn.reply(m.chat, 'No se encontraron resultados', m);

    
    const firstTrack = results[0];

    
    let listSections = [];
    let txt = '*S P O T I F Y - S E A R C H* 💞\n';
    txt += `*✨ Primer Resultado:*\n`;
    txt += `*🎵 Título:* ${firstTrack.title}\n`;
    txt += `*🎤 Artista:* ${firstTrack.artist}\n`;
    txt += `*💬 Url:* ${firstTrack.url}\n\n`;
    
    for (let i = 1; i < (results.length >= 30 ? 30 : results.length); i++) {
      const track = results[i];
      listSections.push({
        title: `Canción Nro ${i + 1}`,highlight_label: `${track.duration}`,
        rows: [
          {
            title: `${track.title}`,
            description: `Artista: ${track.artist}`,
            id: `${usedPrefix}spotifydl ${track.url}`
          }
        ]
      });
    }

    
    await conn.sendList(m.chat, txt + '*💞 Powered by Team Nakano*', '', 'Mas Resultados', firstTrack.image, listSections, m);
    await m.react('✅'); 
  } catch (error) {
    console.error(error);
    await m.react('❌'); 
  }
}

handler.help = ['spotifysearch *<búsqueda>*'];
handler.tags = ['search'];
handler.command = ['spotifysearch'];
handler.register = true;

export default handler;
