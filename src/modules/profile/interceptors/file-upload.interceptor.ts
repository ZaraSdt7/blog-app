import {
    Injectable,
    NestInterceptor,
    ExecutionContext,
    CallHandler,
    BadRequestException,
  } from '@nestjs/common';
  import { Observable } from 'rxjs';
  import { FileInterceptor } from '@nestjs/platform-express';
  import { diskStorage } from 'multer';
  import { extname } from 'path';
  
  @Injectable()
  export class FileUploadInterceptor implements NestInterceptor {
    private readonly fileInterceptor = FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, cb) => {
          const randomName = Array(32)
            .fill(null)
            .map(() => Math.round(Math.random() * 16).toString(16))
            .join('');
          return cb(null, `${randomName}${extname(file.originalname)}`);
        },
      }),
      fileFilter: (req, file, cb) => {
        if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
          return cb(new BadRequestException('Only image files (jpg, jpeg, png) are allowed!'), false);
        }
        cb(null, true);
      },
      limits: {
        fileSize: 5 * 1024 * 1024, //max file size 5MB
      },
    });
  
    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
      const interceptor = new (this.fileInterceptor as any)();
      return interceptor.intercept(context, next);
    }
  }