const axios = require('axios');

// Lista de origens permitidas
const getAllowedOrigins = () => {
    const envOrigins = process.env.ALLOWED_ORIGINS || '';
    return envOrigins.split(',').filter(Boolean);
};

exports.handler = async function (event, context) {
    const origin = event.headers.origin || event.headers.Origin || '';
    const allowedOrigins = getAllowedOrigins();

    const headers = {
        'Access-Control-Allow-Origin': allowedOrigins.includes(origin) ? origin : allowedOrigins[0] || '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'GET, OPTIONS',
        'Content-Type': 'application/json',
        'X-Content-Type-Options': 'nosniff',
        'X-Frame-Options': 'DENY',
        'X-XSS-Protection': '1; mode=block'
    };

    if (event.httpMethod === 'OPTIONS') {
        return { statusCode: 200, headers, body: '' };
    }

    if (event.httpMethod !== 'GET') {
        return {
            statusCode: 405,
            headers,
            body: JSON.stringify({ error: 'Method Not Allowed' })
        };
    }

    const paymentId = event.queryStringParameters?.id;

    // Validação do payment ID
    if (!paymentId) {
        return {
            statusCode: 400,
            headers,
            body: JSON.stringify({ error: 'Missing payment ID' })
        };
    }

    // Validar que é um número válido
    if (!/^\d+$/.test(paymentId)) {
        return {
            statusCode: 400,
            headers,
            body: JSON.stringify({ error: 'Invalid payment ID format' })
        };
    }

    // Obter Access Token de variável de ambiente
    const ACCESS_TOKEN = process.env.MERCADO_PAGO_ACCESS_TOKEN;

    if (!ACCESS_TOKEN) {
        console.error('MERCADO_PAGO_ACCESS_TOKEN not configured');
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({ error: 'Payment service not configured' })
        };
    }

    try {
        const response = await axios.get(`https://api.mercadopago.com/v1/payments/${paymentId}`, {
            headers: {
                'Authorization': `Bearer ${ACCESS_TOKEN}`
            },
            timeout: 10000 // 10 segundos timeout
        });

        return {
            statusCode: 200,
            headers,
            body: JSON.stringify({ status: response.data.status })
        };
    } catch (error) {
        console.error('Erro ao verificar status:', error.response?.data || error.message);

        // Não expor detalhes internos
        const statusCode = error.response?.status || 500;

        return {
            statusCode: statusCode === 404 ? 404 : 500,
            headers,
            body: JSON.stringify({
                status: 'pending',
                error: statusCode === 404 ? 'Payment not found' : 'Error checking payment status'
            })
        };
    }
};
