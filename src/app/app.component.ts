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
import {MatIconModule, MatIconRegistry} from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';

 
@Component({
  selector: 'app-root',
  standalone:true,
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  imports: [MatFormFieldModule, MatInputModule, MatSelectModule,FormsModule, ReactiveFormsModule, HttpClientModule,MatIconModule, HttpClientModule]
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

  dialogMessages={
    welcome: {text:"Bienvenido a ACA Villaguay, espere un momento", icon:"wait"},
    error:{text:"No se ha podido determinar su ubicación",icon:'error'},
    fail:{text:"No se encuentra dentro del radio de distancia permitido",icon:'error'},
    success:{text: "Se solicitó el turno con éxito",icon:'okey'},
    fatalError: {text:"Hubo un problema al solicitar el turno, recargue la página e intente nuevamente", icon:'error'}
  }

  dialogOpen=false;
  dialogMessage:DialogMessage= this.dialogMessages.welcome;
  ngOnInit() {
   this.openDialog(this.dialogMessages.welcome)

  this.location.getGeolocation().pipe(timeout(1000)).subscribe((location)=> location?this.closeDialog():(this.dialogMessage=this.dialogMessages.fail))
  }

  constructor(
    private sheets: SheetsService,
    private location: LocationService,
    private matIconReg: MatIconRegistry,
    private sanitizer: DomSanitizer
  ){
    this.matIconReg.addSvgIcon('okey',this.sanitizer.bypassSecurityTrustResourceUrl('../assets/img/check.svg'))
    this.matIconReg.addSvgIcon('error',this.sanitizer.bypassSecurityTrustResourceUrl('../assets/img/error.svg'))
    this.matIconReg.addSvgIcon('wait',this.sanitizer.bypassSecurityTrustResourceUrl('../assets/img/wait.svg'))
  }
 
  private openDialog(message:any){
    this.dialogOpen=true
    this.dialogMessage= message;
  }
  private closeDialog(){  this.dialogOpen=false; }

  doPost(e:Event){
    e.preventDefault();
   this.sheets.post(this.form).subscribe((res:any)=>{this.openDialog(res?this.dialogMessages.success:this.dialogMessages.fatalError)})
   
  }
}

interface DialogMessage{
  icon:string,
  text:string
}


  
