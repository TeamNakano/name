import fetch from 'node-fetch';

let handler = async (m, { conn, args }) => {
    if (!args[0]) return conn.reply(m.chat, '🚩 Por favor, ingresa un enlace de YouTube.', m);

    await m.react('🕗');

    try {
        
        let url = `https://api.ryzendesu.vip/api/downloader/y2mate?url=${encodeURIComponent(args[0])}`;
        let response = await fetch(url);
        let json = await response.json();

        
        if (json.type === "download" && json.download && json.download.dl.mp3) {
            let { title } = json.download;
            let mp3Url = json.download.dl.mp3['128kbps'].url; 

            await conn.sendMessage(m.chat, {
                audio: { url: mp3Url },
                mimetype: 'audio/mpeg',
                fileName: `${title}.mp3`
            }, { quoted: m });

            await m.react('✅');
        } else {
            await conn.reply(m.chat, '🚩 No se pudo obtener el archivo de audio MP3.', m);
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

export default handler;
