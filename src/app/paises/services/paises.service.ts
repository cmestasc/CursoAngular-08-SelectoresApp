import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Pais, PaisSmall } from '../interfaces/paises.interface';
import { combineLatest, Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PaisesService {
  private _regiones: string[] = ['Africa', 'Americas', 'Asia', 'Europe', 'Oceania'];

  private baseUrl = 'https://restcountries.com/v3.1';
  get regiones(): string[]{
    return [...this._regiones];
  }
  constructor(private http: HttpClient) { }

  getPaisesPorRegion(region:string):Observable<PaisSmall[]>{
    const url: string = `${this.baseUrl}/region/${region}?fields=cca2,name`
    return this.http.get<PaisSmall[]>(url);
  }
  
  getPaisPorCodigo(cca2:string):Observable<Pais[]>{
    if(!cca2){
      return of([]);
    } else {
    const url: string = `${this.baseUrl}/alpha/${cca2}`
    return this.http.get<Pais[]>(url);
    }
  }
  
  getPaisesFronterizos(cca2:string):Observable<string[]>{
    const url: string = `${this.baseUrl}/alpha/${cca2}?fields=borders`
    return this.http.get<string[]>(url);
  }

  getPaisPorCodigoSmall(cca2:string):Observable<PaisSmall>{
    const url: string = `${this.baseUrl}/alpha/${cca2}?fields=cca2,name`
    return this.http.get<PaisSmall>(url);
    
  }

  getPaisesPorCodigos(borders:string[]):Observable<PaisSmall[]>{
    if(!borders){
      return of([])
    }else{
      const peticiones: Observable<PaisSmall>[] = [];

      borders.forEach(codigo => {
        const peticion = this.getPaisPorCodigoSmall(codigo);
        peticiones.push(peticion);
      });
      return combineLatest(peticiones);
    }
  }



}
