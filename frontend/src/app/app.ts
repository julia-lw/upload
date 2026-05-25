import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ArquivoService } from './arquivo.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './app.html',
  styleUrls: ['./app.css'] // Apontando pro arquivo css do seu print
})
export class App implements OnInit {
  arquivoService = inject(ArquivoService);
  
  fotos = this.arquivoService.fotos;
  loading = this.arquivoService.loading;
  mensagemErro = signal<string | null>(null);

  ngOnInit(): void {
    this.arquivoService.carregarFotos();
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      this.mensagemErro.set(null);

      this.arquivoService.uploadFoto(file).subscribe({
        error: (err) => {
          this.mensagemErro.set(err.error?.mensagem || 'Ocorreu um erro ao enviar o arquivo.');
        }
      });
    }
  }

  deletar(filename: string): void {
    if (confirm(`Deseja mesmo apagar o arquivo "${filename}"?`)) {
      this.arquivoService.deletarFoto(filename).subscribe({
        error: (err) => alert(err.error?.mensagem || 'Erro ao deletar arquivo.')
      });
    }
  }

  formatBytes(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }
}