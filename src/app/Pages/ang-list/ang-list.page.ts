import { Component, OnInit, ViewChild } from '@angular/core';
import { ListComponent } from 'src/app/Components/list/list.component';
import { HelperService } from 'src/app/services/helper.service';

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

}
