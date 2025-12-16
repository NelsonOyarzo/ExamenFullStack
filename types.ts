// types.ts - PokéStore Type Definitions

export interface User {
    id: number;
    nombre: string;
    run: string;
    correo: string;
    rol: 'Administrador' | 'Cliente';
    telefono?: string | null;
    direccion?: DireccionEnvio | null;
}

export interface DireccionEnvio {
    calle: string;
    numero: string;
    comuna: string;
    ciudad: string;
    region: string;
    codigoPostal?: string;
}

export interface Producto {
    id: number;
    nombre: string;
    set: string;
    numeroSet: string;
    rareza: 'Common' | 'Uncommon' | 'Rare' | 'Rare Holo' | 'Rare Holo V' | 'Rare Holo VMAX' | 'Rare Holo VSTAR' | 'Ultra Rare' | 'Secret Rare' | 'Rainbow Rare';
    tipo: 'Grass' | 'Fire' | 'Water' | 'Lightning' | 'Electric' | 'Psychic' | 'Fighting' | 'Darkness' | 'Metal' | 'Dragon' | 'Fairy' | 'Colorless';
    precio: number;
    stock: number;
    imagen: string;
    descripcion: string;
    estado: 'Nuevo' | 'Usado - Mint' | 'Usado - Near Mint' | 'Usado - Lightly Played';
    idioma: 'Español' | 'Inglés' | 'Japonés';
}

export interface CartItem {
    productoId: number;
    cantidad: number;
    producto?: Producto;
}

export interface Cart {
    items: CartItem[];
    subtotal: number;
    envio: number;
    total: number;
}

export interface OrderItem {
    productoId: number;
    nombreProducto: string;
    cantidad: number;
    precioUnitario: number;
}

export interface Order {
    id: string;
    usuarioId: number;
    items: OrderItem[];
    subtotal: number;
    envio: number;
    total: number;
    estado: 'Pendiente' | 'Confirmado' | 'Enviado' | 'Entregado' | 'Cancelado';
    direccionEnvio: DireccionEnvio;
    fechaCreacion: number;
    fechaActualizacion: number;
}

export interface AuthResponse {
    token: string;
    user: {
        id: number;
        nombre: string;
        correo: string;
        rol: string;
    };
}

export interface ProductFilters {
    rareza?: string;
    tipo?: string;
    set?: string;
    precioMin?: number;
    precioMax?: number;
    buscar?: string;
    ordenar?: 'precio-asc' | 'precio-desc' | 'nombre' | 'stock';
}

export interface CreateProductDto {
    nombre: string;
    set: string;
    numeroSet?: string;
    rareza: string;
    tipo: string;
    precio: number;
    stock: number;
    imagen?: string;
    descripcion?: string;
    estado?: string;
    idioma?: string;
}

export interface UpdateProductDto extends Partial<CreateProductDto> { }

export interface CreateOrderDto {
    direccionEnvio: DireccionEnvio;
}

export interface AdminStats {
    totalProductos: number;
    totalOrdenes: number;
    totalUsuarios: number;
    ventasTotales: number;
    ordenesPendientes: number;
    productosAgotados: number;
}
