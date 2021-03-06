import { PerfilService } from './../services/domain/perfil.service';
import { StorageService } from './../services/storage.service';
import { AuthService } from './../services/auth.service';

import { GrupoService } from './../services/domain/grupo.service';
import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';

import { MyApp } from './app.component';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { HttpClientModule } from '@angular/common/http';
import { ErrorInterceptorProvider } from '../interceptors/error-interceptor';
import { UsuarioService } from '../services/domain/usuario.service';
import { AuthInterceptorProvider } from '../interceptors/auth-interceptor';
import { ExercicioService } from '../services/domain/exercicio.service';
import { SolicitacaoService } from '../services/domain/solicitacao.service';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import { CartService } from '../services/domain/cart.service';
import { SerieService } from '../services/domain/serie.service';
import { ImageUtilService } from '../services/image-util.service';
import { CheckRoleService } from '../services/check-role.service';
import { DashboardService } from '../services/domain/dashboard.service';
import { ChartsModule } from 'ng2-charts/ng2-charts';
import { Network } from '@ionic-native/network';
import { OneSignal } from '@ionic-native/onesignal';

@NgModule({
  declarations: [
    MyApp
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    IonicModule.forRoot(MyApp),
    BrowserAnimationsModule,
    ChartsModule,
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    GrupoService,
    AuthInterceptorProvider,
    ErrorInterceptorProvider,
    AuthService,
    StorageService,
    UsuarioService,
    PerfilService,
    ExercicioService,
    SolicitacaoService,
    CartService,
    SerieService,
    ImageUtilService,
    CheckRoleService,
    DashboardService,
    Network,
    OneSignal,
  ]
})
export class AppModule {}
