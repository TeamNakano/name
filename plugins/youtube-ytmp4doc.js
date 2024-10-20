import fetch from 'node-fetch';

let handler = async (m, { conn, args }) => {
    if (!args[0]) return conn.reply(m.chat, '🚩 Por favor, ingresa un enlace de YouTube.', m);

    await m.react('🕗');  

    try {
        let url = `https://widipe.com/download/ytdl?url=${encodeURIComponent(args[0])}`;
        let response = await fetch(url);
        let json = await response.json();

        if (json.status && json.result && json.result.mp4) {
            let { title, thumbnail, duration, views, mp4, size } = json.result;

           
            let mp4Url = mp4;  

           
            let message = `
*💞 Título:* ${title}
*💞 Duración:* ${duration}
*💞 Vistas:* ${views}
*💞 Tamaño:* ${size}
*💞 Enlace Original:* ${json.result.url}
*💞 Calidad:* Alta (si está disponible)
            `.trim();

            
            await conn.sendFile(m.chat, thumbnail, 'thumbnail.jpg', message, m);

            
            await conn.sendFile(m.chat, mp4Url, `${title}.mp4`, '', m, false, { asDocument: true });

            await m.react('✅');  
        } else {
            await conn.reply(m.chat, '🚩 No se pudo obtener el archivo de video MP4DOC.', m);
            await m.react('❌');  
        }
    } catch (error) {
        console.error(error);
        await conn.reply(m.chat, '🚩 Ocurrió un error al procesar tu solicitud.', m);
        await m.react('❌');  
    }
};

handler.help = ['ytmp4doc'];
handler.command = /^(ytmp4doc)$/i;
handler.tags = ['downloader'];  
export default handler;
