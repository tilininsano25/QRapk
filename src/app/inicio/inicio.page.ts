import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { NavController } from '@ionic/angular';
import { AngularFirestore } from '@angular/fire/compat/firestore'; 
import { AngularFireAuth } from '@angular/fire/compat/auth';

@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.page.html',
  styleUrls: ['./inicio.page.scss'],
})
export class InicioPage implements OnInit {
  user: any = null;

  constructor(
    private authService: AuthService,
     private router: Router,
     private firestore: AngularFirestore,
     private afAuth: AngularFireAuth
    ) {}

  async ngOnInit() {
    await this.checkAuthStatus();
  }

  onLoginSuccess() {
    this.checkAuthStatus();
  }


  async checkAuthStatus() {
    try {
      const user = await this.authService.getUser(); // Obtener el usuario autenticado
      if (user) {
        this.firestore.collection('users').doc(user.uid).valueChanges().subscribe(userDoc => {
          this.user = userDoc || null; // Asigna datos o null
        });
      } else {
        this.user = null; // No hay usuario autenticado
      }
    } catch (error) {
      console.error('Error al obtener el usuario:', error);
    }
  }
  

  logout() {
    this.authService.logout();
    //this.user = null;

  }

  goToScanQr() {
    this.router.navigate(['/scan-qr']);
  }

  goToProfile() {
    this.router.navigate(['/user-profile']);
  }
  
}
