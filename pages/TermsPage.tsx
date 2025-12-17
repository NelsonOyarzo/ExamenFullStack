// pages/TermsPage.tsx
import React from 'react';

const TermsPage: React.FC = () => {
    return (
        <div className="container mx-auto px-4 py-8 max-w-2xl">
            <h1 className="text-4xl font-black mb-8 text-brand-black dark:text-brand-white">Términos y Condiciones</h1>
            <div className="prose dark:prose-invert">
                <p>Al utilizar este sitio web, aceptas los siguientes términos:</p>
                <ul className="list-disc pl-5">
                    <li>Los precios están en pesos chilenos (CLP).</li>
                    <li>Los envíos se realizan dentro de las 48 horas hábiles.</li>
                    <li>No se aceptan devoluciones de sobres abiertos.</li>
                    <li>Las imágenes son referenciales.</li>
                    <li>Nos reservamos el derecho de cancelar órdenes por falta de stock.</li>
                </ul>
            </div>
        </div>
    );
};
export default TermsPage;
