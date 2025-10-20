import { Component, inject, OnInit, signal } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { MidiaService } from './services/midia-service';
import { Navbar } from "./components/navbar/navbar";
import { BannerPrincipal } from "./components/banner-principal/banner-principal";
import { AsyncPipe } from '@angular/common';
import { tap } from 'rxjs';

@Component({
  selector: 'app-root',
  imports: [AsyncPipe, RouterOutlet, Navbar, BannerPrincipal],
  templateUrl: "./app.html",
  styleUrl: "./app.scss"
})
export class App {
  private readonly midiaService = inject(MidiaService);

  // funciona como o OnInit
  protected readonly midiasPopulares$ = this.midiaService.selecionarMidiasPopulares()
  .pipe(tap((x) => console.log(x)));
}
