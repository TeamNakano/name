let handler = async (m, { conn, usedPrefix, command, text }) => {
  try {
    let q = m.quoted ? m.quoted : m;
    let mime = (q.msg || q).mimetype || '';

    if (!mime || !/webp/.test(mime)) throw '᪥ 𝑷𝒐𝒓 𝒇𝒂𝒗𝒐𝒓 𝒓𝒆𝒔𝒑𝒐𝒏𝒅𝒆 𝒂 𝒖𝒏 𝒔𝒕𝒊𝒄𝒌𝒆𝒓.';
    let sticker = await q.download();
    if (!sticker) throw 'No se pudo descargar el sticker.';
    const imageBuffer = Buffer.from(sticker, 'base64');
    await conn.sendMessage(m.chat, { image: imageBuffer }, { quoted: m });
  } catch (e) {
    console.error(e);
    m.reply(`𝑵𝒐𝒕𝒂: ${e}`);
  }
};

handler.help = ['toimg'].map(v => v + ' (responde a un sticker)');
handler.tags = ['tools'];
handler.command = ['toimg']

export default handler;
