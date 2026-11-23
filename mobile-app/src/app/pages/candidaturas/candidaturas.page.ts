import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule, DatePipe, TitleCasePipe } from '@angular/common';
import { RouterModule } from '@angular/router';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonSegment,
  IonSegmentButton,
  IonLabel,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardSubtitle,
  IonCardContent,
  IonBadge,
  IonButton,
  IonIcon,
  IonSelect,
  IonSelectOption,
  IonSpinner,
  IonToast,
  IonRefresher,
  IonRefresherContent
} from '@ionic/angular';
import { addIcons } from 'ionicons';
import {
  checkmarkDoneCircleOutline,
  timeOutline,
  calendarOutline,
  trashOutline,
  heart,
  heartOutline,
  openOutline,
  briefcaseOutline,
  chevronForwardOutline,
  locationOutline
} from 'ionicons/icons';
import { JobApiService } from '../../core/services/job-api.service';
import { FavoritesStorageService } from '../../core/services/favorites-storage.service';
import { UserJobMatchResponse, MatchStatus } from '../../core/models/job.model';
import { MatchScorePipe } from '../../shared/pipes/match-score.pipe';
import { TruncatePipe } from '../../shared/pipes/truncate.pipe';
import { MatchHighlightDirective } from '../../shared/directives/match-highlight.directive';
import { CardHoverDirective } from '../../shared/directives/card-hover.directive';

type FilterTab = 'all' | 'applied' | 'interview' | 'discarded' | 'favorites';

@Component({
  selector: 'app-candidaturas',
  templateUrl: './candidaturas.page.html',
  styleUrls: ['./candidaturas.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    DatePipe,
    TitleCasePipe,
    MatchScorePipe,
    TruncatePipe,
    MatchHighlightDirective,
    CardHoverDirective,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonSegment,
    IonSegmentButton,
    IonLabel,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardSubtitle,
    IonCardContent,
    IonBadge,
    IonButton,
    IonIcon,
    IonSelect,
    IonSelectOption,
    IonSpinner,
    IonToast,
    IonRefresher,
    IonRefresherContent
  ]
})
export class CandidaturasPage implements OnInit {
  private jobService = inject(JobApiService);
  public favService = inject(FavoritesStorageService);

  matches = signal<UserJobMatchResponse[]>([]);
  loading = signal<boolean>(true);
  activeTab = signal<FilterTab>('all');
  toastMessage = signal<string>('');
  isToastOpen = signal<boolean>(false);

  // Vagas consideradas processos seletivos ou favoritadas
  candidateJobs = computed(() => {
    return this.matches().filter((m) => m.status !== 'new' || m.is_favorite || this.favService.isFavorite(m.id));
  });

  totalApplied = computed(() => this.candidateJobs().length);
  inAnalysis = computed(() => this.matches().filter((m) => m.status === 'applied').length);
  inInterview = computed(() => this.matches().filter((m) => m.status === 'interview').length);
  avgScore = computed(() => {
    const list = this.candidateJobs();
    if (!list.length) return 0;
    return Math.round(list.reduce((acc, curr) => acc + curr.score, 0) / list.length);
  });

  filteredJobs = computed(() => {
    const tab = this.activeTab();
    const list = this.matches();

    if (tab === 'applied') {
      return list.filter((m) => m.status === 'applied');
    }
    if (tab === 'interview') {
      return list.filter((m) => m.status === 'interview');
    }
    if (tab === 'discarded') {
      return list.filter((m) => m.status === 'discarded' || (m.status as any) === 'rejected');
    }
    if (tab === 'favorites') {
      return list.filter((m) => m.is_favorite || this.favService.isFavorite(m.id));
    }
    return this.candidateJobs();
  });

  constructor() {
    addIcons({
      checkmarkDoneCircleOutline,
      timeOutline,
      calendarOutline,
      trashOutline,
      heart,
      heartOutline,
      openOutline,
      briefcaseOutline,
      chevronForwardOutline,
      locationOutline
    });
  }

  ngOnInit(): void {
    this.loadData();
  }

  loadData(event?: any): void {
    this.loading.set(true);
    this.jobService.getJobs().subscribe({
      next: (data) => {
        this.matches.set(data);
        this.loading.set(false);
        if (event) event.target.complete();
      },
      error: () => {
        this.loading.set(false);
        if (event) event.target.complete();
      }
    });
  }

  onSegmentChange(event: any): void {
    this.activeTab.set(event.detail.value);
  }

  handleStatusChange(matchId: number, newStatus: string): void {
    this.jobService.updateMatch(matchId, { status: newStatus }).subscribe({
      next: (updated) => {
        this.matches.update((prev) => prev.map((m) => (m.id === matchId ? { ...m, status: newStatus as any } : m)));
        this.toastMessage.set(`✓ Etapa atualizada para "${newStatus}" com sucesso!`);
        this.isToastOpen.set(true);
      },
      error: () => {
        this.toastMessage.set('Não foi possível atualizar o status.');
        this.isToastOpen.set(true);
      }
    });
  }

  toggleFavorite(event: Event, matchId: number): void {
    event.stopPropagation();
    event.preventDefault();
    const isFav = this.favService.toggleFavorite(matchId);
    this.matches.update((prev) => prev.map((m) => (m.id === matchId ? { ...m, is_favorite: isFav } : m)));
    this.toastMessage.set(isFav ? '⭐ Adicionada às favoritas!' : 'Removida das favoritas.');
    this.isToastOpen.set(true);
  }
}
