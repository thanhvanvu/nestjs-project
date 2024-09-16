import { User } from './users/schemas/user.schema';
import { Controller, Get, Post, Request, UseGuards } from '@nestjs/common';
import { AppService } from './app.service';
import { ConfigService } from '@nestjs/config';
import { LocalAuthGuard } from './auth/local-auth.guard';
import { AuthService } from './auth/auth.service';

import { Public } from './decorator/customize';

@Controller()
export class AppController {}
