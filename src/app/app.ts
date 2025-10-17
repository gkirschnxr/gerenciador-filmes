import { Component, inject, OnInit, signal } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { FilmeService } from './services/filme-service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink],
  templateUrl: "./app.html",
  styleUrl: "./app.scss"
})
export class App implements OnInit{
  protected readonly title = signal('gerenciador-filmes');
  private readonly filmeService = inject(FilmeService);

  ngOnInit(): void {
    this.filmeService.selecionarFilmesPopulares().subscribe(v => console.log(v));
  }
}
