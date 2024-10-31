
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
                            title: `${video.title}`,
                            rows: [
                                {
                                    header: `✨ ${video.title}`,
                                    title: `💬 ${video.url}`,  
                                    description: '🎧 Descargar como MP3',
                                    id: `${usedPrefix}ytmp3 ${video.url}`
                                },
                                {
                                    header: `✨ ${video.title}`,
                                    title: `💬 ${video.url}`,  
                                    description: '📄 Descargar MP3 (documento)',
                                    id: `${usedPrefix}ytmp3doc ${video.url}`
                                },
                                {
                                    header: `✨ ${video.title}`,
                                    title: `💬 ${video.url}`,  
                                    description: '🎬 Descargar como MP4',
                                    id: `${usedPrefix}ytmp4 ${video.url}`
                                },
                                {
                                    header: `✨ ${video.title}`,
                                    title: `💬 ${video.url}`,  
                                    description: '📄 Descargar MP4 (documento)',
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
