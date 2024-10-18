let linkRegex = /(https?:\/\/(?:www\.)?(?:t\.me|telegram\.me|whatsapp\.com)\/\S+)|(https?:\/\/chat\.whatsapp\.com\/\S+)|(https?:\/\/whatsapp\.com\/channel\/\S+)/i

export async function before(m, { isAdmin, isBotAdmin }) {
    if (m.isBaileys && m.fromMe)
        return !0
    if (!m.isGroup) return !1
    let chat = global.db.data.chats[m.chat]
    let delet = m.key.participant
    let bang = m.key.id
    let bot = global.db.data.settings[this.user.jid] || {}
    const isGroupLink = linkRegex.exec(m.text)
    const grupo = `https://chat.whatsapp.com`

    
    if (isAdmin && chat.antiLink && m.text.includes(grupo)) return conn.sendMessage(m.chat, { react: { text: "✅", key: m.key } })

    
    if (chat.antiLink && isGroupLink && !isAdmin) {
        if (isBotAdmin) {
            const linkThisGroup = `https://chat.whatsapp.com/${await this.groupInviteCode(m.chat)}`
            if (m.text.includes(linkThisGroup)) return conn.sendMessage(m.chat, { react: { text: "✅", key: m.key } })
        }

        await conn.sendMessage(m.chat, { react: { text: "❌", key: m.key } })

        
        if (!isBotAdmin) {
            return conn.reply(m.chat, `❌ *Necesito ser administradora para poder eliminar a usuarios que compartan enlaces.*`, m)
        }

        
        if (isBotAdmin) {
            await conn.sendMessage(m.chat, { delete: { remoteJid: m.chat, fromMe: false, id: bang, participant: delet } })
            await conn.groupParticipantsUpdate(m.chat, [m.sender], 'remove')

            
            let username = await this.getName(m.sender)
            await conn.sendMessage(m.chat, { text: `🚫 *Elimine a ${username} por que el antilink esta activo.*` })
        } else if (!bot.restrict) return
    }
    return !0
}
