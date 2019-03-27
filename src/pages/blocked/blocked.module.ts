import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { BlockedPage } from './blocked';

@NgModule({
  declarations: [
    BlockedPage,
  ],
  imports: [
    IonicPageModule.forChild(BlockedPage),
  ],
})
export class BlockedPageModule {}
