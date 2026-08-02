import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { RuntimeConfigService } from '../core/config/runtime-config.service';

@Injectable({
  providedIn: 'root'
})
export class AiService {
  private readonly apiUrl: string;

  constructor(
    private http: HttpClient,
    runtimeConfig: RuntimeConfigService
  ) {
    this.apiUrl = runtimeConfig.apiUrl('/api/v1/ia/consulta');
  }

  consultarInteligenciaArtificial(pregunta: string): Observable<any> {
    // Enviamos la pregunta como parámetro de consulta (RequestParam)
    return this.http.get<any>(`${this.apiUrl}?pregunta=${encodeURIComponent(pregunta)}`);
  }
}
