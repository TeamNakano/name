import fetch from 'node-fetch';

let handler = async (m, { conn, args }) => {
    if (!args[0]) return conn.reply(m.chat, '🚩 Por favor, ingresa un enlace de YouTube.', m);

    await m.react('🕗');  

    try {
        let url = `https://widipe.com/download/ytdl?url=${encodeURIComponent(args[0])}`;
        let response = await fetch(url);
        let json = await response.json();

        if (json.status && json.result && json.result.mp3) {
            let { title, thumbnail, duration, views, mp3 } = json.result;
            let mp3Url = mp3;

            
            let message = `
*💞 Título:* ${title}
*💞 Duración:* ${duration}
*💞 Vistas:* ${views}
*💞 Enlace Original:* ${json.result.url}
            `.trim();

            
            await conn.sendFile(m.chat, thumbnail, 'thumbnail.jpg', message, m);

            
            await conn.sendFile(m.chat, mp3Url, `${title}.mp3`, '', m, false, { mimetype: 'audio/mpeg' });

            await m.react('✅');  
        } else {
            await conn.reply(m.chat, '🚩 No se pudo obtener el archivo MP3.', m);
            await m.react('❌'); 
        }
    } catch (error) {
        console.error(error);
        await conn.reply(m.chat, '🚩 Ocurrió un error al procesar tu solicitud.', m);
        await m.react('❌'); 
    }
};

handler.help = ['ytmp3'];
handler.command = /^(ytmp3)$/i;
handler.tags = ['downloader'];
handler.limit = false;  
export default handler;
