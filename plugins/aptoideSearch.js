import Starlights from '@StarlightsTeam/Scraper';

let handler = async (m, { conn, command, text, usedPrefix }) => {
    if (!text) return conn.reply(m.chat, '🚩 Ingresa el nombre de la aplicación que deseas buscar en Aptoide.', m);

    await m.react('🕓');

    try {
        let results = await Starlights.aptoideSearch(text);
        if (!results || results.length === 0) return conn.reply(m.chat, '❌ No se encontraron resultados', m);

        
        let listSections = [];

        
        const firstApp = results[0];
        listSections.push({
            title: `✨ **Primer resultado:**`,
            highlight_label: 'Popular',
            rows: [
                {
                    header: '',
                    title: `⭐ ${firstApp.name}`,
                    description: `📦 ID: ${firstApp.id}\n🔗 Url: https://m.aptoide.com/app/${firstApp.id}`,
                    id: `${usedPrefix}aptoidedl ${firstApp.id}`
                }
            ]
        });

        
        for (let i = 1; i < (results.length >= 30 ? 30 : results.length); i++) {
            const app = results[i];

            listSections.push({
                title: `Aplicación Nro ${i + 1}`,
                rows: [
                    {
                        header: '',
                        title: `⭐ ${app.name}`,
                        description: `📦 ID: ${app.id}\n🔗 Url: https://m.aptoide.com/app/${app.id}`,
                        id: `${usedPrefix}aptoidedl ${app.id}`
                    }
                ]
            });
        }

        
        await conn.sendList(m.chat, `*💞 A P T O I D E - B Ú S Q U E D A*`, `Resultados de: *${text}*`, 'Resultados', 'https://qu.ax/dXXhQ.jpg', listSections, m);
        
        await m.react('✅');
    } catch (error) {
        console.error(error);
        await m.react('✖️');
    }
};

handler.tags = ['search'];
handler.help = ['aptoidesearch *<búsqueda>*'];
handler.command = ['aptoidesearch', 'aptoide','apkmod', 'apk'];

export default handler;
