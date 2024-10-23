import fetch from 'node-fetch';

let handler = async (m, { conn, args }) => {
    if (!args[0]) return conn.reply(m.chat, '🚩 Por favor, ingresa un enlace de YouTube.', m);

    await m.react('🕗');

    try {
        let url = `https://widipe.com/download/ytdl?url=${encodeURIComponent(args[0])}&type=mp3`; // Aseguramos que sea mp3
        let response = await fetch(url);
        let json = await response.json();

        if (json.status && json.result && json.result.mp3) {
            let { title, mp3 } = json.result;

            
            await conn.sendMessage(m.chat, {
                audio: { url: mp3 },
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
