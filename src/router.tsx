import { createBrowserRouter, Navigate, RouterProvider } from 'react-router-dom';
import { MainLayout } from '@/layouts';
import { OrdersPage } from '@/pages';
import { ROUTES } from '@/constants';

/**
 * Configuração das rotas da aplicação
 */
const router = createBrowserRouter([
  {
    path: ROUTES.HOME,
    element: (
      <MainLayout>
        <OrdersPage />
      </MainLayout>
    ),
  },
  {
    path: ROUTES.ORDERS,
    element: <Navigate to={ROUTES.HOME} replace />,
  },
]);

export const Router = () => <RouterProvider router={router} />;
