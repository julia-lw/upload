import { Controller, Get, Post, Delete, Param, UseInterceptors, UploadedFile, BadRequestException } from '@nestjs/common';
import { ArquivoService } from './arquivo.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';

@Controller('arquivo')
export class ArquivoController {
  constructor(private readonly arquivoService: ArquivoService) {}

  @Post('upload')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './drive',
        filename: (req, file, callback) => {
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
          const ext = extname(file.originalname);
          callback(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
        },
      }),
    }),
  )
  uploadFile(@UploadedFile() file: Express.Multer.File){
    if(!file){
      throw new BadRequestException('Nenhum arquivo enviado.');
    }
    return this.arquivoService.create(file);
  }

  @Get()
  findAll() {
    return this.arquivoService.findAll();
  }

  @Delete(':filename')
  remove(@Param('filename') filename: string) {
    return this.arquivoService.removePorNome(filename);
  }
}