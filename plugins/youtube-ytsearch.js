import { prepareWAMessageMedia, generateWAMessageFromContent, getDevice } from '@whiskeysockets/baileys';
import yts from 'yt-search';

const handler = async (m, { conn, text, usedPrefix, command, args }) => {
    const device = await getDevice(m.key.id);

    if (!args[0]) return m.reply(`🚩 Ejemplo: *${usedPrefix + command}* Lil Peep hate my life`);
    
    await m.react('🕗');
    
    const results = await yts(text);
    const videos = results.videos.slice(0, 30);

    if (videos.length === 0) {
        await m.react('❌');
        return m.reply(`❌ Lo siento, no encontré resultados para *${text}*. Intenta con otro término de búsqueda.`);
    }

    await m.react('✅');

    
    var mediaMessage = await prepareWAMessageMedia({ image: { url: 'https://qu.ax/fPmDc.jpg' } }, { upload: conn.waUploadToServer });

    
    const interactiveMessage = {
        body: { 
            text: `Resultados de: *${text}*`,  
        },
        footer: { text: 'Powered by Nakano' },  
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
                        title: 'Seleccione un video',
                        sections: videos.map((video) => ({
                            title: video.title,
                            rows: [
                                {
                                    header: video.title,
                                    title: 'MP3',
                                    description: 'Descargar como MP3',
                                    id: `${usedPrefix}ytmp3 ${video.url}`
                                },
                                {
                                    header: video.title,
                                    title: 'MP3DOC',
                                    description: 'Descargar MP3 (como documento)',
                                    id: `${usedPrefix}ytmp3doc ${video.url}`
                                },
                                {
                                    header: video.title,
                                    title: 'MP4',
                                    description: 'Descargar como MP4',
                                    id: `${usedPrefix}ytmp4 ${video.url}`
                                },
                                {
                                    header: video.title,
                                    title: 'MP4DOC',
                                    description: 'Descargar MP4 (como documento)',
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
