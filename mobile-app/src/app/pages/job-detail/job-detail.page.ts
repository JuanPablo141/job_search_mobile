import { Component, OnInit, inject, signal, Input } from '@angular/core';
import { CommonModule, DatePipe, TitleCasePipe } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonButtons,
  IonBackButton,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardSubtitle,
  IonCardContent,
  IonBadge,
  IonButton,
  IonIcon,
  IonSpinner,
  IonToast
} from '@ionic/angular';
import { addIcons } from 'ionicons';
import {
  heart,
  heartOutline,
  locationOutline,
  calendarOutline,
  openOutline,
  shareSocialOutline,
  sparklesOutline,
  shieldCheckmarkOutline,
  businessOutline
} from 'ionicons/icons';
import { JobApiService } from '../../core/services/job-api.service';
import { FavoritesStorageService } from '../../core/services/favorites-storage.service';
import { UserJobMatchResponse, MatchStatus } from '../../core/models/job.model';
import { MatchScorePipe } from '../../shared/pipes/match-score.pipe';
import { MatchHighlightDirective } from '../../shared/directives/match-highlight.directive';

@Component({
  selector: 'app-job-detail',
  templateUrl: './job-detail.page.html',
  styleUrls: ['./job-detail.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    DatePipe,
    TitleCasePipe,
    MatchScorePipe,
    MatchHighlightDirective,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonButtons,
    IonBackButton,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardSubtitle,
    IonCardContent,
    IonBadge,
    IonButton,
    IonIcon,
    IonSpinner,
    IonToast
  ]
})
export class JobDetailPage implements OnInit {
  // Requisito 6 (Ponto Extra): Injeção do parâmetro de rota dinâmico :id
  @Input() id?: string;

  private route = inject(ActivatedRoute);
  private jobService = inject(JobApiService);
  public favService = inject(FavoritesStorageService);

  readonly stages: { value: MatchStatus; label: string }[] = [
    { value: 'new', label: 'Nova' },
    { value: 'applied', label: 'Enviada' },
    { value: 'interview', label: 'Entrevista' },
    { value: 'discarded', label: 'Descartada' }
  ];

  jobMatch = signal<UserJobMatchResponse | null>(null);
  loading = signal<boolean>(true);
  toastMessage = signal<string>('');
  isToastOpen = signal<boolean>(false);

  constructor() {
    addIcons({
      heart,
      heartOutline,
      locationOutline,
      calendarOutline,
      openOutline,
      shareSocialOutline,
      sparklesOutline,
      shieldCheckmarkOutline,
      businessOutline
    });
  }

  ngOnInit(): void {
    const routeId = this.id || this.route.snapshot.paramMap.get('id');
    if (routeId) {
      this.loadJobDetails(Number(routeId));
    }
  }

  private showToast(msg: string): void {
    this.isToastOpen.set(false);
    setTimeout(() => {
      this.toastMessage.set(msg);
      this.isToastOpen.set(true);
    }, 10);
  }

  getStageLabel(status: string): string {
    const found = this.stages.find((s) => s.value === status);
    return found ? found.label : 'Nova';
  }

  loadJobDetails(id: number): void {
    this.loading.set(true);
    // Chamada ao segundo método GET usando o parâmetro da rota
    this.jobService.getJobById(id).subscribe({
      next: (data) => {
        this.jobMatch.set(data);
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
      }
    });
  }

  handleStatusChange(newStatus: MatchStatus): void {
    const match = this.jobMatch();
    if (!match || match.status === newStatus) return;

    this.jobMatch.set({ ...match, status: newStatus });

    this.jobService.updateMatch(match.id, { status: newStatus }).subscribe({
      next: () => {
        this.showToast(`✓ Etapa alterada para "${this.getStageLabel(newStatus)}"`);
      },
      error: () => {
        this.showToast('Não foi possível atualizar a etapa no servidor.');
      }
    });
  }

  toggleFavorite(): void {
    const match = this.jobMatch();
    if (!match) return;

    const isFav = this.favService.toggleFavorite(match.id);
    this.jobMatch.set({ ...match, is_favorite: isFav });
    this.jobService.updateMatch(match.id, { is_favorite: isFav }).subscribe({ error: () => {} });
    this.showToast(isFav ? '⭐ Vaga adicionada aos favoritos!' : 'Vaga removida dos favoritos.');
  }

  openUrl(): void {
    const url = this.jobMatch()?.job.url || 'https://portal.gupy.io';
    window.open(url, '_blank');
  }
}
