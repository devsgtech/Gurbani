import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-filter-modal-component',
  templateUrl: './filter-modal-component.component.html',
  styleUrls: ['./filter-modal-component.component.scss'],
})
export class FilterModalComponentComponent implements OnInit {
  filterData ={
    searchMode  : null,
    scriptures  : '1',
    writer      : '0',
    raag        : null,
  }
  searchmode = [
    {
      val :'First Letter (Start)',
      id  : 0,
    },
    {
      val :'First Letter (Anywhere)',
      id  : 1,
    },
    {
      val :'Ang/Vaar',
      id  : 2,
    },
    {
      val :'Full Word (Gurmukhi)',
      id  : 3,
    },
    {
      val :'Full Word (English)',
      id  : 4,
    }
  ]
  raagData :any ;
  constructor(
    private modalController: ModalController,
  ) { }

  ngOnInit() {}

  setmode(ev){
    this.filterData.searchMode =ev.detail.value;
  }
  setRaag(ev){
    this.filterData.raag = ev.detail.value;
  }
  setScripture(ev){
    this.filterData.scriptures = ev.detail.value;
  }
  setWriter(ev){
    this.filterData.writer = ev.detail.value;
  }
  applyFilter(){
    console.log('Apply Function call',this.filterData,)
    this.modalController.dismiss(this.filterData);
  }
  clearFilter(){
    this.filterData ={
      searchMode  : null,
      scriptures  : '1',
      writer      : '0',
      raag        : null,
    }
    console.log('Clear Filter Data',this.filterData,)
    this.modalController.dismiss(this.filterData);
  }
  closeModal(){
    let data ={
      searchMode  : this.filterData.searchMode,
      scriptures  : this.filterData.scriptures,
      writer      :  this.filterData.writer,
      raag        : this.filterData.raag,
    }
    this.modalController.dismiss(data);
  }
}
