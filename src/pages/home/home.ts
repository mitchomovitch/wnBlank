import { SearchMenuPage } from './../search-menu-page/search-menu-page';
import { ProfileData } from './../../providers/profile-data';
import { WineModel } from './../../models/wine-model';
import { WineCreatePage } from './../wine-create/wine-create';
import { WineData } from './../../providers/wine-data';
import { WineDetailPage } from './../wine-detail/wine-detail';
import { Component,NgZone } from '@angular/core';
import { NavController,ActionSheetController } from 'ionic-angular';
import { Storage } from '@ionic/storage';

declare var cordova;

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  
  public wineList: any;
  wineModel: WineModel;

  constructor(public nav: NavController, public actionsheetCtrl: ActionSheetController,
  public wineData:WineData, private ngZone:NgZone, public storage: Storage,public profileData:ProfileData) {
    
    this.nav = nav;
    this.wineData = wineData;
    this.wineList = this.wineData.getWineList();
    

    storage.get('wineListToDelete').then(list=>{
      if(list){
        var array:any[]=JSON.parse(list);
        //console.log('WINE LIST TO DELETE :'+list);
        for(var i = 0, len = array.length; i < len; i++) {
          //console.log("REMOVE "+i+' '+array[i]);
          this.wineData.removeWine(array[i],this.wineList);
        }
      }
    });

    storage.get('wineList').then(list=>{
      if(list){
        console.log("use local");
        var array:any[]=JSON.parse(list);
        //console.log('WINE LIST :'+list);
        
        for(var i = array.length-1;i>=0;i--){
          if(array[i].id!=null){
            this.wineData.saveWine(array[i],this.wineList);
          }
        }
      }
    });
    
    
  }

  goToWineDetail(wine){
    this.nav.push(WineDetailPage, {
      wine: wine,
      wineList: this.wineList
    });
  }

  createWine(){
    console.log('createWine');
    this.nav.push(WineCreatePage, {
      wineList: this.wineList
    });
  }

  searchWine(){
    console.log('searchWine');
    this.nav.push(SearchMenuPage, {
      wineList: this.wineList
    });
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
      wine.isPhotoChanged=true;
      wine.photoName=name;
      wine.photoPath=success.nativeURL;
      this.wineData.saveWine(wine,this.wineList)
    });    
  }

  openPhotoLibrary(){
    this.wineData.takePicture(0).then(success=>{
      let wine = new WineModel();
      let name = success.nativeURL.replace(/^.*[\\\/]/, '');
      wine.isPhotoChanged=true;
      wine.photoName=name;
      wine.photoPath=success.nativeURL;
      this.wineData.saveWine(wine,this.wineList)
    }); 
  }

}
