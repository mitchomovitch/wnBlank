import { UtilData } from './../providers/util-data';
import { PriceData } from './../providers/price-data';
import { PriceCreatePage } from './../pages/price-create/price-create';
import { ValueListPage } from './../pages/value-list/value-list';
import { ListData } from './../providers/list-data';
import { ClassementProfile } from './../providers/classement-profile';
import { ProfileData } from './../providers/profile-data';
import { ResellerDetailPage } from './../pages/reseller-detail/reseller-detail';
import { ConnectivityService } from './../providers/connectivity-service';
import { ResellerData } from './../providers/reseller-data';
import { ResellerMapPage } from './../pages/reseller-map/reseller-map';
import { ResellerListPage } from './../pages/reseller-list/reseller-list';
import { ResellerCreatePage } from './../pages/reseller-create/reseller-create';
import { WineCreatePage } from './../pages/wine-create/wine-create';
import { WineDetailPage } from './../pages/wine-detail/wine-detail';
import { WineData } from './../providers/wine-data';
import { ResetPasswordPage } from './../pages/reset-password/reset-password';
import { SignupPage } from './../pages/signup/signup';
import { AuthData } from './../providers/auth-data';
import { ProfilePage } from './../pages/profile/profile';
import { LoginPage } from './../pages/login/login';
import { NgModule } from '@angular/core';
import { IonicApp, IonicModule } from 'ionic-angular';
import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { Storage } from '@ionic/storage';

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    LoginPage,
    ProfilePage,
    SignupPage,
    ResetPasswordPage,
    WineDetailPage,
    WineCreatePage,
    ResellerCreatePage,
    ResellerDetailPage,
    ResellerListPage,
    ResellerMapPage,
    ValueListPage,
    PriceCreatePage
  ],
  imports: [
    IonicModule.forRoot(MyApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    LoginPage,
    ProfilePage,
    SignupPage,
    ResetPasswordPage,
    WineDetailPage,
    WineCreatePage,
    ResellerCreatePage,
    ResellerDetailPage,
    ResellerListPage,
    ResellerMapPage,
    ValueListPage,
    PriceCreatePage
  ],
  providers: [Storage,AuthData,ProfileData,WineData,ResellerData,ConnectivityService,ClassementProfile,
  ListData,PriceData,UtilData]
})
export class AppModule {}
