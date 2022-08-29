import { DEFAULT_LAYOUT } from '../base';
import { AppRouteRecordRaw } from '../types';

const LIST: AppRouteRecordRaw = {
  path: '/system',
  name: 'system',
  component: DEFAULT_LAYOUT,
  meta: {
    locale: 'menu.server.system',
    requiresAuth: true,
    icon: 'icon-list',
    order: 2,
  },
  children: [
    {
      path: 'menu', // The midline path complies with SEO specifications
      name: 'menu',
      component: () => import('@/views/system/menu/index.vue'),
      meta: {
        locale: 'menu.server.system.menu',
        requiresAuth: true,
        roles: ['*'],
      },
    },
  ],
};

export default LIST;
