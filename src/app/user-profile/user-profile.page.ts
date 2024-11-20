import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireAuth } from '@angular/fire/compat/auth';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.page.html',
  styleUrls: ['./user-profile.page.scss'],
})
export class UserProfilePage implements OnInit {
  user: any = null;
  isModalOpen = false;

  constructor(
    private authService: AuthService,
    private router: Router,
    private firestore: AngularFirestore,
    private afAuth: AngularFireAuth 
  ) {}

  ngOnInit() {
    this.afAuth.authState.subscribe(userData => {
      if (userData) {
        const userId = userData.uid;
        this.firestore.collection('users').doc(userId).valueChanges().subscribe(userDoc => {
          if (userDoc) {
            this.user = userDoc;
          }
        });
      } else {
        this.router.navigate(['/home']);
      }
    });
  }

  async logout() {
    await this.authService.logout();
    this.user = null;
    this.router.navigate(['/home']);
  }

  goBack() {
    this.router.navigate(['/inicio']);
  }

  openImageOptions() {
    this.isModalOpen = true;
  }

  viewImage() {
    if (this.user && this.user.avatar) {
      window.open(this.user.avatar, '_blank');
    } else {
      alert('No hay imagen para mostrar.');
    }
  }

  removeImage() {
    if (this.user) {
      this.user.avatar = null;
      this.firestore.collection('users').doc(this.user.id).update({ avatar: null });
    }
  }

  changeImage() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = async (event: any) => {
      const file = event.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = async (e: any) => {
          this.user.avatar = e.target.result; // Establecer la nueva imagen
          await this.firestore.collection('users').doc(this.user.id).update({ avatar: this.user.avatar }); // Actualizar en Firestore
        };
        reader.readAsDataURL(file);
      }
    };
    input.click();
  }
}