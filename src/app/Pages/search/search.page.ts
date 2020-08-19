import { Component, OnInit, ViewChild } from '@angular/core';
import { FilterModalComponentComponent } from 'src/app/Modal/filter-modal-component/filter-modal-component.component';
import { ModalController } from '@ionic/angular';
import { raagDB } from 'src/app/services/raagDb';
import { newhelper } from 'src/app/services/newhelper';
import { ListComponent } from 'src/app/Components/list/list.component';

@Component({
  selector: 'app-search',
  templateUrl: './search.page.html',
  styleUrls: ['./search.page.scss'],
})
export class SearchPage  implements OnInit {
  @ViewChild(ListComponent) listComp:ListComponent;
  
  backdrop : boolean = false;
  searchOpt: any;
  favourite = false;
  searchOffset = 0;
  searchString = '';
  raagData  : any = [];
  filterData ={
    searchMode  : null,
    scriptures  : null,
    writer      : null,
    raag        : null,
  }
  sqlScript = '';
  constructor(
    public modalController: ModalController,
    private raagDb  : raagDB,
    private helper : newhelper,
  ){}

  ngOnInit(){
    this.raagDb.dbState().subscribe((res) => {
      if(res){
        this.raagDb.fetchSongs().subscribe(item => {
          this.raagData = item;
         console.log('Got Data From RAAG' , item)
        })
      }
    });
  }
  searchWord(ev = null) {

    console.log(this.searchString, 'search String')
    // this.searchString = ev.target.value.trim();
    this.listComp.searchWord();
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
      .then((data) => {
        this.backdrop = false;
        this.filterData = data.data;
        this.consoleData();
        // this.searchFilterData(data.data)
    });
      return await modal.present();
  }

  consoleData(){
    this.checkFilterDataAndFind();
    // this.listComp.searchFilterData(this.filterData);
  }



  checkFilterDataAndFind(){
    this.searchString = this.searchString.trim();
    let text = this.searchString;
    let arrayText = [];
    if(this.filterData.searchMode!==null && this.filterData.raag !==null){
       console.log('Search mode and Raag', this.filterData);

      let raagText ;
      raagText = this.filterData.raag;
      switch (this.filterData.searchMode) {
        case 0:
          text = text + '%';
          arrayText = [text,text,raagText,0];
          this.sqlScript = 'SELECT * FROM shabad WHERE source_id="G" AND transliteration LIKE ? OR english_ssk LIKE ? AND raag_id LIKE ? LIMIT 10 OFFSET ?'
          break;
        case 1:
          text = '%' + text + '%'
          arrayText = [text,text,raagText,0];
          this.sqlScript =  'SELECT * FROM shabad WHERE source_id="G" AND  transliteration LIKE ? OR english_ssk LIKE ? AND raag_id LIKE ?  LIMIT 10 OFFSET ?' 
          break;
        case 2:   
        arrayText = [parseInt(text),raagText,0];
        this.sqlScript =  'SELECT * FROM shabad WHERE source_id="G" AND  ang_id LIKE ? AND raag_id LIKE ? LIMIT 10 OFFSET ?'
          break;
        default:
          text = '%' + text + '%'
          arrayText = [text,text,raagText,0];
          this.sqlScript =  'SELECT * FROM shabad WHERE source_id="G" AND  transliteration LIKE ? OR english_ssk LIKE ? AND raag_id LIKE ?  LIMIT 10 OFFSET ?'
          break;
      }
    } else if(this.filterData.searchMode !==null){
      console.log('Only Search Mode', this.filterData);

      switch (this.filterData.searchMode) {
        case 0:
          text = text + '%';
          arrayText = [text,text,0];
          this.sqlScript = 'SELECT * FROM shabad WHERE source_id="G" AND  transliteration LIKE ? OR english_ssk LIKE ? LIMIT 10 OFFSET ?'
          break;
        case 1:
          text = '%' + text + '%'
          arrayText = [text,text,0];
          this.sqlScript =  'SELECT * FROM shabad WHERE source_id="G" AND  transliteration LIKE ? OR english_ssk LIKE ? LIMIT 10 OFFSET ?'
          break;
        case 2:   
        text = '%' + text + '%'
        arrayText = [text,text,0];
        this.sqlScript =  'SELECT * FROM shabad WHERE source_id="G" AND  transliteration LIKE ? OR english_ssk LIKE ? LIMIT 10 OFFSET ?'
          break;

        default:
          text = '%' + text + '%'
          this.sqlScript =  'SELECT * FROM shabad WHERE source_id="G" AND  ang_id LIKE ? AND raag_id LIKE ?  LIMIT 10 OFFSET ?', [text]
          break;
      }
    }
    this.listComp.searchFilterData(this.sqlScript, arrayText);
  }


}
