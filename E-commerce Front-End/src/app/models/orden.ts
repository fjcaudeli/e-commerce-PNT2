import { CarritoItem } from './carrito-item';

export type EstadoOrden = 'Pendiente' | 'Confirmada' | 'Cancelada';

export interface Orden {
  id?: number;
  usuarioId?: number;
  items: CarritoItem[];
  total: number;
  fecha: string;
  estado: EstadoOrden;
}

export interface ConfirmarOrdenRequest {
  items: ConfirmarOrdenItemRequest[];
}

export interface ConfirmarOrdenItemRequest {
  productoId: number;
  cantidad: number;
}

export interface ConfirmarOrdenResponse {
  orden: Orden;
  mensaje: string;
}
