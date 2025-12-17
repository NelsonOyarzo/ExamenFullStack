// pages/WebpayReturnPage.tsx
import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { orderService } from '../services/orderService';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/outline';
import type { DireccionEnvio } from '../types';

const WebpayReturnPage: React.FC = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const { refreshCart } = useCart();
    const { user } = useAuth();
    const [status, setStatus] = useState<'loading' | 'approved' | 'rejected' | 'error'>('loading');
    const [details, setDetails] = useState<any>(null);

    useEffect(() => {
        const token_ws = searchParams.get('token_ws'); // Success case
        const tbk_token = searchParams.get('TBK_TOKEN'); // Aborted case sometimes

        if (!token_ws || token_ws === '0') {
            setStatus('rejected');
            return;
        }

        const commitTransaction = async () => {
            try {
                const response = await fetch('http://localhost:3000/api/webpay/commit', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ token: token_ws })
                });
                const data = await response.json();

                if (data.status === 'AUTHORIZED') {
                    setDetails(data.details);
                    // Create the actual order in our system
                    const savedAddress = localStorage.getItem('pendingOrderAddress');
                    if (savedAddress) {
                        const address: DireccionEnvio = JSON.parse(savedAddress);
                        // We assume auth token is still valid in context/localStorage
                        await orderService.createOrder({ direccionEnvio: address });
                        await refreshCart(); // Clear cart
                        localStorage.removeItem('pendingOrderAddress');
                    }
                    setStatus('approved');
                } else {
                    setStatus('rejected');
                }
            } catch (error) {
                console.error(error);
                setStatus('error');
            }
        };

        commitTransaction();
    }, []);

    return (
        <div className="container mx-auto px-4 py-16 flex flex-col items-center justify-center text-center">
            {status === 'loading' && (
                <div>
                    <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-pokemon-blue mx-auto mb-6"></div>
                    <h2 className="text-2xl font-bold">Confirmando pago con Transbank...</h2>
                </div>
            )}

            {status === 'approved' && (
                <div className="bg-green-50 p-8 rounded-lg border-2 border-green-500 max-w-md w-full">
                    <CheckCircleIcon className="w-20 h-20 text-green-500 mx-auto mb-4" />
                    <h1 className="text-3xl font-black text-green-800 mb-2">¡Pago Exitoso!</h1>
                    <p className="text-green-700 mb-6">Tu orden ha sido procesada correctamente.</p>

                    {details && (
                        <div className="bg-white p-4 rounded border border-green-200 text-left text-sm mb-6">
                            <p><strong>Orden de Compra:</strong> {details.buy_order}</p>
                            <p><strong>Autorización:</strong> {details.authorization_code}</p>
                            <p><strong>Tarjeta:</strong> **** **** **** {details.card_detail?.card_number}</p>
                            <p><strong>Monto:</strong> ${details.amount?.toLocaleString('es-CL')}</p>
                            <p><strong>Fecha:</strong> {new Date(details.transaction_date).toLocaleString()}</p>
                        </div>
                    )}

                    <button
                        onClick={() => navigate('/perfil')}
                        className="w-full py-3 bg-green-600 text-white font-bold rounded-lg hover:bg-green-700 transition-colors"
                    >
                        Ver mis Pedidos
                    </button>
                </div>
            )}

            {(status === 'rejected' || status === 'error') && (
                <div className="bg-red-50 p-8 rounded-lg border-2 border-red-500 max-w-md w-full">
                    <XCircleIcon className="w-20 h-20 text-red-500 mx-auto mb-4" />
                    <h1 className="text-3xl font-black text-red-800 mb-2">Pago Rechazado</h1>
                    <p className="text-red-700 mb-6">
                        {status === 'error' ? 'Hubo un error al comunicarse con Transbank.' : 'La transacción fue anulada o rechazada por el banco.'}
                    </p>
                    <button
                        onClick={() => navigate('/checkout')}
                        className="w-full py-3 bg-red-600 text-white font-bold rounded-lg hover:bg-red-700 transition-colors"
                    >
                        Intentar Nuevamente
                    </button>
                </div>
            )}
        </div>
    );
};

export default WebpayReturnPage;
