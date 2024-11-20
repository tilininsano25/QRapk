import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { switchMap, map } from 'rxjs/operators';

interface RegisterData {
  email: string;
  nombre: string;
  apellido: string;
  universidad: string;
  carrera: string;
  sede: string;
  pais: string;
  jornada: string;
  password: string;
  rut: string;
  seccion: string; // Añadir el campo seccion
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(
    private afAuth: AngularFireAuth,
    private firestore: AngularFirestore,
    private router: Router
  ) {}

  async login(email: string, password: string): Promise<any> {
    try {
      await this.afAuth.setPersistence('none');
      return await this.afAuth.signInWithEmailAndPassword(email, password);
    } catch (error) {
      console.error('Error al iniciar sesión:', error);
      throw error;
    }
  }

  async register(data: RegisterData): Promise<any> {
    try {
      const result = await this.afAuth.createUserWithEmailAndPassword(data.email, data.password);
      if (result.user) {
        const userDocRef = this.firestore.collection('user').doc(result.user.uid);
        await userDocRef.set({
          nombre: data.nombre,
          apellido: data.apellido,
          universidad: data.universidad,
          carrera: data.carrera,
          sede: data.sede,
          pais: data.pais,
          jornada: data.jornada,
          email: data.email,
          rut: data.rut
        });

        // Añadir datos a la subcolección 'seccion'
        const seccionesCollectionRef = userDocRef.collection('seccion');
        const seccionDocRef = await seccionesCollectionRef.add({
          codigo: data.seccion
        });

        // Añadir datos a la subcolección 'asignatura' dentro de 'seccion'
        await seccionDocRef.collection('asignatura').add({
          codigo: 'ASIG001',
          nombre: 'Asignatura 1',
          profesor: 'Profesor 1',
          dia: 'Lunes',
          hora: '08:00 - 10:00'
        });
      }
      return result;
    } catch (error) {
      console.error('Error en el registro:', error);
      throw error;
    }
  }

  async logout(): Promise<void> {
    try {
      await this.afAuth.signOut();
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  }

  resetPassword(email: string): Promise<boolean> {
    return this.afAuth.sendPasswordResetEmail(email)
      .then(() => true)
      .catch(() => false);
  }

  getUser(): Promise<any> {
    return this.afAuth.currentUser;
  }

  getCurrentUser(): Observable<any> {
    return this.afAuth.authState.pipe(
      map(user => user ? { uid: user.uid, email: user.email } : null) // Cambiado para evitar el conflicto
    );
  }

  getSeccionId(userId: string): Observable<string | null> {
    return this.firestore.collection(`user/${userId}/seccion`).snapshotChanges().pipe(
      map(seccionesSnapshot => {
        if (seccionesSnapshot.length > 0) {
          const seccionId = seccionesSnapshot[0].payload.doc.id; // Toma el primer documento de la colección 'seccion'
          console.log('Sección encontrada con ID:', seccionId);
          return seccionId;
        } else {
          console.log('No se encontraron secciones.');
          return null;
        }
      })
    );
  }
}