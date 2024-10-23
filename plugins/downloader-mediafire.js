import axios from 'axios';

let handler = async (m, { conn, text, usedPrefix, command }) => {
    if (!text) return conn.reply(m.chat, `Ingresa la URL de la carpeta de MediaFire.\n\nEjemplo:\n${usedPrefix + command} https://www.mediafire.com/folder/4zhvcue3l75xa`, m);

    await m.react('🕗');

    try {
        
        const response = await axios.get(`https://deliriussapi-oficial.vercel.app/download/mediafire?url=${encodeURIComponent(text)}`, {
            headers: { accept: 'application/json' }
        });

        const { folder, data } = response.data;

        if (data.length === 0) {
            return conn.reply(m.chat, 'No se encontraron archivos en la carpeta de MediaFire.', m);
        }

        
        let message = `📁 *Carpeta MediaFire*: ${folder}\n\nArchivos disponibles:\n\n`;
        for (let file of data) {
            message += `🔹 *${file.filename}* (${file.size})\n➡️ [Descargar](${file.link})\n\n`;
        }

        
        await conn.reply(m.chat, message, m);
        await m.react('✅');

    } catch (error) {
        await m.react('❌');
        conn.reply(m.chat, 'Hubo un error al procesar tu solicitud. Verifica que el enlace de MediaFire sea válido.', m);
        console.error(error);
    }
};

handler.help = ['mediafire'];
handler.command = /^(mediafire)$/i;
handler.tags = ['downloader'];
handler.limit = false;

export default handler;
