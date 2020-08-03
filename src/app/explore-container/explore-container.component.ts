import { Component, OnInit, Input } from '@angular/core';
import { DbService } from '../services/newdb';
import { FormGroup, FormBuilder } from '@angular/forms';
import { ToastController } from '@ionic/angular';
import { Router } from '@angular/router';

@Component({
  selector: 'app-explore-container',
  templateUrl: './explore-container.component.html',
  styleUrls: ['./explore-container.component.scss'],
})
export class ExploreContainerComponent implements OnInit {
  @Input() name: string;
  mainForm: FormGroup;
  Data: any[] = []
  constructor(
    private db: DbService,
    public formBuilder: FormBuilder,
    private toast: ToastController,
    private router: Router,
  ) { }

  ngOnInit() {
    this.db.dbState().subscribe((res) => {
      if(res){
        this.db.fetchSongs().subscribe(item => {
          this.Data = item
        })
      }
    });
  
    this.mainForm = this.formBuilder.group({
      artist: [''],
      song: ['']
    })
  }

  storeData() {
    this.db.addSong(
      this.mainForm.value.artist,
      this.mainForm.value.song
    ).then((res) => {
      this.mainForm.reset();
    })
  }

  deleteSong(id){
    this.db.deleteSong(id).then(async(res) => {
      let toast = await this.toast.create({
        message: 'Song deleted',
        duration: 2500
      });
      toast.present();      
    })
  }

  }


