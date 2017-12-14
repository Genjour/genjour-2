import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';


import { AppComponent } from './app.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { LoginComponent } from './components/login/login.component';
import { FeedsComponent } from './components/feeds/feeds.component';
import { ProfileComponent } from './components/profile/profile.component';
import { RouterModule, Routes } from '@angular/router';
import { ArticleComponent } from './components/article/article.component';
import { SidenavComponent } from './components/sidenav/sidenav.component';

import { LoginService } from './components/login/login.service';

const appRoutes: Routes = [
  {path: '', component: LoginComponent },
  {path: 'feeds', component: FeedsComponent },
  {path: 'genjourist', component: ProfileComponent },
  {path: 'article', component:ArticleComponent},
]

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    LoginComponent,
    FeedsComponent,
    ProfileComponent,
    ArticleComponent,
    SidenavComponent
  ],
  imports: [
    BrowserModule,
    HttpModule, 
    RouterModule.forRoot(appRoutes),
    
  ],
  providers: [LoginService],
  bootstrap: [AppComponent]
})
export class AppModule { }
