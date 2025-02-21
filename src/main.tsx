import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import Layout from '@/layout';
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import LoginPage from 'pages/client/auth/login';
import RegisterPage from 'pages/client/auth/register';
import 'styles/global.scss'
import HomePage from 'pages/client/home';
import { App, ConfigProvider } from 'antd';
import { AppProvider } from 'components/context/app.context';
import ProtectedRoute from '@/components/auth';
import DashBoardPage from 'pages/admin/dashboard';
import ManageTreePage from '@/pages/admin/manage.tree';
import ManageUserPage from 'pages/admin/manage.user';
import LayoutAdmin from 'components/layout/layout.admin';
import TreeMapPage from './pages/client/treemap';
import TreePage from './pages/client/tree';
import enUS from 'antd/locale/en_US';

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        index: true,
        element: <HomePage />
      },
      {
        path: "/treemap",
        element: <TreeMapPage />,
      },
      {
        path: "/tree",
        element: <TreePage />,
      },
      {
        path: "/feedback",
        element: (
          <ProtectedRoute>
            <div>Ý kiến phản ánh</div>
          </ProtectedRoute>
        ),
      }
    ]
  },
  {
    path: "admin",
    element: <LayoutAdmin />,
    children: [
      {
        index: true,
        element: (
          <ProtectedRoute>
            <DashBoardPage />
          </ProtectedRoute>
        )
      },
      {
        path: "tree",
        element: (
          <ProtectedRoute>
            <ManageTreePage />
          </ProtectedRoute>
        )
      },
      // {
      //   path: "order",
      //   element: (
      //     <ProtectedRoute>
      //       <ManageOrderPage />
      //     </ProtectedRoute>
      //   )
      // },
      {
        path: "user",
        element: (
          <ProtectedRoute>
            <ManageUserPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "/admin",
        element: (
          <ProtectedRoute>
            <div>admin page</div>
          </ProtectedRoute>
        ),
      },

    ]
  },
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/register",
    element: <RegisterPage />,
  },

]);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App>
      <AppProvider>
        <ConfigProvider locale={enUS}>
          <RouterProvider router={router} />
        </ConfigProvider>
      </AppProvider>
    </App>
  </StrictMode>,
)
