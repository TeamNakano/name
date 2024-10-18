import fetch from 'node-fetch';
import Starlights from '@StarlightsTeam/Scraper';

let handler = async (m, { conn, command, text, usedPrefix }) => {
  if (!text) return conn.reply(m.chat, '🚩 Ingresa el nombre del video que deseas buscar en TikTok.', m);

  await m.react('🕓');

  try {
    let results = await Starlights.tiktokSearch(text);
    if (!results || results.length === 0) return conn.reply(m.chat, 'No se encontraron resultados', m);

    let listSections = [];
    for (let i = 0; i < (results.length >= 30 ? 30 : results.length); i++) {
      const video = results[i];

      listSections.push({
        title: `Video Nro ${i + 1}`,
        rows: [
          {
            header: '',
            title: `${video.title}\n`,
            description: `Autor: ${video.author}\nUrl: ${video.url}`,
            id: `${usedPrefix}tiktok ${video.url}`
          }
        ]
      });
    }

    await conn.sendList(m.chat, '*乂  T I K T O K  -  S E A R C H*', '> _Powered By Nakano Team', 'Seleccione un Video', 'https://qu.ax/fPmDc.jpg', listSections, m);
    await m.react('✅');
  } catch (error) {
    console.error(error);
    await m.react('✖️');
  }
}

handler.tags = ['search']
handler.help = ['tiktoksearch *<búsqueda>*']
handler.command = ['tiktoksearch', 'tiktoks'];

export default handler;
