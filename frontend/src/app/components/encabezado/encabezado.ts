import { Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-encabezado',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './encabezado.html',
  styleUrl: './encabezado.scss'
})
export class Encabezado {
  @Input() titulo: string = 'Catálogo de productos';
}
