//Nota le falta mucho a este comando sin embargo es una base prometedora

import axios from 'axios';

let handler = async (m) => {
    await m.react('🕓'); 

    try {
        
        const response = await axios.get('https://api.ryzendesu.vip/api/weebs/sfw-waifu', {
            headers: { accept: 'application/json' }
        });
        
        const data = response.data;

        if (data && data.url) {
            
            await conn.sendFile(m.chat, data.url, 'waifu.jpg', 'Aquí tienes una waifu random!', m);
            await m.react('✅'); 
        } else {
            conn.reply(m.chat, '❌ No se encontró una imagen de waifu.', m);
        }
    } catch (error) {
        console.error(error);
        conn.reply(m.chat, '❌ Hubo un error al obtener la imagen de waifu. Por favor, intenta de nuevo.', m);
    }
};

handler.help = ['randomwaifu'];
handler.tags = ['fun'];
handler.command = /^randomwaifu$/i;
handler.register = false;

export default handler;
