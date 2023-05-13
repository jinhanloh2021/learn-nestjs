import { Module } from '@nestjs/common';
import { DiskService } from './disk.service';
import { PowerModule } from 'src/power/power.module';

@Module({
  imports: [PowerModule], // anything that gets exported by power module can be imported by disk module
  providers: [DiskService],
})
export class DiskModule {}
