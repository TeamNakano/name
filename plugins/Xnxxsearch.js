import fg from 'api-dylux';

let handler = async (m, { conn, command, text, usedPrefix }) => {
    if (!text) return conn.reply(m.chat, '🚩 Por favor, ingresa el texto de lo que quieres buscar.', m);

    await m.react('🕗');

    try {
        let xnxx = [];
        let { result } = await fg.xnxxSearch(text);

        if (!result || result.length === 0) {
            await m.react('✖️'); 
            return conn.reply(m.chat, '🚩 No se encontraron resultados.', m);
        }

        for (let i = 0; i < result.length; i++) {
            xnxx.push({
                title: '',
                rows: [
                    {
                        header: '',
                        title: `${result[i].title}`, 
                        description: `Resultado #${i + 1}\nEnlace: ${result[i].link}`,  
                        id: `${usedPrefix}xnxxdl ${result[i].link}` 
                    }
                ]
            });
        }

        const imageUrl = 'https://qu.ax/fPmDc.jpg';

        
        await conn.sendList(m.chat, '*XNXX  - SEARCH*\n\n> _Powered by Nakano Team_', `Resultados de:\n*${text.toUpperCase()}*`, 'Seleccione un vídeo', imageUrl, xnxx, m);

        await m.react('✅');
    } catch (error) {
        console.log(error);
        await m.react('✖️'); 
    }
};

handler.command = ['xnxxsearch'];
handler.tags = ['search']
handler.help = ['xnxxsearch *<texto>*']
export default handler;