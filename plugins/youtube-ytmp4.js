import fetch from 'node-fetch';

let handler = async (m, { conn, args }) => {
    if (!args[0]) return conn.reply(m.chat, '🚩 Por favor, ingresa un enlace de YouTube.', m);

    await m.react('🕗');

    try {
        let url = `https://widipe.com/download/ytdl?url=${encodeURIComponent(args[0])}`;
        let response = await fetch(url);
        let json = await response.json();

        
        if (json.status && json.result && json.result.mp4) {
            let { title, mp4 } = json.result;

            
            await conn.sendFile(m.chat, mp4, `${title}.mp4`, '', m);

            await m.react('✅');
        } else {
            await conn.reply(m.chat, '🚩 No se pudo obtener el archivo de video.', m);
            await m.react('❌');
        }
    } catch (error) {
        console.error(error);
        await conn.reply(m.chat, '🚩 Ocurrió un error al procesar tu solicitud.', m);
        await m.react('❌');
    }
};

handler.help = ['ytmp4 <link>'];
handler.command = /^(ytmp4)$/i; 
handler.tags = ['downloader'];

export default handler;
