import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { map, tap } from 'rxjs/operators';
import { API_CONFIG } from '../config/api.config';
import { LoginRequest, LoginResponse, UsuarioSesion } from '../models/auth';
import { RegistroUsuarioRequest, Usuario } from '../models/usuario';
import { GeneralResponse } from '../models';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private readonly tokenKey = 'token';
  private readonly userKey = 'user';
  private readonly loginUrl = `${API_CONFIG.baseUrl}${API_CONFIG.endpoints.login}`;
  private readonly registroUrl = `${API_CONFIG.baseUrl}${API_CONFIG.endpoints.registro}`;

  private user: UsuarioSesion | null = null;
  constructor(private http: HttpClient) {}

  login(usuario: string, clave: string): Observable<LoginResponse> {
    const request: LoginRequest = { usuario, clave };
    const body = {
      username: usuario,
      password: clave
    };

    return this.http.post<LoginResponse>(this.loginUrl, body).pipe(
      map((response: LoginResponse) => {
        if (!response.estado || !response.token) {
          throw new Error(response.mensaje || 'Credenciales incorrectas');
        }

        return response;
      }),
      tap((response: LoginResponse) => this.procesarLoginExitoso(response, request))
    );
  }

  registrar(request: RegistroUsuarioRequest): Observable<Usuario> {
    const body = {
      username: request.usuario,
      password: request.clave,
      name: request.nombreCompleto,
      email: request.email
    };

    return this.http.post<GeneralResponse>(this.registroUrl, body).pipe(
      map((response: GeneralResponse) => {
        if (!response.estado) {
          throw new Error(response.mensaje || 'No se pudo registrar el usuario');
        }

        return {
          nombreCompleto: request.nombreCompleto,
          usuario: request.usuario,
          clave: request.clave,
          fechaAlta: new Date().toISOString()
        };
      })
    );
  }

  logout(){
    this.user = null;
    this.removeStorage(this.userKey);
    this.removeStorage(this.tokenKey);
  }

  isLogged(): boolean {
    return !!this.getToken();
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

    const usuarioSesion = response.usuario ?? this.crearSesionDesdeToken(response.token, request.usuario);

    usuarioSesion.token = response.token;
    this.user = usuarioSesion;
    this.guardarSesion(usuarioSesion);
  }

  private crearSesionDesdeToken(token: string, usuarioFallback: string): UsuarioSesion {
    const payload = this.decodificarJwt(token);
    const idClaim = 'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier';
    const nameClaim = 'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name';
    const givenNameClaim = 'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/givenname';

    return {
      id: Number(payload?.[idClaim] ?? 0),
      usuario: String(payload?.[nameClaim] ?? usuarioFallback),
      nombreCompleto: String(payload?.[givenNameClaim] ?? usuarioFallback),
      token
    };
  }

  private decodificarJwt(token: string): Record<string, unknown> | null {
    const payload = token.split('.')[1];

    if (!payload || typeof atob === 'undefined') {
      return null;
    }

    const base64 = payload.replace(/-/g, '+').replace(/_/g, '/');
    const padded = base64.padEnd(base64.length + (4 - base64.length % 4) % 4, '=');

    try {
      return JSON.parse(atob(padded)) as Record<string, unknown>;
    } catch {
      return null;
    }
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
