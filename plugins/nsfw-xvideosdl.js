import fg from 'api-dylux';

let handler = async (m, { conn, args, command, usedPrefix }) => {
    if (!args[0]) return conn.reply(m.chat, `Ingresa un enlace de xvideos`, m, rcanal);

    await m.react('🕗');  

    try {
        let { title, url_dl: dl } = await fg.xvideosdl(args[0]);  
        await conn.sendFile(m.chat, dl, `${title}.mp4`, '', m, false, { asDocument: true });  
        await m.react('✅');  
    } catch (error) {
        console.log(error);
        await m.react('❌');  
    }
};

handler.command = ['xvideosdl'];

export default handler;
