import { Component, NgZone, OnInit, ViewChild } from '@angular/core';
import { AndroidPermissions } from '@ionic-native/android-permissions/ngx';
import {FileTransfer, FileTransferObject} from '@ionic-native/file-transfer/ngx';
import {Media, MediaObject} from '@ionic-native/media/ngx';
import { Network } from '@ionic-native/network/ngx';
import { AlertController, IonInfiniteScroll, Platform } from '@ionic/angular';
import { ListComponent } from 'src/app/Components/list/list.component';
import { ChangeUIService } from 'src/app/services/change-ui.service';
import { raags, VARS, writes } from 'src/app/services/constantString';
import { HelperService } from 'src/app/services/helper.service';
import { newhelper } from 'src/app/services/newhelper';
import { shabadDB } from 'src/app/services/shabadDB';
import {File} from '@ionic-native/file/ngx';
import {Storage} from '@ionic/storage';

@Component({
  selector: 'app-ang-list',
  templateUrl: './ang-list.page.html',
  styleUrls: ['./ang-list.page.scss'],
})
export class AngListPage implements OnInit {
  @ViewChild(ListComponent) listComp:ListComponent;

  angPage = true;
  favourite :any = false;
  filterData ={
    searchMode  : 0,
    scriptures  : 1,
    writer    : 0,
    raag      : 0,
  }
  searchString = '';
  contentId = 'angContent'
  constructor(
    private helper: HelperService,
  ) { }

  ngOnInit() {
   
    this.helper.navParams().then((params: any) => {
      console.log('private helper: HelperService,',params);
      this.filterData.searchMode = params.newFilter;
      this.searchString = params.newSearch;
      this.getData();
    })

   
  }
  ionViewWillLeave() {
    console.log('leave');
    this.helper.event$.next(true);
    this.listComp.newallStop()
    }
  getData(){
    this.listComp.emptyServerArry()
    let text = '%' + this.searchString + '%'
    let arrayText = [text,0];
    let sql =  'SELECT * FROM shabad WHERE source_id="G" AND  ang_id LIKE ?  LIMIT 10 OFFSET ?';
    this.listComp.searchFilterData(sql, arrayText);

  }

  nnscrollTo(index) {
    document.getElementById('currentPlayItemId' + index.toString()).scrollIntoView({ behavior: 'smooth' });
    console.log('index-----', index); 
  }
  
}
