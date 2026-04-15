import { Producto } from './producto';

export interface CarritoItem {
  id?: number;
  producto: Producto;
  cantidad: number;
}
