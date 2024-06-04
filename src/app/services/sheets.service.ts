import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Observable, catchError, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SheetsService {
  constructor(private http: HttpClient) {}

  post(form: FormGroup):Observable<boolean> {
    const scriptURL =
      'https://script.google.com/macros/s/AKfycbwiNVEWY4RTq6ROPZEDoz2o1VKlRX8GiSsnYR60mNllsBP6ZquKvx5jwfzsnCVqCAUZgg/exec';
      const date = new Date();
      form.addControl("timetoken", new FormControl(date.toLocaleDateString()+' '+ date.toLocaleTimeString('it-IT')));
      let formData= new FormData()
      this.toFormData(formData, form)

    return new Observable<boolean>((observer)=>{
      this.http.post(scriptURL,formData).subscribe((res:any)=> {
        observer.next(res.result=='success')
        observer.complete()
      })
    }).pipe(
        catchError((error) => {
          return throwError(error);
        })
      )
      //  fetch(scriptURL, { method: 'POST', body: formData })
      //   .then((response) =>
      //     response.status == 200
      //   )
      //   // .then(() => {
      //   //   window.location.reload();
      //   // })
      //   .catch((error) => {return false});
  }


  private toFormData(formData: FormData, formGroup: FormGroup) {
    for (let key in formGroup.controls) {
        if (formGroup.controls[key] instanceof FormGroup) {
            this.toFormData(formData, formGroup.controls[key] as FormGroup);
        }
        else {
            formData.append(key, formGroup.controls[key].value);
        }
    }
}
}
