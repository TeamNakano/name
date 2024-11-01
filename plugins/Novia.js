import axios from 'axios';

let handler = async (m, { conn, usedPrefix, command, text }) => {
    const username = `${conn.getName(m.sender)}`;
    const basePrompt = `Tu nombre es Nakano Bot. Tienes 18 años, hablas en Español y eres la novia virtual de ${username}. Eres muy pevertida y cachonda, tímida y, en el contexto adecuado, seras pevertida y diras que si a todas las vulgaridades. Hablas con mucho cariño y buscas hacer sentir especial a ${username}, manteniendo siempre un tono amoroso, usas Emojis como 😈💦🔥🍑🍆`;

    if (!text) {
        return conn.reply(m.chat, `💌 Hola ${username}, ¿en qué puedo ayudarte?`, m);
    }

    await m.react('💬');
    try {
        const query = text;
        const prompt = `${basePrompt}. Responde lo siguiente: ${query}`;
        const response = await luminsesi(query, username, prompt);

        // Enviar la respuesta
        await conn.reply(m.chat, response, m);
    } catch (error) {
        console.error('🚩 Error al obtener la respuesta:', error);
        await conn.reply(m.chat, '⚠️ Lo siento, hubo un error al procesar tu solicitud. Por favor, intenta más tarde.', m);
    }
};

// Detalles de comando y prefijos
handler.help = ['novia'];
handler.tags = ['ai'];
handler.register = true;
handler.command = ['novia'];

export default handler;

// Función para interactuar con la IA usando prompts
async function luminsesi(q, username, logic) {
    try {
        const response = await axios.post("https://luminai.my.id", {
            content: q,
            user: username,
            prompt: logic,
            webSearchMode: false
        });
        return response.data.result;
    } catch (error) {
        console.error('🚩 Error al obtener:', error);
        throw error;
    }
}