import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {path: 'setting-tab', loadChildren: () => import('./setting-tab/setting-tab.module').then( m => m.SettingTabPageModule)},
  {path: 'search', loadChildren: () => import('./Pages/search/search.module').then( m => m.SearchPageModule)},
  {path: 'about', loadChildren: () => import('./Pages/about/about.module').then( m => m.AboutPageModule)},
  {path: '', loadChildren: () => import('./tabs/tabs.module').then(m => m.TabsPageModule)},

];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
