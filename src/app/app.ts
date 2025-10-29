import { Component, inject } from '@angular/core';
import { Navbar } from './components/shared/navbar/navbar';
import { Router, RouterOutlet } from '@angular/router';
import { BarraBusca } from './components/shared/barra-busca/barra-busca';

@Component({
  selector: 'app-root',
  imports: [Navbar, RouterOutlet, BarraBusca],
  templateUrl: './app.html',
})
export class App {
  private readonly router = inject(Router);

  public buscar(query: string) {
    console.log(query);

    this.router.navigate(['/busca'], { queryParams: { query } });
  }
}
