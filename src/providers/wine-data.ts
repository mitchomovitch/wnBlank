import { UtilData } from './util-data';
import { PriceData } from './price-data';
import { ClassementProfile } from './classement-profile';
import { FirebaseData } from './firebase-data';
import { Platform, Events } from 'ionic-angular';
import { WineModel } from './../models/wine-model';
import { Injectable, NgZone } from '@angular/core';
import firebase from 'firebase';
import { File, Camera, Geolocation, Transfer } from 'ionic-native';
import { Storage } from '@ionic/storage';

declare var cordova:any;

@Injectable()
export class WineData extends FirebaseData{
  public currentUser: any;
  public wineListRef: any;
  public syncWineList: any;
  public winePictureRef: any;
  public userProfile:any;
  public wineListToDelete:any[];
  public geocoderClassementList:any[];
  

  constructor(public platform:Platform, public ngZone:NgZone,public storage: Storage, 
  public classementProfile:ClassementProfile, public priceData : PriceData, public util : UtilData,
  public events:Events) {
    super(platform,ngZone,storage);
    //this.currentUser = firebase.auth().currentUser.uid;
    this.storage.get('userProfile').then(profile=>{
      console.log('userProfile',profile)
      this.userProfile=JSON.parse(profile);
    }); 
    this.events.subscribe('userProfile:updated', (data) => {
      console.log('userProfile events',JSON.stringify(data[0]));
      this.userProfile=data[0];    
    });

    this.wineListRef = firebase.database().ref('wineList');
    this.syncWineList=this.getSynchronizedArray(this.wineListRef);
    this.winePictureRef = firebase.storage().ref('/WinePhoto/');
    console.log('Hello WineData provider');
    this.initLocalStorage();
       

  }

  initLocalStorage(){
    
    this.storage.get('wineListToDelete').then(listDelete=>{
      if(listDelete){
        this.wineListToDelete=JSON.parse(listDelete);
      }
      else {
        this.wineListToDelete=[];
      }
    }); 
    this.storage.get('geocoderClassementList').then(geocoderList=>{
      console.log('geocoderList storage enter',geocoderList);
      if(geocoderList){
        console.log('geocoderList',geocoderList);
        this.geocoderClassementList=JSON.parse(geocoderList);
        this.updateClassement();
      }
      else {   
        this.geocoderClassementList=[];
        console.log('geocoderList init');
      }
    });   

      
  }

  getWineList(): any {
    return this.syncWineList;
  }

  getWineDetail(wineId): any {
    return this.wineListRef.child(wineId);
  }

  saveWine(wine:WineModel, list:any) {  
    if(wine.id==null){
      let date = new Date(),time = date.getTime();
      wine.id=this.util.uuid.generateTimeId();
      wine.time=time;
      wine.userId=this.userProfile.id;
      wine.userPseudo=this.userProfile.pseudo; 
    }

    if(wine.latlng==null){
      Geolocation.getCurrentPosition().then((position) => {
          wine.latlng=position.coords.latitude+","+position.coords.longitude;
          wine.nbPointToUpdate=10;
          list.set( wine.id, wine );
          this.storage.set('wineList',JSON.stringify(list));
          if (wine.photoPath != null && wine.isPhotoChanged) {
              this.savePhoto(wine,list);         
          } 
          this.addItemToGeocoderClassementList(wine.latlng,10,this.userProfile);
          this.updateClassement();
          
      });
    }
    else {
      list.set( wine.id, wine );
      this.storage.set('wineList',JSON.stringify(list));
      if (wine.photoPath != null && wine.isPhotoChanged) {
          this.savePhoto(wine,list);         
      } 
    }
    
  }

  removeWine(wine:WineModel, list:any){
    if(wine.photoUrl != null){
      let currentName = wine.photoPath.replace(/^.*[\\\/]/, '');
      this.winePictureRef.child(wine.id).child(currentName).delete().then(()=>{
        console.log("delete storage "+wine.id);
      }, (err) => {
        console.log('err delete storage : '+err);
      });
    }
    var id=wine.id;
    list.remove(wine.id).then((data)=>{
      
      var i = this.positionFor(this.wineListToDelete, id);
      if( i > -1 ) {
        console.log('remove wineListToDelete ');
        this.wineListToDelete.splice(i, 1);
        this.storage.set('wineListToDelete',JSON.stringify(this.wineListToDelete));
      }
      this.storage.set('wineList',JSON.stringify(list));
    });
    
  }

  savePhoto(wine:WineModel, list:any){
    //Grab the file name
    let currentName = wine.photoPath.replace(/^.*[\\\/]/, '');
    let path='';
    if(this.platform.is('ios')){
      path=cordova.file.dataDirectory;
    }
    else {
      path=wine.photoPath.substring(0,wine.photoPath.indexOf(currentName));
    }
    console.log('photoPath:'+wine.photoPath);
    console.log('Name:'+currentName);
    console.log('Path:'+path);

    File.readAsDataURL(path,currentName).then( (base64:string)=>{
      base64=base64.substring(base64.indexOf(',')+1);
      this.winePictureRef.child(wine.id).child(currentName)
      .putString(base64, 'base64', {contentType: 'image/png'})
      .then((savedPicture) => {
        wine.photoUrl=savedPicture.downloadURL;
        wine.isPhotoChanged=false;
        list.set( wine.id, wine );
        this.storage.set('wineList',JSON.stringify(list));
        //this.wineList.child(wine.id).child('photoUrl').set(savedPicture.downloadURL);
      }, (err) => {
        console.log('err putString : '+err);
      });
    }, (err) => {
      console.log('err read file : '+err);    
    });
  }


  uploadFile(imageData:any){
    
  }

  takePicture(sourceType:number):Promise<any>{
    return Camera.getPicture({
      quality : 40,
      destinationType : Camera.DestinationType.FILE_URI,
      //CAMERA. PHOTOLIBRARY : 0, CAMERA : 1, SAVEDPHOTOALBUM : 2
      sourceType : sourceType,
      allowEdit : true,
      encodingType: Camera.EncodingType.JPEG,
      targetWidth: 600,
      targetHeight: 800,
      saveToPhotoAlbum: false
    }).then( path => {
      
      /*console.log('takePicture data:'+cordova.file.dataDirectory);
      console.log('takePicture temp:'+cordova.file.tempDirectory);
      console.log('takePicture path:'+path);*/

      if(this.platform.is('ios')){
          let currentName = path.replace(/^.*[\\\/]/, '');
          //Create a new file name
              let d = new Date(),
                  n = d.getTime(),
                  newFileName = n + ".png";
          return File.moveFile(cordova.file.tempDirectory, currentName, cordova.file.dataDirectory, newFileName);
      
      } else {
          return new Promise(function(resolve, reject) {
            resolve({nativeURL:path});
            reject('some fail stuff');
          });
      }


    });
  }

  // méthode surchargé
  syncChanges(list, ref) {
  //console.log("syncChanges");

      ref.on('child_added', (snap, prevChild) => {
        this.ngZone.run(()=>{
          console.log("syncChanges child_added");
          var data = snap.val();
          data.id = snap.key; // assumes data is always an object
          //var pos = this.positionAfter(list, prevChild);
          //list.splice(pos, 0, data);
          //Ajout du nouvel element a la position 1
          
          if(data.userId==this.userProfile.id){
              if(data.photoName!=null && this.platform.is('ios')){
                data.photoPath=cordova.file.dataDirectory+data.photoName;
              }
              list.splice(0, 0, data);
              this.checkFile(data);
          }
        });
      });

      ref.on('child_removed', (snap) => {
        this.ngZone.run(()=>{
          var data = snap.val();
          data.id = snap.key; 
          
          if(data.userId==this.userProfile.id){
            console.log("syncChanges child_removed");
            var i = this.positionFor(list, snap.key);
            if( i > -1 ) {
              list.splice(i, 1);
              //mark to delete : add to the delete list
              this.wineListToDelete.push(data);
              this.storage.set('wineListToDelete',JSON.stringify(this.wineListToDelete));
            }
            
          }
          
          //console.log("child_removed list :"+JSON.stringify(list));
        });
      });

      ref.on('child_changed', (snap) => {
        this.ngZone.run(()=>{
          var data = snap.val();
          data.id = snap.key; 
          
          if(data.userId==this.userProfile.id){
            if(data.photoName!=null && this.platform.is('ios')){
              data.photoPath=cordova.file.dataDirectory+data.photoName;
            }
            console.log("syncChanges child_changed");
            var i = this.positionFor(list, snap.key);
            if( i > -1 ) {
              list[i] = data;
              list[i].id = snap.key; // assumes data is always an object
            }
            
          }
          
          //console.log("child_changed list :"+JSON.stringify(list));
        });
      });

      ref.on('child_moved', (snap, prevChild) => {
        this.ngZone.run(()=>{
          console.log("syncChanges child_moved");
          var curPos = this.positionFor(list, snap.key);
          if( curPos > -1 ) {
            var data = list.splice(curPos, 1)[0];
            var newPos = this.positionAfter(list, prevChild);
            list.splice(newPos, 0, data);
          }
          //console.log("child_moved list :"+JSON.stringify(list));
        });

      });
  }

  updateClassement():void{
    console.log('init update classement');
    if(this.geocoderClassementList!=null && this.geocoderClassementList.length>0){
      console.log('update classement');
      this.classementProfile.updateClassement(this.geocoderClassementList[0],this.geocoderClassementList);
    }
  }

  addItemToGeocoderClassementList(latlng:string,score:number, userProfile:any){
      let date = new Date(),time = date.getTime();
      var item = {
          time:time,
          userid:userProfile.id,
          pseudo:userProfile.pseudo,
          score:score,
          latlng:latlng
      }

      this.geocoderClassementList.push(item);
      this.storage.set('geocoderClassementList',JSON.stringify(this.geocoderClassementList));
      console.log('add new item to geocoderClassementList');
      
  }

  checkFile(wine:WineModel):void{
    //console.log('photoUrl : '+wine.photoUrl);  
    if(wine.photoUrl){
        var file=wine.photoName;
        var path:string;
        if(this.platform.is('ios')){
          path=cordova.file.dataDirectory;
        }
        else {
          path=wine.photoPath.substr(0,wine.photoPath.indexOf(file));
        }  
        //console.log('photoPath : '+wine.photoPath);
        //console.log('file : '+file);
        //console.log('path : '+path);

        File.checkFile(path,file).then(isExist=>{
          console.log('check file : '+isExist);
        }, err=>{
          //console.log('Err:'+JSON.stringify(err));
          //console.log('download file');
          var transfer= new Transfer();
          transfer.download(wine.photoUrl,path + file).then((entry) => {
            console.log('download complete: ' + entry.toURL());
          }, (error) => {
            console.log(JSON.stringify(error));
          });
            
        });
    }
    
  }

}