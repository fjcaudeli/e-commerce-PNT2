import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { UsuarioService } from '../../Services/usuario-service';

@Component({
  selector: 'app-usuario-component',
  standalone: false,
  templateUrl: './usuario-component.html',
  styleUrl: './usuario-component.css',
})
export class UsuarioComponent implements OnInit{

  dataSourceUsuarios:any;
  NombreCompleto:any;
  Usuario:any;
  Clave:any;
  showForm=false;
  editMode=false;
  id:any;

  constructor(private userService:UsuarioService, 
    private cdr:ChangeDetectorRef){
  }

  ngOnInit(): void {
    this.GetUsers();
    this.editMode = false;
  }

  GetUsers(){
    this.userService.GetUsers().subscribe(x => {
        this.dataSourceUsuarios = x;
        this.cdr.detectChanges();
        console.log(this.dataSourceUsuarios);
    });
  }

  PostUser(){
    
    let objeto = {
      id: 0,
      nombreCompleto: this.NombreCompleto,
      usuario: this.Usuario,
      clave: this.Clave,
      fechaAlta: ""
    }

    this.userService.CreateUser(objeto).subscribe(x =>{
        this.GetUsers();
    });
    
  }

  Actualizar(x:any){
       this.editMode = true;
    this.showForm = true;
    this.id = x.Id;
    this.NombreCompleto =x.NombreCompleto;
    this.Usuario =x.Usuario;
    this.Clave =x.Clave;
  }

  PutUser(){
    
    let objeto = {
      id: this.id,
      nombreCompleto:  this.NombreCompleto,
      usuario:  this.Usuario,
      clave: this.Clave,
      fechaAlta: ""
    }

    this.userService.EditUser(objeto).subscribe(x =>{
      this.GetUsers();
    });

  }


  mostrarForm(){
       this.editMode = false;
    this.showForm = true;
  }

  ocultarForm(){
    this.showForm = false;
  }

  DeleteUser(id:any){
    this.userService.DeleteUser(id).subscribe(x =>{
      this.GetUsers();
      this.cdr.detectChanges();
    });
  }
}