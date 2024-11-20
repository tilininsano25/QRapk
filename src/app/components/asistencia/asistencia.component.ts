import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { AsignaturaService, Asignatura } from 'src/app/services/asignatura.service';
import { AsistenciaService } from 'src/app/services/asistencia.service';
import { Observable } from 'rxjs';

interface Asistencia {
  fecha: string;
  presente: boolean;
}

@Component({
  selector: 'app-asistencia',
  templateUrl: './asistencia.component.html',
  styleUrls: ['./asistencia.component.scss']
})
export class AsistenciaComponent implements OnInit {
  asignaturas$!: Observable<Asignatura[]>;
  asistencias$!: Observable<Asistencia[]>;
  selectedAsignaturaCodigo: string | null = null;
  asistenciaData: any = {
    fecha: '',
    presente: false
  };
  userId: string | null = null;
  seccionId: string | null = null;

  constructor(
    private authService: AuthService,
    private asignaturaService: AsignaturaService,
    private asistenciaService: AsistenciaService
  ) {}

  ngOnInit(): void {
    this.authService.getCurrentUser().subscribe(user => {
      if (user) {
        this.userId = user.uid;
        this.seccionId = this.getSeccionIdForUser(user.uid);
        if (this.seccionId) {
          this.asignaturas$ = this.asignaturaService.getAsignaturas(user.uid, this.seccionId);
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

  onAsignaturaChange() {
    if (this.selectedAsignaturaCodigo && this.userId && this.seccionId) {
      this.asistencias$ = this.asistenciaService.getAsistencias(this.userId, this.seccionId, this.selectedAsignaturaCodigo);
    }
  }

  saveAsistenciaData() {
    console.log('Código de la asignatura seleccionada:', this.selectedAsignaturaCodigo);
    if (this.selectedAsignaturaCodigo && this.userId && this.seccionId) {
      console.log('Guardando asistencia para la asignatura con código:', this.selectedAsignaturaCodigo);
      console.log('Datos de asistencia:', this.asistenciaData);

      this.asistenciaService.saveAsistencia(this.userId, this.seccionId, this.selectedAsignaturaCodigo, this.asistenciaData).then(() => {
        console.log('Datos de asistencia guardados correctamente.');
        // Resetear el formulario después de guardar
        this.asistenciaData = {
          fecha: '',
          presente: false
        };
        this.onAsignaturaChange(); // Actualizar la lista de asistencias
      }).catch(error => {
        console.error('Error al guardar los datos de asistencia:', error);
      });
    } else {
      console.error('No se ha seleccionado ninguna asignatura o falta información del usuario/sección.');
    }
  }
}