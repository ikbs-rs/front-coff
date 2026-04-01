import React, { useEffect, useState } from 'react';
import { Navigate, Route, Routes, useLocation } from 'react-router-dom';
import axios from 'axios';
import App from './App';
import { Login } from './pages/Login';
import { Error } from './pages/Error';
import { NotFound } from './pages/NotFound';
import { Access } from './pages/Access';
import env from './configs/env';

const AUTH_STATUS = {
  CHECKING: 'checking',
  AUTHENTICATED: 'authenticated',
  UNAUTHENTICATED: 'unauthenticated',
};

const PUBLIC_PATHS = new Set(['/login', '/error', '/notfound', '/access']);

const clearAuthStorage = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('refreshToken');
  localStorage.removeItem('userId');
  localStorage.removeItem('user');
  sessionStorage.removeItem('isLoggedIn');
};

const AppWrapper = () => {
  const location = useLocation();
  const [authStatus, setAuthStatus] = useState(AUTH_STATUS.CHECKING);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const languageFromQuery = params.get('sl');

    if (languageFromQuery) {
      localStorage.setItem('sl', languageFromQuery);
    }
  }, [location.search]);

  useEffect(() => {
    let isMounted = true;
    const token = localStorage.getItem('token');
    const isPublicPath = PUBLIC_PATHS.has(location.pathname);
    const hasLoginSession = sessionStorage.getItem('isLoggedIn') === 'true';

    const validateToken = async (showBlockingLoader) => {
      if (!token) {
        if (isMounted) {
          setAuthStatus(AUTH_STATUS.UNAUTHENTICATED);
        }
        return;
      }

      if (isMounted && showBlockingLoader) {
        setAuthStatus(AUTH_STATUS.CHECKING);
      }

      try {
        const response = await axios.post(
          `${env.JWT_BACK_URL}/adm/services/checkJwt`,
          {},
          {
            headers: { Authorization: `Bearer ${token}` },
            timeout: 5000,
          }
        );

        if (!isMounted) {
          return;
        }

        if (response.status === 200) {
          sessionStorage.setItem('isLoggedIn', 'true');
          setAuthStatus(AUTH_STATUS.AUTHENTICATED);
          return;
        }

        clearAuthStorage();
        setAuthStatus(AUTH_STATUS.UNAUTHENTICATED);
      } catch (error) {
        console.error(error);

        if (!isMounted) {
          return;
        }

        clearAuthStorage();
        setAuthStatus(AUTH_STATUS.UNAUTHENTICATED);
      }
    };

    if (isPublicPath && !token) {
      setAuthStatus(AUTH_STATUS.UNAUTHENTICATED);
    } else if (token && hasLoginSession) {
      setAuthStatus(AUTH_STATUS.AUTHENTICATED);
      validateToken(false);
    } else {
      validateToken(true);
    }

    window.scrollTo(0, 0);

    return () => {
      isMounted = false;
    };
  }, [location.pathname, location.search]);

  const isAuthenticated = authStatus === AUTH_STATUS.AUTHENTICATED;
  const isChecking = authStatus === AUTH_STATUS.CHECKING;

  const protectedAppElement = isChecking
    ? null
    : isAuthenticated
      ? <App />
      : <Navigate to="/login" replace />;

  const loginElement = isChecking
    ? null
    : isAuthenticated
      ? <Navigate to="/" replace />
      : <Login />;

  return (
    <Routes>
      <Route path="/login" element={loginElement} />
      <Route path="/error" element={<Error />} />
      <Route path="/notfound" element={<NotFound />} />
      <Route path="/access" element={<Access />} />
      <Route path="/" element={protectedAppElement} />
      <Route path="*" element={protectedAppElement} />
    </Routes>
  );
};

export default AppWrapper;
