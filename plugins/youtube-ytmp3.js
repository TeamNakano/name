import ytdl from "ytdl-mp3";

let handler = async (m, { conn, args }) => {
    // Verificar si se proporcionó el enlace de YouTube
    if (!args[0]) return conn.reply(m.chat, '🚩 Por favor, ingresa un enlace de YouTube válido.', m);

    await m.react('🕗'); // Reacción de espera

    try {
        // Obtener la información y descarga del audio en MP3
        let data = await ytdl.ytdl(args[0]);

        // Verificar si se obtuvo la URL de descarga
        if (data && data.url) {
            // Enviar el archivo MP3 como documento
            await conn.sendMessage(m.chat, {
                document: { url: data.url },
                mimetype: 'audio/mpeg',
                fileName: `${data.title}.mp3`,
                contextInfo: { forwardingScore: 999, isForwarded: true } // Contexto de "reenviado muchas veces"
            }, { quoted: m });

            await m.react('✅'); // Reacción de éxito
        } else {
            await m.react('✖️'); // Reacción de error si no se encontró el enlace de descarga
            conn.reply(m.chat, '🚩 No se pudo obtener el audio.', m);
        }
    } catch (error) {
        console.error(error);
        await m.react('✖️'); // Reacción de error en caso de fallo
        conn.reply(m.chat, '🚩 Error al procesar el audio de YouTube.', m);
    }
};

// Configuración del comando
handler.command = ['ytmp3'];
handler.tags = ['downloader'];
handler.help = ['ytmp3 <enlace>'];
export default handler;
