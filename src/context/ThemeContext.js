import React, { createContext, useState } from "react";

export const ThemeContext = createContext()


export default function ThemeProvider({children}) {
    const [theme, setTheme] = useState("light")

    const ToggleTheme = () => {
        setTheme(theme === "dark" ? "light" : "dark")
    }

    const value = {
        theme,
        toggle: ToggleTheme
    }

    return (
        <ThemeContext.Provider value={value}>
            {children}
        </ThemeContext.Provider>
    )
}

