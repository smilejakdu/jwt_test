import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import ormconfig from 'ormconfig';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { LoggerMiddleware } from './middlewares/logger.middlewares';
import { UsersModule } from './users/users.module';

@Module({
  imports: [ 
    // 다른 모듈들을 임포트하여 연결해준다. export 된 provider 가 있다면 사용할 수 있다.
    // 예를들면 users.module.ts 파일에 UsersService 가 exports 되어있으니
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot(ormconfig),
    AuthModule,
    UsersModule,
  ],
  exports: [], // 임포트하는 모듈에서 사용할 provider 를 지정할 수 있다.
  controllers: [AppController], 
  // 해당 모듈에서 사용되는 컨트롤러의 모음을 인스턴스화 해준다.
  providers: [AppService],
  // Injectable 된 클래스들을 인스턴스화 하고 인스턴스는 모듈 안에서 최소한으로 공유된다.
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer): any {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
