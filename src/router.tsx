import { createBrowserRouter, Navigate, RouterProvider } from 'react-router-dom';
import { MainLayout } from '@/layouts';
import { OrdersPage, PeoplePage, TipPage } from '@/pages';
import { LEGACY_ROUTES, ROUTES } from '@/constants';

/**
 * Application route configuration
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
  {
    path: ROUTES.PEOPLE,
    element: (
      <MainLayout>
        <PeoplePage />
      </MainLayout>
    ),
  },
  {
    path: ROUTES.TIP,
    element: (
      <MainLayout>
        <TipPage />
      </MainLayout>
    ),
  },
  // Legacy Portuguese path redirects
  {
    path: LEGACY_ROUTES.ORDERS,
    element: <Navigate to={ROUTES.HOME} replace />,
  },
  {
    path: LEGACY_ROUTES.PEOPLE,
    element: <Navigate to={ROUTES.PEOPLE} replace />,
  },
  {
    path: LEGACY_ROUTES.TIP,
    element: <Navigate to={ROUTES.TIP} replace />,
  },
]);

export const Router = () => <RouterProvider router={router} />;
