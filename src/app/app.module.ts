import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import {Media} from '@ionic-native/media/ngx';
import {File} from '@ionic-native/file/ngx';
import {FileTransfer, FileTransferObject,  } from '@ionic-native/file-transfer/ngx';
import { SQLite } from '@ionic-native/sqlite/ngx';
import { HttpClientModule } from '@angular/common/http';
import { SQLitePorter } from '@ionic-native/sqlite-porter/ngx';
import { AndroidPermissions } from '@ionic-native/android-permissions/ngx';
import {IonicStorageModule} from '@ionic/storage';
import {Network} from '@ionic-native/network/ngx';
import { FilterModalComponentComponent } from './Modal/filter-modal-component/filter-modal-component.component';
import { ThemeDetection } from "@ionic-native/theme-detection/ngx";

@NgModule({
  declarations: [AppComponent,FilterModalComponentComponent],
  entryComponents: [FilterModalComponentComponent],
  imports: [BrowserModule, IonicModule.forRoot(), 
    AppRoutingModule,
    HttpClientModule,
    IonicStorageModule.forRoot({name: '_SgtechSchoolOfGurbani'}),
  ],
  providers: [
    StatusBar,ThemeDetection,
    SplashScreen,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    Media,
    File, FileTransfer,
    SQLite,
    SQLitePorter,AndroidPermissions,
    FileTransferObject, 
    Network,
    
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
