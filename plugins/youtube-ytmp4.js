import axios from 'axios';

let handler = async (m, { conn: star, text, usedPrefix, command }) => {
    if (!text) return star.reply(m.chat, `Ingresa la URL del video de YouTube.\n\nEjemplo:\n${usedPrefix + command} https://youtu.be/4rDOsvzTicY?si=3Ps-SJyRGzMa83QT`, m);

    await m.react('🕗'); 
    
    try {
        const response = await axios.get(`https://api.betabotz.eu.org/api/download/ytmp4?url=${text}&apikey=btzKiyoEditz`);
        const res = response.data.result;
        var { mp4, title } = res;

        
        await star.sendMessage(m.chat, {
            video: { url: mp4 },
            mimetype: 'video/mp4',
            fileName: `${title}.mp4`
        }, { quoted: m });

        await m.react('✅'); 

    } catch (e) {
        await m.react('❌'); 
        star.reply(m.chat, 'Hubo un error al procesar tu solicitud. Verifica que el enlace de YouTube sea válido.', m);
        console.log(e);
    }
};

handler.help = ['ytmp4'];
handler.command = /^(ytmp4)$/i;
handler.tags = ['downloader'];
handler.limit = false;

export default handler;
