import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ArquivoService } from './arquivo/arquivo.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './app.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
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
          this.mensagemErro.set(err.error?.mensagem || 'Falha ao enviar arquivo.');
        }
      });
    }
  }

  deletar(filename: string): void {
    if (confirm('Deseja apagar essa imagem do seu drive?')) {
      this.arquivoService.deletarFoto(filename);
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