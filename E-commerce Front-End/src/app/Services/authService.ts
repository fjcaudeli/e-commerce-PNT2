import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs/operators';
import { API_CONFIG } from '../config/api.config';
import { LoginRequest, LoginResponse, UsuarioSesion } from '../models/auth';
import { RegistroUsuarioRequest, Usuario } from '../models/usuario';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private readonly tokenKey = 'token';
  private readonly userKey = 'user';
  private readonly loginUrl = `${API_CONFIG.baseUrl}${API_CONFIG.endpoints.login}`;
  private readonly registroUrl = `${API_CONFIG.baseUrl}${API_CONFIG.endpoints.registro}`;

  private user: UsuarioSesion | null = null;
  private usuariosMock: Usuario[] = [
    {
      id: 1,
      nombreCompleto: 'Administrador',
      usuario: 'admin',
      clave: '1234',
      fechaAlta: new Date().toISOString()
    }
  ];

  constructor(private http: HttpClient) {}

  login(usuario: string, clave: string): Observable<LoginResponse> {
    const request: LoginRequest = { usuario, clave };

    if (!API_CONFIG.useMocks) {
      return this.http.post<LoginResponse>(this.loginUrl, request).pipe(
        tap((response: LoginResponse) => this.procesarLoginExitoso(response, request))
      );
    }

    const usuarioEncontrado = this.usuariosMock.find(x =>
      x.usuario === request.usuario && x.clave === request.clave
    );

    if (!usuarioEncontrado) {
      return throwError(() => new Error('Credenciales incorrectas'));
    }

    const usuarioSesion: UsuarioSesion = {
      id: usuarioEncontrado.id ?? 0,
      usuario: usuarioEncontrado.usuario,
      nombreCompleto: usuarioEncontrado.nombreCompleto,
      token: 'mock-jwt-token'
    };

    const response: LoginResponse = {
      codigo: 1,
      mensaje: 'login exitoso',
      estado: true,
      estadoUsuario: 'V',
      fechaLogin: new Date().toISOString(),
      token: usuarioSesion.token,
      usuario: usuarioSesion
    };

    this.user = usuarioSesion;
    this.guardarSesion(usuarioSesion);

    return of(response);
  }

  registrar(request: RegistroUsuarioRequest): Observable<Usuario> {
    if (!API_CONFIG.useMocks) {
      const body = {
        usuario: request.usuario,
        nombre: request.nombreCompleto,
        clave: request.clave
      };

      return this.http.post<Usuario>(this.registroUrl, body);
    }

    const usuarioExistente = this.usuariosMock.some(x => x.usuario === request.usuario);

    if (usuarioExistente) {
      return throwError(() => new Error('El usuario ya existe'));
    }

    const nuevoUsuario: Usuario = {
      id: this.usuariosMock.length + 1,
      nombreCompleto: request.nombreCompleto,
      usuario: request.usuario,
      clave: request.clave,
      fechaAlta: new Date().toISOString()
    };

    this.usuariosMock.push(nuevoUsuario);

    return of(nuevoUsuario);
  }

  logout(){
    this.user = null;
    this.removeStorage(this.userKey);
    this.removeStorage(this.tokenKey);
  }

  isLogged(): boolean {
    return this.getToken() != null;
  }

  getUsuarioActual(): UsuarioSesion | null {
    if (this.user) {
      return this.user;
    }

    const userStorage = this.getStorage(this.userKey);
    return userStorage ? JSON.parse(userStorage) as UsuarioSesion : null;
  }

  getToken(): string | null {
    return this.getStorage(this.tokenKey);
  }

  private guardarSesion(usuario: UsuarioSesion): void {
    this.setStorage(this.userKey, JSON.stringify(usuario));
    this.setStorage(this.tokenKey, usuario.token ?? '');
  }

  private procesarLoginExitoso(response: LoginResponse, request: LoginRequest): void {
    if (!response.estado || !response.token) {
      return;
    }

    const usuarioSesion: UsuarioSesion = response.usuario ?? {
      id: 0,
      usuario: request.usuario,
      token: response.token
    };

    usuarioSesion.token = response.token;
    this.user = usuarioSesion;
    this.guardarSesion(usuarioSesion);
  }

  private getStorage(key: string): string | null {
    if (typeof localStorage === 'undefined') {
      return null;
    }

    return localStorage.getItem(key);
  }

  private setStorage(key: string, value: string): void {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(key, value);
    }
  }

  private removeStorage(key: string): void {
    if (typeof localStorage !== 'undefined') {
      localStorage.removeItem(key);
    }
  }
}
