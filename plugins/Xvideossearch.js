import fetch from 'node-fetch';

let handler = async (m, { conn, command, text, usedPrefix }) => {
    if (!text) return conn.reply(m.chat, '🚩 Por favor, ingresa el texto de lo que quieres buscar en Xvideos.', m);

    await m.react('🕗'); 

    try {
        let xvideos = [];
        let response = await fetch(`https://api.fgmods.xyz/api/search/xvideosearch?text=${encodeURIComponent(text)}&apikey=ybvbaKzV`);
        let data = await response.json();

        if (!data.result || data.result.length === 0) {
            await m.react('✖️'); 
            return conn.reply(m.chat, '🚩 No se encontraron resultados.', m);
        }

        
        const maxResults = Math.min(data.result.length, 30);
        
        for (let i = 0; i < maxResults; i++) {
            xvideos.push({
                title: '',
                rows: [
                    {
                        header: '',
                        title: `${data.result[i].title}`, 
                        description: `Resultado #${i + 1}\nEnlace: ${data.result[i].url}`, 
                        id: `${usedPrefix}xvideosdl ${data.result[i].url}` 
                    }
                ]
            });
        }

        
        const imageUrl = 'https://qu.ax/fPmDc.jpg';

        
        await conn.sendList(
            m.chat, 
            '*XVIDEOS  - SEARCH*\n\n> 💞 Powered By Nakano Team', 
            `Resultados de:\n*${text.toUpperCase()}*`, 
            'Seleccione un video', 
            imageUrl, 
            xvideos, 
            m
        );

        await m.react('✅'); 
    } catch (error) {
        console.log(error);
        await m.react('✖️'); 
    }
};

handler.tags = ['search'];
handler.command = ['xvsearch']; 
handler.help = ['xvsearch *<búsqueda>*']; 

export default handler;
