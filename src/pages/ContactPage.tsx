// pages/ContactPage.tsx - Simplified
import React, { useState } from 'react';

const ContactPage: React.FC = () => {
  const [formData, setFormData] = useState({ nombre: '', correo: '', mensaje: '' });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Mensaje enviado (demo)');
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-black mb-8">Contacto</h1>
      <div className="max-w-2xl mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-card border-2 border-brand-black p-8">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block font-semibold mb-2">Nombre</label>
            <input
              type="text"
              required
              value={formData.nombre}
              onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
              className="w-full px-4 py-2 border-2 border-brand-black rounded-lg"
            />
          </div>
          <div>
            <label className="block font-semibold mb-2">Correo</label>
            <input
              type="email"
              required
              value={formData.correo}
              onChange={(e) => setFormData({ ...formData, correo: e.target.value })}
              className="w-full px-4 py-2 border-2 border-brand-black rounded-lg"
            />
          </div>
          <div>
            <label className="block font-semibold mb-2">Mensaje</label>
            <textarea
              required
              rows={5}
              value={formData.mensaje}
              onChange={(e) => setFormData({ ...formData, mensaje: e.target.value })}
              className="w-full px-4 py-2 border-2 border-brand-black rounded-lg"
            />
          </div>
          <button
            type="submit"
            className="w-full px-6 py-3 bg-pokemon-blue hover:bg-pokemon-red text-white font-bold rounded-lg shadow-hard transition-all"
          >
            Enviar Mensaje
          </button>
        </form>
      </div>
    </div>
  );
};

export default ContactPage;
