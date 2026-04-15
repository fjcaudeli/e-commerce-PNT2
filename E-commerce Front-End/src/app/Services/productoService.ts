import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { API_CONFIG } from '../config/api.config';
import { Producto } from '../models/producto';
import { map } from 'rxjs/operators';
import { parseApiJson } from '../models';

interface ApiProduct {
  id: number;
  product_name: string;
  description: string;
  price: number;
  stock: number;
}

@Injectable({
  providedIn: 'root'
})
export class ProductoService {

  private readonly apiUrl = `${API_CONFIG.baseUrl}${API_CONFIG.endpoints.productos}`;

  constructor(private http: HttpClient) {}

  GetProductos(): Observable<Producto[]> {
    return this.http.get(`${this.apiUrl}/GetAll`, { responseType: 'text' }).pipe(
      map(response => parseApiJson<ApiProduct[]>(response).map(producto => this.mapProducto(producto)))
    );
  }

  GetProductoById(id: number): Observable<Producto | undefined> {
    return this.http.get(`${this.apiUrl}/GetById/${id}`, { responseType: 'text' }).pipe(
      map(response => parseApiJson<ApiProduct[]>(response).map(producto => this.mapProducto(producto))[0])
    );
  }

  private mapProducto(producto: ApiProduct): Producto {
    return {
      id: producto.id,
      nombre: producto.product_name,
      descripcion: producto.description,
      precio: producto.price,
      stock: producto.stock
    };
  }
}
