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

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    LoginPage,
    ProfilePage,
    SignupPage,
    ResetPasswordPage,
    WineDetailPage,
    WineCreatePage
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
    WineCreatePage
  ],
  providers: [AuthData,WineData]
})
export class AppModule {}
