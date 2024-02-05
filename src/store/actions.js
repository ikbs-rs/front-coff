import {
    SET_LANGUAGE,
    SET_THEME,
    SET_OBJECT
} from './types';

export const setLanguage = (language) => {
    return {
        type: SET_LANGUAGE,
        payload: language
    }
};

export const setTheme = (theme) => {
    return {
        type: SET_THEME,
        payload: theme,
    };

};

export const setObject = (code, name) => {
    return {
        type: SET_OBJECT,
        payload: {
            code,
            name,
        },
    };
};