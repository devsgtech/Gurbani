import { Component, OnInit, ViewChild } from '@angular/core';
import { ChangeUIService } from '../services/change-ui.service';
import { shabadDB } from '../services/shabadDB';
import { IonInfiniteScroll } from '@ionic/angular';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss']
})
export class Tab3Page implements OnInit {
  @ViewChild(IonInfiniteScroll) infiniteScroll: IonInfiniteScroll;
  tilesArray = [
    {
      punjabiWord: 'ਜਪੁਜੀ ਸਾਹਿਬ',
      englishWord: 'Japji Sahib',
      id: 1,
    },
    {
      punjabiWord: 'ਅਨੰਦੁ ਸਾਹਿਬ',
      englishWord: 'Anand Sahib',
      id: 2,
    },
    {
      punjabiWord: 'ਸੁਖਮਨੀ ਸਾਹਿਬ',
      englishWord: 'Sukhmani Sahib',
      id: 3,
    }
  ]
  sqlText: any;
  arrayText = [];
  serverFileArray = [];
  serverFileArrayCopy = [];
  sqlScript = '';

  listShow : boolean = false;
  constructor(
    public changeui: ChangeUIService,
    private igdb: shabadDB,
  ) {
  }

  ngOnInit() {
  }

  backToReadTile(){
    this.listShow = false;
  }
  
  readBook(id) {
    this.listShow = true;
    let offset = 0;
    let limit = 0;
    let textArray = [];
    switch (id) {
      case 1:
        offset = 0;
        limit = 385;
        textArray = [limit, offset]
        this.sqlScript = "SELECT * FROM shabad WHERE source_id='G' LIMIT ? OFFSET ?";
        this.searchFilterDataNotReset(this.sqlScript, textArray)
        break;
      case 2:
        offset = 39313;
        limit = 210;
        textArray = [limit, offset]
        this.sqlScript = "SELECT * FROM shabad WHERE source_id='G' LIMIT ? OFFSET ?";
        this.searchFilterDataNotReset(this.sqlScript, textArray)
        break;
      case 3:
        offset = 11587;
        limit = 2027;
        textArray = [limit, offset]
        this.sqlScript = "SELECT * FROM shabad WHERE source_id='G' LIMIT ? OFFSET ?";
        this.searchFilterDataNotReset(this.sqlScript, textArray)
        break;

    }
  }


  loadData(event) {
    let leng = this.serverFileArray.length + 10;
    for (let i = this.serverFileArray.length; i < leng; i++) {
      if(i < this.serverFileArrayCopy.length ){
        this.serverFileArray.push(this.serverFileArrayCopy[i])
      } else{
        event.target.disabled = true;
      }
    }
    console.log('this.serverFileArray Length', this.serverFileArray.length);
    event.target.complete();
  }

  // loadMorewhenFilter(){
  //   let length  = this.arrayText.length;
  //   let offset  = this.arrayText[length - 1];
  //   offset      = offset + 10 ;
  //   this.arrayText[length - 1] = offset;
  //   this.searchFilterDataNotReset(this.sqlText,this.arrayText);
  // }
  searchFilterDataNotReset(sqlText, arrayText) {
    this.serverFileArrayCopy = [];
    this.serverFileArray = [];
    this.sqlText = sqlText;
    this.arrayText = arrayText;
    this.igdb.commonFilter(sqlText, arrayText).then((res) => {
      console.log('Lenght Of Data', res.length);
      console.log('Response From Common Filter', res);
      res.map(item => {
        this.serverFileArrayCopy.push(item);
      })
      this.pushData();
    })
  }

  pushData() {
    for (let i = 0; i < 10; i++) {
      this.serverFileArray.push(this.serverFileArrayCopy[i])
    }
  }
}
