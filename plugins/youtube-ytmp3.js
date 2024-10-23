//Power by Starlight Team

import Starlights from '@StarlightsTeam/Scraper'
import fetch from 'node-fetch' 
let limit = 100

let handler = async (m, { conn, args, usedPrefix, command }) => {
    if (!args[0]) return conn.reply(m.chat, '[ ✰ ] Ingresa el enlace del vídeo de *YouTube* junto al comando.', m)

    await m.react('🕓')
    try {
        let { dl_url } = await Starlights.ytmp3v2(args[0])
        await conn.sendMessage(m.chat, { audio: { url: dl_url }, fileName: 'audio.mp3', mimetype: 'audio/mp4' }, { quoted: m })
        await m.react('✅')
    } catch {
        await m.react('✖️')
    }
}

handler.help = ['ytmp3 *<link yt>*']
handler.tags = ['downloader']
handler.command = ['ytmp3', 'yta', 'fgmp3']
handler.register = false

export default handler
