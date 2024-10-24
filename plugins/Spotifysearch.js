import fetch from 'node-fetch';
import Starlights from '@StarlightsTeam/Scraper';
import { getDevice } from '@whiskeysockets/baileys';

let handler = async (m, { conn, command, text, usedPrefix }) => {
if (!text) return conn.reply(m.chat, 'ingresa el texto de lo que quieras buscar', m);

await m.react('🕓');
    
const deviceType = await getDevice(m.key.id);
if (deviceType !== 'desktop' && deviceType !== "web") {
try {
let results = await Starlights.spotifySearch(text);
if (!results || results.length === 0) return conn.reply(m.chat, 'No se encontraron resultados', m);

let listSections = [];
let txt = 'Spotify  -  Search';
for (let i = 0; i < (results.length >= 30 ? 30 : results.length); i++) {
const track = results[i];
      
listSections.push(
{title: '',rows: [
{header: '',title: `Nro ${i + 1} - ${track.title}\n`,description: `Artista: ${track.artist}`,id: `${usedPrefix}spotifydl ${track.url}`},
]});
}

await conn.sendList(m.chat, ' *S P O T I F Y  -  S E A R C H* 💞', '> 💞 Powered By Nakano Team', 'Selecione una Cancion', 'https://qu.ax/fPmDc.jpg', listSections, m);
await m.react('✅');
} catch (error) {
console.error(error);
await m.react('✖️');
}
} else {
try {
let res = await Starlights.spotifySearch(text)
let img = await (await fetch(`${res[0].thumbnail}`)).buffer()
let txt = 'Spotify  -  Search'
for (let i = 0; i < res.length; i++) {
txt += `\n\n`
txt += `  *» Nro* : ${i + 1}\n`
txt += `  *» Titulo* : ${res[i].title}\n`
txt += `  *» Artista* : ${res[i].artist}\n`
txt += `  *» Url* : ${res[i].url}`
}
    
await conn.sendFile(m.chat, img, 'thumbnail.jpg', txt, m)
await m.react('✅')
} catch {
await m.react('✖️')
}
}}

handler.help = ['spotifysearch *<búsqueda>*']
handler.tags = ['search']
handler.command = ['spotifysearch']
handler.register = true

export default handler;