import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { MidiaApiResponse } from '../models/midia-api-response';
import { map, Observable } from 'rxjs';
import { TipoMidia } from '../models/tipo-midia';
import { DetalhesMidias } from '../models/detalhes-midia';
import { VideosMidiaApiResponse } from '../models/videos-midia-api-response';
import { DomSanitizer } from '@angular/platform-browser';
import { CreditosMidiaApiResponse } from '../models/creditos-midia-api-response';

@Injectable({
  providedIn: 'root',
})
export class MidiaService {
  private readonly http = inject(HttpClient);
  private readonly domSanitizer = inject(DomSanitizer);
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

  public selecionarDetalhesMidiaPorID(
    tipo: TipoMidia,
    idMidia: number,
  ): Observable<DetalhesMidias> {
    const tipoSelecionado = tipo === 'filme' ? 'movie' : 'tv';

    const urlCompleto = `${this.urlBase}/${tipoSelecionado}/${idMidia}?language=pt-BR`;

    return this.http
      .get<DetalhesMidias>(urlCompleto, {
        headers: {
          Authorization: environment.apiKey,
        },
      })
      .pipe(map((resposta) => this.mapDetalhesMidia(resposta, tipo)));
  }

  public selecionarVideosMidiaPorID(
    tipo: TipoMidia,
    idMidia: number,
  ): Observable<VideosMidiaApiResponse> {
    const tipoSelecionado = tipo === 'filme' ? 'movie' : 'tv';

    const urlCompleto = `${this.urlBase}/${tipoSelecionado}/${idMidia}/videos?language=pt-BR`;

    return this.http
      .get<VideosMidiaApiResponse>(urlCompleto, {
        headers: {
          Authorization: environment.apiKey,
        },
      })
      .pipe(map((v) => this.mapVideosMidia(v)));
  }

  public selecionarCreditosMidiaPorId(
    tipo: TipoMidia,
    idMidia: number,
  ): Observable<CreditosMidiaApiResponse> {
    const tipoSelecionado = tipo === 'filme' ? 'movie' : 'tv';

    const urlCompleto = `${this.urlBase}/${tipoSelecionado}/${idMidia}/credits?language=pt-BR`;

    return this.http
      .get<CreditosMidiaApiResponse>(urlCompleto, {
        headers: {
          Authorization: environment.apiKey,
        },
      })
      .pipe(map(this.mapCreditosMidia));
  }

  private mapVideosMidia(x: VideosMidiaApiResponse): VideosMidiaApiResponse {
    return {
      ...x,
      results: x.results
        .filter((v) => v.site.toLowerCase() === 'youtube')
        .map((v) => ({
          ...v,
          key: this.domSanitizer.bypassSecurityTrustResourceUrl(
            'https://youtube.com/embed/' + v.key,
          ),
        })),
    };
  }

  private mapDetalhesMidia(x: DetalhesMidias, tipo: TipoMidia): DetalhesMidias {
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
        vote_average: y.vote_average * 10,
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
        vote_average: y.vote_average * 10,
        poster_path: 'https://image.tmdb.org/t/p/w500' + y.poster_path,
        backdrop_path: 'https://image.tmdb.org/t/p/original' + y.backdrop_path,
      })),
    };
  }

  private mapCreditosMidia(x: CreditosMidiaApiResponse): CreditosMidiaApiResponse {
    return {
      ...x,
      cast: x.cast.map((y) => ({
        ...y,
        profile_path: y.profile_path
          ? 'https://image.tmdb.org/t/p/w300/' + y.profile_path
          : '/person-placeholder.jpg',
      })),
      crew: x.crew.map((y) => ({
        ...y,
        profile_path: y.profile_path
          ? 'https://image.tmdb.org/t/p/w300/' + y.profile_path
          : '/person-placeholder.jpg',
      })),
    };
  }
}
