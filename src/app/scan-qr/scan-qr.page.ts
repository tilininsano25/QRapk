import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { Barcode, BarcodeScanner } from '@capacitor-mlkit/barcode-scanning';
import { AuthService } from '../services/auth.service'; // Asegúrate de que el servicio exista
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-scan-qr',
  templateUrl: './scan-qr.page.html',
  styleUrls: ['./scan-qr.page.scss'],
})
export class ScanQrPage implements OnInit {
  verificationCode: string = '';
  errorMessage: string | null = null;
  user: any;
  isSupported = false; // Agrega esta propiedad
  barcodes: Barcode[] = []; // Agrega esta propiedad

  constructor(
    private navCtrl: NavController,
    private authService: AuthService, // Inyecta AuthService si es necesario
    private router: Router, // Inyecta Router si es necesario
    private alertController: AlertController // Inyecta AlertController
  ) {}

  formatCode(event: any) {
    const input = event.target.value.replace(/\W/gi, '').toUpperCase();
    if (input.length > 3) {
      this.verificationCode = input.substring(0, 3) + '-' + input.substring(3, 6);
    } else {
      this.verificationCode = input;
    }
  }

  isCodeValid(): boolean {
    return /^[A-Z0-9]{3}-[A-Z0-9]{3}$/.test(this.verificationCode);
  }

  async scanQr() { // Cambia el nombre de la función
    const granted = await this.requestPermissions(); // Solicita permisos
    if (!granted) {
      this.presentAlert(); // Muestra alerta si no se concede permiso
      return;
    }
    const { barcodes } = await BarcodeScanner.scan(); // Escanea el código de barras
    this.barcodes.push(...barcodes); // Agrega los códigos escaneados
  }

  async requestPermissions(): Promise<boolean> { // Solicita permisos de cámara
    const { camera } = await BarcodeScanner.requestPermissions();
    return camera === 'granted' || camera === 'limited';
  }

  async presentAlert(): Promise<void> { // Muestra alerta de permiso denegado
    const alert = await this.alertController.create({
      header: 'Permiso denegado',
      message: 'Por favor, concede permiso de cámara para usar el escáner de códigos de barras.',
      buttons: ['OK'],
    });
    await alert.present();
  }

  ngOnInit() {
    this.user = this.authService.getUser();
    if (!this.user) {
      this.router.navigate(['/home']);
    }
    BarcodeScanner.isSupported().then((result) => { // Verifica si el escáner es compatible
      this.isSupported = result.supported;
    });
  }

  goBack() {
    this.navCtrl.back(); // Navega a la página anterior
  }
}