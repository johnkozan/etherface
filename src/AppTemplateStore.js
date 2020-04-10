import React from 'react';

export const AppTemplateStore = React.createContext();

const initialState = {};

function reducer(state, action) {
  switch (action.type) {
    case 'LOAD_TEMPLATE':
      return action.payload;

    case 'ADD_INTEGRATION':
      return { ...state, integrations: [...state.integrations, action.payload] };

    default:
      return state;
  }

}

export const AppTemplateProvider = ({ children }) => {
  const [state, dispatch] = React.useReducer(reducer, initialState);

  return <AppTemplateStore.Provider value={{state, dispatch}}>
    { children }
  </AppTemplateStore.Provider>;
};

export const useAppTemplate = () => {
  const { state } = React.useContext(AppTemplateStore);
  return state;
};
