import { Module } from '@nestjs/common';
import { PhysiotherapistsService } from './physiotherapists.service';
import { PhysiotherapistsController } from './physiotherapists.controller';

@Module({
  controllers: [PhysiotherapistsController],
  providers: [PhysiotherapistsService],
  exports: [PhysiotherapistsService],
})
export class PhysiotherapistsModule {}
