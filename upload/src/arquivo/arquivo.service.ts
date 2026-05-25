import { BadRequestException, Injectable, NotFoundException, PayloadTooLargeException } from '@nestjs/common';
import { UpdateArquivoDto } from './dto/update-arquivo.dto';
import * as fs from 'fs';

@Injectable()
export class ArquivoService {
  public readonly pastaUpload = './drive';
  
  constructor(){
    if(!fs.existsSync(this.pastaUpload)){
      fs.mkdirSync(this.pastaUpload,{recursive:true});
    }
  }

  create(arquivo: Express.Multer.File) {
    const limiteTamanho = 5 * 1024 * 1024;
    if (arquivo.size > limiteTamanho) {
      throw new PayloadTooLargeException({
        erro: 'Arquivo muito grande',
        mensagem: 'O tamanho máximo permitido é de 5MB.',
      });
    }

    const formatosPermitidos = ['image/jpeg', 'image/jpg', 'image/png', 'image/tiff'];
    if (!formatosPermitidos.includes(arquivo.mimetype)) {
      throw new BadRequestException({
        erro: 'Formato inválido',
        mensagem: 'Apenas imagens nos formatos JPG, JPEG, PNG e TIFF são aceitas.',
      });
    }

    return {
      message: 'Arquivo enviado com sucesso!',
      filename: arquivo.filename,
      originalname: arquivo.originalname,
      size: arquivo.size,
    };
  }

  findAll() {
    try {
      if (!fs.existsSync(this.pastaUpload)) return { total: 0, files: [] };
      const files = fs.readdirSync(this.pastaUpload);
      const fileList = files.map(
        (filename) => {
          const stats = fs.statSync(`${this.pastaUpload}/${filename}`);
          return {
            filename,
            size: stats.size,
            criado: stats.birthtime,
          };
        }
      );
      return {
        total: fileList.length,
        files: fileList,
      };
    } catch (error) {
      throw new BadRequestException('Não foi possível listar os arquivos.');
    }
  }

  findOne(id: number) {
    return `This action returns a #${id} arquivo`;
  }

  update(id: number, updateArquivoDto: UpdateArquivoDto) {
    return `This action updates a #${id} arquivo`;
  }

  removePorNome(nome: string) {
    const caminhoArquivo = `${this.pastaUpload}/${nome}`;

    if (!fs.existsSync(caminhoArquivo)) {
      throw new NotFoundException({
        erro: 'Não encontrado',
        mensagem: `Nenhum arquivo com o nome "${nome}" foi localizado.`,
      });
    }

    try {
      fs.unlinkSync(caminhoArquivo);
      return {
        sucesso: true,
        mensagem: `O arquivo ${nome} foi removido com sucesso.`,
      };
    } catch (error) {
      throw new BadRequestException('Não foi possível deletar o arquivo.');
    }
  }
}