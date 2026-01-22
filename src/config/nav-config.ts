import { NavItem } from '@/types';

export const navItems: NavItem[] = [
  {
    title: 'Dashboard',
    url: '/dashboard/overview',
    icon: 'dashboard',
    isActive: false,
    shortcut: ['d', 'd'],
    items: []
  },
  {
    title: 'User',
    url: '/dashboard/user',
    icon: 'teams',
    isActive: false,
    items: []
    // Access control example:
    // access: {
    //   permission: 'view:users'
    // }
  },
  {
    title: 'Master',
    url: '#', // Placeholder as there is no direct link for the parent
    icon: 'workspace',
    isActive: true,
    items: [
      {
        title: 'Dzongkhag',
        url: '/dashboard/master/dzongkhag',
        shortcut: ['m', 'm']
      }
    ]
  }
];
