import fetch from 'node-fetch';

let handler = async (m, { conn, text }) => {
    if (!text) {
        await m.react('❌');
        return conn.reply(m.chat, '✨ Por favor, proporciona la URL del video de YouTube.', m);
    }

    await m.react('⏳'); 

    const videoUrl = encodeURIComponent(text);
    const apiUrl = `https://api.ryzendesu.vip/api/downloader/ytmp4?url=${videoUrl}&reso=360`;

    try {
        const response = await fetch(apiUrl, { headers: { accept: 'application/json' } });
        const videoData = await response.json();

        if (videoData.status === "tunnel" && videoData.url) {
            await m.react('🕗'); 

           
            const videoResponse = await fetch(videoData.url);
            const buffer = await videoResponse.buffer();
            
            
            await conn.sendMessage(m.chat, { video: buffer, caption: `💬 *Calidad*: 360p` }, { quoted: m });
            await m.react('✅'); 
        } else {
            await m.react('❌');
            //await conn.reply(m.chat, '⚠️ No se pudo obtener el video.', m);
        }
    } catch (error) {
        console.error('🚩 Error al obtener el video:', error);
        await m.react('❌'); 
        //await conn.reply(m.chat, '⚠️ Ocurrió un error al procesar tu solicitud. Intenta más tarde.', m);
    }
};

// Detalles del comando
handler.help = ['ytmp4 <url>'];
handler.tags = ['downloader'];
handler.register = false;
handler.command = ['ytmp4'];

export default handler;
