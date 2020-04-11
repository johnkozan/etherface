import React from 'react';

export const AppTemplateStore = React.createContext();

Object.filter = (obj, predicate) =>
  Object.keys(obj)
    .filter( key => predicate(obj[key]) )
    .reduce( (res, key) => (res[key] = obj[key], res), {} );

const initialState = {};

function reducer(state, action) {
  switch (action.type) {
    case 'LOAD_TEMPLATE':
      // TODO: validate JSON
      let tabs = {};
      let pages = {};
      let components = {};
      let integrations = {};

      // Flatten components, pages and tabs
      action.payload.tabs && action.payload.tabs.forEach((tab, tabKey) => {
        tabs[tabKey] = {...tab, __id: tabKey};
        tab.pages.forEach((page, pageKey)  => {
          pages[pageKey] = {...page, __id: pageKey, __tab_id: tabKey};
          page.components.forEach((component, componentKey) => {
            components[componentKey] = {...component, __id: componentKey, __page_id: pageKey};
          });
          delete pages[pageKey].components;
        });
        delete tabs[tabKey].pages;
      });

      action.payload.integrations && action.payload.integrations.forEach((integration, integrationKey) =>
        integrations[integrationKey] = {...integration, __id: integrationKey}
      );

      return {
        name: action.payload.name,
        // TODO: and other top level keys...
        tabs,
        pages,
        components,
        integrations,
      };

    case 'ADD_INTEGRATION':
      return { ...state, integrations: [...state.integrations, action.payload] };

    case 'EDIT_COMPONENT':
      return {
        ...state,
        components: {
          ...state.components,
          [action.payload.__id]: {
            ...state.components[action.payload.__id],
            ...action.payload,
          },
        },
      };

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

export const usePagesByTabId = (tabId) => {
  const { state } = React.useContext(AppTemplateStore);
  const { pages } = state;
  return Object.filter(pages, p => p.__tab_id === tabId);
}

export const useComponentsByPageId = (pageId) => {
  const { state } = React.useContext(AppTemplateStore);
  const { components } = state;
  return Object.filter(components, p => p.__page_id === pageId);
}

