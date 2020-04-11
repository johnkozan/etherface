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



// Serialize internal structure to json.
// TODO:  Remove __fields
export const useExportTemplate = () => {
  const { state } = React.useContext(AppTemplateStore);
  const { tabs, pages, components, integrations } = state;

  return function(template) {
    let serializedTemplate = Object.assign({}, template, {tabs: [], integrations: []});
    Object.keys(tabs).forEach(tabKey => {
      let tab = tabs[tabKey];
      tab.pages = [];
      let tab_pages = Object.filter(pages, p => p.__tab_id === tab.__id);
      Object.keys(tab_pages).forEach(pageKey => {
        let page = pages[pageKey];
        page.components = [];
        let page_components = Object.filter(components, f => f.__page_id === page.__id);
        Object.keys(page_components).forEach(componentKey => {
          page.components.push(components[componentKey]);
        });
        tab.pages.push(page);
      });
      serializedTemplate.tabs.push(tab);
    });

    Object.keys(integrations).forEach(integrationKey => {
      serializedTemplate.integrations.push(integrations[integrationKey])
    });

    return serializedTemplate;
  };
};
