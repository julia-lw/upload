import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

export interface ArquivoInfo {
  filename: string;
  size: number;
  criado: string;
}

export interface ApiResponse {
  total: number;
  files: ArquivoInfo[];
}

@Injectable({
  providedIn: 'root'
})
export class ArquivoService {
  private http = inject(HttpClient);
  private readonly apiUrl = 'http://localhost:3000/arquivo';

  fotos = signal<ArquivoInfo[]>([]);
  loading = signal<boolean>(false);

  carregarFotos(): void {
    this.loading.set(true);
    this.http.get<ApiResponse>(this.apiUrl).subscribe({
      next: (res) => this.fotos.set(res.files || []),
      error: (err) => console.error('Erro ao buscar arquivos:', err),
      complete: () => this.loading.set(false)
    });
  }

  uploadFoto(file: File): Observable<any> {
    const formData = new FormData();
    formData.append('file', file);

    return this.http.post<any>(`${this.apiUrl}/upload`, formData).pipe(
      tap(() => this.carregarFotos()) // Recarrega a lista automaticamente ao subir
    );
  }

  deletarFoto(filename: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${filename}`).pipe(
      tap(() => this.carregarFotos()) // Atualiza a lista após deletar
    );
  }
}