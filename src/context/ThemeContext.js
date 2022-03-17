import React, { createContext, useEffect, useState } from "react";

export const ThemeContext = createContext()


export default function ThemeProvider({children}) {
    // const [theme, setTheme] = useState("light")

    let [theme, setTheme] = useState(() => {
        let check = localStorage.getItem("theme")
        if (!check) {
            localStorage.setItem("theme", "light")
            return "light"
        }
        return check
    })

    useEffect(() => {
        localStorage.setItem("theme", theme)
    }, [theme])
    

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

