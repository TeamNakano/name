import axios from 'axios'

let handler = async (m, { conn, text }) => {
    if (!text) return conn.reply(m.chat, 'Ingrese una URL válida de Instagram', m)
    await m.react('🕒')
    try {
        let videoIg = text;
        let apiUrl = await axios.get(`https://deliriussapi-oficial.vercel.app/download/instagram?url=${encodeURIComponent(videoIg)}`)
        
        let res = apiUrl.data.data[0].url

        if (res) {
            await conn.sendFile(m.chat, res, 'igdl.mp4', 'Aquí tiene', m)
            await m.react('✅')
        } else {
            await m.react('✖️')
        }
    } catch {
       await m.react('✖️')
    }
}

handler.tags = ['downloader']
handler.help = ['igdl <url>']
handler.command = ['igdl', 'instagram', 'instagramdl']
handler.register = true

export default handler;
