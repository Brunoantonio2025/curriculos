import { X, Copy, CheckCircle, Lock, Loader2, AlertCircle } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { useState, useEffect } from 'react';
import { createPixPayment, checkPaymentStatus, PaymentResponse } from '../services/mercadoPago';

interface PaymentModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

export default function PaymentModal({ isOpen, onClose, onSuccess }: PaymentModalProps) {
    const [copied, setCopied] = useState(false);
    const [loading, setLoading] = useState(true);
    const [paymentData, setPaymentData] = useState<PaymentResponse | null>(null);
    const [error, setError] = useState('');
    const [status, setStatus] = useState('pending');

    useEffect(() => {
        let intervalId: NodeJS.Timeout;

        if (isOpen) {
            setLoading(true);
            setError('');
            // Inicia criação do pagamento
            // Em uma aplicação real, você pegaria o email do usuário do formulário de Dados Pessoais
            createPixPayment('usuario@exemplo.com')
                .then(data => {
                    setPaymentData(data);
                    setLoading(false);

                    // Inicia polling de status
                    intervalId = setInterval(async () => {
                        // Só verifica se tivermos um ID
                        if (!data?.id) return;

                        const currentStatus = await checkPaymentStatus(data.id);
                        setStatus(currentStatus);
                        if (currentStatus === 'approved') {
                            clearInterval(intervalId);
                            // Pequeno delay para mostrar o sucesso visualmente antes de fechar
                            setTimeout(() => {
                                onSuccess();
                            }, 1500);
                        }
                    }, 4000); // Checa a cada 4s
                })
                .catch(err => {
                    console.error(err);
                    setError('Erro ao gerar Pix. Verifique se o Access Token está configurado em src/services/mercadoPago.ts');
                    setLoading(false);
                });
        }

        return () => {
            if (intervalId) clearInterval(intervalId);
        };
    }, [isOpen]);

    if (!isOpen) return null;

    const handleCopy = () => {
        if (paymentData?.qr_code) {
            navigator.clipboard.writeText(paymentData.qr_code);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
            <div
                className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity"
                onClick={onClose}
            />

            <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-sm overflow-hidden animate-in zoom-in-95 duration-200">
                <div className="bg-slate-50 border-b border-slate-100 p-4 text-center">
                    <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-3">
                        <Lock className="text-indigo-600" size={24} />
                    </div>
                    <h3 className="text-lg font-bold text-slate-900">Desbloquear Download</h3>
                    <p className="text-sm text-slate-500">Pague R$ 2,00 para liberar seu PDF.</p>
                </div>

                <div className="p-6 space-y-6">
                    {loading ? (
                        <div className="flex flex-col items-center justify-center py-8 gap-3">
                            <Loader2 className="animate-spin text-indigo-600" size={40} />
                            <p className="text-sm text-slate-500 font-medium">Gerando QR Code Pix com Mercado Pago...</p>
                        </div>
                    ) : error ? (
                        <div className="text-center py-6">
                            <AlertCircle className="mx-auto text-red-500 mb-2" size={32} />
                            <p className="text-slate-800 font-medium mb-1">Ops! Algo deu errado.</p>
                            <p className="text-xs text-slate-500 px-4 mb-4">{error}</p>
                            <button onClick={onClose} className="px-4 py-2 bg-slate-100 hover:bg-slate-200 rounded-lg text-slate-700 text-sm font-medium transition-colors">Fechar</button>
                        </div>
                    ) : paymentData ? (
                        <>
                            <div className="text-center">
                                <span className="text-3xl font-bold text-slate-900">R$ 2,00</span>
                            </div>

                            <div className="flex justify-center">
                                <div className="p-4 border-2 border-dashed border-indigo-200 rounded-xl bg-indigo-50/50 relative">
                                    {status === 'approved' && (
                                        <div className="absolute inset-0 bg-emerald-500/95 flex items-center justify-center rounded-lg flex-col text-white animate-in fade-in z-10 transition-all">
                                            <CheckCircle size={48} className="mb-2" />
                                            <span className="font-bold text-lg">Pagamento Aprovado!</span>
                                        </div>
                                    )}
                                    <div className="bg-white p-2 rounded-lg">
                                        <QRCodeSVG value={paymentData.qr_code} size={160} fgColor="#334155" />
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-3">
                                <p className="text-xs text-center text-slate-500 font-medium uppercase tracking-wider">
                                    Pix Copia e Cola
                                </p>
                                <button
                                    onClick={handleCopy}
                                    className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-sm font-medium transition-colors group truncate"
                                >
                                    {copied ? <CheckCircle size={16} className="text-emerald-500" /> : <Copy size={16} className="text-slate-400 group-hover:text-slate-600" />}
                                    {copied ? 'Código copiado!' : <span className="truncate max-w-[200px] text-xs">{paymentData.qr_code}</span>}
                                </button>
                            </div>
                        </>
                    ) : null}
                </div>

                {paymentData && !loading && !error && (
                    <div className={`p-4 border-t border-slate-100 transition-colors ${status === 'approved' ? 'bg-emerald-50' : 'bg-slate-50'} text-center`}>
                        {status === 'pending' || status === 'in_process' ? (
                            <div className="flex items-center justify-center gap-2 text-sm text-slate-500 animate-pulse">
                                <Loader2 size={14} className="animate-spin" />
                                Aguardando pagamento...
                            </div>
                        ) : status === 'approved' ? (
                            <div className="text-emerald-600 font-bold text-sm flex items-center justify-center gap-2">
                                <CheckCircle size={16} /> Liberando download...
                            </div>
                        ) : (
                            <div className="text-slate-400 text-xs">Status: {status}</div>
                        )}
                    </div>
                )}

                <button
                    onClick={onClose}
                    className="absolute top-3 right-3 p-2 bg-transparent hover:bg-slate-100 text-slate-400 hover:text-slate-600 rounded-full transition-colors"
                >
                    <X size={20} />
                </button>
            </div>
        </div>
    );
}
