import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { MidiaApiResponse } from '../models/midia-api-response';
import { map, Observable } from 'rxjs';
import { TipoMidia } from '../models/tipo-midia';
import { DetalhesMidia } from '../models/detalhes-midia';

@Injectable({
  providedIn: 'root',
})
export class MidiaService {
  private readonly http = inject(HttpClient);
  private readonly urlBase: string = 'https://api.themoviedb.org/3';

  public selecionarMidiasPopulares(tipo: TipoMidia) {
    const tipoSelecionado = tipo === 'filme' ? 'movie' : 'tv';

    const urlCompleto = `${this.urlBase}/${tipoSelecionado}/popular?language=pt-BR`;

    return this.http
      .get<MidiaApiResponse>(urlCompleto, {
        headers: {
          Authorization: environment.apiKey,
        },
      })
      .pipe(map((resposta) => this.mapMidias(resposta, tipo)));
  }

  public selecionarMidiasMaisVotadas(tipo: TipoMidia) {
    const tipoSelecionado = tipo === 'filme' ? 'movie' : 'tv';

    const urlCompleto = `${this.urlBase}/${tipoSelecionado}/top_rated?language=pt-BR`;

    return this.http
      .get<MidiaApiResponse>(urlCompleto, {
        headers: {
          Authorization: environment.apiKey,
        },
      })
      .pipe(map((resposta) => this.mapMidias(resposta, tipo)));
  }

  public selecionarFilmesEmCartaz() {
    const urlCompleto = `${this.urlBase}/movie/now_playing?language=pt-BR`;

    return this.http
      .get<MidiaApiResponse>(urlCompleto, {
        headers: {
          Authorization: environment.apiKey,
        },
      })
      .pipe(map(this.mapFilmes));
  }

  public selecionarDetalhesMidiaPorID(tipo: TipoMidia, idMidia: number): Observable<DetalhesMidia> {
    const tipoSelecionado = tipo === 'filme' ? 'movie' : 'tv';

    const urlCompleto = `${this.urlBase}/${tipoSelecionado}/${idMidia}?language=pt-BR`;

    return this.http
      .get<DetalhesMidia>(urlCompleto, {
        headers: {
          Authorization: environment.apiKey,
        },
      })
      .pipe(map((resposta) => this.mapDetalhesMidia(resposta, tipo)));
  }

  private mapDetalhesMidia(x: DetalhesMidia, tipo: TipoMidia): DetalhesMidia {
    return {
      ...x,
      type: tipo,
      vote_average: x.vote_average * 10,
      poster_path: 'https://image.tmdb.org/t/p/w500/' + x.poster_path,
      backdrop_path: 'https://image.tmdb.org/t/p/original/' + x.backdrop_path,
    };
  }

  private mapMidias(x: MidiaApiResponse, tipoMidia: TipoMidia): MidiaApiResponse {
    return {
      ...x,
      type: tipoMidia,
      results: x.results.map((y) => ({
        ...y,
        poster_path: 'https://image.tmdb.org/t/p/w500' + y.poster_path,
        backdrop_path: 'https://image.tmdb.org/t/p/original' + y.backdrop_path,
      })),
    };
  }

  private mapFilmes(x: MidiaApiResponse): MidiaApiResponse {
    return {
      ...x,
      type: TipoMidia.Filme,
      results: x.results.map((y) => ({
        ...y,
        poster_path: 'https://image.tmdb.org/t/p/w500' + y.poster_path,
        backdrop_path: 'https://image.tmdb.org/t/p/original' + y.backdrop_path,
      })),
    };
  }
}
