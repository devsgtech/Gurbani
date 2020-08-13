import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./tabs/tabs.module').then(m => m.TabsPageModule)
  },
  {
    path: 'setting-tab',
    loadChildren: () => import('./setting-tab/setting-tab.module').then( m => m.SettingTabPageModule)
  },
  {
    path: 'search',
    loadChildren: () => import('./Pages/search/search.module').then( m => m.SearchPageModule)
  },  {
    path: 'filter-modal',
    loadChildren: () => import('./Modal/filter-modal/filter-modal.module').then( m => m.FilterModalPageModule)
  }

];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
