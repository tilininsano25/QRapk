// holidays.component.ts
import { Component, OnInit } from '@angular/core';
import { CalendarificService } from 'src/app/services/calendarific.service'; // Asegúrate de que la ruta sea correcta

@Component({
  selector: 'app-holidays',
  templateUrl: './holidays.component.html',
  styleUrls: ['./holidays.component.scss']
})
export class HolidaysComponent implements OnInit {
  holidays: any[] = []; // Para almacenar los días festivos recibidos
  page: number = 0; // Inicializar la página
  itemsPerPage: number = 27; // Número de días festivos a mostrar por carga

  constructor(private calendarificService: CalendarificService) {}

  ngOnInit() {
    this.fetchHolidays('CL', 2024); // Llama al método para obtener festivos
  }

  fetchHolidays(country: string, year: number) {
    this.calendarificService.getHolidays(country, year).subscribe(
      (data) => {
        this.holidays = data.response.holidays; // Procesa los datos recibidos
        console.log(this.holidays); // Muestra los datos en la consola
        this.holidays = this.holidays.slice(0, this.itemsPerPage); // Cargar solo los primeros 'itemsPerPage'
      },
      (error) => {
        console.error('Error fetching holidays:', error);
      }
    );
  }

  loadMoreHolidays(event: any) {
    const currentLength = this.holidays.length;
    const nextPage = currentLength + this.itemsPerPage;

    // Cargar más días festivos si están disponibles
    if (nextPage <= this.holidays.length) {
      this.holidays = this.holidays.slice(0, nextPage); // Agregar más días festivos
    } else {
      // Si no hay más festivos, completar la carga
      event.target.disabled = true; // Desactivar el scroll infinito
    }

    event.target.complete(); // Completar la carga
  }
}
