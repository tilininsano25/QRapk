import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { Barcode, BarcodeScanner } from '@capacitor-mlkit/barcode-scanning';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { AsistenciaService } from '../services/asistencia.service';

interface ScannedData {
  asignatura: string;
  presente: boolean;
  fecha: string;
  hora: string;
}

@Component({
  selector: 'app-scan-qr',
  templateUrl: './scan-qr.page.html',
  styleUrls: ['./scan-qr.page.scss'],
})
export class ScanQrPage implements OnInit {
  isSupported = false;
  errorMessage: string | null = null;
  userId: string | null = null;
  seccionId: string | null = null;
  asistenciaRegistrada: boolean = false;
  lastScannedData: ScannedData | null = null;

  constructor(
    private navCtrl: NavController,
    private authService: AuthService,
    private router: Router,
    private alertController: AlertController,
    private asistenciaService: AsistenciaService
  ) {}

  ngOnInit() {
    this.authService.getCurrentUser().subscribe(user => {
      if (user) {
        this.userId = user.uid;
        if (this.userId) {
          this.seccionId = this.getSeccionIdForUser(this.userId);
        } else {
          console.error('userId es null');
        }
      } else {
        this.router.navigate(['/home']);
      }
    });

    BarcodeScanner.isSupported().then((result) => {
      this.isSupported = result.supported;
    });
  }

  getSeccionIdForUser(userId: string): string | null {
    const userSeccionMap: { [userId: string]: string } = {
      'L3OGKIEaeZXHFELKR8FQXSbDVsP2': 'Ingenieria',
      'bKZUWFAAx0fO37corjVPCyORPxn2': 'analista'
    };
    return userSeccionMap[userId] || null;
  }

  async scanQr() {
    try {
      const permissions = await this.requestPermissions();
      if (!permissions) {
        this.presentAlert();
        return;
      }

      const { barcodes } = await BarcodeScanner.scan();
      
      if (barcodes.length > 0) {
        const scannedData = barcodes[0].rawValue;
        const parsedData = this.parseQRData(scannedData);
        
        if (parsedData && this.userId && this.seccionId) {
          await this.asistenciaService.saveAsistencia(
            this.userId,
            this.seccionId,
            parsedData.asignatura,
            {
              fecha: parsedData.fecha,
              hora: parsedData.hora,
              presente: parsedData.presente
            }
          );
          
          this.lastScannedData = parsedData;
          this.asistenciaRegistrada = true;
          this.errorMessage = null;
        }
      }
    } catch (error) {
      console.error('Error al escanear:', error);
      this.errorMessage = 'Error al escanear el código QR';
      this.asistenciaRegistrada = false;
    }
  }

  private parseQRData(rawData: string): ScannedData | null {
    try {
      const pairs = rawData.split(';');
      const data: any = {};
      
      pairs.forEach(pair => {
        const [key, value] = pair.split(':');
        if (key === 'ASIGNATURA') data.asignatura = value;
        if (key === 'PRESENCIAL') data.presente = value.toLowerCase() === 'true';
        if (key === 'FECHA') data.fecha = value;
        if (key === 'HORA') data.hora = value;
      });

      if (data.asignatura && data.fecha && data.hora !== undefined) {
        return data as ScannedData;
      }
      
      throw new Error('Datos del QR incompletos');
    } catch (error) {
      console.error('Error al parsear datos del QR:', error);
      this.errorMessage = 'Formato de QR inválido';
      return null;
    }
  }

  goBack() {
    this.navCtrl.back();
  }

  private async requestPermissions(): Promise<boolean> {
    try {
      const permissions = await BarcodeScanner.checkPermissions();
      
      if (permissions.camera === 'granted') {
        return true;
      }
      
      // Si no tenemos permisos, los solicitamos
      const result = await BarcodeScanner.requestPermissions();
      return result.camera === 'granted';
    } catch (error) {
      console.error('Error al solicitar permisos:', error);
      return false;
    }
  }

  private async presentAlert() {
    const alert = await this.alertController.create({
      header: 'Permisos requeridos',
      message: 'Se requieren permisos para acceder a la cámara.',
      buttons: ['OK']
    });
    await alert.present();
  }
}