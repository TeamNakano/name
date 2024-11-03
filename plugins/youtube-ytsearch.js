import { prepareWAMessageMedia, generateWAMessageFromContent, getDevice } from '@whiskeysockets/baileys';
import axios from 'axios';

const handler = async (m, { conn, text, usedPrefix, command, args }) => {
    const device = await getDevice(m.key.id);

    if (!args[0]) return m.reply(`🚩 Ejemplo: *${usedPrefix + command}* Lil Peep hate my life`);
    
    await m.react('🕗');
    
    
    const response = await axios.get(`https://deliriussapi-oficial.vercel.app/search/ytsearch?q=${encodeURIComponent(text)}`);
    const results = response.data;

    
    if (!results.status || !results.data || results.data.length === 0) {
        await m.react('❌');
        return m.reply(`❌ Lo siento, no encontré resultados para *${text}*. Intenta con otro término de búsqueda.`);
    }

    await m.react('✅');

    // Editar tecto no la sintaxis 
    const firstVideo = results.data[0];
    const firstVideoInfo = `
*✨ Primer Resultado de Búsqueda:*
*📌 Título:* ${firstVideo.title}
*📅 Publicado:* ${firstVideo.publishedAt}
*🕗 Duración:* ${firstVideo.duration}
*👁️ Vistas:* ${firstVideo.views}
*💬 Enlace:* ${firstVideo.url}
`.trim();

    
    var mediaMessage = await prepareWAMessageMedia({ image: { url: 'https://qu.ax/rLO.jpg' } }, { upload: conn.waUploadToServer });

    const interactiveMessage = {
        body: { 
            text: `${firstVideoInfo}\n\nResultados de: *${text}*`,  
        },
        footer: { text: '✨ Powered by Team Nakano' },  
        header: {
            title: `*乂  Y T  -  S E A R C H 💞*`,
            hasMediaAttachment: true,
            imageMessage: mediaMessage.imageMessage,
        },
        nativeFlowMessage: {
            buttons: [
                {
                    name: 'single_select',
                    buttonParamsJson: JSON.stringify({
                        title: 'Mas resultados',
                        sections: results.data.map((video) => ({
                            title: `${video.title}`, highlight_label: `${video.duration}`, 
                            rows: [
                                {
                                    header: `✨ Duracion: ${video.duration}`,
                                    title: '🎧 Descargar como MP3',  
                                    description: `💬 Url: ${video.url}`,  
                                    id: `${usedPrefix}ytmp3 ${video.url}`
                                },
                                {
                                    header: `✨ Duracion: ${video.duration}`,
                                    title: '📄 Descargar MP3 (documento)', 
                                    description: `💬 Url: ${video.url}`,  
                                    id: `${usedPrefix}ytmp3doc ${video.url}`
                                },
                                {
                                    header: `✨ Duracion: ${video.duration}`,
                                    title: '🎬 Descargar como MP4',  
                                    description: `💬 Url: ${video.url}`,  
                                    id: `${usedPrefix}ytmp4 ${video.url}`
                                },
                                {
                                    header: `✨ Duracion: ${video.duration}`,
                                    title: '📄 Descargar MP4 (documento)',  
                                    description: `💬 Url: ${video.url}`,  
                                    id: `${usedPrefix}ytmp4doc ${video.url}`
                                }
                            ]
                        }))
                    })
                }
            ],
            messageParamsJson: ''
        }
    };

    let msg = generateWAMessageFromContent(m.chat, {
        viewOnceMessage: {
            message: {
                interactiveMessage,
            },
        },
    }, { userJid: conn.user.jid, quoted: m });
    
    conn.relayMessage(m.chat, msg.message, { messageId: msg.key.id });
};

handler.help = ['ytsearch <texto>'];
handler.tags = ['search'];
handler.command = ['ytsearch', 'yts', 'searchyt', 'buscaryt', 'videosearch', 'audiosearch'];
handler.register = false;
handler.group = false;

export default handler;
