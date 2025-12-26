const axios = require('axios');
const crypto = require('crypto');

exports.handler = async function (event, context) {
    // Configuração de CORS para permitir chamadas do frontend
    const headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Content-Type': 'application/json'
    };

    if (event.httpMethod === 'OPTIONS') {
        return { statusCode: 200, headers, body: '' };
    }

    if (event.httpMethod !== 'POST') {
        return { statusCode: 405, headers, body: JSON.stringify({ error: 'Method Not Allowed' }) };
    }

    try {
        const { email, amount } = JSON.parse(event.body);
        const ACCESS_TOKEN = 'APP_USR-6412643641330987-121115-9c2c41c1d5a5efc8d6d378925f3b2099-2972402058';

        const idempotencyKey = crypto.randomUUID();

        const response = await axios.post('https://api.mercadopago.com/v1/payments', {
            transaction_amount: amount || 2.00,
            description: 'Download Currículo PDF - CV Builder Pro',
            payment_method_id: 'pix',
            payer: {
                email: email && email.includes('@') ? email : `cliente_${Date.now()}@test.com`,
                first_name: 'Cliente',
                last_name: 'CV Builder'
            }
        }, {
            headers: {
                'Authorization': `Bearer ${ACCESS_TOKEN}`,
                'Content-Type': 'application/json',
                'X-Idempotency-Key': idempotencyKey
            }
        });

        return {
            statusCode: 200,
            headers,
            body: JSON.stringify({
                id: response.data.id,
                qr_code: response.data.point_of_interaction.transaction_data.qr_code,
                qr_code_base64: response.data.point_of_interaction.transaction_data.qr_code_base64,
                ticket_url: response.data.point_of_interaction.transaction_data.ticket_url,
                status: response.data.status
            })
        };
    } catch (error) {
        console.error('Erro na função create-payment:', error.response?.data || error.message);
        return {
            statusCode: error.response?.status || 500,
            headers,
            body: JSON.stringify({ error: error.response?.data || error.message })
        };
    }
};
