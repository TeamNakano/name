/*import {
    useMultiFileAuthState,
    DisconnectReason,
    fetchLatestBaileysVersion,
    makeCacheableSignalKeyStore,
    jidNormalizedUser,
    PHONENUMBER_MCC
} from '@whiskeysockets/baileys';

import NodeCache from 'node-cache';
import readline from 'readline';
import crypto from 'crypto';
import fs from "fs";
import pino from 'pino';
import { makeWASocket } from '../lib/simple.js';

if (!global.conns) {
    global.conns = [];
}

let handler = async (m, { conn: _conn, args, usedPrefix, command, isOwner }) => {
    if (!((args[0] && args[0] == 'plz') || (_conn.user.jid == _conn.user.jid))) {
        // return m.reply(`Este comando solo puede ser usado en el bot principal! wa.me/${global.conn.user.jid.split`@`[0]}?text=${usedPrefix}code`)
    }

    async function serbot() {
        let authFolderB = crypto.randomBytes(10).toString('hex').slice(0, 8);

        if (!fs.existsSync("./serbot/" + authFolderB)) {
            fs.mkdirSync("./serbot/" + authFolderB, { recursive: true });
        }
        args[0] ? fs.writeFileSync("./serbot/" + authFolderB + "/creds.json", JSON.stringify(JSON.parse(Buffer.from(args[0], "base64").toString("utf-8")), null, '\t')) : "";

        const { state, saveCreds } = await useMultiFileAuthState(`./serbot/${authFolderB}`);
        const msgRetryCounterCache = new NodeCache();
        const { version } = await fetchLatestBaileysVersion();
        let phoneNumber = m.sender.split('@')[0];

        const methodCodeQR = process.argv.includes("qr");
        const methodCode = !!phoneNumber || process.argv.includes("code");
        const MethodMobile = process.argv.includes("mobile");

        const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
        const question = (texto) => new Promise((resolver) => rl.question(texto, resolver));

        const connectionOptions = {
            logger: pino({ level: 'silent' }),
            printQRInTerminal: false,
            mobile: MethodMobile,
            browser: ["Ubuntu", "Chrome", "20.0.04"],
            auth: {
                creds: state.creds,
                keys: makeCacheableSignalKeyStore(state.keys, pino({ level: "fatal" }).child({ level: "fatal" })),
            },
            markOnlineOnConnect: true,
            generateHighQualityLinkPreview: true,
            getMessage: async (clave) => {
                let jid = jidNormalizedUser(clave.remoteJid);
                let msg = await store.loadMessage(jid, clave.id);
                return msg?.message || "";
            },
            msgRetryCounterCache,
            defaultQueryTimeoutMs: undefined,
            version
        };

        let conn = makeWASocket(connectionOptions);

        if (methodCode && !conn.authState.creds.registered) {
            if (!phoneNumber) {
                process.exit(0);
            }
            let cleanedNumber = phoneNumber.replace(/[^0-9]/g, '');
            if (!Object.keys(PHONENUMBER_MCC).some(v => cleanedNumber.startsWith(v))) {
                process.exit(0);
            }

            setTimeout(async () => {
                let codeBot = await conn.requestPairingCode(cleanedNumber);
                codeBot = codeBot?.match(/.{1,4}/g)?.join("-") || codeBot;

                await m.reply(`*𝑩𝒐𝒕𝑪𝒍𝒐𝒏𝒆*\n\n> *𝑺𝒊𝒈𝒖𝒆 𝒆𝒔𝒕𝒐𝒔 𝒑𝒂𝒔𝒐𝒔 𝒑𝒂𝒓𝒂 𝒔𝒆𝒓 𝒖𝒏 𝑺𝒖𝒃-𝑩𝒐𝒕*\n\n> 1. 𝑪𝒍𝒊𝒄𝒌 𝒆𝒏 𝒍𝒂 𝒆𝒔𝒒𝒖𝒊𝒏𝒂 𝒔𝒖𝒑𝒆𝒓𝒊𝒐𝒓 𝒅𝒆𝒓𝒆𝒄𝒉𝒂.\n> 2. 𝑻𝒐𝒒𝒖𝒆 𝒅𝒊𝒔𝒑𝒐𝒔𝒊𝒕𝒊𝒗𝒐𝒔 𝒗𝒊𝒏𝒄𝒖𝒍𝒂𝒅𝒐𝒔\n> 3. 𝑺𝒆𝒍𝒆𝒄𝒄𝒊𝒐𝒏𝒂 *𝑽𝒊𝒏𝒄𝒖𝒍𝒂𝒓 𝒄𝒐𝒏 𝒆𝒍 𝒏𝒖𝒎𝒆𝒓𝒐 𝒅𝒆 𝒕𝒆𝒍𝒆𝒇𝒐𝒏𝒐*\n\n> *𝑰𝒏𝒑𝒐𝒓𝒕𝒂𝒏𝒕𝒆:* 𝑬𝒍 𝒄𝒐𝒅𝒊𝒈𝒐 𝒔𝒐𝒍𝒐 𝒇𝒖𝒏𝒄𝒊𝒐𝒏𝒂 𝒆𝒏 𝒆𝒍 𝒏𝒖𝒎𝒆𝒓𝒐 𝒒𝒖𝒆 𝒍𝒐 𝒑𝒊𝒅𝒊𝒐`);
                _conn.sendButton2(m.chat, `᪥ 𝑬𝒔𝒕𝒆 𝒆𝒔 𝒔𝒖 𝒄𝒐𝒅𝒊𝒈𝒐: *${codeBot}*`, null, 'https://i.ibb.co/SKKdvRb/code.jpg', [], codeBot, null, m);
                rl.close();
            }, 3000);
        }

        conn.isInit = false;
        let isInit = true;

        async function connectionUpdate(update) {
            const { connection, lastDisconnect, isNewLogin, qr } = update;
            if (isNewLogin) conn.isInit = true;
            const code = lastDisconnect?.error?.output?.statusCode || lastDisconnect?.error?.output?.payload?.statusCode;
            if (code && code !== DisconnectReason.loggedOut && conn?.ws.socket == null) {
                let i = global.conns.indexOf(conn);
                if (i < 0) return console.log(await creloadHandler(true).catch(console.error));
                delete global.conns[i];
                global.conns.splice(i, 1);

                if (code !== DisconnectReason.connectionClosed) {
                    _conn.sendMessage(m.chat, { text: "𝑺𝒆 𝒑𝒆𝒓𝒅𝒊𝒐 𝒍𝒂 𝒄𝒐𝒏𝒆𝒙𝒊𝒐𝒏.." }, { quoted: m });
                }
            }

            if (global.db.data == null) loadDatabase();

            if (connection == 'open') {
                conn.isInit = true;
                global.conns.push(conn);
                await _conn.sendMessage(m.chat, { text: args[0] ? `᪥ 𝑪𝒐𝒏𝒆𝒙𝒊𝒐𝒏 𝒆𝒙𝒊𝒕𝒐𝒔𝒂` : `\n\n> 𝑺𝒊 𝒍𝒂 𝒄𝒐𝒏𝒆𝒙𝒊𝒐𝒏 𝒔𝒆 𝒄𝒊𝒆𝒓𝒓𝒂 𝒔𝒆 𝒗𝒐𝒍𝒗𝒆𝒓𝒂 𝒂 𝒄𝒐𝒏𝒆𝒄𝒕𝒂𝒓 𝒔𝒐𝒍𝒐, ۞ 𝑵𝒐 𝒆𝒍𝒊𝒎𝒊𝒏𝒆𝒔 𝒆𝒍 𝒗𝒊𝒏𝒄𝒖𝒍𝒐!!\n\n` }, { quoted: m });
                await sleep(5000);
                if (args[0]) return;
            }

            if (connection === 'close' || connection === 'error') {
                setTimeout(async () => {
                    try {
                        conn.ws.close();
                        conn.ev.off('messages.upsert', conn.handler);
                        conn.ev.off('connection.update', conn.connectionUpdate);
                        conn.ev.off('creds.update', conn.credsUpdate);

                        conn = makeWASocket(connectionOptions);

                        conn.handler = handler.handler.bind(conn);
                        conn.connectionUpdate = connectionUpdate.bind(conn);
                        conn.credsUpdate = saveCreds.bind(conn, true);
                        conn.ev.on('messages.upsert', conn.handler);
                        conn.ev.on('connection.update', conn.connectionUpdate);
                        conn.ev.on('creds.update', conn.credsUpdate);

                        await creloadHandler(false);
                    } catch (error) {
                        console.error('Error durante la reconexión:', error);
                    }
                }, 5000); 
            }
        }

        setInterval(async () => {
            if (!conn.user) {
                try {
                    conn.ws.close();
                } catch {
                    
                }
                conn.ev.removeAllListeners();
                let i = global.conns.indexOf(conn);
                if (i < 0) return;
                delete global.conns[i];
                global.conns.splice(i, 1);
            }
        }, 60000);
 creloadHandler
        let handler = await import('../handler.js');
        let creloadHandler = async function (restartConn) {
            try {
                const Handler = await import(`../handler.js?update=${Date.now()}`).catch(console.error);
                if (Object.keys(Handler || {}).length) handler = Handler;
            } catch (e) {
                console.error(e);
            }

            if (restartConn) {
                try {
                    conn.ws.close();
                } catch {
                    
                }
                conn.ev.removeAllListeners();
                conn = makeWASocket(connectionOptions);
                isInit = true;
            }

            if (!isInit) {
                conn.ev.off('messages.upsert', conn.handler);
                conn.ev.off('connection.update', conn.connectionUpdate);
                conn.ev.off('creds.update', conn.credsUpdate);
            }

            conn.handler = handler.handler.bind(conn);
            conn.connectionUpdate = connectionUpdate.bind(conn);
            conn.credsUpdate = saveCreds.bind(conn, true);
         
            conn.ev.on('messages.upsert', conn.handler);
            conn.ev.on('connection.update', conn.connectionUpdate);
            conn.ev.on('creds.update', conn.credsUpdate);

            isInit = false;
            return true;
        };

        await creloadHandler(false);
    }

    serbot();
};

handler.help = ['code'];
handler.tags = ['serbot'];
handler.command = ['code', 'codebot', 'botclone', 'serbot'];
handler.rowner = false;

export default handler;

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
					      }*/
