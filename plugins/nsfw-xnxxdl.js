import fg from 'api-dylux'

let handler = async (m, { conn, args, command, usedPrefix }) => {
    if (!args[0]) return conn.reply(m.chat, `Ingresa un enlace de xnxx`, m)

    try {
        
        await m.react('🕗')

        let { title, quality, duration, size, thumb, url_dl: dl } = await fg.xnxxdl(args[0])
        let txt = `*Nombre:* ${title}
*Tamaño:* ${size}
*Calidad:* ${quality}
*Duracion:* ${duration}`.trim()

        
        await conn.sendFile(m.chat, dl, title + '.mp4', ``, m, false, { asDocument: true }) 
        
        
        await m.react('✅')
    } catch (error) {
        console.log(error)
        
        await m.react('✖️')
    }
}

handler.tags = ['nsfw', 'downloader']
handler.help = ['xnxxdl *<url>*']
handler.command = ['xnxxdl']

export default handler
