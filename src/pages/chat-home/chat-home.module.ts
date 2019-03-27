import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ChatHomePage } from './chat-home';
import { SuperTabsModule } from 'ionic2-super-tabs';
import { ComponentsModule } from '../../components/components.module';

@NgModule({
  declarations: [
    ChatHomePage,
  ],
  imports: [
    IonicPageModule.forChild(ChatHomePage),
    SuperTabsModule,
    ComponentsModule,
  ],
})
export class ChatHomePageModule {}
 