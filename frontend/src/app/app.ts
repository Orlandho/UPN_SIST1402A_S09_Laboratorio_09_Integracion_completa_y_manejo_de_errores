import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Encabezado } from './components/encabezado/encabezado';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, Encabezado],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {}
