import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ConfigModule } from '@nestjs/config';
import appConfig from './config/app.config';
import authConfig from './config/auth.config';

import { UsersModule } from './users/users.module';
import { IamModule } from './iam/iam.module';
import { SubappsModule } from './subapps/resources/subapps.module';
import { FreeinvModule } from './subapps/freeinv/freeinv.module';
import { BizlinksfreeModule } from './subapps/bizlinksfree/bizlinksfree.module';
import { MycuttingboardModule } from './subapps/mycuttingboard/mycuttingboard.module';

import { AppController } from './app.controller';
import { AppService } from './app.service';

import { JwtModule } from '@nestjs/jwt';
import jwtConfig from './iam/config/jwt.config';

import * as Joi from '@hapi/joi';

import { APP_GUARD, RouterModule } from '@nestjs/core';
import { RolesGuard } from './iam/authorization/guards/roles.guard';
import { AuthenticationGuard } from './iam/authentication/guards/authentication/authentication.guard';
import { AccessTokenGuard } from './iam/authentication/guards/access-token/access-token.guard';
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [appConfig, authConfig],
      validationSchema: Joi.object({
        ENVIRONMENT: Joi.string().required(),
        DATABASE_URL: Joi.string().required(),
      }),
    }),
    ConfigModule.forFeature(jwtConfig),
    TypeOrmModule.forRootAsync({
      useFactory: () => ({
        type: 'postgres',
        url: process.env.DATABASE_URL,
        autoLoadEntities: true,
      }),
    }),
    JwtModule.registerAsync(jwtConfig.asProvider()),
    UsersModule,
    IamModule,
    SubappsModule,
    RouterModule.register([
      {
        path: 'subapps',
        module: SubappsModule,
        children: [
          {
            path: 'freeinv',
            module: FreeinvModule,
          },
          {
            path: 'bizlinksfree',
            module: BizlinksfreeModule,
          },
          {
            path: 'mycuttingboard',
            module: MycuttingboardModule,
          },
        ],
      },
    ]),
    MycuttingboardModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: AuthenticationGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
    AccessTokenGuard,
  ],
})
export class AppModule {}
