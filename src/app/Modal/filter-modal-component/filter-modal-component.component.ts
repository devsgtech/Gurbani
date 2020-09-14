import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-filter-modal-component',
  templateUrl: './filter-modal-component.component.html',
  styleUrls: ['./filter-modal-component.component.scss'],
})
export class FilterModalComponentComponent implements OnInit {
  filterData ={
    searchMode  : 0,
    scriptures  : 1,
    writer      : 0,
    raag        : 0,
  }
  searchmode = [
    {
      val :'Default',
      id  : 0,
    },
    {
      val :'First Letter (Start)',
      id  : 5,
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
  raagData :any;
  writersArray = [
    {val: 0, title: 'All'},
    {val: 1, title: 'Shri Guru Nanak Dev Ji'},
  ]
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
    this.modalController.dismiss({isCancel: false, data: this.filterData});
  }
  clearFilter(){
    this.filterData ={
      searchMode  : 0,
      scriptures  : 1, // 'Shri Guru Granth Sahib Ji
      writer      : 0,
      raag        : 0,
    }
    console.log('Clear Filter Data',this.filterData,)
    this.modalController.dismiss({isCancel: false, data: this.filterData});
  }
  closeModal(isCancel = false){
    let data ={
      searchMode  : this.filterData.searchMode,
      scriptures  : this.filterData.scriptures,
      writer      :  this.filterData.writer,
      raag        : this.filterData.raag,
    }
    this.modalController.dismiss({isCancel, data});
  }
}
