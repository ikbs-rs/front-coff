import React, { useEffect, useState } from 'react';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Checkbox } from 'primereact/checkbox';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import env from '../configs/env';
import { useDispatch } from 'react-redux';
import { setLanguage } from '../store/actions';
import { translations } from '../configs/translations';

const DEFAULT_LANGUAGE = 'en';

const LOGIN_COPY = {
    en: {
        welcome: 'Welcome, use the form to sign in to the EMS network',
        username: 'Username',
        password: 'Password',
        language: 'Language',
        rememberMe: 'Remember me',
        signIn: 'Sign in',
    },
    sr_lat: {
        welcome: 'Dobrodošli, koristite formular za prijavu na EMS mrežu',
        username: 'Korisnik',
        password: 'Lozinka',
        language: 'Jezik',
        rememberMe: 'Zapamti me',
        signIn: 'Prijavite se',
    },
    sr_cyr: {
        welcome: 'Добродошли, користите формулар за пријаву на ЕМС мрежу',
        username: 'Корисник',
        password: 'Лозинка',
        language: 'Језик',
        rememberMe: 'Запамти ме',
        signIn: 'Пријавите се',
    },
    fr: {
        welcome: "Bienvenue, utilisez le formulaire pour vous connecter au reseau EMS",
        username: "Utilisateur",
        password: "Mot de passe",
        language: 'Langue',
        rememberMe: 'Se souvenir de moi',
        signIn: 'Se connecter',
    },
    de: {
        welcome: 'Willkommen, verwenden Sie das Formular zur Anmeldung im EMS-Netzwerk',
        username: 'Benutzer',
        password: 'Passwort',
        language: 'Sprache',
        rememberMe: 'Angemeldet bleiben',
        signIn: 'Anmelden',
    },
};

const LANGUAGE_OPTIONS = [
    { value: 'en', label: 'English' },
    { value: 'sr_cyr', label: 'Српски (ћирилица)' },
    { value: 'sr_lat', label: 'Srpski (latinica)' },
    { value: 'fr', label: 'French' },
    { value: 'de', label: 'German' },
];

const getLoginCopy = (language) => LOGIN_COPY[language] || LOGIN_COPY.sr_cyr;

const isSuccessfulLoginResponse = (response) => response?.status === 200;

const persistLoginSession = (responseData, selectedLanguage) => {
    localStorage.setItem('token', responseData.token);
    localStorage.setItem('refreshToken', responseData.refreshToken);
    localStorage.setItem('userId', responseData.userId);
    localStorage.setItem('sl', selectedLanguage || DEFAULT_LANGUAGE);
    sessionStorage.setItem('isLoggedIn', 'true');
};

export const Login = () => {
    const [checked, setChecked] = useState(false);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [selectedLanguage, setSelectedLanguageState] = useState(localStorage.getItem('sl') || DEFAULT_LANGUAGE);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    useEffect(() => {
        dispatch(setLanguage(selectedLanguage));
    }, [dispatch, selectedLanguage]);

    const translate = (key) => {
        const fallbackCopy = getLoginCopy(selectedLanguage);
        const baseTranslations = translations[selectedLanguage] || translations[DEFAULT_LANGUAGE] || {};

        switch (key) {
            case 'username':
                return baseTranslations.User || baseTranslations.Username || fallbackCopy.username;
            case 'password':
                return fallbackCopy.password;
            case 'language':
                return fallbackCopy.language;
            case 'rememberMe':
                return fallbackCopy.rememberMe;
            case 'signIn':
                return fallbackCopy.signIn;
            case 'welcome':
            default:
                return fallbackCopy.welcome;
        }
    };

    const handleLanguageChange = (event) => {
        const nextLanguage = event.target.value;
        setSelectedLanguageState(nextLanguage);
        localStorage.setItem('sl', nextLanguage);
    };

    const handleLogin = async () => {
        const requestData = {
            username,
            password,
        };
        const url = `${env.JWT_BACK_URL}/adm/services/sign/in`;

        setIsSubmitting(true);

        try {
            const response = await axios.post(url, requestData);

            // Kriticna tacka: samo eksplicitni HTTP 200 tretiramo kao uspesno logovanje.
            if (!isSuccessfulLoginResponse(response)) {
                navigate('/login');
                return;
            }

            persistLoginSession(response.data, selectedLanguage);
            navigate('/');
        } catch (error) {
            console.error(error);
            navigate('/login');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="login-body">
            <div className="card login-panel p-fluid">
                <div className="login-panel-content">
                    <div className="grid">
                        <div className="col-12 sm:col-8 md:col-8 logo-container">
                            {/* <img src="start/assets/layout/images/logo-tl.png" alt="Ticketline" style={{ width: "155.88px", height: "46.25px" }}/> */}
                            <img src="assets/layout/images/logo-tl.png" alt="Ticketline" style={{ height: "150px" }}/>
                            <span className="guest-sign-in">{translate('welcome')}</span>
                        </div>
                        <div className="col-12 username-container">
                            <label htmlFor="input">{translate('username')}</label>
                            <div className="login-input">
                                <InputText
                                    id="input"
                                    type="text"
                                    value={username}
                                    onChange={(event) => setUsername(event.target.value)}
                                    autoComplete="username"
                                />
                            </div>
                        </div>
                        <div className="col-12 password-container">
                            <label htmlFor="password-input">{translate('password')}</label>
                            <div className="login-input">
                                <InputText
                                    id="password-input"
                                    type="password"
                                    value={password}
                                    onChange={(event) => setPassword(event.target.value)}
                                    autoComplete="current-password"
                                    onKeyDown={(event) => {
                                        if (event.key === 'Enter') {
                                            handleLogin();
                                        }
                                    }}
                                />
                            </div>
                        </div>
                        <div className="col-12 language-container">
                            <label htmlFor="language-input">{translate('language')}</label>
                            <div className="login-input">
                                <select id="language-input" onChange={handleLanguageChange} value={selectedLanguage}>
                                    {LANGUAGE_OPTIONS.map((option) => (
                                        <option key={option.value} value={option.value}>
                                            {option.label}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                        <div className="col-12 sm:col-6 md:col-6 rememberme-container">
                            <Checkbox checked={checked} onChange={(e) => setChecked(e.checked)} />
                            <label> {translate('rememberMe')}</label>
                        </div>

                        {/* <div className="col-12 sm:col-6 md:col-6 forgetpassword-container">
                            <a href="/" className="forget-password">
                                Forget Password
                            </a>
                        </div> */}

                        <div className="col-12 sm:col-6 md:col-6">
                            <Button
                                label={translate('signIn')}
                                icon="pi pi-check"
                                onClick={handleLogin}
                                loading={isSubmitting}
                                disabled={isSubmitting}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
