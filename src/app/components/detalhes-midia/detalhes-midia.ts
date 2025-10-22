import { Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { filter, map, switchMap } from 'rxjs';
import { MidiaService } from '../../services/midia-service';
import { TipoMidia } from '../../models/tipo-midia';

@Component({
  selector: 'app-detalhes-midia',
  imports: [],
  templateUrl: './detalhes-midia.html',
})
export class DetalhesMidia {
  protected readonly route = inject(ActivatedRoute);
  protected readonly midiaService = inject(MidiaService);

  protected readonly detalhes$ = this.route.paramMap.pipe(
    filter((params) =>
      params.get('tipoMidia') !== null && params.get('idMidia') !== null
    ),
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
  );
}
