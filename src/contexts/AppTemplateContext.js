import React, { useRef, useMemo } from 'react';
import slugify from 'slugify';
import { useToasts } from 'react-toast-notifications'

import localstorage from 'lib/localstorage';

export const AppTemplateStore = React.createContext();

Object.filter = (obj, predicate) =>
  Object.keys(obj)
    .filter( key => predicate(obj[key]) )
    .reduce( (res, key) => (res[key] = obj[key], res), {} );

const initialState = {
  settings: {},
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
  if (Object.keys(objs).length === 0) { return 0; }
  return maxId(objs) + 1;
}

export function reducer(state, action) {
  switch (action.type) {
    case 'LOAD_TEMPLATE':
      // TODO: validate JSON
      let tabs = {};
      let pages = {};
      let components = {};
      let integrations = {};
      let addresses = [];

      // Flatten components, pages and tabs
      action.payload.tabs && action.payload.tabs.forEach((tab) => {
        const tabId = nextId(tabs);
        tabs[tabId] = {...tab, __id: tabId};
        tab.pages.forEach((page)  => {
          const pageId = nextId(pages);
          pages[pageId] = {...page, __id: pageId, __tab_id: tabId};
          page.components.forEach((component) => {
            const componentId = nextId(components);
            components[componentId] = {...component, __id: componentId, __page_id: pageId};
          });
          delete pages[pageId].components;
        });
        delete tabs[tabId].pages;
      });

      action.payload.integrations && action.payload.integrations.forEach((integration, integrationKey) =>
        integrations[integrationKey] = {
          ...integration,
          __id: integrationKey,
          __connected: false,
        }
      );

      addresses = action.payload.addresses || [];

      return {
        ...state,
        name: action.payload.name,
        // TODO: and other top level keys...
        tabs,
        pages,
        components,
        integrations,
        addresses,
        __loaded: true,
        __version: 0,
      };

    case 'ADD_TAB': {
      const tabId = nextId(state.tabs);
      // TODO: Move validation error throwing to action creator
      if (!action.payload.name) { throw new Error('Name required'); }
      const slug = slugify(action.payload.name);

      // Create a first page for the tab
      const pageId = nextId(state.pages);
      const firstPage = {
        __id: pageId,
        __tab_id: tabId,
        title: action.payload.title,
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
        __version: state.__version + 1,
      };
    }

    case 'EDIT_TAB':
      return {
        ...state,
        tabs: {
          ...state.tabs,
          [action.payload.__id]: {
            ...state.tabs[action.payload.__id],
            ...action.payload,
          },
        },
        __version: state.__version + 1,
      };

    case 'DELETE_TAB':
      // TODO: Need to delete Pages and Tabs also
      return {
        ...state,
        tabs: Object.filter(state.tabs, t => t.__id !== action.payload.__id),
        __version: state.__version + 1,
      };

    case 'ADD_PAGE': {
      if (action.payload.__tab_id === undefined) { throw new Error('page requires tab id'); }
      const pageId = nextId(state.pages);

      return {
        ...state,
        pages: {
          ...state.pages,
          [pageId]: {
            ...action.payload,
            __id: pageId,
          },
        },
        __version: state.__version + 1,
      };
    }

    case 'EDIT_PAGE':
      return {
        ...state,
        pages: {
          ...state.pages,
          [action.payload.__id]: {
            ...state.pages[action.payload.__id],
            ...action.payload,
          },
        },
        __version: state.__version + 1,
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
        __version: state.__version + 1,
      };

    case 'DELETE_INTEGRATION':
      return {
        ...state,
        integrations: Object.filter(state.integrations, i => i.__id !== action.payload.__id),
        __version: state.__version + 1,
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
      //TODO: move valiation to action creator
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
        __version: state.__version + 1,
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
        __version: state.__version + 1,
      };

    case 'DELETE_COMPONENT':
      return {
        ...state,
        components: Object.filter(state.components, c => c.__id !== action.payload.__id),
        __version: state.__version + 1,
      };

    case 'ADD_ADDRESS':
      return {
        ...state,
        // TODO:: Ensure address doesn't already exist
        addresses: [...state.addresses, action.payload],
        __version: state.__version + 1,
      };

    case 'DELETE_ADDRESS':
      return {
        ...state,
        addresses: state.addresses.filter(a => (a.address !== action.payload.address && a.network !== action.payload.network)),
        __version: state.__version + 1,
      };

    case 'LOAD_SETTINGS':
      return {
        ...state,
        settings: action.payload,
      };

    case 'SET_SETTING':
      return {
        ...state,
        settings: {
          ...state.settings,
          [action.payload.setting]: action.payload.value,
        },
      };

    default:
      return state;
  }

}

export const AppTemplateProvider = ({ children }) => {
  const [state, dispatch] = React.useReducer(reducer, initialState);
  const { addToast } = useToasts();

  // TODO: React warning about updating during state transition
  function autoSave() {
    const exportedTemplate = serializeTemplate(state);
    localstorage.saveAppTemplate(exportedTemplate);
    addToast('Autosaved to localstorage', {apperance: 'success', autoDismiss: true, autoDismissTimeout: 3000});
  }

  // Autosave on changes to template
  useMemo(() => {
    if (state.__version && state.__version > 0) {
      if (state.settings.autosave) {
        autoSave();
      }
    }
  }, [state.__version]);

  return <AppTemplateStore.Provider value={{state, dispatch}}>
    { children }
  </AppTemplateStore.Provider>;
};

export const useAppTemplate = () => {
  const { state } = React.useContext(AppTemplateStore);
  return state;
};

export const useAddresses = () => {
  const { state } = React.useContext(AppTemplateStore);
  return state.addresses;
};

export const useAddress = (address, network) => {
  const { state } = React.useContext(AppTemplateStore);
  return state.addresses.find(a => a.address === address && a.network === network);
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

//export const useDebugState = () => {
//const { state } = React.useContext(AppTemplateStore);
//console.log('DATA STATE: ', state);
//};

export const useIntegration = (type, endpoint) => {
  const { state } = React.useContext(AppTemplateStore);
  const { integrations } = state;

  const integration = integrations[Object.keys(Object.filter(integrations, i => i.type === type && i.endpoint === endpoint))[0]];
  if (!integration || !integration.__connected) { return; }

  return integration;
};

export const useSettings = () => {
  const { state } = React.useContext(AppTemplateStore);
  return state.settings;
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

export function serializeTemplate(template) {
  let serializedTemplate = {tabs: [], integrations: [], addresses: []};
  Object.keys(template.tabs).forEach(tabKey => {
    let tab = {...template.tabs[tabKey], pages: []};
    let tab_pages = Object.filter(template.pages, p => p.__tab_id === tab.__id);
    Object.keys(tab_pages).forEach(pageKey => {
      let page = tab_pages[pageKey];
      page.components = [];
      let page_components = Object.filter(template.components, f => f.__page_id === page.__id);
      Object.keys(page_components).forEach(componentKey => {
        page.components.push(filterInternalFields(template.components[componentKey]));
      });
      tab.pages.push(filterInternalFields(page));
    });
    serializedTemplate.tabs.push(filterInternalFields(tab));
  });

  Object.keys(template.integrations).forEach(integrationKey => {
    serializedTemplate.integrations.push(filterInternalFields(template.integrations[integrationKey]))
  });

  serializedTemplate.addresses = Object.keys(template.addresses).map(addressKey  => template.addresses[addressKey]);

  return serializedTemplate;
}
