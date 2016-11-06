import { Injectable } from '@angular/core';
import { Network } from 'ionic-native';
import { Platform } from 'ionic-angular';
 
declare var Connection;

/*
  Generated class for the ConnectivityService provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class ConnectivityService {

  onDevice: boolean;
 
  constructor(public platform: Platform){
    this.onDevice = this.platform.is('cordova');
  }
 
  isOnline(): boolean {
    
    console.log('this.onDevice:'+this.onDevice);
    console.log('Network.connection:'+Network.connection);
    console.log('test '+Network.connection !== Connection.NONE);

    if(this.onDevice && Network.connection){
      return (Network.connection !== Connection.NONE);
    } else {
      return navigator.onLine; 
    }
  }
 
  isOffline(): boolean {
    if(this.onDevice && Network.connection){
      return (Network.connection === Connection.NONE);
    } else {
      return !navigator.onLine;   
    }
  }

}
