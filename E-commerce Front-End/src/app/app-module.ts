import { NgModule, provideZonelessChangeDetection } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './Components/login-component/login-component';
import { UsuarioComponent } from './Components/usuario-component/usuario-component';
import { ProductosComponent } from './Components/producto-component/producto-component';
import { ProductoComponenteDetalle } from './Components/producto-componente-detalle/producto-componente-detalle';
import { RegistroComponent } from './Components/registro-component/registro-component';
import { CarritoComponent } from './Components/carrito-component/carrito-component';
import { ConfirmacionCompraComponent } from './Components/confirmacion-compra-component/confirmacion-compra-component';
import { App } from './app';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'registro', component: RegistroComponent },
  { path: 'usuarios', component: UsuarioComponent },

  { path: 'productos', component: ProductosComponent },
  { path: 'producto/:id', component: ProductoComponenteDetalle },
  { path: 'carrito', component: CarritoComponent },
  { path: 'confirmar-compra', component: ConfirmacionCompraComponent }
];

@NgModule({
  declarations: [
    App,
    UsuarioComponent,
    LoginComponent,
    RegistroComponent,
    ProductosComponent,
    ProductoComponenteDetalle,
    CarritoComponent,
    ConfirmacionCompraComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,

    RouterModule.forRoot(routes)
  ],
  providers: [
    provideZonelessChangeDetection()
  ],
  bootstrap: [App]
})
export class AppModule { }
