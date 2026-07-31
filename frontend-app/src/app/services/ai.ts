import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AiService {
  private readonly apiUrl = `${environment.apiBaseUrl}/api/v1/ia/consulta`;
  
  constructor(private http: HttpClient) {}

  consultarInteligenciaArtificial(pregunta: string): Observable<any> {
    // Enviamos la pregunta como parámetro de consulta (RequestParam)
    return this.http.get<any>(`${this.apiUrl}?pregunta=${encodeURIComponent(pregunta)}`);
  }
}
