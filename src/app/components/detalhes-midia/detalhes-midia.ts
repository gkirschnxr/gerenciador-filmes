import { Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { filter, map, shareReplay, switchMap } from 'rxjs';
import { MidiaService } from '../../services/midia-service';
import { TipoMidia } from '../../models/tipo-midia';
import { AsyncPipe, NgClass } from '@angular/common';
import { IconeAvaliacao } from '../shared/icone-avaliacao/icone-avaliacao';

@Component({
  selector: 'app-detalhes-midia',
  imports: [AsyncPipe, IconeAvaliacao, NgClass],
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
      this.midiaService.selecionarVideosMidiaPorID(detalhes.media_type, detalhes.id),
    ),
  );

  public readonly creditos$ = this.detalhes$.pipe(
    switchMap((x) => this.midiaService.selecionarCreditosMidiaPorId(x.media_type, x.id)),
  );
}
