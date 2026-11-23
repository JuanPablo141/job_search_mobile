import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardSubtitle,
  IonCardContent,
  IonInput,
  IonButton,
  IonIcon,
  IonToast,
  LoadingController
} from '@ionic/angular';
import { addIcons } from 'ionicons';
import {
  sparklesOutline,
  personOutline,
  mailOutline,
  lockClosedOutline,
  checkmarkCircleOutline,
  arrowBackOutline,
  flashOutline,
  rocketOutline
} from 'ionicons/icons';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardSubtitle,
    IonCardContent,
    IonInput,
    IonButton,
    IonIcon,
    IonToast
  ]
})
export class RegisterPage {
  public auth = inject(AuthService);
  private router = inject(Router);
  private loadingCtrl = inject(LoadingController);

  name = '';
  email = '';
  password = '';
  confirmPassword = '';

  errorMessage = signal<string | null>(null);
  successMessage = signal<string | null>(null);
  toastMessage = signal<string>('');
  isToastOpen = signal<boolean>(false);

  constructor() {
    addIcons({
      sparklesOutline,
      personOutline,
      mailOutline,
      lockClosedOutline,
      checkmarkCircleOutline,
      arrowBackOutline,
      flashOutline,
      rocketOutline
    });
  }

  async handleRegister(): Promise<void> {
    this.errorMessage.set(null);
    this.successMessage.set(null);

    if (!this.name || this.name.trim().length < 3) {
      this.errorMessage.set('O nome deve conter ao menos 3 caracteres.');
      return;
    }

    if (!this.email || !this.email.includes('@')) {
      this.errorMessage.set('Informe um formato de e-mail válido (ex: seu@email.com).');
      return;
    }

    if (!this.password || this.password.length < 6) {
      this.errorMessage.set('A senha deve ter no mínimo 6 caracteres.');
      return;
    }

    if (this.password !== this.confirmPassword) {
      this.errorMessage.set('As senhas digitadas não coincidem.');
      return;
    }

    const loader = await this.loadingCtrl.create({
      message: 'Registrando candidato no Spring Boot...',
      spinner: 'circles'
    });
    await loader.present();

    this.auth.register(this.name.trim(), this.email.trim(), this.password).subscribe({
      next: async () => {
        await loader.dismiss();
        this.successMessage.set('Cadastro realizado com sucesso! Conectando perfil...');
        this.toastMessage.set('✓ Conta criada com sucesso!');
        this.isToastOpen.set(true);
        setTimeout(() => this.router.navigate(['/tabs/jobs']), 800);
      },
      error: async (err) => {
        await loader.dismiss();
        const msg = err?.error?.message || 'Falha ao registrar candidato. Verifique os dados.';
        this.errorMessage.set(msg);
      }
    });
  }
}
