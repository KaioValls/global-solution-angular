import { HttpClient, HttpParams, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Ocean } from '../interface/ocean';

@Injectable({
  providedIn: 'root',
})
export class OceanService {
  constructor(private http: HttpClient) {}

  API = 'https://fiap-3sis-gs-20241.azurewebsites.net/OceanData';

  getOceans(pagina = 1, qtde = 20): Observable<Ocean[]> {
    const parametros: HttpParams = new HttpParams()
      .set('pagina', pagina)
      .set('qtde', qtde);

    return this.http.get(this.API, { params: parametros }) as Observable<
      Ocean[]
    >;
  }

  getOceansSearch(search:any): Observable<Ocean[]> {
    let parametros: HttpParams = new HttpParams()

    if(search.regiao){
      parametros = parametros.append('regiao', search.regiao)
    }
    if(search.especies){
      parametros = parametros.append('especie', search.especies)
    }
    if(search.statusConservacao){
      parametros = parametros.append('statusConservacao', search.statusConservacao)
    }
    if(search.niveis){
      parametros = parametros.append('nivelPoluicao', search.niveis)
    }
    if(search.temperaturaAgua){
      parametros = parametros
      .append('temperaturaMin', search.temperaturaMin)
      .append('temperaturaMax', search.temperaturaMax)
    }
    if(search.ph){
      parametros = parametros
      .append('phMin', search.phMin)
      .append('phMax', search.phMax)
    }


    return this.http.get(this.API, { params: parametros }) as Observable<
      Ocean[]
    >;
  }
}
