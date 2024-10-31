import { ytmp4 } from '@StarlightsTeam/Scraper'
import fetch from 'node-fetch'
let handler = async (m, { conn, args, text, usedPrefix, command }) => {
if (!text) await m.reply('')
let {dl_url, thumbnail} = await ytmp4(text)
//m.reply(dl_url)
m.react("⏰")
     conn.sendMessage(m.chat, { video: { url: dl_url }, caption: `\n*𝑈𝑊-BOT*`, thumbnail: await fetch(thumbnail) }, { quoted: m }) m.react("✔️")
}
handler.command = ['ytmp4']
export default handler
