import React, { createContext, useContext, useEffect, useState } from "react";

type Theme = "dark" | "light";

interface ThemeContextType {
    theme: Theme;
    toggleTheme: () => void;
    setTheme: (theme: Theme) => void;
}

// creating context

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const THEME_STORAGE_KEY = "theme_preference";

export const ThemeProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
    const [theme, setThemeState] = useState<Theme>(() => {
        // check local storage

        const savedTheme = localStorage.getItem(THEME_STORAGE_KEY) as Theme | null;
        if(savedTheme){
            return savedTheme;
        }

        // Fallback to system preference

        const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        return systemPrefersDark ? 'dark' : 'light';
    });

    //apply theme to DOM

    useEffect(() => {
        const root = document.documentElement;

        if(theme === 'dark') {
            root.classList.add('dark')
        } else {
            root.classList.remove('dark')
        }

        //save to local storage
        localStorage.setItem(THEME_STORAGE_KEY, theme);
    }, [theme])

    // Listen to system preference changes

    useEffect(() => {
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

        const handleChange = (e: MediaQueryListEvent) => {
            // only update if user hasn't set preference
            const savedTheme = localStorage.getItem(THEME_STORAGE_KEY);
            if(!savedTheme) {
                setThemeState(e.matches ? 'dark' : 'light')
            }
        };

        mediaQuery.addEventListener('change', handleChange);

        return () => mediaQuery.removeEventListener('change', handleChange)
    }, []);

    const toggleTheme = () => {
        setThemeState((prev) => prev === 'light' ? 'dark' : 'light')
    }

    const setTheme = (newTheme: Theme) => {
        setThemeState(newTheme);
    }   

    const value: ThemeContextType = {
        theme,
        toggleTheme,
        setTheme
    } 

    return (
        <ThemeContext.Provider value={value}>
            {children}
        </ThemeContext.Provider>
    )
}

// custom hook for using theme

export const useTheme = () : ThemeContextType => {
    const context = useContext(ThemeContext);

    if(context === undefined){
        throw new Error('useTheme must be used within a theme provider.')
    }

    return context;
}