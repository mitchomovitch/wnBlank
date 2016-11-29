import { PriceCreatePage } from './../../../.tmp/pages/price-create/price-create';
import { PriceModel } from './../../models/price-model';
import { PriceData } from './../../providers/price-data';
import { ValueListPage } from './../value-list/value-list';
import { Storage } from '@ionic/storage';
import { WineData } from './../../providers/wine-data';
import { Component } from '@angular/core';
import { NavController, NavParams,ActionSheetController,Events, Platform } from 'ionic-angular';
import { BarcodeScanner } from 'ionic-native';

declare var cordova;
/*
  Generated class for the WineDetail page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-wine-detail',
  templateUrl: 'wine-detail.html'
})
export class WineDetailPage {
  public wineList: any;
  wine: any;
  public photoChanged:boolean;
  public isDeleted: boolean;
  public lastModif:Date;
  constructor(public platform:Platform,public nav: NavController, public navParams: NavParams, public actionsheetCtrl: ActionSheetController, public priceData : PriceData,
  public wineData: WineData,public events: Events,public storage:Storage) {

    console.log('Constructor WineDetailPage Page');
    this.navParams = navParams;
    this.wineList=this.navParams.get('wineList');
    this.wine=this.navParams.get('wine');
    this.photoChanged=false;
    this.isDeleted=false;
    this.lastModif= new Date(this.wine.time);

    this.events.subscribe('region:selected', (data) => {
      //console.log('Event data', JSON.stringify(data));
      if(this.wine){
        //console.log('Event data', data.region);
        this.wine.region=data[0].region;
        this.wine.subdivision=data[0].subdivision;
        this.wine.appellation=data[0].appellation;
        
        this.elementChanged();
      }
      
    });

  }

  ionViewDidLoad() {
    console.log('Hello WineDetail Page');  
  }


  ionViewWillLeave() {
    console.log('Not deleted ?'+(!this.isDeleted));
    if(this.wine.isChanged&&!this.isDeleted){
      console.log('update wine detail');
      this.wineData.saveWine(this.wine,this.wineList);
    }
  }

  scan(){
    BarcodeScanner.scan().then((barcodeData) => {
      this.elementChanged();
      this.wine.codebarre=barcodeData.text;
    // Success! Barcode data is here
    }, (err) => {
        console.log("ERROR -> " + JSON.stringify(err));
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
        },
        {
          text: 'Scanner un code barre',
          icon: 'barcode',
          handler: () => {
            this.scan();
          }
        }
      ]
    });
    actionSheet.present();
  }

  takePicture(){
    this.wineData.takePicture(1).then(success=>{
      this.elementChanged();
      this.wine.isPhotoChanged=true;
      let name = success.nativeURL.replace(/^.*[\\\/]/, '');
      this.wine.photoName=name;
      this.wine.photoPath=success.nativeURL;
      
    });
  }


  openPhotoLibrary(){
    this.wineData.takePicture(0).then(success=>{
      this.elementChanged();
      this.wine.isPhotoChanged=true;
      let name = success.nativeURL.replace(/^.*[\\\/]/, '');
      this.wine.photoName=name;
      this.wine.photoPath=success.nativeURL;
    });
  }

  removeWine(){
    console.log("delete notes");
    this.elementChanged();
    
    this.wineData.removeWine(this.wine,this.wineList);
    this.isDeleted=true;
    console.log("delete notes finish");
    this.nav.pop();
  }

  saveCloud(){

  }

  openMenuDetail()
  {
    let actionSheet = this.actionsheetCtrl.create({
      cssClass: 'action-sheets-basic-page',
      buttons: [
        {
          text: 'Supprimer',
          icon: 'trash',
          handler: () => {
            this.removeWine();
          }
        }
      ]
    });
    actionSheet.present();
    
  }

  elementChanged(){
    this.wine.isChanged=true;
  }

  setColor(color:string){
    console.log('color :'+color);
    this.wine.color=color;
    this.elementChanged();
  }

  openValueList(listName:string){
    this.nav.push(ValueListPage, {
        listName: listName
    });
  }

  openPrice(){
    this.nav.push(PriceCreatePage, {
        wine: this.wine,
        price : new PriceModel
    }); 
  }

  backButtonClick(){
    console.log("wine detail back click");
  }


}
