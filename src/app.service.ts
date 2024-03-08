/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { Injectable, HttpException, HttpStatus } from '@nestjs/common';

@Injectable()
export class AppService {
  getHealth(): string {
    return "I'm okay!";
  }

  updateUser(
    userId: string,
    userUpdate: {
      name: string;
      birthDate?: string;
      gender?: string;
      otherGender?: string;
      city?: string;
      state?: string;
    },
  ): string {
    return `Updating user with ID ${userId} and data ${JSON.stringify(userUpdate)}`;
  }
}
