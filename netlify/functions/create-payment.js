const axios = require('axios');
const crypto = require('crypto');

// Rate limiting simples em memória (para produção, use Redis ou similar)
const requestCounts = new Map();
const RATE_LIMIT_WINDOW = 60000; // 1 minuto
const MAX_REQUESTS_PER_WINDOW = 5;

// Lista de origens permitidas (configure no Netlify Environment Variables)
const getAllowedOrigins = () => {
    const envOrigins = process.env.ALLOWED_ORIGINS || '';
    return envOrigins.split(',').filter(Boolean);
};

// Validação de email
const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

// Rate limiting check
const checkRateLimit = (identifier) => {
    const now = Date.now();
    const userRequests = requestCounts.get(identifier) || [];

    // Remove requisições antigas
    const recentRequests = userRequests.filter(time => now - time < RATE_LIMIT_WINDOW);

    if (recentRequests.length >= MAX_REQUESTS_PER_WINDOW) {
        return false;
    }

    recentRequests.push(now);
    requestCounts.set(identifier, recentRequests);
    return true;
};

exports.handler = async function (event, context) {
    const origin = event.headers.origin || event.headers.Origin || '';
    const allowedOrigins = getAllowedOrigins();

    // CORS restrito
    const headers = {
        'Access-Control-Allow-Origin': allowedOrigins.includes(origin) ? origin : allowedOrigins[0] || '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Content-Type': 'application/json',
        'X-Content-Type-Options': 'nosniff',
        'X-Frame-Options': 'DENY',
        'X-XSS-Protection': '1; mode=block',
        'Strict-Transport-Security': 'max-age=31536000; includeSubDomains'
    };

    if (event.httpMethod === 'OPTIONS') {
        return { statusCode: 200, headers, body: '' };
    }

    if (event.httpMethod !== 'POST') {
        return {
            statusCode: 405,
            headers,
            body: JSON.stringify({ error: 'Method Not Allowed' })
        };
    }

    try {
        // Rate limiting baseado em IP
        const clientIp = event.headers['x-forwarded-for'] || event.headers['client-ip'] || 'unknown';

        if (!checkRateLimit(clientIp)) {
            return {
                statusCode: 429,
                headers,
                body: JSON.stringify({
                    error: 'Too many requests. Please try again later.',
                    retryAfter: 60
                })
            };
        }

        // Parse e validação do body
        let body;
        try {
            body = JSON.parse(event.body);
        } catch (e) {
            return {
                statusCode: 400,
                headers,
                body: JSON.stringify({ error: 'Invalid JSON in request body' })
            };
        }

        const { email, amount } = body;

        // Validações de entrada
        if (!email || typeof email !== 'string') {
            return {
                statusCode: 400,
                headers,
                body: JSON.stringify({ error: 'Email is required and must be a string' })
            };
        }

        if (!isValidEmail(email)) {
            return {
                statusCode: 400,
                headers,
                body: JSON.stringify({ error: 'Invalid email format' })
            };
        }

        // Validação de valor
        const paymentAmount = parseFloat(amount) || 2.00;
        const minAmount = parseFloat(process.env.MIN_PAYMENT_AMOUNT) || 1.00;
        const maxAmount = parseFloat(process.env.MAX_PAYMENT_AMOUNT) || 10.00;

        if (paymentAmount < minAmount || paymentAmount > maxAmount) {
            return {
                statusCode: 400,
                headers,
                body: JSON.stringify({
                    error: `Payment amount must be between ${minAmount} and ${maxAmount}`
                })
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

        // Sanitizar email
        const sanitizedEmail = email.trim().toLowerCase();

        const idempotencyKey = crypto.randomUUID();

        const response = await axios.post('https://api.mercadopago.com/v1/payments', {
            transaction_amount: paymentAmount,
            description: 'Download Currículo PDF - CV Builder Pro',
            payment_method_id: 'pix',
            payer: {
                email: sanitizedEmail,
                first_name: 'Cliente',
                last_name: 'CV Builder'
            }
        }, {
            headers: {
                'Authorization': `Bearer ${ACCESS_TOKEN}`,
                'Content-Type': 'application/json',
                'X-Idempotency-Key': idempotencyKey
            },
            timeout: 10000 // 10 segundos timeout
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

        // Não expor detalhes internos do erro
        const statusCode = error.response?.status || 500;
        const errorMessage = statusCode >= 500
            ? 'Internal server error. Please try again later.'
            : 'Payment creation failed. Please check your data and try again.';

        return {
            statusCode,
            headers,
            body: JSON.stringify({ error: errorMessage })
        };
    }
};
