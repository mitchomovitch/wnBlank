import { Storage } from '@ionic/storage';
import { FirebaseData } from './firebase-data';
import { Platform } from 'ionic-angular';
import { Injectable, NgZone } from '@angular/core';
import firebase from 'firebase';
declare var google;

/*
  Generated class for the ClassementProfile provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class ClassementProfile extends FirebaseData{
  public currentUser: any;
  public classementProfile: any;
  public classementPays: any;
  public classementCommune: any;
  public classementQuartier: any;
  public classementRue: any;
  public geocoder:any;

  constructor(public platform:Platform, public ngZone:NgZone, public storage:Storage) {
    
    super(platform,ngZone);
    console.log('Hello ClassementProfile Provider');
    //this.currentUser = firebase.auth().currentUser.uid;

    
  }

  updateClassement(geocoderClassementItem:any, geocoderClassementList:any[]):void{
        console.log('UPDATE CLASSEMENT ITEM:'+JSON.stringify(geocoderClassementItem));
        console.log('UPDATE CLASSEMENT LIST LENGTH:'+geocoderClassementList.length);
        console.log('UPDATE CLASSEMENT LIST:'+JSON.stringify(geocoderClassementList));

        var latlngStr=geocoderClassementItem.latlng;
        var latlngTab = latlngStr.split(',', 2);
        var latlng = {lat: parseFloat(latlngTab[0]), lng: parseFloat(latlngTab[1])};

        //1. call google geocoder : get Quartier, commune, pays
        this.geocode(latlng).then(results=> {
          //console.log('geocodeResults:'+JSON.stringify(results));
            var adress = this.getFormatedAdress(results);
            if (adress!='') {  
              var adressTab = adress.split(',',3)
              var pays=adressTab[2];
              var commune=adressTab[1];
              var quartier=adressTab[0];
              
              var userid=geocoderClassementItem.userid;
              var pseudo=geocoderClassementItem.pseudo;
              var score=geocoderClassementItem.score;

              var classement = {
                userid:userid,
                pseudo:pseudo,
                score:score
              }

              console.log('update classement for adress : '+adress);
              //2.update each node of ClassementProfile
              classement.score=score;
              let ref = firebase.database().ref('classementProfile/pays/'+pays+'/classement');
                  ref.child(userid).once('value').then( (snapshot) => {
                    
                    if(snapshot.val()){
                      console.log('score '+pays+':'+snapshot.val().score);
                      classement.score=snapshot.val().score+score;
                    }
                    ref.child(userid).update(classement).then(data1=>{
                        classement.score=score;
                        ref = firebase.database().ref('classementProfile/pays/'+pays+'/commune/'+commune+'/classement');
                        ref.child(userid).once('value').then( (snapshot) => {
                          
                          if(snapshot.val()){
                            console.log('score '+commune+':'+snapshot.val().score);
                            classement.score=snapshot.val().score+score;
                          }
                          
                          ref.child(userid).update(classement).then(data2=>{
                              classement.score=score;
                              ref = firebase.database().ref('classementProfile/pays/'+pays+'/commune/'+commune+'/quartier/'+quartier+'/classement');
                              ref.child(userid).once('value').then( (snapshot) => {
                                
                                if(snapshot.val()){
                                  console.log('score '+quartier+':'+snapshot.val().score);
                                  classement.score=snapshot.val().score+score;
                                }

                                ref.child(userid).update(classement).then(data3=>{
                                  // remove item  of geocoderClassementList
                                  var i = this.positionFor(geocoderClassementList, geocoderClassementItem.time);
                                  if( i > -1 ) {
                                    geocoderClassementList.splice(i, 1);
                                    this.storage.set('geocoderClassementList',JSON.stringify(geocoderClassementList));
                                    // recall update classement if item
                                    if(geocoderClassementList.length>0){
                                      this.updateClassement(geocoderClassementList[0],geocoderClassementList);
                                    }
                                  }
                                  

                                },err=>{console.log('ERROR UPDATE CLASSEMENT QUARTIER'+JSON.stringify(err));});
                            },err=>{console.log('ERROR CLASSEMENT QUARTIER'+JSON.stringify(err));});

                          },err=>{console.log('ERROR UPDATE CLASSEMENT COMMUNE'+JSON.stringify(err));});
                        },err=>{console.log('ERROR CLASSEMENT COMMUNE'+JSON.stringify(err));});

                      }, err=>{console.log('ERROR UPDATE CLASSEMENT PAYS'+JSON.stringify(err));});
                    }, err=>{console.log('ERROR CLASSEMENT PAYS'+JSON.stringify(err));});


            } else {
              console.log('No results found');
            }
        }, err=>{console.log('Geocoder failed : '+err)});

  }

  // similar to indexOf, but uses time to find element
  positionFor(list, key):number {
    for(var i = 0, len = list.length; i < len; i++) {
      if( list[i].time === key ) {
        return i;
      }
    }
    return -1;
  }

  geocode(latlng:any):Promise<any>{
      this.geocoder = new google.maps.Geocoder;
      var geocoder=this.geocoder;
      return new Promise(function(resolve, reject) {
          geocoder.geocode({ 'location': latlng }, function (results, status) { // called asynchronously
              if (status == google.maps.GeocoderStatus.OK) {
                  resolve(results);
              } else {
                  reject(status);
              }
          });
      });
  }

  getFormatedAdress(results:any):string{
    console.log('getAdress');
    for(var i = 0, len = results.length; i < len; i++) {
      console.log('type : '+JSON.stringify(results[i].types));
      if( JSON.stringify(results[i].types).indexOf('sublocality_level_1') != -1 ) {
        
        return results[i].formatted_address;
      }
    }
    return '';
  }

}
