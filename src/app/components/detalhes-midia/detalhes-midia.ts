import { Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { filter, map, shareReplay, switchMap, tap } from 'rxjs';
import { MidiaService } from '../../services/midia-service';
import { TipoMidia } from '../../models/tipo-midia';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-detalhes-midia',
  imports: [AsyncPipe],
  templateUrl: './detalhes-midia.html',
})
export class DetalhesMidia {
  protected readonly route = inject(ActivatedRoute);
  protected readonly midiaService = inject(MidiaService);

  protected readonly detalhes$ = this.route.paramMap.pipe(
    filter((params) => params.get('tipoMidia') !== null && params.get('idMidia') !== null),
    map((params) => {
      const idMidia = params.get('idMidia')!;
      return {
        tipoMidia: params.get('tipoMidia') as TipoMidia,
        idMidia: parseInt(idMidia),
      };
    }),
    switchMap((params) =>
      this.midiaService.selecionarDetalhesMidiaPorID(params.tipoMidia, params.idMidia),
    ),
    shareReplay({ bufferSize: 1, refCount: true }),
  );

  protected readonly videos$ = this.detalhes$.pipe(
    switchMap((detalhes) =>
      this.midiaService.selecionarVideosMidiaPorID(detalhes.type, detalhes.id),
    ),
    tap((v) => console.log(v)),
  );
}
