import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ChatsPage } from './chats';
import { ShrinkingSegmentHeaderComponent } from '../../components/shrinking-segment-header/shrinking-segment-header';
import { ComponentsModule } from "../../components/components.module";




@NgModule({ 
  declarations: [
    ChatsPage,
  ],
  imports: [
    IonicPageModule.forChild(ChatsPage),
    ComponentsModule
  ],
})
export class ChatsPageModule {}
