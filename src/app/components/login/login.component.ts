import { Component, Output, EventEmitter } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  email: string = '';
  password: string = '';
  passwordType: string = 'password';
  passwordIcon: string = 'eye-off';
  rememberMe: boolean = false;
  loginError: string | null = null;

  registerError: string | null = null;
  showingRegisterForm: boolean = false;
  registerData = {
    email: '',
    nombre: '',
    apellido: '',
    universidad: '',
    carrera: '',
    sede: '',
    pais: '',
    jornada: '',
    password: '',
    rut: '', // Añadir el campo rut
    seccion: '' // Añadir el campo seccion
  };

  @Output() loginSuccess = new EventEmitter<void>();

  constructor(
    private authService: AuthService, 
    private router: Router,
    private alertController: AlertController
  ) {}

  async login() {
    try {
      await this.authService.login(this.email, this.password);
      this.router.navigate(["/inicio"])
    } catch (error) {
      this.loginError = 'Error al iniciar sesión. Verifica tus credenciales.';
      console.error('Error al iniciar sesión:', error);
    }
  }

  showRegisterForm() {
    this.showingRegisterForm = true;
  }

  showLoginForm() {
    this.showingRegisterForm = false;
  }

  async register() {
    this.registerError = null;
    try {
      if (this.validateRegisterData()) {
        await this.authService.register(this.registerData);
        await this.showSuccessAlert('Registro exitoso', 'Tu cuenta ha sido creada correctamente.');
        this.router.navigate(["/inicio"])
        this.showLoginForm();
      }
    } catch (error) {
      console.error('Error al registrar:', error);
      this.registerError = 'Error al registrar. Por favor, inténtalo de nuevo.';
    }
  }

  validateRegisterData(): boolean {
    for (const [key, value] of Object.entries(this.registerData)) {
      if (!value) {
        this.registerError = `Por favor, completa el campo ${key}.`;
        return false;
      }
    }
    return true;
  }

  togglePasswordVisibility() {
    this.passwordType = this.passwordType === 'password' ? 'text' : 'password';
    this.passwordIcon = this.passwordIcon === 'eye' ? 'eye-off' : 'eye';
  }

  async showSuccessAlert(header: string, message: string) {
    const alert = await this.alertController.create({
      header: header,
      message: message,
      buttons: ['OK']
    });

    await alert.present();
  }
}