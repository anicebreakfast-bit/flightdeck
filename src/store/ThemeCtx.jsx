import { createContext, useState, useReducer } from "react";

export const ThemeContext = createContext({
    theme: 'light', 
    toggleTheme: () => {},
}); 

function reducer(state, action) {
  switch (action.type) {
    case "UPDATE_THEME":
      return {
        theme: state.theme === "light" ? "dark" : "light"
      };
    default:
      return state;
  }
}
  
export default function ThemeContextProvider({ children }){ 
    const [state, dispatch] = useReducer(reducer, { 
        theme: 'light',
        
    });

    function toggleTheme() {
        dispatch({
            type: 'UPDATE_THEME',
        }); 
    }
 
    const ctxValue = {
        theme: state.theme, 
        toggleTheme 
    }
     
    return(
        <ThemeContext.Provider value={ctxValue}>
            { children }
        </ThemeContext.Provider>
    )
}