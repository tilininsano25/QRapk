import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';

export interface Asignatura {
  id: string;
  codigo: string;
  nombre: string;
  profesor: string;
  dia: string;
  hora_inicio: string;
  hora_final: string;
  
  // Otros campos relevantes
}

@Injectable({
  providedIn: 'root'
})
export class AsignaturaService {

  constructor(private firestore: AngularFirestore) {}

  getAsignaturas(userId: string, seccionId: string): Observable<Asignatura[]> {
    console.log(`Consultando asignaturas para userId: ${userId}, seccionId: ${seccionId}`);
    return this.firestore.collection<Asignatura>(`users/${userId}/seccion/${seccionId}/asignatura`).valueChanges();
  }
}