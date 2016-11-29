import { PriceModel } from './../../models/price-model';
import { PriceCreatePage } from './../price-create/price-create';
import { ValueListPage } from './../value-list/value-list';
import { WineModel } from './../../models/wine-model';
import { WineData } from './../../providers/wine-data';
import { Component } from '@angular/core';
import { NavController,ActionSheetController,NavParams,Events, Platform } from 'ionic-angular';
import { BarcodeScanner } from 'ionic-native';
import { Storage } from '@ionic/storage';
/*
  Generated class for the WineCreate page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-wine-create',
  templateUrl: 'wine-create.html'
})
export class WineCreatePage {
  wine:WineModel;
  public wineList: any;
  public photoChanged:boolean;
  public userProfile:any;

  constructor(public navParams:NavParams,public nav: NavController, public platform:Platform,
  public actionsheetCtrl: ActionSheetController,public wineData: WineData,
  public storage: Storage,public events:Events) {
    this.nav = nav;
    this.wineData= wineData;
    this.wine = new WineModel();
    this.photoChanged=false;
    this.wineList=this.navParams.get('wineList');
    

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

    //getUserProfile
    this.storage.get('userProfile').then(profile=>{
      this.userProfile=JSON.parse(profile);
      console.log('Pseudo '+this.userProfile.pseudo)
    });
    
  }

  ionViewDidLoad() {
    console.log('Hello WineCreate Page');
  }

  ionViewWillLeave() {
    console.log("leave WineCreatePage : wine.id "+(!this.wine.id));
    if(this.wine.isChanged){
      this.wine.isChanged=false; 
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
  
  saveCloud(){

  }

  openMenuDetail()
  {
    let actionSheet = this.actionsheetCtrl.create({
      cssClass: 'action-sheets-basic-page',
      buttons: [
        {
          text: 'Vendeurs',
          icon: 'basket',
          handler: () => {
            
          }
        }
      ]
    });
    actionSheet.present();
    
  }

  elementChanged(){
    console.log('element Changed !');
    this.wine.isChanged=true;
  }

  setColor(color:string){
    console.log('color :'+color);
    this.wine.color=color;
  }

  openValueList(listName:string){
    this.nav.push(ValueListPage, {
        listName: listName
    });
  }

  openPrice(){
    this.wine.isChanged=true;
    this.nav.push(PriceCreatePage, {
        wine: this.wine,
        price : new PriceModel()
    });
  }
}
