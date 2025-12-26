import axios from 'axios';

export interface PaymentResponse {
    id: number;
    qr_code: string;
    qr_code_base64: string;
    ticket_url: string;
    status: string;
}

// URL base para as Netlify Functions
// O caminho '/.netlify/functions' é padrão no Netlify
const FUNCTIONS_URL = '/.netlify/functions';

export const createPixPayment = async (email: string, amount: number = 2.00): Promise<PaymentResponse> => {
    try {
        // Chamada para a Function de backend segura
        const response = await axios.post(`${FUNCTIONS_URL}/create-payment`, {
            email,
            amount
        });

        return response.data;
    } catch (error: any) {
        console.error('Erro ao criar pagamento via Function:', error.response?.data || error.message);
        throw error;
    }
};

export const checkPaymentStatus = async (paymentId: number): Promise<string> => {
    try {
        const response = await axios.get(`${FUNCTIONS_URL}/check-status`, {
            params: { id: paymentId }
        });
        return response.data.status;
    } catch (error) {
        console.error('Erro ao verificar status via Function:', error);
        return 'pending';
    }
};
