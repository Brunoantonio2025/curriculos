const axios = require('axios');

exports.handler = async function (event, context) {
    const headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Content-Type': 'application/json'
    };

    if (event.httpMethod === 'OPTIONS') {
        return { statusCode: 200, headers, body: '' };
    }

    const paymentId = event.queryStringParameters.id;
    const ACCESS_TOKEN = 'APP_USR-6412643641330987-121115-9c2c41c1d5a5efc8d6d378925f3b2099-2972402058';

    if (!paymentId) {
        return { statusCode: 400, headers, body: JSON.stringify({ error: 'Missing payment ID' }) };
    }

    try {
        const response = await axios.get(`https://api.mercadopago.com/v1/payments/${paymentId}`, {
            headers: {
                'Authorization': `Bearer ${ACCESS_TOKEN}`
            }
        });

        return {
            statusCode: 200,
            headers,
            body: JSON.stringify({ status: response.data.status })
        };
    } catch (error) {
        console.error('Erro ao verificar status:', error.response?.data || error.message);
        return {
            statusCode: error.response?.status || 500,
            headers,
            body: JSON.stringify({ status: 'pending', error: error.message })
        };
    }
};
