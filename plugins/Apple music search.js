import fetch from 'node-fetch';
import { getDevice } from '@whiskeysockets/baileys';

let handler = async (m, { conn, command, text, usedPrefix }) => {
  if (!text) return conn.reply(m.chat, 'Ingresa el texto de lo que quieras buscar', m);

  await m.react('🕓');
  
  try {
    let response = await fetch(`https://deliriussapi-oficial.vercel.app/search/applemusic?text=${encodeURIComponent(text)}`);
    let results = await response.json();

    if (!results || results.length === 0) return conn.reply(m.chat, 'No se encontraron resultados', m);

    const firstTrack = results[0];
    const firstTrackInfo = `✨ *Primer Resultado* ✨\n\n` +
                           `*» Título* : ${firstTrack.title}\n` +
                           `*» Artista* : ${firstTrack.artists}\n` +
                           `*» Duración* : ${firstTrack.duration}\n\n`;

    // Preparar lista de resultados
    let listSections = [];
    for (let i = 0; i < (results.length >= 30 ? 30 : results.length); i++) {
      const track = results[i];
      
      listSections.push({
        title: '',
        rows: [
          {
            header: '',
            title: `Nro ${i + 1} - ${track.title}\n`,
            description: `Artista: ${track.artists}`,
            id: `${usedPrefix}applemusicdl ${track.url}`
          },
        ]
      });
    }

    // Enviar lista de resultados junto con la información del primer resultado
    await conn.sendList(
      m.chat,
      ' *A P P L E  M U S I C  -  S E A R C H* 💬',
      firstTrackInfo, // Información del primer resultado aquí
      'Seleccione una Canción',
      'https://qu.ax/fPmDc.jpg',
      listSections,
      m
    );
    await m.react('✅');
  } catch (error) {
    console.error(error);
    await m.react('✖️');
  }
};

handler.help = ['applemusicsearch *<búsqueda>*'];
handler.tags = ['search'];
handler.command = ['applemusicsearch', 'applemusic']; // Puedes añadir más comandos si lo deseas
handler.register = true;

export default handler;