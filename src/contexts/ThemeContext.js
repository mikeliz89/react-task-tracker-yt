import { createContext, useContext, useState } from 'react';

const THEME_LIGHT = 'light';
const THEME_DARK = 'dark';

const ThemeContext = createContext(THEME_LIGHT);

export function useTheme() {
    return useContext(ThemeContext);
}

export function ThemeProvider({ children }) {

    //states
    const [theme, setTheme] = useState(THEME_LIGHT); //default = light

    const toggleTheme = () => {
        setTheme((curr) => curr === THEME_LIGHT ? THEME_DARK : THEME_LIGHT)
    }

    const value = { theme, toggleTheme };
    return (
        <ThemeContext.Provider value={value}>
            {children}
        </ThemeContext.Provider>
    )

}