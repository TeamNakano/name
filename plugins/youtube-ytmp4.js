import { ytmp4 } from '@StarlightsTeam/Scraper';
import fetch from 'node-fetch';

let handler = async (m, { conn, args, text }) => {
    
    if (!text) return await m.reply('🚩 Por favor, ingresa un enlace de YouTube válido.');

    try {
        await m.react("🕐"); 

        
        const { title, size, quality, thumbnail, dl_url } = await ytmp4(text);

        
        if (!dl_url) {
            await m.react("✖️"); 
            return await m.reply('🚩 No se pudo obtener el enlace de descarga.');
        }

        
        const videoSize = parseFloat(size) || 0;
        if (videoSize > 1000) {
            await m.react("⚠️");
            return await m.reply(`🚩 El archivo es demasiado grande para enviarlo (máximo 1 GB). Tamaño: ${size} MB`);
        }

        
        await conn.sendMessage(m.chat, {
            document: { url: dl_url },
            mimetype: 'video/mp4',
            fileName: `${title}.mp4`,
            caption: `🎬 *${title}*\n📏 *Tamaño:* ${size} MB\n🔍 *Calidad:* ${quality}`,
            thumbnail: thumbnail ? await fetch(thumbnail).then(res => res.buffer()) : null
        }, { quoted: m });

        await m.react("✅"); // Reacción de éxito
    } catch (error) {
        console.error(error);
        await m.react("✖️"); 
        //await m.reply('🚩 Ocurrió un error al procesar el video de YouTube.');
    }
};


handler.command = ['ytmp4'];

export default handler;
