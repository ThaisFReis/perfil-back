import {
  Body,
  Controller,
  Get,
  HttpException,
  Param,
  Post,
  Put,
  UploadedFile,
  UseInterceptors,
  Delete,
  HttpStatus,
} from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { catchError, map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { EditUserDto } from './app.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { format } from 'date-fns';
import { State } from './states';

@Controller()
export class AppController {
  constructor(private readonly httpService: HttpService) {}

  @Get()
  getHealth(): string {
    return "I'm okay!";
  }

  @Get('users')
  getUsers(): Observable<any> {
    return this.httpService
      .get('https://test-backend-bzwn.onrender.com/v1/users')
      .pipe(
        map((response: any) => response.data),
        catchError((error) => {
          throw new HttpException(
            error.response.data,
            error.response.status || HttpStatus.INTERNAL_SERVER_ERROR,
          );
        }),
      );
  }

  @Put('users/:userId')
  editUser(
    @Param('userId') userId: string,
    @Body() editUserDto: EditUserDto,
  ): Observable<any> {
    // Verifique se a idade é maior ou igual a 18 anos
    if (editUserDto.birthDate) {
      const birthDate = new Date(editUserDto.birthDate);
      editUserDto.birthDate = format(birthDate, 'yyyy-MM-dd');

      const age = new Date().getFullYear() - birthDate.getFullYear();
      if (age < 18) {
        throw new HttpException(
          'Idade inválida, você precisa ter pelo menos 18 anos',
          HttpStatus.BAD_REQUEST,
        );
      }
    }

    // Faça a solicitação PUT para atualizar o usuário
    return this.httpService
      .put(
        `https://test-backend-bzwn.onrender.com/v1/users/${userId}`,
        editUserDto,
      )
      .pipe(
        map((response: any) => ({ message: 'User edited successfully' })),
        catchError((error) => {
          throw new HttpException(error.response.data, error.response.status);
        }),
      );
  }

  @Post('users/:userId/photos')
  @UseInterceptors(FileInterceptor('file'))
  uploadPhoto(
    @Param('userId') userId: string,
    @UploadedFile() file: Express.Multer.File,
  ): Observable<any> {
    const formData = new FormData();
    const fileBlob = new Blob([file.buffer]);
    formData.append('file', fileBlob, file.originalname);

    return this.httpService
      .post(
        `https://test-backend-bzwn.onrender.com/v1/users/${userId}/photos`,
        formData,
      )
      .pipe(
        map((response: any) => ({ message: 'Photo uploaded successfully' })),
        catchError((error) => {
          throw new HttpException(error.response.data, error.response.status);
        }),
      );
  }

  @Delete('users/:userId/photos/:photoIndex')
  deletePhoto(
    @Param('userId') userId: string,
    @Param('photoIndex') photoIndex: string,
  ): Observable<any> {
    return this.httpService
      .delete(
        `https://test-backend-bzwn.onrender.com/v1/users/${userId}/photos/${photoIndex}`,
      )
      .pipe(
        map((response: any) => ({ message: 'Photo deleted successfully' })),
        catchError((error) => {
          throw new HttpException(error.response.data, error.response.status);
        }),
      );
  }

  @Delete('users/:userId/confirmations/:attractionId')
  confirmAttraction(
    @Param('userId') userId: string,
    @Param('attractionId') attractionId: string,
  ): Observable<any> {
    return this.httpService
      .delete(
        `https://test-backend-bzwn.onrender.com/v1/users/${userId}/confirmations/${attractionId}`,
      )
      .pipe(
        map((response: any) => ({
          message: 'Attraction confirmed successfully',
        })),
        catchError((error) => {
          throw new HttpException(error.response.data, error.response.status);
        }),
      );
  }
}
