import React, { createContext, useEffect, useState } from "react";

export const ThemeContext = createContext()


export default function ThemeProvider({children}) {
    const [themeConver, setThemeConver] = useState(() => {
        let check = localStorage.getItem("themeConver")
        if (!check) {
            localStorage.setItem("themeConver", "default")
            return "default"
        }
        return check
    })

    const [theme, setTheme] = useState(() => {
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

    useEffect(() => {
        localStorage.setItem("themeConver", themeConver)
    }, [themeConver])
    

    const ToggleTheme = () => {
        setTheme(theme === "dark" ? "light" : "dark")
    }

    const value = {
        theme,
        toggle: ToggleTheme,
        themeConver,
        setThemeConver
    }

    return (
        <ThemeContext.Provider value={value}>
            {children}
        </ThemeContext.Provider>
    )
}

