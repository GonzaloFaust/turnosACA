import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormsModule, Validators } from '@angular/forms';
import { SheetsService } from './services/sheets.service';
import { LocationService } from './services/location.service';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { ReactiveFormsModule } from '@angular/forms';
import { FormBuilder } from '@angular/forms';
import { catchError, timeout } from 'rxjs';
import { HttpClientModule } from '@angular/common/http';


@Component({
  selector: 'app-root',
  standalone:true,
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  imports: [MatFormFieldModule, MatInputModule, MatSelectModule,FormsModule, ReactiveFormsModule, HttpClientModule]
})
export class AppComponent implements OnInit {

  form = new FormGroup({
    apellido: new FormControl('', Validators.required),
    nombre: new FormControl('', Validators.required),
    telefono: new FormControl('', Validators.required),
    productor: new FormControl('', Validators.required),
    patente: new FormControl('', Validators.required),
    cuit: new FormControl('', Validators.required),
    cartaPorte: new FormControl(''),
    operacion: new FormControl('', Validators.required)
  });
  messages={
    dialogWelcome: "Por favor conceda los permisos de ubicación y espere un momento",
    dialogError:"No se ha podido determinar su ubicación",
    dialogFail:"No se encuentra dentro del radio de distancia permitido"
  }
  dialogOpen=false;
  dialogMessage="";
  ngOnInit() {
   this.openDialog()

    this.location.getGeolocation().pipe(timeout(10000),catchError(()=>this.messages.dialogError) ).subscribe((location)=> !location?this.closeDialog():this.dialogMessage=this.messages.dialogFail)
  }

  constructor(
    private sheets: SheetsService,
    private location: LocationService,
  ){}
 
  private openDialog(){
    this.dialogOpen=true
    this.dialogMessage= this.messages.dialogWelcome;
  }
  private closeDialog(){  this.dialogOpen=false; }
  doPost(){
    this.sheets.post()
  }
}


  
