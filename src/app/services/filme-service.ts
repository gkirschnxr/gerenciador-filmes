import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class FilmeService {
  private readonly http = inject(HttpClient);
  private readonly urlBase: string = 'https://api.themoviedb.org/3/movie';

  public selecionarFilmesPopulares() {
    const urlCompleto = `${this.urlBase}/popular?language=pt-BR`

    return this.http.get(urlCompleto, { 
      headers: {
        Authorization: environment.apiKey,
      },
    });
  }
}
