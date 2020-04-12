import React from 'react';
import slugify from 'slugify';

export const AppTemplateStore = React.createContext();

Object.filter = (obj, predicate) =>
  Object.keys(obj)
    .filter( key => predicate(obj[key]) )
    .reduce( (res, key) => (res[key] = obj[key], res), {} );

const initialState = {
  __loaded: false,
};

function maxId(objs) {
  let max = 0;
  Object.keys(objs).forEach(key => {
    if (objs[key].__id > max) { max = objs[key].__id; }
  });
  return max;
}

function nextId(objs) {
  return maxId(objs) + 1;
}

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
        integrations[integrationKey] = {
          ...integration,
          __id: integrationKey,
          __connected: false,
        }
      );

      return {
        name: action.payload.name,
        // TODO: and other top level keys...
        tabs,
        pages,
        components,
        integrations,
        __loaded: true,
      };

    case 'ADD_TAB':
      // Need to get max ID from tabs
      const tabId = nextId(state.tabs);
      if (!action.payload.name) { throw new Error('Name required'); }
      const slug = slugify(action.payload.name);

      // Create a first page for the tab
      const pageId = nextId(state.pages);
      const firstPage = {
        __id: pageId,
        __tab_id: tabId,
      };

      return {
        ...state,
        tabs: {
          ...state.tabs,
          [tabId]: {
            ...action.payload,
            __id: tabId,
            slug,
          },
        },
        pages: {
          ...state.pages,
          [pageId]: firstPage,
        },
      };

    case 'DELETE_TAB':
      return {
        ...state,
        tabs: Object.filter(state.tabs, t => t.__id !== action.payload.__id),
      };


    case 'ADD_INTEGRATION':
      const integrationId = nextId(state.integrations);
      return {
        ...state,
        integrations: {
          ...state.integrations,
          [integrationId]: {
            ...action.payload,
            __id: integrationId,
          },
        },
      };

    case 'DELETE_INTEGRATION':
      return {
        ...state,
        integrations: Object.filter(state.integrations, i => i.__id !== action.payload.__id),
      };

    case 'CONNECT_INTEGRATION':
      return {
        ...state,
        integrations: {
          ...state.integrations,
          [action.payload.__id]: {
            ...action.payload,
            __connected: true,
          },
        },
      };

    case 'ADD_COMPONENT':
      if (action.payload.__page_id === undefined) { throw new Error('Page id required on component'); }
      // TODO: ensure page_id actually exists also??
      const componentId = nextId(state.components);
      return {
        ...state,
        components: {
          ...state.components,
          [componentId]: {
            ...action.payload,
            __id: componentId,
          },
        },
      };

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
};

export const useComponentsByPageId = (pageId) => {
  const { state } = React.useContext(AppTemplateStore);
  const { components } = state;
  return Object.filter(components, p => p.__page_id === pageId);
};

export const useIntegration = (type, endpoint) => {
  const { state } = React.useContext(AppTemplateStore);
  const { integrations } = state;

  console.log('INTEGRATIONS::: ', integrations);
  const integration = integrations[Object.keys(Object.filter(integrations, i => i.type === type && i.endpoint === endpoint))[0]];
  if (!integration || !integration.__connected) { return; }

  return integration.__instance;
};


function filterInternalFields(obj) {
  let copy = Object.assign({}, obj);
  Object.keys(obj).forEach(key => {
    if (key.substr(0,2) === '__') {
      delete copy[key];
    }
  });
  return copy;
}

// Serialize internal structure to json.
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
          page.components.push(filterInternalFields(components[componentKey]));
        });
        tab.pages.push(filterInternalFields(page));
      });
      serializedTemplate.tabs.push(filterInternalFields(tab));
    });

    Object.keys(integrations).forEach(integrationKey => {
      serializedTemplate.integrations.push(filterInternalFields(integrations[integrationKey]))
    });

    console.log('SERIALIED:::: ', serializedTemplate);
    return serializedTemplate;
  };
};
