import { Component, ViewChild } from '@angular/core';

import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { SettingTabPage } from './setting-tab/setting-tab.page';
import {SqliteDbCopy} from '@ionic-native/sqlite-db-copy/ngx';
import {shabadDB} from './services/shabadDB';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent {
  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private dbCopy: SqliteDbCopy,
    private shabadDb: shabadDB
  ) {
    this.initializeApp();
  
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.statusBar.overlaysWebView(false);
      this.statusBar.styleLightContent();
      this.statusBar.backgroundColorByHexString( '#0F1425');
      this.shabadDb.dbCopiedReady.next(false);
      this.dbCopy.copy('gurbani.db', 0).then((res) => {
        console.log('ress', res);
        this.shabadDb.dbCopiedReady.next(true);
        this.splashScreen.hide();
      }).catch((error) => {
        console.log('error...', error);
        this.shabadDb.dbCopiedReady.next(true);
        this.splashScreen.hide();
      });
    });
  }
}
