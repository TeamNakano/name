import axios from 'axios';

let handler = async (m, { conn: star, text, usedPrefix, command }) => {
   
    if (!text) return star.reply(m.chat, `Por favor, ingresa la URL del video.\n\nEjemplo:\n${usedPrefix + command} https://youtu.be/C8mJ8943X80`, m);

    
    await m.react('🕗');

    try {
        
        const response = await axios.get(`https://api.betabotz.eu.org/api/download/ytmp3?url=${text}&apikey=btzKiyoEditz`);
        const res = response.data.result;

        
        var { mp3 } = res;

        
        await star.sendMessage(m.chat, {
            audio: { url: mp3 },
            mimetype: 'audio/mpeg',
            fileName: `audio.mp3`, 
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
