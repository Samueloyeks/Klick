import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { IonicStorageModule } from '@ionic/storage';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { LoginPageModule } from '../pages/login/login.module';
import { IntroPageModule } from '../pages/intro/intro.module';
import { SuperTabsModule } from 'ionic2-super-tabs';
import { HttpModule } from '@angular/http';
import { ReactiveFormsModule } from '@angular/forms';
import { Camera } from '@ionic-native/camera';
import { NgPipesModule } from 'ngx-pipes';
import { Badge } from '@ionic-native/badge';
import { Geolocation } from '@ionic-native/geolocation';
import { LocationTrackerProvider } from '../providers/location-tracker/location-tracker';
import { BackgroundGeolocation } from '@ionic-native/background-geolocation';
import { Crop } from '@ionic-native/crop';
import { File } from '@ionic-native/file';
import { FilePath } from "@ionic-native/file-path";
import {TimeAgoPipe} from 'time-ago-pipe';



import { MyApp } from './app.component';
import { IntroPage } from '../pages/intro/intro';
import { LoginPage } from '../pages/login/login';
import { ChatsPage } from '../pages/chats/chats';
import { SignupPage } from '../pages/signup/signup';
import { EditProfilePage } from '../pages/edit-profile/edit-profile';
import { InfoPage } from '../pages/info/info';
import { MatchupPage } from '../pages/matchup/matchup';
import { UploadPage } from '../pages/upload/upload';
import { FeedPage } from '../pages/feed/feed';
import { NotificationsPage } from '../pages/notifications/notifications';
import { TabsPage } from '../pages/tabs/tabs';
import { ChatHomePage } from '../pages/chat-home/chat-home';
import { MatchedPage } from '../pages/matched/matched';
import { MatchesPage } from '../pages/matches/matches';
import { BlockedPage } from '../pages/blocked/blocked';
import { ChatsPageModule } from '../pages/chats/chats.module';
import { MatchedPageModule } from '../pages/matched/matched.module';
import { MatchesPageModule } from '../pages/matches/matches.module';
import { BlockedPageModule } from '../pages/blocked/blocked.module';
import { ProfilePage } from '../pages/profile/profile';
import { MatchListPage } from '../pages/match-list/match-list';
import * as firebase from 'firebase';
import { CreateProfilePage } from '../pages/create-profile/create-profile';
import { ResetPasswordPage } from '../pages/reset-password/reset-password';
import { FirebaseServiceProvider } from '../providers/firebase-service/firebase-service';
import { ProfileServiceProvider } from '../providers/profile-service/profile-service';
import { RequestServiceProvider } from '../providers/request-service/request-service';
import { TempFriendsListPage } from '../pages/temp-friends-list/temp-friends-list';
import { FriendsListPage } from '../pages/friends-list/friends-list';
import { ChatProvider } from '../providers/chat/chat';
import { ChattingPage } from '../pages/chatting/chatting';
import { ImghandlerProvider } from '../providers/imghandler/imghandler';
import { MenuPage } from '../pages/menu/menu';
import { UpdateStatusPage } from '../pages/update-status/update-status';
import { ElasticHeaderModule } from "ionic2-elastic-header/dist";
import { FriendProfilePage } from '../pages/friend-profile/friend-profile';
import { TempFriendsList2Page } from '../pages/temp-friends-list2/temp-friends-list2';
import { IonicImageViewerModule } from 'ionic-img-viewer';
import { ComponentsModule}from '../components/components.module'
// import { AutoresizeDirective } from '../directives/autoresize/autoresize';

export const config = {
  apiKey: "AIzaSyAqMs3_wy6mxxyIVX4KNVdTuFbiVrF7uoA",
  authDomain: "klick-49db9.firebaseapp.com",
  databaseURL: "https://klick-49db9.firebaseio.com",
  projectId: "klick-49db9",
  storageBucket: "klick-49db9.appspot.com",
  messagingSenderId: "272076283000"
};
firebase.initializeApp(config);
 


@NgModule({
  declarations: [
    MyApp,
    SignupPage,
    EditProfilePage,
    InfoPage,
    MatchupPage,
    UploadPage,
    FeedPage,
    NotificationsPage,
    ChatHomePage,
    TabsPage,
    ProfilePage,
    MatchListPage,
    CreateProfilePage,
    ResetPasswordPage,
    TempFriendsListPage,
    FriendsListPage,
    ChattingPage,
    MenuPage,
    UpdateStatusPage,
    FriendProfilePage,
    TempFriendsList2Page,
    TimeAgoPipe,
    // ChatsPage,
    // AutoresizeDirective,

  ],
  imports: [
    BrowserModule,
    HttpModule,
    IonicModule.forRoot(MyApp, { backButtonText: '' }),
    IonicStorageModule.forRoot(),
    LoginPageModule,
    IntroPageModule,
    SuperTabsModule.forRoot(),
    ChatsPageModule,
    MatchedPageModule,
    MatchesPageModule,
    BlockedPageModule,
    ReactiveFormsModule,
    NgPipesModule,
    ElasticHeaderModule,
    IonicImageViewerModule,
    ComponentsModule

  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    IntroPage,
    LoginPage,
    ChatsPage,
    SignupPage,
    EditProfilePage,
    InfoPage,
    MatchupPage,
    UploadPage,
    FeedPage,
    NotificationsPage,
    TabsPage,
    ChatHomePage,
    MatchedPage,
    MatchesPage,
    BlockedPage,
    ProfilePage,
    MatchListPage,
    CreateProfilePage,
    ResetPasswordPage,
    TempFriendsListPage,
    FriendsListPage,
    ChattingPage,
    MenuPage,
    UpdateStatusPage,
    FriendProfilePage,
    TempFriendsList2Page,
    // ChatsPage,

  ],
  providers: [
    Camera,
    StatusBar,
    SplashScreen,
    { provide: ErrorHandler, useClass: IonicErrorHandler, },
    FirebaseServiceProvider,
    ProfileServiceProvider,
    RequestServiceProvider,
    ChatProvider,
    ImghandlerProvider,
    Badge,
    Geolocation,
    LocationTrackerProvider,
    BackgroundGeolocation,
    Crop,
    File,
    FilePath,

  ]
})
export class AppModule { }
