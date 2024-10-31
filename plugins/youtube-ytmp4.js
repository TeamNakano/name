import { ytmp4 } from '@StarlightsTeam/Scraper';
import fetch from 'node-fetch';

let handler = async (m, { conn, args, text, usedPrefix, command }) => {
    // Verificar si el texto (enlace) fue proporcionado
    if (!text) return await m.reply('🚩 Por favor, ingresa un enlace de YouTube válido.');

    try {
        await m.react("🕐"); // Reaccionar con reloj mientras se procesa

        // Obtener URL de descarga y miniatura del video
        const { dl_url, thumbnail } = await ytmp4(text);

        // Verificar si la URL de descarga es válida
        if (!dl_url) {
            await m.react("✖️"); // Reacción en caso de error
            return await m.reply('🚩 No se pudo obtener el enlace de descarga.');
        }

        // Enviar el video como mensaje con miniatura y contexto
        await conn.sendMessage(m.chat, {
            video: { url: dl_url },
            caption: '\n*𝑈𝑊-BOT*',
            thumbnail: thumbnail ? await fetch(thumbnail).then(res => res.buffer()) : null
        }, { quoted: m });

        await m.react("✅"); // Reacción de éxito
    } catch (error) {
        console.error(error);
        await m.react("✖️"); // Reacción en caso de error
        await m.reply('🚩 Ocurrió un error al procesar el video de YouTube.');
    }
};

// Configuración del comando
handler.command = ['ytmp4'];
export default handler;
