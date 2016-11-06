import { WineModel } from './../../models/wine-model';
import { WineCreatePage } from './../wine-create/wine-create';
import { WineData } from './../../providers/wine-data';
import { WineDetailPage } from './../wine-detail/wine-detail';
import { Component,NgZone } from '@angular/core';
import { NavController,ActionSheetController } from 'ionic-angular';

declare var cordova;

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  public wineList: any;
  wineModel: WineModel;

  constructor(public nav: NavController, public actionsheetCtrl: ActionSheetController,
  public wineData:WineData, private ngZone:NgZone) {
    this.nav = nav;
    this.wineData = wineData;
    this.wineData.getWineList().on('value', snapshot => {
      this.ngZone.run(()=>{
          console.log('Snapshot');
          let rawList = [];
          snapshot.forEach( snap => {
            this.wineModel=snap.val();
            this.wineModel.id=snap.key;
            if(this.wineModel.photoName!=null){
              this.wineModel.photoPath=cordova.file.dataDirectory+this.wineModel.photoName;
            }       
            rawList.push(this.wineModel); 
          });
          this.wineList = rawList;
          });   
    });
  }

  goToWineDetail(wineId){
    this.nav.push(WineDetailPage, {
      wineId: wineId,
    });
  }

  createWine(){
    console.log('createWine');
    this.nav.push(WineCreatePage);
  }

  searchWine(){
    console.log('searchWine');
  }

  openMenuPhoto() {
    let actionSheet = this.actionsheetCtrl.create({
      title: 'Photo',
      cssClass: 'action-sheets-basic-page',
      buttons: [
        {
          text: 'Prendre une photo',
          icon: 'camera',
          handler: () => {
            this.takePicture();
          }
        },
        {
          text: 'Choisir une photo',
          icon: 'images',
          handler: () => {
            this.openPhotoLibrary();
          }
        }
      ]
    });
    actionSheet.present();
  }

  takePicture(){
    this.wineData.takePicture(1).then(success=>{
      let wine = new WineModel();
      let name = success.nativeURL.replace(/^.*[\\\/]/, '');
      wine.photoName=name;
      wine.photoPath=success.nativeURL;
      this.wineData.createWine(wine).then( () => {
      });
    });    
  }

  openPhotoLibrary(){
    this.wineData.takePicture(0).then(success=>{
      let wine = new WineModel();
      let name = success.nativeURL.replace(/^.*[\\\/]/, '');
      wine.photoName=name;
      wine.photoPath=success.nativeURL;
      this.wineData.createWine(wine).then( () => {
      });
    }); 
  }


}
