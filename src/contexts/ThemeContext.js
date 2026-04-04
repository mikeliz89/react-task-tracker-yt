import { createContext, useContext, useEffect, useState } from 'react';
import { THEMES, SESSIONSTORAGE } from '../utils/Constants';

const ThemeContext = createContext(THEMES.LIGHT);

export function useTheme() {
    return useContext(ThemeContext);
}

export function ThemeProvider({ children }) {

    //states
    const [theme, setTheme] = useState(THEMES.LIGHT);

    useEffect(() => {

        // Access fromPage from session storage
        const allowedThemes = Object.values(THEMES);
        var themeFromSession = localStorage.getItem(SESSIONSTORAGE.THEME);
        if (themeFromSession == null || !allowedThemes.includes(themeFromSession)) {
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
        const orderedThemes = [THEMES.LIGHT, THEMES.DARK];
        setTheme((curr) => {
            const currentIndex = orderedThemes.indexOf(curr);
            const nextTheme = orderedThemes[(currentIndex + 1) % orderedThemes.length];
            setLocalStorage(nextTheme);
            return nextTheme;
        });
    }

    const value = { theme, toggleTheme };
    return (
        <ThemeContext.Provider value={value}>
            {children}
        </ThemeContext.Provider>
    )

}