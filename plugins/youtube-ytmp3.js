




import axios from 'axios';

let handler = async (m, { conn: star, text, usedPrefix, command }) => {
    if (!text) return star.reply(m.chat, `Ingresa la URL del video de YouTube.\n\nEjemplo:\n${usedPrefix + command} https://youtu.be/4rDOsvzTicY?si=3Ps-SJyRGzMa83QT`, m);

    await m.react('🕗'); 
    
    try {
        const response = await axios.get(`https://api.betabotz.eu.org/api/download/ytmp3?url=${text}&apikey=btzKiyoEditz`);
        const res = response.data.result;
        var { mp3, title } = res;

        
        await star.sendMessage(m.chat, {
            audio: { url: mp3 },
            mimetype: 'audio/mpeg',
            fileName: `${title}.mp3`
        }, { quoted: m });

        await m.react('✅'); 

    } catch (e) {
        await m.react('❌'); 
        star.reply(m.chat, 'Hubo un error al procesar tu solicitud. Verifica que el enlace de YouTube sea válido.', m);
        console.log(e);
    }
};

handler.help = ['ytmp3'];
handler.command = /^(ytmp3)$/i;
handler.tags = ['downloader'];
handler.limit = false;

export default handler;
