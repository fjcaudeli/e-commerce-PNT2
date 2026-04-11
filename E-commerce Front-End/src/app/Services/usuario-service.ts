import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { API_CONFIG } from '../config/api.config';
import { LoginRequest, Usuario } from '../models';

@Injectable({
  providedIn: 'root',
})

export class UsuarioService {

  constructor(private http:HttpClient){
    
  }

  url = `${API_CONFIG.baseUrl}${API_CONFIG.endpoints.usuarios}/`;

  GetUsers(){
    return this.http.get(this.url + "GetUsers");
  }

  CreateUser(obj: Usuario){
    return this.http.post(this.url + "CreateUser",obj)
  }

  EditUser(obj: Usuario){
    return this.http.put(this.url + "EditUser",obj)
  }

  DeleteUser(id: number){
    return this.http.delete(this.url + "DeleteUser?id=" + id);
  }
  Login(obj: LoginRequest){
  return this.http.post(this.url + "Login", obj);
}
}
