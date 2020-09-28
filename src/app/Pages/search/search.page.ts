import {Component, NgZone, OnInit, ViewChild} from '@angular/core';
import { FilterModalComponentComponent } from 'src/app/Modal/filter-modal-component/filter-modal-component.component';
import { ModalController, Platform } from '@ionic/angular';
import { newhelper } from 'src/app/services/newhelper';
import { ListComponent } from 'src/app/Components/list/list.component';
import { raags } from '../../services/constantString'
import { ChangeUIService } from 'src/app/services/change-ui.service';
@Component({
  selector: 'app-search',
  templateUrl: './search.page.html',
  styleUrls: ['./search.page.scss'],
})
export class SearchPage  implements OnInit {
  @ViewChild(ListComponent) listComp:ListComponent;
  raagData = raags.raagArray;
  backdrop : boolean = false;
  searchOpt: any;
  favourite = false;
  searchOffset = 0;
  searchString = '';
  // raagData  : any = [];
  filterData ={
    searchMode  : 0,
    scriptures  : 1,
    writer    : 0,
    raag      : 0,
  }
  sqlScript = '';
  checkDidFilter : boolean = false;
  constructor(
    public changeui: ChangeUIService,
    public modalController: ModalController,
    private helper : newhelper,
    public platform: Platform,
    private ngZone: NgZone
  ){
    this.platform.pause.subscribe(e => {
      this.ngZone.run(() => {
        this.listComp.newallStop();
      });
    });
    this.platform.resume.subscribe(e => {
      this.ngZone.run(() => {
        this.listComp.newallStop();
      });
    });
  }

  ngOnInit(){
    this.changeui.themeDetection();
  }

   ionViewWillLeave() {
        try{
          this.modalController.dismiss(this.filterData).catch(() => {});
        } catch (e){}

        this.listComp.stopPlayRecording();
        this.listComp.setIndexZero();
        this.listComp.cancelDownload()
    }
    ionViewWillEnter(){
      this.listComp.newallStop();
      this.listComp.setFavourite()
    }

    ionViewDidLeave(){
      this.listComp.newallStop();
    }
  searchWord(ev = null) {
    if(this.checkDidFilter == true){
      this.checkFilterDataAndFind()
    } else {
      this.listComp.searchWord();
    }
    console.log(this.searchString, 'search String')
  }

  async filterModal(){
    this.backdrop = true;
      const modal = await this.modalController.create({
        showBackdrop: true,
        component: FilterModalComponentComponent,
        cssClass: 'filter-modal',
        componentProps: { raagData: this.raagData , filterData : this.filterData}
      });
      modal.onDidDismiss()
      .then((data: any) => {
        this.backdrop = false;
        console.log('data', data);
        if (data && data.data && !data.data.isCancel && data.data.data) {
          this.filterData = data.data.data;
          this.consoleData();
        }
    });
    return await modal.present();
  }

  consoleData(){
    console.log('fiterDaata From Filer Popup', this.filterData)
    if(this.filterData.searchMode || this.filterData.raag || this.filterData.writer){
      this.checkDidFilter = true;
      this.checkFilterDataAndFind();
    } else {
      this.checkDidFilter = false;
      let text = this.searchString;
      let arrayText = [];
      text = '%' + text + '%'
      arrayText = [text,text,text,0];
      this.sqlScript =  'SELECT * FROM shabad WHERE source_id="G" AND  punjabiVersion LIKE ? OR transliteration LIKE ? OR english_ssk LIKE ?   LIMIT 10 OFFSET ?' 
      this.listComp.searchFilterData(this.sqlScript, arrayText);
    }
  }



  checkFilterDataAndFind(){
    this.searchString = this.searchString.trim();
    let text = '';
    text = this.searchString;
    let arrayText = [];
    let raagText ;
    let writerText ;
    raagText = this.filterData.raag;
    writerText = this.filterData.writer;
    if(this.filterData.searchMode && this.filterData.raag && this.filterData.writer){
       console.log('Search mode and Raag', this.filterData);
       let sql = '';
      switch (this.filterData.searchMode) {
        case 5:
          text = text + '%';
          // arrayText = [text,text,text,raagText,0];
          arrayText = [raagText,writerText,text,text,text,0];
          sql= 'SELECT * FROM shabad WHERE (source_id="G" AND  raag_id=? AND  writer_id=?) AND (punjabiVersion LIKE ? OR  transliteration LIKE ? OR english_ssk LIKE ?) LIMIT 10 OFFSET ? '
          this.sqlScript = sql;
          // this.sqlScript = 'SELECT * FROM shabad WHERE source_id="G" AND punjabiVersion LIKE ? OR transliteration LIKE ? OR english_ssk LIKE ? AND raag_id LIKE ? LIMIT 10 OFFSET ?'
          break;
        case 1:
          text = '%' + text + '%'
          // arrayText = [text,text,text,raagText,0];
          arrayText = [raagText,writerText,text,text,text,0];
          sql= 'SELECT * FROM shabad WHERE (source_id="G" AND  raag_id=? AND  writer_id=?) AND (punjabiVersion LIKE ? OR  transliteration LIKE ? OR english_ssk LIKE ?) LIMIT 10 OFFSET ? '
          this.sqlScript = sql;
          // this.sqlScript =  'SELECT * FROM shabad WHERE source_id="G" AND  punjabiVersion LIKE ? OR transliteration LIKE ? OR english_ssk LIKE ? AND raag_id LIKE ?  LIMIT 10 OFFSET ?' 
          break;
        case 2:   
          text = text + '%';
          // raagText = '%' + raagText + '%';
          // writerText = '%' + writerText + '%';
        arrayText = [raagText,writerText,text,0];
        sql= 'SELECT * FROM shabad WHERE (source_id="G" AND  raag_id=? AND  writer_id=?) AND (ang_id LIKE ?) LIMIT 10 OFFSET ? '
        this.sqlScript = sql;
        // this.sqlScript =  'SELECT * FROM shabad WHERE source_id="G" AND  ang_id LIKE ? AND raag_id LIKE ? AND  writer_id LIKE ? LIMIT 10 OFFSET ?'
          break;
          case 3:   
          text = '%' + text + '%'
          // arrayText = [text,text,text,raagText,0];
          arrayText = [raagText,writerText,text,0];
          sql= 'SELECT * FROM shabad WHERE (source_id="G" AND  raag_id=? AND  writer_id=?) AND (punjabiVersion LIKE ? ) LIMIT 10 OFFSET ? '
          this.sqlScript = sql;
          // this.sqlScript =  'SELECT * FROM shabad WHERE source_id="G" AND  punjabiVersion LIKE ? OR transliteration LIKE ? OR english_ssk LIKE ? AND raag_id LIKE ?  LIMIT 10 OFFSET ?' 
          break;
          case 4:   
          text = '%' + text + '%'
          // arrayText = [text,text,text,raagText,0];
          arrayText = [raagText,writerText,text,0];
          sql= 'SELECT * FROM shabad WHERE (source_id="G" AND  raag_id=? AND  writer_id=?) AND ( english_ssk LIKE ?) LIMIT 10 OFFSET ? '
          this.sqlScript = sql;
          // this.sqlScript =  'SELECT * FROM shabad WHERE source_id="G" AND  punjabiVersion LIKE ? OR transliteration LIKE ? OR english_ssk LIKE ? AND raag_id LIKE ?  LIMIT 10 OFFSET ?' 
          break;
        default:
          text = '%' + text + '%'
          // arrayText = [text,text,text,raagText,0];
          arrayText = [raagText,writerText,text,text,text,0];
          sql= 'SELECT * FROM shabad WHERE (source_id="G" AND  raag_id=? AND  writer_id=?) AND (punjabiVersion LIKE ? OR  transliteration LIKE ? OR english_ssk LIKE ?) LIMIT 10 OFFSET ? '
          this.sqlScript = sql;
          break;
      }
    } else if(this.filterData.searchMode && !this.filterData.raag && !this.filterData.writer){
      console.log('Only Search Mode', this.filterData);

      switch (this.filterData.searchMode) {
        case 5:
          text = text + '%';
          arrayText = [text,text,text,0];
          this.sqlScript = 'SELECT * FROM shabad WHERE source_id="G" AND   punjabiVersion LIKE ? OR  transliteration LIKE ? OR english_ssk LIKE ? LIMIT 10 OFFSET ?'
          break;
        case 1:
          text = '%' + text + '%'
          arrayText = [text,text,text,0];
          this.sqlScript =  'SELECT * FROM shabad WHERE source_id="G" AND  punjabiVersion LIKE ? OR  transliteration LIKE ? OR english_ssk LIKE ? LIMIT 10 OFFSET ?'
          break;
        case 2:   
        text = '%' + text + '%'
        arrayText = [text,0];
       
        this.sqlScript =  'SELECT * FROM shabad WHERE source_id="G" AND  ang_id LIKE ?  LIMIT 10 OFFSET ?'
          break;
          case 3:   
          text = '%' + text + '%'
          // arrayText = [text,text,text,raagText,0];
          arrayText = [text,0];
          this.sqlScript= 'SELECT * FROM shabad WHERE source_id="G" AND  punjabiVersion LIKE ? LIMIT 10 OFFSET ? '
          // this.sqlScript =  'SELECT * FROM shabad WHERE source_id="G" AND  punjabiVersion LIKE ? OR transliteration LIKE ? OR english_ssk LIKE ? AND raag_id LIKE ?  LIMIT 10 OFFSET ?' 
          break;
          case 4:   
          text = '%' + text + '%'
          // arrayText = [text,text,text,raagText,0];
          arrayText = [text,0];
          this.sqlScript= 'SELECT * FROM shabad WHERE source_id="G" AND english_ssk LIKE ? LIMIT 10 OFFSET ?'
          
          // this.sqlScript =  'SELECT * FROM shabad WHERE source_id="G" AND  punjabiVersion LIKE ? OR transliteration LIKE ? OR english_ssk LIKE ? AND raag_id LIKE ?  LIMIT 10 OFFSET ?' 
          break;
        default:
          text = '%' + text + '%'
          arrayText = [text,text,text,0];
          this.sqlScript =  'SELECT * FROM shabad WHERE source_id="G" AND  punjabiVersion LIKE ? OR  transliteration LIKE ? OR english_ssk LIKE ? LIMIT 10 OFFSET ?'
          break;
      }
    } else if(this.filterData.searchMode && this.filterData.raag && !this.filterData.writer){
      let sql = '';
      switch (this.filterData.searchMode) {
        case 5:
          text = text + '%';
          // arrayText = [text,text,text,raagText,0];
          arrayText = [raagText,text,text,text,0];
          sql= 'SELECT * FROM shabad WHERE (source_id="G" AND  raag_id=? ) AND (punjabiVersion LIKE ? OR  transliteration LIKE ? OR english_ssk LIKE ?) LIMIT 10 OFFSET ? '
          this.sqlScript = sql;
          // this.sqlScript = 'SELECT * FROM shabad WHERE source_id="G" AND punjabiVersion LIKE ? OR transliteration LIKE ? OR english_ssk LIKE ? AND raag_id LIKE ? LIMIT 10 OFFSET ?'
          break;
        case 1:
          text = '%' + text + '%'
          // arrayText = [text,text,text,raagText,0];
          arrayText = [raagText,text,text,text,0];
          sql= 'SELECT * FROM shabad WHERE (source_id="G" AND  raag_id=?) AND (punjabiVersion LIKE ? OR  transliteration LIKE ? OR english_ssk LIKE ?) LIMIT 10 OFFSET ? '
          this.sqlScript = sql;
          // this.sqlScript =  'SELECT * FROM shabad WHERE source_id="G" AND  punjabiVersion LIKE ? OR transliteration LIKE ? OR english_ssk LIKE ? AND raag_id LIKE ?  LIMIT 10 OFFSET ?' 
          break;
        case 2:   
          text = text + '%';
          // raagText = '%' + raagText + '%';
          arrayText = [raagText,text,0];
          this.sqlScript= 'SELECT * FROM shabad WHERE (source_id="G" AND  raag_id=?) AND (ang_id LIKE ?) LIMIT 10 OFFSET ? '
          break;
        
        case 3:   
          text = '%' + text + '%'
          // arrayText = [text,text,text,raagText,0];
          arrayText = [raagText,text,0];
          sql= 'SELECT * FROM shabad WHERE (source_id="G" AND  raag_id=?) AND (punjabiVersion LIKE ? ) LIMIT 10 OFFSET ? '
          this.sqlScript = sql;
          // this.sqlScript =  'SELECT * FROM shabad WHERE source_id="G" AND  punjabiVersion LIKE ? OR transliteration LIKE ? OR english_ssk LIKE ? AND raag_id LIKE ?  LIMIT 10 OFFSET ?' 
          break;
        case 4:   
          text = '%' + text + '%'
          // arrayText = [text,text,text,raagText,0];
          arrayText = [raagText,text,0];
          sql= 'SELECT * FROM shabad WHERE (source_id="G" AND  raag_id=?) AND ( english_ssk LIKE ?) LIMIT 10 OFFSET ? '
          this.sqlScript = sql;
          // this.sqlScript =  'SELECT * FROM shabad WHERE source_id="G" AND  punjabiVersion LIKE ? OR transliteration LIKE ? OR english_ssk LIKE ? AND raag_id LIKE ?  LIMIT 10 OFFSET ?' 
          break;
        default:
          text = '%' + text + '%'
          arrayText = [raagText,text,text,text,0];
          sql= 'SELECT * FROM shabad WHERE (source_id="G" AND  raag_id=?) AND (punjabiVersion LIKE ? OR  transliteration LIKE ? OR english_ssk LIKE ?) LIMIT 10 OFFSET ? '
          this.sqlScript = sql;
          break;
      }
    }else if(this.filterData.searchMode && !this.filterData.raag && this.filterData.writer){
      let sql = '';
      switch (this.filterData.searchMode) {
        case 5:
          text = text + '%';
          // arrayText = [text,text,text,raagText,0];
          arrayText = [writerText,text,text,text,0];
          sql= 'SELECT * FROM shabad WHERE (source_id="G" AND  writer_id=?) AND (punjabiVersion LIKE ? OR  transliteration LIKE ? OR english_ssk LIKE ?) LIMIT 10 OFFSET ? '
          this.sqlScript = sql;
          // this.sqlScript = 'SELECT * FROM shabad WHERE source_id="G" AND punjabiVersion LIKE ? OR transliteration LIKE ? OR english_ssk LIKE ? AND raag_id LIKE ? LIMIT 10 OFFSET ?'
          break;
        case 1:
          text = '%' + text + '%'
          // arrayText = [text,text,text,raagText,0];
          arrayText = [writerText,text,text,text,0];
          sql= 'SELECT * FROM shabad WHERE (source_id="G" AND  writer_id=?) AND (punjabiVersion LIKE ? OR  transliteration LIKE ? OR english_ssk LIKE ?) LIMIT 10 OFFSET ? '
          this.sqlScript = sql;
          // this.sqlScript =  'SELECT * FROM shabad WHERE source_id="G" AND  punjabiVersion LIKE ? OR transliteration LIKE ? OR english_ssk LIKE ? AND raag_id LIKE ?  LIMIT 10 OFFSET ?' 
          break;
        case 2:   
          text = text + '%';
          
          // writerText = '%' + writerText + '%';
          arrayText = [writerText,text,0];
          this.sqlScript= 'SELECT * FROM shabad WHERE(source_id="G" AND writer_id=?) AND (ang_id LIKE ?) LIMIT 10 OFFSET ? '
          break;
        case 3:   
          text = '%' + text + '%'
          // arrayText = [text,text,text,raagText,0];
          arrayText = [writerText,text,0];
          sql= 'SELECT * FROM shabad WHERE (source_id="G" AND  writer_id=?) AND (punjabiVersion LIKE ? ) LIMIT 10 OFFSET ? '
          this.sqlScript = sql;
          // this.sqlScript =  'SELECT * FROM shabad WHERE source_id="G" AND  punjabiVersion LIKE ? OR transliteration LIKE ? OR english_ssk LIKE ? AND raag_id LIKE ?  LIMIT 10 OFFSET ?' 
          break;
        case 4:   
          text = '%' + text + '%'
          // arrayText = [text,text,text,raagText,0];
          arrayText = [writerText,text,0];
          sql= 'SELECT * FROM shabad WHERE (source_id="G" AND  writer_id=?) AND ( english_ssk LIKE ?) LIMIT 10 OFFSET ? '
          this.sqlScript = sql;
          // this.sqlScript =  'SELECT * FROM shabad WHERE source_id="G" AND  punjabiVersion LIKE ? OR transliteration LIKE ? OR english_ssk LIKE ? AND raag_id LIKE ?  LIMIT 10 OFFSET ?' 
          break;
        default:
          text = '%' + text + '%'
          // arrayText = [text,text,text,raagText,0];
          arrayText = [writerText,text,text,text,0];
          sql= 'SELECT * FROM shabad WHERE (source_id="G" AND  writer_id=?) AND (punjabiVersion LIKE ? OR  transliteration LIKE ? OR english_ssk LIKE ?) LIMIT 10 OFFSET ? '
          this.sqlScript = sql;
          break;
      }
    } else if(!this.filterData.searchMode && this.filterData.raag && this.filterData.writer){
      text = '%' + text + '%'
      // arrayText = [text,text,text,raagText,0];
      arrayText = [raagText,writerText,text,text,text,0];
      this.sqlScript= 'SELECT * FROM shabad WHERE (source_id="G" AND  raag_id=? AND  writer_id=?) AND (punjabiVersion LIKE ? OR  transliteration LIKE ? OR english_ssk LIKE ?) LIMIT 10 OFFSET ? '

      } else if(!this.filterData.searchMode && this.filterData.raag && !this.filterData.writer){
        text = '%' + text + '%'
        arrayText = [raagText,text,text,text,0];
        this.sqlScript= 'SELECT * FROM shabad WHERE (source_id="G" AND  raag_id=?) AND (punjabiVersion LIKE ? OR  transliteration LIKE ? OR english_ssk LIKE ?) LIMIT 10 OFFSET ? '
  
      }else if(!this.filterData.searchMode && !this.filterData.raag && this.filterData.writer){
        text = '%' + text + '%'
        arrayText = [writerText,text,text,text,0];
        this.sqlScript= 'SELECT * FROM shabad WHERE (source_id="G" AND   writer_id=?) AND (punjabiVersion LIKE ? OR  transliteration LIKE ? OR english_ssk LIKE ?) LIMIT 10 OFFSET ? '
  
      }else if(!this.filterData.searchMode && this.filterData.raag && this.filterData.writer){
        text = '%' + text + '%'
        arrayText = [raagText,writerText,text,text,text,0];
        this.sqlScript= 'SELECT * FROM shabad WHERE (source_id="G" AND raag_id=? AND writer_id=?) AND (punjabiVersion LIKE ? OR  transliteration LIKE ? OR english_ssk LIKE ?) LIMIT 10 OFFSET ? '
      }

    this.listComp.searchFilterData(this.sqlScript, arrayText);

    }
  //   } if(!this.filterData.searchMode && this.filterData.raag){
  //     // raagText = '%' + raagText + '%';
  //     text = '%' + text + '%'
  //     arrayText = [raagText,text,text,text,0];
  //    let sql= 'SELECT * FROM shabad WHERE (source_id="G" AND  raag_id=?) AND (punjabiVersion LIKE ? OR  transliteration LIKE ? OR english_ssk LIKE ?) LIMIT 10 OFFSET ? '
  //    this.sqlScript = sql;
  //     // this.sqlScript =  'SELECT * FROM shabad WHERE source_id="G" AND  raag_id LIKE ? AND punjabiVersion LIKE ? OR  transliteration LIKE ? OR english_ssk LIKE ? LIMIT 10 OFFSET ?'
  //   }
  //   this.listComp.searchFilterData(this.sqlScript, arrayText);
  // }

  prevplay(){
    this.listComp.prevplay();
  }
  playAll(){
    this.listComp.playAll();
  }
  stopPlayRecording(){
    this.listComp.stopPlayRecording();
  }
  nextplay(){
    this.listComp.nextplay();
  }
  getIfDot() {
    return !(this.filterData && !this.filterData.searchMode && (this.filterData.scriptures === 1) && !this.filterData.writer && !this.filterData.raag);
  }

  test(){
    console.log('search back')
  }
}
