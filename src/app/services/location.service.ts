import { Injectable } from '@angular/core';
import { Observable, catchError, retry, tap, throwError } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class LocationService {

  ACA={
    longitude:-58.993695, 
    latitude:-31.889287
  }

  radio = 200;
  constructor() {}

  getGeolocation():Observable<boolean>{
    return new Observable<boolean>((observer) => {
      window.navigator.geolocation.getCurrentPosition(
        (position) => {
          observer.next(this.dentroDelRadio(position.coords.latitude,position.coords.longitude));
          observer.complete();
        },
        (err) => observer.error(err)
      );
    }).pipe(
      retry(1),
      tap(() => {
          // notificacion
                }
      ),
      catchError((error) => {
        return throwError(error);
      })
    );
  }

  private  dentroDelRadio(lat1:number, lon1:number) {
    const R = 6371e3; // radio de la Tierra en metros
    const radLat1 = lat1 * Math.PI/180; // convertir a radianes
    const radLat2 = this.ACA.latitude * Math.PI/180;
    const deltaLat = (this.ACA.latitude-lat1) * Math.PI/180;
    const deltaLon = (this.ACA.longitude-lon1) * Math.PI/180;

    const a = Math.sin(deltaLat/2) * Math.sin(deltaLat/2) +
              Math.cos(radLat1) * Math.cos(radLat2) *
              Math.sin(deltaLon/2) * Math.sin(deltaLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

    const distancia = R * c; // distancia en metros

    return distancia <= this.radio;
  }
}
