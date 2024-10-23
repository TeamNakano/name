import fetch from 'node-fetch';

const mediaFireHandler = async (m, { conn }) => {
    const folderUrl = 'https://www.mediafire.com/folder/4zhvcue3l75xa/Delirius+Test';
    const response = await fetch(`https://deliriussapi-oficial.vercel.app/download/mediafire?url=${encodeURIComponent(folderUrl)}`);
    const data = await response.json();

    if (!data.status) return conn.reply(m.chat, 'No se encontraron archivos en la carpeta.', m);

    let message = '`Archivos disponibles:`\n\n';
    data.data.forEach(file => {
        message += `✩ *${file.filename}* - [Descargar](${file.link})\n`;
    });

    await conn.reply(m.chat, message, m);
};

mediaFireHandler.help = ['mediafire'];
mediaFireHandler.tags = ['downloader'];
mediaFireHandler.command = ['mediafire'];

export default mediaFireHandler;
