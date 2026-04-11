export interface Usuario {
  id?: number;
  nombreCompleto: string;
  usuario: string;
  clave?: string;
  fechaAlta?: string;
}

export interface RegistroUsuarioRequest {
  nombreCompleto: string;
  usuario: string;
  clave: string;
}
