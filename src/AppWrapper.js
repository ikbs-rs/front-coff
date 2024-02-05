import React, { useEffect, useState } from 'react';
import { Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import App from './App';
import { Login } from './pages/Login';
import { Error } from './pages/Error';
import { NotFound } from './pages/NotFound';
import { Access } from './pages/Access';
import axios from 'axios';
import env from "./configs/env"


const AppWrapper = (props) => {
    let location = useLocation(); 
    const navigate = useNavigate();    
    let [isLoggedIn, setIsLoggedIn] = useState(true);
    const search = window.location.search;
    const params = new URLSearchParams(search);
    const sl = params.get('sl');
    localStorage.setItem('sl', sl||"en")

    useEffect(() => {
      const token = localStorage.getItem('token');      
      // proveri da li postoji token i da li je validan
      if (token && token.length > 0) {
        // ovde mozete dodati kod za proveru da li je token validan
        axios
         .post(`${env.JWT_BACK_URL}/adm/services/checkJwt`,
         {},
        {
          headers: { Authorization: `Bearer ${token}` },
          timeout: 5000, // vreme za koje se očekuje odgovor od udaljenog servera (u milisekundama)
        }
        )
         .then((response) => {
           isLoggedIn = response.status === 200; // Ako je status 200, isLoggedIn će biti true
           if (isLoggedIn) {
             //TODO idi na pocetnu stranicu
             setIsLoggedIn(true);
            // navigate('/');
           } else {
             //TODO vrati se na login
             navigate('/login');
           }
         })
         .catch((error) => {
           console.error(error);
           isLoggedIn = false; // Ako se dogodila pogreška, isLoggedIn će biti false
           //TODO vrati se na login
         }); 
      } else {
        setIsLoggedIn(false);
      }
      window.scrollTo(0, 0);
    }, []);



    return (
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/error" element={<Error />} />
        <Route path="/notfound" element={<NotFound />} />
        <Route path="/access" element={<Access />} />
        {isLoggedIn ? (
          <Route path="*" element={<App />} />
        ) : (
          <Route path="*" element={<Login />} />
        )}
      </Routes>
    );
  };

export default AppWrapper;
