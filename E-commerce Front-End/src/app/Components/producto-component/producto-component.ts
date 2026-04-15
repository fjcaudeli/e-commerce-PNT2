import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ProductoService } from '../../Services/productoService';
import { Router } from '@angular/router';
import { Producto } from '../../models/producto';
import { CarritoService } from '../../Services/carritoService';
import { CarritoItem } from '../../models';

@Component({
  selector: 'app-productos-component',
  standalone: false,
  templateUrl: './producto-component.html',
  styleUrl: './producto-component.css'
})
export class ProductosComponent implements OnInit {

  productos: Producto[] = [];
  cantidadesEnCarrito: { [productoId: number]: number } = {};
  mensaje = '';
  error = '';
  private mensajeTimer?: ReturnType<typeof setTimeout>;
  private errorTimer?: ReturnType<typeof setTimeout>;

  constructor(
    private productoService: ProductoService,
    private carritoService: CarritoService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.GetProductos();
    this.carritoService.GetItems().subscribe({ error: () => undefined });
    this.carritoService.items$.subscribe((items: CarritoItem[]) => {
      this.cantidadesEnCarrito = this.armarCantidadesEnCarrito(items);
      this.cdr.detectChanges();
    });
  }

  GetProductos(){
    this.productoService.GetProductos().subscribe((res: Producto[]) => {
      this.productos = res;
    });
  }

  verDetalle(id: number){
    this.router.navigate(['/producto', id]);
  }

  cantidadEnCarrito(productoId: number): number {
    return this.cantidadesEnCarrito[productoId] ?? 0;
  }

  agregarAlCarrito(producto: Producto): void {
    this.mensaje = '';
    this.error = '';

    this.carritoService.AgregarProducto(producto).subscribe({
      next: () => {
        this.mostrarMensaje('Producto agregado al carrito');
      },
      error: (err: Error) => {
        this.mostrarError(err.message);
      }
    });
  }

  private mostrarMensaje(texto: string): void {
    if (this.mensajeTimer) {
      clearTimeout(this.mensajeTimer);
    }

    this.mensaje = '';
    this.cdr.detectChanges();

    this.mensajeTimer = setTimeout(() => {
      this.mensaje = texto;
      this.cdr.detectChanges();
    }, 80);
  }

  private mostrarError(texto: string): void {
    if (this.errorTimer) {
      clearTimeout(this.errorTimer);
    }

    this.error = '';
    this.cdr.detectChanges();

    this.errorTimer = setTimeout(() => {
      this.error = texto;
      this.cdr.detectChanges();
    }, 80);
  }

  private armarCantidadesEnCarrito(items: CarritoItem[]): { [productoId: number]: number } {
    return items.reduce((cantidades, item) => {
      cantidades[item.producto.id] = item.cantidad;
      return cantidades;
    }, {} as { [productoId: number]: number });
  }
}
