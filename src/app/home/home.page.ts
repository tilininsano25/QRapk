import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { AngularFirestore } from '@angular/fire/compat/firestore'; 
import { AngularFireAuth } from '@angular/fire/compat/auth';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {
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
      const user = await this.authService.getUser();
      if (user) {
        this.firestore.collection('users').doc(user.uid).valueChanges().subscribe(userDoc => {
          this.user = userDoc || null;
        });
      } else {
        this.user = null;
      }
    } catch (error) {
      console.error('Error al obtener el usuario:', error);
    }
  }

  async logout() {
    
    this.authService.logout();
    this.user=null;
  }

  goToScanQr() {
    this.router.navigate(['/scan-qr']);
  }

  goToProfile() {
    this.router.navigate(['/user-profile']);
  }
}