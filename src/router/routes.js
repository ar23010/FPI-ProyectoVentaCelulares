const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { 
        path: '', 
        redirect: '/productos' 
      },
      { 
        path: 'productos', 
        component: () => import('pages/ProductListPage.vue') 
      },
      { 
        path: 'producto/:id', 
        component: () => import('pages/ProductDetailPage.vue') 
      },
      { 
        path: 'vender', 
        component: () => import('pages/SellProductPage.vue') 
      },
    ],
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue'),
  },
]

export default routes
