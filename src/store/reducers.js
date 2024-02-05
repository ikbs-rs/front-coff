import {
    SET_LANGUAGE,
    SET_THEME,
    SET_OBJECT
} from './types';

const initialState = {
    selectedLanguage: 'en',
    theme: 'light',
};

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case SET_LANGUAGE:
            return {
                ...state,
                selectedLanguage: action.payload
            };
        case SET_THEME:
            return {
                ...state,
                theme: action.payload,
            };
        case SET_OBJECT:
            return {
                ...state,
                myObject: action.payload,
            };
        default:
            return state;
    }
};

export default reducer;
