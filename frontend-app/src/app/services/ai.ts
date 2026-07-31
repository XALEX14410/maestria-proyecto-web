import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface AiConsultaResponse {
  respuesta: string;
}

@Injectable({
  providedIn: 'root'
})
export class AiService {
  private readonly apiUrl = `${environment.apiBaseUrl}/api/v1/ia/consulta`;

  constructor(private readonly http: HttpClient) {}

  consultarInteligenciaArtificial(pregunta: string): Observable<AiConsultaResponse> {
    return this.http.get<AiConsultaResponse>(`${this.apiUrl}?pregunta=${encodeURIComponent(pregunta)}`);
  }
}
