import axios from 'axios';

const handler = async (m, { conn, text, usedPrefix, command }) => {
    if (!text) {
        return conn.reply(m.chat, '*¿Qué quieres que busque, tu botsita nakano?*', m);
    }

    await m.react('🕗'); 

    try {
        
        const response = await axios.get(`https://deliriussapi-oficial.vercel.app/search/ytsearch?q=${encodeURIComponent(text)}`, {
            headers: { accept: 'application/json' }
        });

        const data = response.data;

        
        if (!data.status || !data.data || data.data.length === 0) {
            await m.react('❌'); 
            return m.reply(`❌ No se encontraron resultados para *${text}*.`);
        }

     
        const firstVideo = data.data[0];
        const { title, thumbnail, publishedAt, duration, views, url, author } = firstVideo;

        
        let txt = '*✨ Primer Resultado de Búsqueda:*\n';
        txt += `*📌 Título:* _${title}_\n`;
        txt += `*📅 Publicado:* _${publishedAt || 'Desconocido'}_\n`;
        txt += `*🕗 Duración:* _${duration || 'Desconocida'}_\n`;
        txt += `*👁️ Vistas:* _${views || 'Desconocidas'}_\n`;
        txt += `*💬 Enlace:* _[Ver Video](${url})_\n`;
        txt += `*👤 Autor:* _[${author.name || 'Desconocido'}](${author.url || '#'})_\n`;

        
        await conn.sendButton2(m.chat, txt, '', thumbnail, [
            ['Audio', `${usedPrefix}ytmp3 ${url}`],
            ['Video', `${usedPrefix}ytmp4 ${url}`]
        ], null, null, m);

        await m.react('✅'); 
    } catch (error) {
        console.error('Error en la búsqueda de YouTube:', error);
        await m.react('❌'); 
        await m.reply(`❌ Ocurrió un error al procesar la solicitud. Por favor, intenta de nuevo más tarde.`);
    }
};


handler.help = ['play <texto>'];
handler.tags = ['downloader'];
handler.command = ['play'];
handler.register = false;
handler.group = false;

export default handler;
