import { createContext, useContext, useEffect, useState } from 'react';
import * as Constants from '../utils/Constants';

const ThemeContext = createContext(Constants.THEME_LIGHT);

export function useTheme() {
    return useContext(ThemeContext);
}

export function ThemeProvider({ children }) {

    //states
    const [theme, setTheme] = useState('');

    useEffect(() => {

        // Access fromPage from session storage
        var themeFromSession = localStorage.getItem(Constants.SESSION_THEME);
        if (themeFromSession == null) {
            //initialize as light
            themeFromSession = Constants.THEME_LIGHT;
            // Update session storage
            setLocalStorage(themeFromSession);
        }

        //console.log("themfromSession", themeFromSession);
        setTheme(themeFromSession);

    }, []); //No dependency to trigger in each page load

    const setLocalStorage = (value) => {
        localStorage.setItem(Constants.SESSION_THEME, value);
    }

    const toggleTheme = () => {
        setTheme((curr) => curr === Constants.THEME_LIGHT ? Constants.THEME_DARK : Constants.THEME_LIGHT);
        setLocalStorage(theme === Constants.THEME_LIGHT ? Constants.THEME_DARK : Constants.THEME_LIGHT);
    }

    const value = { theme, toggleTheme };
    return (
        <ThemeContext.Provider value={value}>
            {children}
        </ThemeContext.Provider>
    )

}