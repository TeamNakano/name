import Starlights from '@StarlightsTeam/Scraper';
import fetch from 'node-fetch';

let handler = async (m, { conn, text }) => {
if (!text) return conn.reply(m.chat, '💞 Ingresa el enlace de algún Track, Playlist o Álbum de Spotify.', m);

let isSpotifyUrl = text.match(/^(https:\/\/open\.spotify\.com\/(album|track|playlist)\/[a-zA-Z0-9]+)/i);
if (!isSpotifyUrl) return conn.reply(m.chat, '💬 Ingresa un enlace válido de Track, Playlist o Álbum de Spotify.', m);

await m.react('🕓')
try {
let { title, artist, album, thumbnail, dl_url } = await Starlights.spotifydl(text);
let img = await (await fetch(thumbnail)).buffer();

let txt = `🎧 S͙p͙o͙t͙i͙f͙y͙ D͙o͙w͙n͙l͙o͙a͙d͙ 🌟⭐\n\n`;
    txt += `    💞  *Título* : ${title}\n`;
    txt += `    💞  *Álbum* : ${album}\n`;
    txt += `    💞  *Artista* : ${artist}\n\n`;
    txt += ` *Power by Nakano Team* `;

await conn.sendFile(m.chat, img, 'thumbnail.jpg', txt, m, null, rcanal);
await conn.sendMessage(m.chat, { audio: { url: dl_url }, fileName: `${title}.mp3`, mimetype: 'audio/mp4' }, { quoted: m });

await m.react('✅');
} catch {
await m.react('✖️');
}
};

handler.help = ['spotifydl'];
handler.tags = ['downloader'];
handler.command = ['spotifydl'];
// handler.limit = 1;
handler.register = false;

export default handler;
