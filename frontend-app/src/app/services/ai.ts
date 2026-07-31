import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AiService {
<<<<<<< HEAD
  private readonly apiUrl = `${environment.apiBaseUrl}/api/v1/ia/consulta`;
=======
  // URL de nuestro Backend en Java
  private apiUrl = 'http://localhost:8080/api/v1/ia/consulta';
  
  constructor(private http: HttpClient) {}
>>>>>>> parent of eb0c42c (Merge pull request #8 from XALEX14410/feature/clickup-core-mvp)

  consultarInteligenciaArtificial(pregunta: string): Observable<any> {
    // Enviamos la pregunta como parámetro de consulta (RequestParam)
    return this.http.get<any>(`${this.apiUrl}?pregunta=${encodeURIComponent(pregunta)}`);
  }
}
