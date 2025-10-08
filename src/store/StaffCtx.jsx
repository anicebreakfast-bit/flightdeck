import { createContext, useReducer } from "react";
 
export const StaffContext = createContext(null);

const initialCounts = { 
    GND: 2, 
    TWR: 2, 
    APP: 1, 
    DEP: 2 
};

const initialState = { counts: initialCounts };

function reducer(state, action) {
  switch (action.type) {
    case "ADD_STAFF":
      return {
        ...state,
        counts: {
          ...state.counts,
          [action.role]: (state.counts[action.role] ?? 0) + 1,
        },
      };
    case "DECREASE_STAFF":
      return {
        ...state,
        counts: {
          ...state.counts,
          [action.role]: Math.max(0, (state.counts[action.role] ?? 0) - 1),
        },
      };
    case "RESET":
      return {
        ...state,
        counts: { ...state.counts, [action.role]: 0 },
      };
    case "RESET_ALL":
      return { ...state, counts: { GND: 0, TWR: 0, APP: 0, DEP: 0 } };
    default:
      return state;
  }
}

export default function StaffContextProvider({ children }) { 
    const [state, dispatch] = useReducer(reducer, initialState);

    function handleAddStaff(role) {
        dispatch({
            type: 'ADD_STAFF',
            role
        }); 
    }

    function handleDecreaseStaff(role) {
        dispatch({
            type: 'DECREASE_STAFF',
            role
        }); 
    }


    function handleResetStaff(role) {
        dispatch({
            type: 'RESET',
            role
        }); 
    }

    function handleResetStaffAll() {
        dispatch({
            type: 'RESET_ALL',
        }); 
    }
 

    const value = {
        staffCountByRole: state.counts,
        handleAddStaff,
        handleDecreaseStaff,
        handleResetStaff, 
        handleResetStaffAll
    };

    return (
    <StaffContext.Provider value={value}>
        {children}
    </StaffContext.Provider>
    );
}
