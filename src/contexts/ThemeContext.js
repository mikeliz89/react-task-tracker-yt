import { createContext, useContext, useState } from 'react';

const ThemeContext = createContext("light");

export function useTheme() {
    return useContext(ThemeContext);
}

export function ThemeProvider({ children }) {

    //states
    const [theme, setTheme] = useState("light"); //default = light

    const toggleTheme = () => {
        setTheme((curr) => curr === "light" ? "dark" : "light")
    }

    const value = { theme, toggleTheme };
    return (
        <ThemeContext.Provider value={value}>
            {children}
        </ThemeContext.Provider>
    )

}