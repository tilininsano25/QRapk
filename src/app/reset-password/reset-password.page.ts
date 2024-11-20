import { Component } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.page.html',
  styleUrls: ['./reset-password.page.scss'],
})
export class ResetPasswordPage {
  email: string = '';
  resetMessage: string | null = null;
  errorMessage: string | null = null;

  constructor(private authService: AuthService, private navCtrl: NavController) {}

  async resetPassword() {
    try {
      const success = await this.authService.resetPassword(this.email);
      if (success) {
        this.resetMessage = 'Revisa tu correo electrónico vinculado para restablecer tu contraseña.';
        this.errorMessage = null;
      } else {
        this.errorMessage = 'No se encontró el correo electrónico.';
        this.resetMessage = null;
      }
    } catch (error) {
      console.error('Error al restablecer la contraseña:', error);
      this.errorMessage = 'Ocurrió un error al intentar restablecer la contraseña.';
      this.resetMessage = null;
    }
  }

  goBack() {
    this.navCtrl.back();  // Navegar de vuelta al login
  }
}