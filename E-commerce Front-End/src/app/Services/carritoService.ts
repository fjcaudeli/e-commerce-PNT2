import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, forkJoin, Observable, of, throwError } from 'rxjs';
import { map, switchMap, tap } from 'rxjs/operators';
import { API_CONFIG } from '../config/api.config';
import { AuthService } from './authService';
import { CarritoItem, GeneralResponse, parseApiJson, Producto } from '../models';

interface ApiCartItem {
  id: number;
  product_id: number;
  quantity: number;
  product_name: string;
  description?: string;
  price: number;
  stock?: number;
}

@Injectable({
  providedIn: 'root'
})
export class CarritoService {

  private readonly apiUrl = `${API_CONFIG.baseUrl}${API_CONFIG.endpoints.carrito}`;
  private items: CarritoItem[] = [];
  private itemsSubject = new BehaviorSubject<CarritoItem[]>([]);

  items$ = this.itemsSubject.asObservable();

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) {}

  GetItems(): Observable<CarritoItem[]> {
    const usuarioId = this.obtenerUsuarioId();

    if (!usuarioId) {
      return throwError(() => new Error('Debe iniciar sesion'));
    }

    return this.http.get(`${this.apiUrl}/GetCart/${usuarioId}`, { responseType: 'text' }).pipe(
      map(response => parseApiJson<ApiCartItem[]>(response).map(item => this.mapCartItem(item))),
      tap(items => {
        this.items = items;
        this.notificarCambios();
      })
    );
  }

  AgregarProducto(producto: Producto, cantidad: number = 1): Observable<CarritoItem[]> {
    if (cantidad <= 0) {
      return throwError(() => new Error('La cantidad debe ser mayor a cero'));
    }

    const usuarioId = this.obtenerUsuarioId();

    if (!usuarioId) {
      return throwError(() => new Error('Debe iniciar sesion'));
    }

    const cantidadActual = this.items.find(item => item.producto.id === producto.id)?.cantidad ?? 0;

    if (cantidadActual + cantidad > producto.stock) {
      return throwError(() => new Error('No hay stock suficiente'));
    }

    return this.http.post<GeneralResponse>(`${this.apiUrl}/Add`, {
      user_Id: usuarioId,
      product_Id: producto.id,
      quantity: cantidad
    }).pipe(
      switchMap(response => this.procesarRespuestaCarrito(response))
    );
  }

  ModificarCantidad(productoId: number, cantidad: number): Observable<CarritoItem[]> {
    const usuarioId = this.obtenerUsuarioId();

    if (!usuarioId) {
      return throwError(() => new Error('Debe iniciar sesion'));
    }

    if (cantidad <= 0) {
      return this.EliminarProducto(productoId);
    }

    return this.http.put<GeneralResponse>(`${this.apiUrl}/Update`, {
      user_Id: usuarioId,
      product_Id: productoId,
      quantity: cantidad
    }).pipe(
      switchMap(response => this.procesarRespuestaCarrito(response))
    );
  }

  EliminarProducto(productoId: number): Observable<CarritoItem[]> {
    const item = this.items.find(x => x.producto.id === productoId);

    if (!item?.id) {
      return throwError(() => new Error('El producto no esta en el carrito'));
    }

    return this.http.delete<GeneralResponse>(`${this.apiUrl}/Remove/${item.id}`).pipe(
      switchMap(response => this.procesarRespuestaCarrito(response))
    );
  }

  VaciarCarrito(): Observable<void> {
    const deletes = this.items
      .filter(item => item.id)
      .map(item => this.http.delete<GeneralResponse>(`${this.apiUrl}/Remove/${item.id}`));

    if (deletes.length === 0) {
      this.LimpiarEstadoLocal();
      return of(void 0);
    }

    return forkJoin(deletes).pipe(
      tap(() => this.LimpiarEstadoLocal()),
      map(() => void 0)
    );
  }

  ObtenerTotal(): number {
    return this.items.reduce((total, item) => total + item.producto.precio * item.cantidad, 0);
  }

  ObtenerCantidadTotal(): number {
    return this.items.reduce((total, item) => total + item.cantidad, 0);
  }

  LimpiarEstadoLocal(): void {
    this.items = [];
    this.notificarCambios();
  }

  private procesarRespuestaCarrito(response: GeneralResponse): Observable<CarritoItem[]> {
    if (!response.estado) {
      return throwError(() => new Error(response.mensaje || 'No se pudo actualizar el carrito'));
    }

    return this.GetItems();
  }

  private obtenerUsuarioId(): number | undefined {
    return this.authService.getUsuarioActual()?.id;
  }

  private mapCartItem(item: ApiCartItem): CarritoItem {
    return {
      id: item.id,
      producto: {
        id: item.product_id,
        nombre: item.product_name,
        descripcion: item.description ?? '',
        precio: item.price,
        stock: item.stock ?? 9999
      },
      cantidad: item.quantity
    };
  }

  private notificarCambios(): void {
    this.itemsSubject.next(this.copiarItems());
  }

  private copiarItems(): CarritoItem[] {
    return this.items.map(item => ({
      id: item.id,
      producto: { ...item.producto },
      cantidad: item.cantidad
    }));
  }
}
