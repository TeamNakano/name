import axios from 'axios';

let handler = async (m, { conn: star, text, usedPrefix, command }) => {
    
    if (!text) return star.reply(m.chat, `Por favor, ingresa la URL del video.\n\nEjemplo:\n${usedPrefix + command} https://youtu.be/C8mJ8943X80`, m, rcanal);

    
    await m.react('🕗');

    try {
        
        const response = await axios.get(`https://api.betabotz.eu.org/api/download/ytmp3?url=${text}&apikey=btzKiyoEditz`);
        const res = response.data.result;

        
        var { mp3, id, title, source, duration, thumb } = res;

        
        let caption = `
  Y O U T U B E  M P 3  
 💞 *Título:* ${title}
 💞 *ID:* ${id}
 💞 *Duración:* ${duration} segundos
 💞 *Enlace Original:* ${source}
 💞 *Calidad:* Media.
`;

        
        await star.sendMessage(m.chat, {
            image: { url: thumb },
            caption: caption
        }, { quoted: m });

        
        await star.sendMessage(m.chat, {
            audio: { url: mp3 },
            mimetype: 'audio/mpeg',
            fileName: `${title}.mp3`,
            ptt: false 
        }, { quoted: m });

        
        await m.react('✅');

    } catch (e) {
        
        await m.react('❌');
        console.error(e);
        star.reply(m.chat, 'Hubo un error al procesar tu solicitud. Verifica que el enlace de YouTube sea válido.', m);
    }
};

handler.help = ['ytmp3'];
handler.command = /^(ytmp3)$/i;
handler.tags = ['downloader'];

export default handler;
