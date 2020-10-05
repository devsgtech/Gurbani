import {Injectable} from '@angular/core';
// import {APP_URLS, IMG, VALIDATION_MSG, VARS} from './constants.service';
import {
  ActionSheetController,
  AlertController,
  LoadingController,
  MenuController,
  ModalController,
  NavController,
  Platform,
  PopoverController,
  ToastController
} from '@ionic/angular';
// import {Toast} from '@ionic-native/toast/ngx';
// import {Keyboard} from '@ionic-native/keyboa//rd/ngx';
import _ from 'lodash';
import {StatusBar} from '@ionic-native/status-bar/ngx';
// import {AppVersion} from '@ionic-native/app-version/ngx';
import {ActivatedRoute, Router} from '@angular/router';
import {BehaviorSubject} from 'rxjs';
import {APP_URLS, VARS} from './constantString';

declare var window;
@Injectable({
  providedIn: 'root'
})
export class HelperService {
  event$: BehaviorSubject<any> = new BehaviorSubject(null);
  playEvent$: BehaviorSubject<any> = new BehaviorSubject(null);

  private mutationObserver: MutationObserver;
  lastTimeBackPress = 0; timePeriodToExit = 2000;
  DH: any = 0; DW: any = 0; _LODASH = _;
  // _IMG = IMG; _VAR = VARS; _VM = VALIDATION_MSG; _AP = APP_URLS;
  loading; toast;
  constructor(private platform: Platform,
              private loadingCtrl: LoadingController,
              private toastCtrl: ToastController,
              private actionSheetCtrl: ActionSheetController,
              private alertCtrl: AlertController,
              private modalCtrl: ModalController,
              private popOverCtrl: PopoverController,
              private menuCtrl: MenuController,
              // private nativeToast: Toast,
              // private keyboard: Keyboard,
              private statusBar: StatusBar,
              private navCtrl: NavController,
              // private appVersion: AppVersion,
              private activatedRoute: ActivatedRoute,
              private router: Router) {
    this.platform.ready().then(() => {
      this.DH = this.platform.height();
      this.DW = this.platform.width();
    }).catch(() => {});
  }
  async presentTruckAlert(msg, cancelText = 'Different User', confirmText = 'Try Again', confirmText2 = null, cancelBtnClass = 'cancelBtn ion-text-capitalize', confirmBtnClass = 'confirmBtn ion-text-capitalize', confirmBtn2Class = 'confirmBtn ion-text-capitalize') {
    this.dismissLoading();
    this.onScrollCloseKeyBoard();
    return new Promise(async (resolve, reject) => {
      const alertButtons: any = [];
      if (confirmText) {
      alertButtons.push({
        text: confirmText,
        cssClass: confirmBtnClass,
        handler: () => {
          return resolve(confirmText);
        }
      });
    }
      if (confirmText2) {
      alertButtons.push({
        text: confirmText2,
        cssClass: confirmBtn2Class,
        handler: () => {
          return resolve(confirmText2);
        }
      });
    }
      alertButtons.push({
        text: cancelText,
        role: 'cancel',
        cssClass: cancelBtnClass,
        handler: () => {
          return reject(cancelText);
        }
      });
      const alert = await this.alertCtrl.create({
      cssClass: 'myAlert myTruckAlert',
      message: msg,
      buttons: alertButtons
    });
      setTimeout(async () => {
        await alert.present();
      }, 100);
    }).catch(() => {});
  }
  async presentLoadingWithOptions(msg= 'Please wait a moment', customCssClass= 'myLoader') {
    this.dismissLoading();
    this.loading = await this.loadingCtrl.create({
      id: 'myLoader',
      spinner: 'bubbles',
      message: msg,
      translucent: true,
      cssClass: customCssClass
    });
    return await this.loading.present();
  }
  // async presentNewToast(msg = 'No action required.', dur = '2000', pos = 'bottom') {
  //   this.dismissLoading();
  //   if (this.platform.is('android') || this.platform.is('ios')) {
  //     try {
  //       this.nativeToast.hide().catch(() => {
  //       });
  //     } catch (e) {
  //     }
  //     this.nativeToast.showWithOptions({
  //       message: msg,
  //       duration: _.toNumber(dur),
  //       position: pos,
  //       addPixelsY: pos === 'bottom' ? (-150) : 0,
  //     }).subscribe(() => {
  //     });
  //   } else {
  //     try {
  //       this.toastCtrl.dismiss().catch(() => {
  //       });
  //     } catch (e) {
  //     }
  //     this.toast = await this.toastCtrl.create({
  //       message: msg,
  //       duration: +dur,
  //       position: pos === 'center' ? 'middle' : pos === 'top' ? 'top' : 'bottom'
  //     });
  //     this.toast.present().catch(() => {
  //     });
  //   }
  // }
  async presentAlert(head = '', msg = '', subHeader = '', cssClass = '', confirmText = 'Okay',) {
    this.onScrollCloseKeyBoard();
    const alert = await this.alertCtrl.create({
      cssClass: cssClass,
      header: head,
      subHeader: subHeader,
      message: msg,
      buttons: [confirmText]
    });
    setTimeout(async () => {
      await alert.present();
    }, 100);
  }
  presentAlertConfirm(head = 'Confirm!', msg = '', confirmText = 'Okay', cancelText = 'Cancel', cancelBtnClass = 'cancelBtn ion-text-capitalize', confirmBtnClass = 'confirmBtn ion-text-capitalize') {
    this.onScrollCloseKeyBoard();
    return new Promise(async (resolve, reject) => {
      const alert = await this.alertCtrl.create({
        header: head,
        message: msg,
        cssClass: 'myAlert',
        buttons: [
          {
            text: cancelText,
            role: 'cancel',
            cssClass: cancelBtnClass,
            handler: () => {
              return reject(false);
            }
          }, {
            text: confirmText,
            cssClass: confirmBtnClass,
            handler: () => {
              return resolve(true);
            }
          }
        ]
      });
      setTimeout(async () => {
        await alert.present();
      }, 100);
    }).catch(() => {});
  }
  dismissLoading() {
    try { this.loading.dismiss().catch(() => {}); } catch (e) {}
  }
  onScrollCloseKeyBoard() {
    if (this.platform.is('android')) {
      try { window.Keyboard.hide(); } catch (e) { }
    }
    if (this.platform.is('ios')) {
      // try { this.keyboard.hide(); } catch (e) { }
    }
  }
  toggleShowHide(array, obj: any = {}, alwaysOpen = false) {
    const initState = obj.isOpen;
    _.forEach(array, val => {
      val.isOpen = false;
    });
    alwaysOpen ? obj.isOpen = true : obj.isOpen = !initState;
    return true;
  }
  scrollTo(scrollLabel = null, content = null, toTop = false, bottom = false) {
    try {
      setTimeout(async () => {
        if (toTop) {
          await content.scrollToTop( 400);
        } else if (bottom) {
          await content.scrollToBottom( 400);
        } else {
          if (scrollLabel && content) {
            const yOffset = document.getElementById(scrollLabel).offsetTop;
            await content.scrollToPoint(0, ((this.DH) < yOffset) ? (this.DH) : yOffset, 400);
          }
        }
      }, 100);
    } catch (e) {}
    /*if (obj.isOpen && scrollLabel && content) {
      this.scrollTo(scrollLabel, content);
    }*/
  }
  scrollToBottomMutation(contentEle, targetNode) {
    try {
      this.mutationObserver = new MutationObserver((mutations) => {
        contentEle.scrollToBottom();
      });
      this.mutationObserver.observe(targetNode, { attributes: true, childList: true, subtree: true });
    } catch (e) {}
  }
  async closeAllPopups() {
    try {
      const element = await this.loadingCtrl.getTop();
      if (element) { element.dismiss().catch(() => {}); }
    } catch (error) {}
    try {
      const element = await this.actionSheetCtrl.getTop();
      if (element) { element.dismiss().catch(() => {}); }
    } catch (error) {}
    try {
      const element = await this.popOverCtrl.getTop();
      if (element) { element.dismiss().catch(() => {}); }
    } catch (error) {}
    try {
      const element = await this.modalCtrl.getTop();
      if (element) { element.dismiss().catch(() => {}); }
    } catch (error) {}
    try {
      const element = await this.menuCtrl.getOpen();
      if (element) { this.menuCtrl.close().catch(() => {}); }
    } catch (error) {}
  }
  async onFilter(filterOptArr, selectedVal = null) {
    this.onScrollCloseKeyBoard();
    return new Promise(async resolve => {
      const actionButtons = [];
      _.forEach(filterOptArr, (val) => {
        actionButtons.push({
          text: val.title,
          cssClass: (selectedVal === val.val) ? 'action-sheet-selected' : '',
          handler: () => {
            if (selectedVal !== val.val) {
              return resolve(val.val);
            }
          }
        });
      });
      actionButtons.push({
        text: 'Cancel',
        role: 'cancel',
        handler: () => {
          console.log('Cancel clicked');
        }
      });
      const actionSheet = await this.actionSheetCtrl.create({
        header: 'Filter',
        cssClass: 'myActionSheet',
        buttons: actionButtons
      });
      await actionSheet.present();
    }).catch(() => {});
  }
  // loadMoreRecords(event, offset, recordsFiltered, limit: any = VARS.LIMIT_LIST, pages = false) {
  //   return new Promise(resolve => {
  //     setTimeout(() => {
  //       if (pages) {
  //         if ((((offset - 1) * limit) + limit) < recordsFiltered) {
  //           offset++;
  //           return resolve({page: offset, limit, reload: true});
  //         } else {
  //           event.target.disabled = true;
  //           return resolve({page: offset, limit, reload: false});
  //         }
  //       } else {
  //         const currentCount = limit + offset;
  //         if (currentCount < recordsFiltered) {
  //           if ((recordsFiltered - currentCount) > limit) {
  //             offset += limit;
  //           } else {
  //             offset = currentCount;
  //             limit = (recordsFiltered - currentCount);
  //           }
  //           return resolve({offset, limit, reload: true});
  //         } else {
  //           event.target.disabled = true;
  //           return resolve({offset, limit, reload: false});
  //         }
  //       }
  //     }, 500);
  //   });
  // }
  setStatusBar() {
    try {
      this.statusBar.overlaysWebView(true);
      this.statusBar.overlaysWebView(false);
    } catch (e) {}
  }
  pushRootPage(page, navData = null) {
    return new Promise(resolve => {
      navData ? this.navCtrl.navigateRoot(page, {state: navData }).then(() => {
        return resolve(true);
      }).catch((e) => {
        console.log('Page push error - ', e);
        return resolve(false);
      }) : this.navCtrl.navigateRoot(page).then(() => {
        return resolve(true);
      }).catch((e) => {
        console.log('Page push error - ', e);
        return resolve(false);
      });
    });
  }
  pushPage(page, navData = null) {
    return new Promise(resolve => {
      navData ? this.navCtrl.navigateForward(page, {state: navData }).then(() => {
        return resolve(true);
      }).catch((e) => {
        console.log('Page push error - ', e);
        return resolve(false);
      }) : this.navCtrl.navigateForward(page).then(() => {
        return resolve(true);
      }).catch((e) => {
        console.log('Page push error - ', e);
        return resolve(false);
      });
    });
  }
  popPage() {
    return new Promise(resolve => {
      this.navCtrl.pop().then(() => {
        return resolve(true);
      }).catch((e) => {
        return resolve(false);
      });
    });
  }
  navParams() {
    return new Promise(resolve => {
      this.activatedRoute.queryParams.subscribe(async () => {
        try {
          const routParams = this.router.getCurrentNavigation().extras.state || null;
          return resolve(routParams);
        } catch (e) {
          return resolve(undefined);
        }
      });
    });
  }

  static checkEventData(ev, evName = null, data = true) {
    return data ? (ev && ev.eventName  && ev.eventName === evName && ev.data) : (ev && ev.eventName  && ev.eventName === evName);
  }
  async presentNewToast(msg = 'No action required.', dur = '2000', pos = 'top') {
    this.dismissLoading();
    try {
      this.toastCtrl.dismiss().catch(() => {
      });
    } catch (e) {}
    this.toast = await this.toastCtrl.create({
      message: msg,
      duration: +dur,
      cssClass: 'myIonicToast',
      position: pos === 'center' ? 'middle' : pos === 'top' ? 'top' : 'bottom'
    });
    this.toast.present().catch(() => {});
  }

  listenBackBtn() {
    this.platform.backButton.subscribe(async () => {
      const currentUrl = this.router.url;
      console.log('currentUrl', currentUrl);
      try {
        const element = await this.loadingCtrl.getTop();
        if (element) {
          // element.dismiss().catch(() => {});
          return;
        }
      } catch (error) {}
      try {
        const element = await this.actionSheetCtrl.getTop();
        if (element) { element.dismiss().catch(() => {}); return; }
      } catch (error) {}
      try {
        const element = await this.popOverCtrl.getTop();
        if (element) { element.dismiss().catch(() => {}); return; }
      } catch (error) {}
      try {
        const element = await this.modalCtrl.getTop();
        if (element) { element.dismiss().catch(() => {}); return; }
      } catch (error) {}
      try {
        const element = await this.menuCtrl.getOpen();
        if (element) { this.menuCtrl.close().catch(() => {}); return; }
      } catch (error) {}
      if (((new Date().getTime()) - this.lastTimeBackPress) < this.timePeriodToExit) {
        (navigator as any).app.exitApp();
      } else if (_.includes([APP_URLS.TABS_TAB2, APP_URLS.TABS_TAB3, APP_URLS.TABS_SETTING], currentUrl)) {
        console.log('sss--');
        await this.navCtrl.navigateRoot(APP_URLS.TABS_TAB1, {state: {selectedTab: 'search'}});
      } else if (_.includes([APP_URLS.TABS_TAB1], currentUrl)) {
        await this.presentNewToast(VARS.MSG_BACK_BUTTON, '' + this.timePeriodToExit);
        this.lastTimeBackPress = (new Date().getTime());
      }
    });
  }
}

