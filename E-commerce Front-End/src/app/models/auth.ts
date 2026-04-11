export interface LoginRequest {
  usuario: string;
  clave: string;
}

export interface UsuarioSesion {
  id: number;
  usuario: string;
  nombreCompleto?: string;
  token?: string;
}

export interface LoginResponse {
  codigo: number;
  mensaje: string;
  estado: boolean;
  estadoUsuario?: string;
  fechaLogin?: string;
  token?: string;
  usuario?: UsuarioSesion;
}
