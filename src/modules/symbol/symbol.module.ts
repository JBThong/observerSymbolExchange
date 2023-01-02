import { Module } from '@nestjs/common';
import { SymbolService } from './symbol.service';
import { HttpModule } from '@nestjs/axios';
import { SymbolController } from './symbol.controller';


@Module({
  imports: [HttpModule],
  providers: [SymbolService],
  controllers: [SymbolController]
})
export class SymbolModule {}
