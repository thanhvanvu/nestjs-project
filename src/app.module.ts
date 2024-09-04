import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    MongooseModule.forRoot(
      'mongodb+srv://vvt4994:LgQtvw29ib89SH3m@cluster0.licob1z.mongodb.net/',
    ),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
