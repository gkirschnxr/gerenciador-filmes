import { Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Midia } from '../../../models/midia-api-response';
import { TipoMidia } from '../../../models/tipo-midia';
import { IconeAvaliacao } from '../icone-avaliacao/icone-avaliacao';

@Component({
  selector: 'app-card-midia',
  imports: [RouterLink, IconeAvaliacao],
  template: `
    @if (midia) {
      <a
        class="text-decoration-none text-white"
        [title]="midia.title ?? midia.name"
        [routerLink]="['/', tipoMidia, midia.id, 'detalhes']"
        ><div class="card rounded-3 app-card-filme">
          @if (midia.vote_average > 0) {
            <app-icone-avaliacao
              [avaliacao]="midia.vote_average"
              [tamanhoPx]="40"
              class="app-icone-absoluto"
            ></app-icone-avaliacao>
          }

          @if (midia.poster_path) {
            <img
              class="card-img-top rounded-3"
              style="min-height: 270px"
              [src]="midia.poster_path"
              [alt]="midia.title ?? midia.name"
            />
          } @else {
            <div
              class="card-img-top rounded-3 d-flex flex-column justify-content-center align-items-center bg-secondary bg-opacity-25"
              style="min-height: 270px;"
            >
              <i class="bi bi-image fs-1 text-black-50"></i>
              <small class="text-black-50 mt-2">Sem imagem</small>
            </div>
          }
        </div>

        <div class="mt-2">
          <small class="text-white fst-italic">{{
            midia.release_date ?? midia.first_air_date
          }}</small>
          <p class="app-titulo-card fw-bold">
            {{ (midia.title ?? midia.name)?.slice(0, 30) }}
          </p>
        </div>
      </a>
    }
  `,
})
export class CardMidia {
  @Input({ required: true }) midia?: Midia;
  @Input({ required: true }) tipoMidia?: TipoMidia;
}
