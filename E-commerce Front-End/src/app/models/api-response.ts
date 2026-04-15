export interface GeneralResponse {
  codigo: number;
  mensaje: string;
  estado: boolean;
}

export function parseApiJson<T>(response: string | T): T {
  if (typeof response !== 'string') {
    return response;
  }

  const parsed = JSON.parse(response);
  return typeof parsed === 'string' ? JSON.parse(parsed) as T : parsed as T;
}
