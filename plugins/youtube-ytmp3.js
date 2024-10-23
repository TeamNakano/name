import axios from 'axios';

let handler = async (m, { conn: star, text, usedPrefix, command }) => {
    // Validar si se proporcionó el texto (URL)
    if (!text) return star.reply(m.chat, `Por favor, ingresa la URL del video.\n\nEjemplo:\n${usedPrefix + command} https://youtu.be/C8mJ8943X80`, m, rcanal);

    // Reacciona con 🕗 mientras se procesa la solicitud
    await m.react('🕗');

    try {
        // Realiza la solicitud a la API para descargar el MP3
        const response = await axios.get(`https://api.betabotz.eu.org/api/download/ytmp3?url=${text}&apikey=btzKiyoEditz`);
        const res = response.data.result;

        // Desestructura la respuesta
        var { mp3, id, title, source, duration, thumb } = res;

        // Crear el mensaje de respuesta
        let caption = `
  Y O U T U B E  M P 3  
 💞 *Título:* ${title}
 💞 *ID:* ${id}
 💞 *Duración:* ${duration} segundos
 💞 *Enlace Original:* ${source}
 💞 *Calidad:* Media.
`;

        // Envía la imagen y los detalles del video
        await star.sendMessage(m.chat, {
            image: { url: thumb },
            caption: caption
        }, { quoted: m });

        // Envía el archivo de audio MP3 en alta calidad
        await star.sendMessage(m.chat, {
            audio: { url: mp3 },
            mimetype: 'audio/mpeg',
            fileName: `${title}.mp3`,
            ptt: false // Indica que se enviará como archivo de audio y no como mensaje de voz
        }, { quoted: m });

        // Reacciona con ✅ si la solicitud es exitosa
        await m.react('✅');

    } catch (e) {
        // Reacciona con ❌ si hay un error
        await m.react('❌');
        console.error(e);
        star.reply(m.chat, 'Hubo un error al procesar tu solicitud. Verifica que el enlace de YouTube sea válido.', m);
    }
};

handler.help = ['ytmp3'];
handler.command = /^(ytmp3)$/i;
handler.tags = ['downloader'];

export default handler;
