import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';

// Import internal modules.
import { SymbolModule } from './modules/symbol/symbol.module';

@Module({
  imports: [
    SymbolModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
