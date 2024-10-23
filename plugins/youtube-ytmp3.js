import axios from 'axios';

let handler = async (m, { conn: star, text, usedPrefix, command }) => {
    if (!text) return star.reply(m.chat, `Ingresa la URL del video de YouTube.\n\nEjemplo:\n${usedPrefix + command} https://youtu.be/4rDOsvzTicY?si=3Ps-SJyRGzMa83QT`, m);

    await m.react('🕗'); 
    
    try {
        const response = await axios.get(`https://api.ryzendesu.vip/api/downloader/y2mate?url=${encodeURIComponent(text)}`);
        const res = response.data.download;
        var { title } = res;

        
        let mp3Url = res.dl.mp3['128kbps'].url;

        await star.sendMessage(m.chat, {
            audio: { url: mp3Url },
            mimetype: 'audio/mpeg',
            fileName: `${title}.mp3`,
            caption: `💬 *Título del Video:* ${title}`
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
