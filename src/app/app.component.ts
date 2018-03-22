import { UsuarioDTO } from './../models/usuario.dto';
import { StorageService } from './../services/storage.service';
import { Component, ViewChild } from '@angular/core';
import { Nav, Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { UsuarioService } from '../services/domain/usuario.service';
import { API_CONFIG } from '../config/api.config';
import { AuthService } from '../services/auth.service';

@Component({
  templateUrl: 'app.html'
})

export class MyApp {
  @ViewChild(Nav) nav: Nav;
  menu: UsuarioDTO;
  perfis: any;
  rootPage: string = 'HomePage';

  pages: Array<{title: string, component: string}>;

  constructor(
      public platform: Platform, 
      public statusBar: StatusBar, 
      public splashScreen: SplashScreen,
      public storage: StorageService,
      public usuarioService: UsuarioService,
      public authService: AuthService) {
    this.initializeApp();

    // used for an example of ngFor and navigation
    this.pages = [
      { title: 'Home', component: 'HomePage'},
      { title: 'Perfil', component: 'ProfilePage'},
      
    ];
    
    this.loadSideMenu();
  }

  loadSideMenu()
  {
    let localUser = this.storage.getLocalUser();
    
    if(localUser && localUser.email)
    {
      this.usuarioService.findByEmail(localUser.email)
        .subscribe(response => {
          this.menu = response;

          this.getImageIfExist(this.menu.id);

          this.perfis = response.perfis;

          if(this.perfis)
          {
            if(this.perfis.includes("ADMIN"))
            {
              this.pages.push(
                { title: 'Grupo', component: 'GrupoPage'},
                { title: 'Usuários', component: 'UsuarioPage'},
                { title: 'Logout', component: '' },
              )
            }
            else if(this.perfis.includes("CLIENTE"))
            {
              this.pages.push(
                { title: 'Logout', component: '' },
              )
            }
          };
        }, error => {});
      
    }
  };

  getImageIfExist(id: string) {
    this.usuarioService.getImageBucket(id)
      .subscribe(response => {
         this.menu.imageUrl = `${API_CONFIG.bucketBaseUrl}/cp${id}.jpg`;
      },
    error => {});
  };

  initializeApp() {
    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
  }

  openPage(page : {title:string, component:string}) {

    switch (page.title)
    {
      case 'Logout':
      this.authService.logout();
      this.nav.setRoot('HomePage');
      this.setPage();
      break;

      default:
      this.nav.setRoot(page.component);
    };
  };

  setPage()
  {
    delete this.pages;

    this.pages = [
      { title: 'Home', component: 'HomePage'},
      { title: 'Perfil', component: 'ProfilePage'},
    ];
  };

}
