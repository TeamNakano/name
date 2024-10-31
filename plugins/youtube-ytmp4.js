import yts from 'yt-search';
import fetch from "node-fetch";

const handler = async (m, { text, usedPrefix, command, conn }) => {
    if (!text) {
        throw await m.reply("✨ Ingresa una consulta o link de *YouTube*");
    }
    await m.react('🕓');
    
    let res = await yts(text);
    let videoList = res.all;
    let videos = videoList[0];

    async function ytdl(url) {
        const response = await fetch('https://shinoa.us.kg/api/download/ytdl', {
            method: 'POST',
            headers: {
                'accept': '*/*',
                'api_key': 'free',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                text: url
            })
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        return data;
    }

    let data_play = await ytdl(videos.url);
    console.log(data_play);

    if (data_play && data_play.data && data_play.data.mp4) {
        const videoTitle = videos.title; // Título del video
        const videoQuality = data_play.data.quality || 'auto'; 
        const caption = `✨ *Título:* ${videoTitle}\n💬 *Calidad:* ${videoQuality}`;

        await conn.sendMessage(m.chat, { 
            video: { url: data_play.data.mp4 }, 
            mimetype: 'video/mp4',
            caption: caption 
        }, { quoted: m });
        
        await m.react('✅'); 
    } else {
        await m.reply("❌ No se pudo obtener el video.");
        await m.react('❌'); 
    }
};

handler.help = ['ytmp4 <yt url>'];
handler.tags = ['downloader'];
handler.command = ['ytmp4'];
handler.register = true;

export default handler;
