import { Routes } from '@angular/router';

/**
 * 页面路由动画列表
 * 格式：'离开页面,进入页面'
 */
export const animationPages = ['home'];

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: '/init' },
  {
    path: 'init',
    loadComponent: () => import('./features/init/init').then((m) => m.Init),
    pathMatch: 'full',
  },
  {
    path: 'home',
    loadComponent: () => import('./features/home/home').then((m) => m.Home),
    data: { animation: 'index' },
    pathMatch: 'full',
  },
  {
    path: 'store-detail',
    loadComponent: () => import('./features/store-info/store-info').then((m) => m.StoreInfo),
    pathMatch: 'full',
  },
];

