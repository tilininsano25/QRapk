import { Injectable } from '@angular/core';
import { AngularFirestore, DocumentReference, DocumentData } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AsistenciaService {
  constructor(private firestore: AngularFirestore) {}

  saveAsistencia(userId: string, seccionId: string, asignaturaCodigo: string, asistenciaData: any): Promise<DocumentReference<DocumentData>> {
    console.log('Guardando en Firestore en la colección users, documento:', userId, 'subcolección seccion, documento:', seccionId, 'subcolección asignatura, documento:', asignaturaCodigo, 'subcolección asistencia');
    console.log('Datos de asistencia a guardar:', asistenciaData);
    return this.firestore.collection('users').doc(userId)
      .collection('seccion').doc(seccionId)
      .collection('asignatura').doc(asignaturaCodigo)
      .collection('asistencia').add(asistenciaData);
  }

  getAsistencias(userId: string, seccionId: string, asignaturaCodigo: string): Observable<any[]> {
    return this.firestore.collection('users').doc(userId)
      .collection('seccion').doc(seccionId)
      .collection('asignatura').doc(asignaturaCodigo)
      .collection('asistencia').valueChanges();
  }
}