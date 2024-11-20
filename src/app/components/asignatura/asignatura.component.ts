import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { AsignaturaService, Asignatura } from 'src/app/services/asignatura.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-asignatura',
  templateUrl: './asignatura.component.html',
  styleUrls: ['./asignatura.component.scss']
})
export class AsignaturaComponent implements OnInit {
  asignaturasGroupedByDay$!: Observable<{ [key: string]: Asignatura[] }>;
  userId: string | null = null;
  seccionId: string | null = null;
  selectedDay: string = 'Lunes'; // Día seleccionado por defecto

  constructor(
    private authService: AuthService,
    private asignaturaService: AsignaturaService
  ) {}

  ngOnInit(): void {
    this.authService.getCurrentUser().subscribe(user => {
      if (user) {
        this.userId = user.uid;
        this.seccionId = this.getSeccionIdForUser(user.uid);
        if (this.seccionId) {
          console.log(`Usuario: ${user.uid}, Sección: ${this.seccionId}`);
          this.asignaturasGroupedByDay$ = this.asignaturaService.getAsignaturas(user.uid, this.seccionId).pipe(
            map(asignaturas => {
              console.log('Asignaturas obtenidas:', asignaturas);
              const cleanedAsignaturas = this.cleanAsignaturas(asignaturas);
              const grouped = this.groupByDay(cleanedAsignaturas);
              console.log('Asignaturas agrupadas por día:', grouped);
              return grouped;
            })
          );
        } else {
          console.error('No se encontró un seccionId para el usuario:', user.uid);
        }
      }
    });
  }

  getSeccionIdForUser(userId: string): string | null {
    const userSeccionMap: { [userId: string]: string } = {
      'L3OGKIEaeZXHFELKR8FQXSbDVsP2': 'Ingenieria',
      'bKZUWFAAx0fO37corjVPCyORPxn2': 'analista'
    };
    return userSeccionMap[userId] || null;
  }

  cleanAsignaturas(asignaturas: Asignatura[]): Asignatura[] {
    return asignaturas.map(asignatura => {
      const cleanedAsignatura: any = {};
      Object.keys(asignatura).forEach(key => {
        const cleanedKey = key.trim();
        cleanedAsignatura[cleanedKey] = (asignatura as any)[key];
      });

      // Asegurarse de que todos los campos estén presentes y sean consistentes
      cleanedAsignatura.codigo = cleanedAsignatura.codigo || '';
      cleanedAsignatura.hora_inicio = cleanedAsignatura.hora_inicio || '';
      cleanedAsignatura.hora_final = cleanedAsignatura.hora_final || '';
      cleanedAsignatura.profesor = cleanedAsignatura.profesor || '';
      cleanedAsignatura.dia = cleanedAsignatura.dia || '';
      cleanedAsignatura.nombre = cleanedAsignatura.nombre || '';

      return cleanedAsignatura as Asignatura;
    });
  }

  groupByDay(asignaturas: Asignatura[]): { [key: string]: Asignatura[] } {
    const daysOfWeek = this.getDaysOfWeek();
    const grouped = asignaturas.reduce((groups, asignatura) => {
      const day = asignatura.dia;
      if (!groups[day]) {
        groups[day] = [];
      }
      groups[day].push(asignatura);
      return groups;
    }, {} as { [key: string]: Asignatura[] });

    // Asegurarse de que todos los días de la semana estén presentes en el objeto agrupado
    daysOfWeek.forEach(day => {
      if (!grouped[day]) {
        grouped[day] = [];
      }
    });

    return grouped;
  }

  getDaysOfWeek(): string[] {
    return ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];
  }
  
  onDayChange(day: string): void {
    this.selectedDay = day;
  }
}