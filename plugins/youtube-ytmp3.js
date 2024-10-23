import axios from 'axios';

let handler = async (m, { conn, text, usedPrefix, command }) => {
    if (!text) return conn.reply(m.chat, `Ingresa la URL del video de YouTube.\n\nEjemplo:\n${usedPrefix + command} https://youtu.be/TdrL3QxjyVw`, m);

    await m.react('🕗'); 
    
    try {
        
        const response = await axios.get(`https://deliriussapi-oficial.vercel.app/download/ytmp3?url=${encodeURIComponent(text)}`, {
            headers: { accept: 'application/json' }
        });

        const { title, download } = response.data.data;

        
        await conn.sendMessage(m.chat, {
            audio: { url: download.url },
            mimetype: 'audio/mpeg',
            fileName: `${download.filename}`
        }, { quoted: m });

        await m.react('✅'); 

    } catch (e) {
        await m.react('❌'); 
        conn.reply(m.chat, 'Hubo un error al procesar tu solicitud. Verifica que el enlace de YouTube sea válido.', m);
        console.error(e);
    }
};

handler.help = ['ytmp3'];
handler.command = /^(ytmp3)$/i;
handler.tags = ['downloader'];
handler.limit = false;

export default handler;
