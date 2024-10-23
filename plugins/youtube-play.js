

import { prepareWAMessageMedia, generateWAMessageFromContent } from '@whiskeysockets/baileys';
import yts from 'yt-search';

const handler = async (m, { conn, text, usedPrefix, command, args }) => {
    if (!args[0]) return m.reply(`*¿Qué quieres que busque, tu botsita Nakano?* 😘`);

    await m.react('🕗');

    const results = await yts(text);
    const video = results.videos[0]; 

    if (!video) {
        await m.react('❌');
        return m.reply(`❌ Lo siento, no encontré resultados para *${text}*. Intenta con otro término de búsqueda.`);
    }

    await m.react('✅');

    
    var mediaMessage = await prepareWAMessageMedia({ image: { url: video.thumbnail } }, { upload: conn.waUploadToServer });

    
    const videoInfo = `
*💞 Título:* ${video.title}
*📅 Creado:* ${video.ago}
*🕗 Duración:* ${video.timestamp}
*👁️ Vistas:* ${video.views.toLocaleString()}
*💬 Link:* ${video.url}
    `.trim();

    
    const interactiveMessage = {
        body: {
            text: videoInfo,
        },
        footer: { text: 'Powered by Nakano Team' },
        header: {
            title: `*Y O U T U B E  -  P L A Y* 💞`,
            hasMediaAttachment: true,
            imageMessage: mediaMessage.imageMessage,
        },
        nativeFlowMessage: {
            buttons: [
                {
                    name: 'single_select',
                    buttonParamsJson: JSON.stringify({
                        title: 'Selecciona una opcion',
                        sections: [
                            {
                                title: `SELECCIONE EL FORMATO QUE DESEE`,
                                rows: [
                                    {
                                        header: video.title,
                                        title: 'MP3',
                                        description: `Descargar MP3`,
                                        id: `${usedPrefix}ytmp3 ${video.url}`
                                    },
                                    {
                                        header: video.title,
                                        title: 'MP3DOC',
                                        description: `Descargar MP3DOC (como documento)`,
                                        id: `${usedPrefix}ytmp3doc ${video.url}`
                                    },
                                    {
                                        header: video.title,
                                        title: 'MP4',
                                        description: `Descargar MP4`,
                                        id: `${usedPrefix}ytmp4 ${video.url}`
                                    },
                                    {
                                        header: video.title,
                                        title: 'MP4DOC',
                                        description: `Descargar MP4DOC (como documento)`,
                                        id: `${usedPrefix}ytmp4doc ${video.url}`
                                    }
                                ]
                            }
                        ]
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

handler.help = ['play <texto>'];
handler.tags = ['downloader'];
handler.command = ['play'];
handler.register = false;
handler.group = false;

export default handler;
