// import React, { ReactNode, Suspense } from 'react';
import React, { Suspense } from 'react';
// import { Routes, Route, Navigate, NavigateProps } from 'react-router-dom';
import { Routes, Route } from 'react-router-dom';

import { Global, ThemeProvider } from '@emotion/react';
// import { useRecoilValue, useRecoilCallback } from 'recoil';
import { useRecoilCallback, useRecoilValue } from 'recoil';
import { ModalViewer, Layout, Toast } from '@/components';

import { theme, globalStyles } from './styles';

import LoginPage from './pages/LoginPage/LoginPage.page';
import { $me, $isAuthorized, $teams, $toast } from './store';
import * as api from './api';
import { ACCESS_TOKEN, PATH } from './constants';

import { ApplicationFormDetail, CreateApplicationForm, UpdateApplicationForm } from './pages';

// interface RequiredAuthProps extends Partial<NavigateProps> {
//   children: ReactNode;
//   isAuth: boolean;
// }

// const RequiredAuth = ({ children, isAuth, to = PATH.LOGIN, ...restProps }: RequiredAuthProps) => {
//   if (!isAuth) {
//     return <Navigate {...restProps} to={to} />;
//   }

//   // eslint-disable-next-line react/jsx-no-useless-fragment
//   return <>{children}</>;
// };

const App = () => {
  // const isAuthorized = useRecoilValue($isAuthorized);
  const toast = useRecoilValue($toast);

  useRecoilCallback(({ snapshot, set, reset }) => async () => {
    const TOKEN = localStorage.getItem(ACCESS_TOKEN);
    const isAuthorizedSnapshot = snapshot.getLoadable($isAuthorized).contents;

    if (!!TOKEN && !isAuthorizedSnapshot) {
      try {
        const { data: me } = await api.getMyInfo();
        const { data: teams } = await api.getTeams();
        set($me, { accessToken: TOKEN as string, adminMember: me });
        set($teams, teams);
      } catch (e) {
        localStorage.removeItem(ACCESS_TOKEN);
        reset($me);
      }
    }
  })();

  return (
    <ThemeProvider theme={theme}>
      <Suspense fallback={null}>
        <Global styles={globalStyles} />
        <ModalViewer />
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route
              path={PATH.APPLICATION_FORM_DETAIL}
              element={
                // <RequiredAuth isAuth={isAuthorized} to={PATH.LOGIN}>
                <ApplicationFormDetail />
                // </RequiredAuth>
              }
            />
            <Route
              path={PATH.APPLICATION_FORM_UPDATE}
              element={
                // <RequiredAuth isAuth={isAuthorized} to={PATH.LOGIN}>
                <UpdateApplicationForm />
                // </RequiredAuth>
              }
            />

            <Route
              path={PATH.APPLICATION_FORM_CREATE}
              element={
                // <RequiredAuth isAuth={isAuthorized}>
                <CreateApplicationForm />
                // </RequiredAuth>
              }
            />
            {/* <Route path="/" element={<Navigate to={PATH.LOGIN} />} /> */}
          </Route>
          <Route
            path={PATH.LOGIN}
            element={
              // <RequiredAuth isAuth={!isAuthorized} to={PATH.APPLICATION}>
              <LoginPage />
              // </RequiredAuth>
            }
          />
        </Routes>
        {toast && <Toast />}
      </Suspense>
    </ThemeProvider>
  );
};

export default App;
