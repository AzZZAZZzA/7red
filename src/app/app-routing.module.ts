import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {GameComponent} from './game/game.component';
import { MenuComponent } from './menu/menu.component';
import {SettingComponent} from './setting/setting.component';
import{HomeComponent} from './home/home.component'
import{RulesComponent} from './rules/rules.component'

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'assets/Red7.pdf',redirectTo: 'http://tm.xhosting.su/assets/Red7.pdf'},
  { path: 'setting', component: SettingComponent },
  { path: 'rules', component: RulesComponent },
  { path: 'game', component: GameComponent },
  { path: 'assets/Red7.pdf', redirectTo: '../assets/Red7.pdf'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})


export class AppRoutingModule {
 }
