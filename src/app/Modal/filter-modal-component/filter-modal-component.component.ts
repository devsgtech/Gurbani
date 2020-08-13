import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-filter-modal-component',
  templateUrl: './filter-modal-component.component.html',
  styleUrls: ['./filter-modal-component.component.scss'],
})
export class FilterModalComponentComponent implements OnInit {
  filterData ={
    searchMode  : '0',
    scriptures  : '1',
    writer      : '0',
    raag        : '0',
  }
  raagData :any ;
  constructor(
    private modalController: ModalController,
  ) { }

  ngOnInit() {}

  change(ev){
    this.filterData.searchMode = ev.detail.value;
  }
  setRaag(ev){
    this.filterData.raag = ev.detail.value;
  }
  applyFilter(e){
    console.log('this.filterData',this.filterData,)
    this.modalController.dismiss(this.filterData);
  }
}
