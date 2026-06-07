import { Component, inject, signal, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../../environments/environment';

interface Session {
  id: string;
  status: string;
}

interface ApiResponse<T> {
  data: T;
  error: string | null;
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export class DashboardComponent implements OnInit {
  private readonly http = inject(HttpClient);

  readonly activeSessions = signal(0);
  readonly isLoading = signal(true);

  ngOnInit(): void {
    this.http
      .get<ApiResponse<Session[]>>(`${environment.apiUrl}/sessions`)
      .subscribe({
        next: (res) => {
          const active = res.data.filter((s) => s.status === 'ACTIVE').length;
          this.activeSessions.set(active);
          this.isLoading.set(false);
        },
        error: () => this.isLoading.set(false),
      });
  }
}
