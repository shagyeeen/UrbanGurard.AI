require('dotenv').config({ path: '.env.local' });
const { Groq } = require('groq-sdk');

const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY,
});

async function main() {
    try {
        const models = await groq.models.list();
        console.log('Available Models:', JSON.stringify(models.data.map(m => m.id), null, 2));
    } catch (error) {
        console.error('Error fetching models:', error);
    }
}

main();
