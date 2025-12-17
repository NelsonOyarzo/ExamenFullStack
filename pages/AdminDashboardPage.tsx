// pages/AdminDashboardPage.tsx
import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';
import { productService } from '../services/productService';
import { orderService } from '../services/orderService';
import { userService } from '../services/userService';
import type { Producto, Order, User, AdminStats, CreateProductDto } from '../types';

// Icons
import {
    ChartBarIcon, CubeIcon, ShoppingBagIcon, UsersIcon,
    PlusIcon, PencilIcon, TrashIcon, XMarkIcon
} from '@heroicons/react/24/outline';

const AdminDashboardPage: React.FC = () => {
    const { isAdmin, user } = useAuth();
    const [activeTab, setActiveTab] = useState<'stats' | 'products' | 'orders' | 'users'>('stats');

    if (!isAdmin) return <Navigate to="/" />;

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex flex-col md:flex-row justify-between items-center mb-8">
                <div>
                    <h1 className="text-4xl font-black text-brand-black dark:text-brand-white">Panel de Administración</h1>
                    <p className="text-gray-600 dark:text-gray-400">Bienvenido, {user?.nombre}</p>
                </div>
                <div className="flex space-x-2 mt-4 md:mt-0">
                    <TabButton active={activeTab === 'stats'} onClick={() => setActiveTab('stats')} icon={<ChartBarIcon className="w-5 h-5" />} label="Resumen" />
                    <TabButton active={activeTab === 'products'} onClick={() => setActiveTab('products')} icon={<CubeIcon className="w-5 h-5" />} label="Productos" />
                    <TabButton active={activeTab === 'orders'} onClick={() => setActiveTab('orders')} icon={<ShoppingBagIcon className="w-5 h-5" />} label="Órdenes" />
                    <TabButton active={activeTab === 'users'} onClick={() => setActiveTab('users')} icon={<UsersIcon className="w-5 h-5" />} label="Usuarios" />
                </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-hard border-2 border-brand-black dark:border-brand-white p-6 min-h-[500px]">
                {activeTab === 'stats' && <StatsView />}
                {activeTab === 'products' && <ProductsView />}
                {activeTab === 'orders' && <OrdersView />}
                {activeTab === 'users' && <UsersView />}
            </div>
        </div>
    );
};

const TabButton: React.FC<{ active: boolean; onClick: () => void; icon: React.ReactNode; label: string }> = ({ active, onClick, icon, label }) => (
    <button
        onClick={onClick}
        className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-bold transition-all ${active
                ? 'bg-pokemon-blue text-white shadow-md'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
            }`}
    >
        {icon}
        <span>{label}</span>
    </button>
);

// --- Subviews ---

const StatsView = () => {
    const [stats, setStats] = useState<AdminStats | null>(null);

    useEffect(() => {
        orderService.getAdminStats().then(setStats).catch(console.error);
    }, []);

    if (!stats) return <div className="p-8 text-center">Cargando estadísticas...</div>;

    const cards = [
        { label: 'Ventas Totales', value: `$${stats.ventasTotales.toLocaleString()}`, color: 'bg-green-100 text-green-800' },
        { label: 'Órdenes Pendientes', value: stats.ordenesPendientes, color: 'bg-yellow-100 text-yellow-800' },
        { label: 'Productos Agotados', value: stats.productosAgotados, color: 'bg-red-100 text-red-800' },
        { label: 'Total Productos', value: stats.totalProductos, color: 'bg-blue-100 text-blue-800' },
        { label: 'Total Usuarios', value: stats.totalUsuarios, color: 'bg-purple-100 text-purple-800' },
        { label: 'Total Órdenes', value: stats.totalOrdenes, color: 'bg-gray-100 text-gray-800' },
    ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {cards.map((c, i) => (
                <div key={i} className={`p-6 rounded-lg ${c.color} border-2 border-transparent hover:border-brand-black transition-all`}>
                    <h3 className="text-lg font-bold mb-2 opacity-80">{c.label}</h3>
                    <p className="text-4xl font-black">{c.value}</p>
                </div>
            ))}
        </div>
    );
};

const ProductsView = () => {
    const [products, setProducts] = useState<Producto[]>([]);
    const [editing, setEditing] = useState<Partial<CreateProductDto> | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const load = () => productService.getProducts().then(setProducts).catch(console.error);
    useEffect(() => { load(); }, []);

    const handleDelete = async (id: number) => {
        if (window.confirm('¿Seguro que deseas eliminar este producto?')) {
            await productService.deleteProduct(id);
            load();
        }
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (editing && (editing as any).id) {
                await productService.updateProduct((editing as any).id, editing as any);
            } else {
                await productService.createProduct(editing as CreateProductDto);
            }
            setIsModalOpen(false);
            setEditing(null);
            load();
        } catch (err) {
            alert('Error al guardar');
        }
    };

    const openNew = () => {
        setEditing({ nombre: '', set: '', rareza: 'Common', tipo: 'Colorless', precio: 0, stock: 0, imagen: '' });
        setIsModalOpen(true);
    };

    const openEdit = (p: Producto) => {
        setEditing({ ...p });
        setIsModalOpen(true);
    };

    return (
        <div>
            <div className="flex justify-between mb-4">
                <h2 className="text-2xl font-bold">Inventario</h2>
                <button onClick={openNew} className="bg-green-600 text-white px-4 py-2 rounded-lg font-bold flex items-center gap-2 hover:bg-green-700">
                    <PlusIcon className="w-5 h-5" /> Nuevo Producto
                </button>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-gray-100 dark:bg-gray-700">
                            <th className="p-3 border-b">ID</th>
                            <th className="p-3 border-b">Nombre</th>
                            <th className="p-3 border-b">Precio</th>
                            <th className="p-3 border-b">Stock</th>
                            <th className="p-3 border-b">Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {products.map(p => (
                            <tr key={p.id} className="border-b hover:bg-gray-50 dark:hover:bg-gray-700">
                                <td className="p-3">#{p.id}</td>
                                <td className="p-3 font-semibold">{p.nombre}</td>
                                <td className="p-3 text-green-600">${p.precio.toLocaleString()}</td>
                                <td className={`p-3 font-bold ${p.stock < 5 ? 'text-red-500' : 'text-blue-500'}`}>{p.stock}</td>
                                <td className="p-3 flex gap-2">
                                    <button onClick={() => openEdit(p)} className="p-1 text-blue-600 hover:bg-blue-100 rounded"><PencilIcon className="w-5 h-5" /></button>
                                    <button onClick={() => handleDelete(p.id)} className="p-1 text-red-600 hover:bg-red-100 rounded"><TrashIcon className="w-5 h-5" /></button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Modal Simple */}
            {isModalOpen && editing && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-xl font-bold">{(editing as any).id ? 'Editar Producto' : 'Nuevo Producto'}</h3>
                            <button onClick={() => setIsModalOpen(false)}><XMarkIcon className="w-6 h-6" /></button>
                        </div>
                        <form onSubmit={handleSave} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <input className="input-field" placeholder="Nombre" value={editing.nombre} onChange={e => setEditing({ ...editing, nombre: e.target.value })} required />
                            <input className="input-field" placeholder="Set / Expansión" value={editing.set} onChange={e => setEditing({ ...editing, set: e.target.value })} required />
                            <select className="input-field" value={editing.tipo} onChange={e => setEditing({ ...editing, tipo: e.target.value as any })}>
                                {productService.getTipos().map(t => <option key={t} value={t}>{t}</option>)}
                            </select>
                            <select className="input-field" value={editing.rareza} onChange={e => setEditing({ ...editing, rareza: e.target.value as any })}>
                                {productService.getRarezas().map(r => <option key={r} value={r}>{r}</option>)}
                            </select>
                            <input type="number" className="input-field" placeholder="Precio" value={editing.precio} onChange={e => setEditing({ ...editing, precio: Number(e.target.value) })} required />
                            <input type="number" className="input-field" placeholder="Stock" value={editing.stock} onChange={e => setEditing({ ...editing, stock: Number(e.target.value) })} required />
                            <input className="input-field md:col-span-2" placeholder="URL Imagen" value={editing.imagen} onChange={e => setEditing({ ...editing, imagen: e.target.value })} />
                            <textarea className="input-field md:col-span-2" placeholder="Descripción" value={editing.descripcion} onChange={e => setEditing({ ...editing, descripcion: e.target.value })} />

                            <div className="md:col-span-2 flex justify-end gap-2 mt-4">
                                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400">Cancelar</button>
                                <button type="submit" className="px-4 py-2 bg-pokemon-blue text-white rounded hover:bg-blue-700">Guardar</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

const OrdersView = () => {
    const [orders, setOrders] = useState<Order[]>([]);
    const load = () => orderService.getAllOrders().then(setOrders).catch(console.error);
    useEffect(() => { load(); }, []);

    const changeStatus = async (id: string, status: string) => {
        await orderService.updateOrderStatus(id, status);
        load();
    };

    return (
        <div>
            <h2 className="text-2xl font-bold mb-4">Gestión de Órdenes</h2>
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-sm">
                    <thead>
                        <tr className="bg-gray-100 dark:bg-gray-700">
                            <th className="p-3 border-b">ID / Fecha</th>
                            <th className="p-3 border-b">Cliente</th>
                            <th className="p-3 border-b">Total</th>
                            <th className="p-3 border-b">Estado</th>
                            <th className="p-3 border-b">Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {orders.map(o => (
                            <tr key={o.id} className="border-b">
                                <td className="p-3">
                                    <div className="font-mono text-xs">{o.id.slice(0, 8)}...</div>
                                    <div className="text-gray-500 text-xs">{orderService.formatDate(o.fechaCreacion)}</div>
                                </td>
                                <td className="p-3">User #{o.usuarioId}</td>
                                <td className="p-3 font-bold">{orderService.formatPrice(o.total)}</td>
                                <td className="p-3">
                                    <span className={`px-2 py-1 rounded-full text-xs font-bold ${o.estado === 'Pendiente' ? 'bg-yellow-100 text-yellow-800' :
                                            o.estado === 'Entregado' ? 'bg-green-100 text-green-800' :
                                                o.estado === 'Cancelado' ? 'bg-red-100 text-red-800' : 'bg-blue-100 text-blue-800'
                                        }`}>
                                        {o.estado}
                                    </span>
                                </td>
                                <td className="p-3">
                                    <select
                                        value={o.estado}
                                        onChange={(e) => changeStatus(o.id, e.target.value)}
                                        className="text-xs p-1 border rounded"
                                    >
                                        {orderService.getEstadosOrden().map(st => (
                                            <option key={st} value={st}>{st}</option>
                                        ))}
                                    </select>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

const UsersView = () => {
    const [users, setUsers] = useState<User[]>([]);
    const load = () => userService.getUsers().then(setUsers).catch(console.error);
    useEffect(() => { load(); }, []);

    const handleDelete = async (id: number) => {
        if (window.confirm('¿Eliminar usuario? Esta acción no se puede deshacer.')) {
            await userService.deleteUser(id);
            load();
        }
    };

    return (
        <div>
            <h2 className="text-2xl font-bold mb-4">Usuarios Registrados</h2>
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-gray-100 dark:bg-gray-700">
                            <th className="p-3 border-b">ID</th>
                            <th className="p-3 border-b">Nombre</th>
                            <th className="p-3 border-b">Correo</th>
                            <th className="p-3 border-b">Rol</th>
                            <th className="p-3 border-b">Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map(u => (
                            <tr key={u.id} className="border-b">
                                <td className="p-3">#{u.id}</td>
                                <td className="p-3 font-medium">{u.nombre}</td>
                                <td className="p-3 text-gray-600">{u.correo}</td>
                                <td className="p-3">
                                    <span className={`px-2 py-1 rounded text-xs font-bold ${u.rol === 'Administrador' ? 'bg-purple-100 text-purple-800' : 'bg-gray-200 text-gray-800'}`}>
                                        {u.rol}
                                    </span>
                                </td>
                                <td className="p-3">
                                    {u.rol !== 'Administrador' && (
                                        <button onClick={() => handleDelete(u.id)} className="text-red-600 hover:text-red-800">
                                            <TrashIcon className="w-5 h-5" />
                                        </button>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AdminDashboardPage;

// Helper CSS
const style = document.createElement('style');
style.innerHTML = `
  .input-field {
    width: 100%;
    padding: 0.5rem;
    border: 2px solid #e5e7eb;
    border-radius: 0.5rem;
    outline: none;
  }
  .input-field:focus {
    border-color: #3b82f6;
  }
`;
document.head.appendChild(style);
