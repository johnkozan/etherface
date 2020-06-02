import React from 'react';

import localstorage from '../lib/localstorage';


export function reducer(state, action) {
  switch (action.type) {

    case 'LOAD_SETTINGS':
      return {
        ...state,
        ...action.payload,
      };

    case 'SET_SETTING':
      return {
        ...state,
        [action.payload.setting]: action.payload.value,
      };

    default:
      return state;
  }
}

const initialState = {
  settings: {},
};

export const SettingsStore = React.createContext();

export const SettingsProvider = ({ children }) => {
  const [state, dispatch] = React.useReducer(reducer, initialState);

  return <SettingsStore.Provider value={{state, dispatch}}>
    { children }
  </SettingsStore.Provider>;
};

export const useSettings = () => {
  const { state, dispatch } = React.useContext(SettingsStore);

  function loadSettings() {
    const settings = localstorage.loadSettings();
    console.log('LOADED SETTINGS: ', settings);
    dispatch({ type: 'LOAD_SETTINGS', payload: settings});
  }

  function setSetting(setting, value) {
    console.log('SETTTING>>> ', setting, value);
    localstorage.setSetting(setting, value);
    dispatch({ type: 'SET_SETTING', payload: {setting, value}});
  }

  return { settings: state, loadSettings, setSetting };
};


