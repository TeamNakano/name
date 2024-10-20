


import fetch from 'node-fetch';

let handler = async (m, { conn, args }) => {
    if (!args[0]) return conn.reply(m.chat, '🚩 Por favor, ingresa un enlace de YouTube.', m, rcanal);

    await m.react('🕗');  

    try {
        let url = `https://widipe.com/download/ytdl?url=${encodeURIComponent(args[0])}`;
        let response = await fetch(url);
        let json = await response.json();

        if (json.status && json.result && json.result.mp4) {
            let { title, thumbnail, duration, views, mp4, size } = json.result;
            let mp4Url = mp4;

            
            let sizeMB = parseFloat(size);

            
            if (sizeMB > 130) {
                return conn.reply(m.chat, `🚩 El video es demasiado grande (${sizeMB} MB). El límite es 130 MB.`, m);
            }

            
            let message = `
*💞 Título:* ${title}
*💞 Duración:* ${duration}
*💞 Vistas:* ${views}
*💞 Tamaño:* ${size}
*💞 Enlace Original:* ${json.result.url}
            `.trim();

            
            await conn.sendFile(m.chat, thumbnail, 'thumbnail.jpg', message, m);

            
            await conn.sendFile(m.chat, mp4Url, `${title}.mp4`, '', m, false, { mimetype: 'video/mp4' });

            await m.react('✅'); 
        } else {
            await conn.reply(m.chat, '🚩 No se pudo obtener el archivo de video MP4.', m);
            await m.react('❌');  
        }
    } catch (error) {
        console.error(error);
        await conn.reply(m.chat, '🚩 Ocurrió un error al procesar tu solicitud puede que el video sea muy pesado intente con .ytmp4doc.', m, rcanal);
        await m.react('❌');  
    }
};

handler.help = ['ytmp4'];
handler.command = /^(ytmp4)$/i;
handler.tags = ['downloader'];  
export default handler;
