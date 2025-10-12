import { createContext, useContext, useEffect, useState } from 'react';
import { THEMES, SESSIONSTORAGE } from '../utils/Constants';

const ThemeContext = createContext(THEMES.LIGHT);

export function useTheme() {
    return useContext(ThemeContext);
}

export function ThemeProvider({ children }) {

    //states
    const [theme, setTheme] = useState('');

    useEffect(() => {

        // Access fromPage from session storage
        var themeFromSession = localStorage.getItem(SESSIONSTORAGE.THEME);
        if (themeFromSession == null) {
            //initialize as light
            themeFromSession = THEMES.LIGHT;
            // Update session storage
            setLocalStorage(themeFromSession);
        }

        //console.log("themfromSession", themeFromSession);
        setTheme(themeFromSession);

    }, []); //No dependency to trigger in each page load

    const setLocalStorage = (value) => {
        localStorage.setItem(SESSIONSTORAGE.THEME, value);
    }

    const toggleTheme = () => {
        setTheme((curr) => curr === THEMES.LIGHT ? THEMES.DARK : THEMES.LIGHT);
        setLocalStorage(theme === THEMES.LIGHT ? THEMES.DARK : THEMES.LIGHT);
    }

    const value = { theme, toggleTheme };
    return (
        <ThemeContext.Provider value={value}>
            {children}
        </ThemeContext.Provider>
    )

}