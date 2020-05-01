import React from 'react';
import { AppTemplateStore, useExportTemplate } from 'contexts/AppTemplateContext';

import { connectTheGraph } from 'lib/thegraph';
import localstorage from 'lib/localstorage';

export const useActions = () => {
  const { state, dispatch } = React.useContext(AppTemplateStore);

  function loadAppTemplate(template) {
    dispatch({ type: 'LOAD_TEMPLATE', payload: template });
  }

  function addTab(tab){
    dispatch({ type: 'ADD_TAB', payload: tab });
  }

  function deleteTab(tab){
    dispatch({ type: 'DELETE_TAB', payload: tab });
  }

  function addPage(page){
    dispatch({ type: 'ADD_PAGE', payload: page });
  }

  function editPage(page) {
    dispatch({ type: 'EDIT_PAGE', payload: page});
  }

  function addIntegration(integration) {
    dispatch({ type: 'ADD_INTEGRATION', payload: integration });
  }

  function deleteIntegration(integration) {
    dispatch({ type: 'DELETE_INTEGRATION', payload: integration });
  }

  function connectIntegration(integration) {
    const __instance = ((type) => {
      switch (type) {
        case 'thegraph':
          return connectTheGraph(integration.endpoint);
        default:
          throw new Error ('Unsupported integration type: ', type);
      }
    })(integration.type);
    dispatch({ type: 'CONNECT_INTEGRATION', payload: {...integration, __instance}});
  }

  function addComponent(component) {
    dispatch({ type: 'ADD_COMPONENT', payload: component });
  }

  function editComponent(component) {
    dispatch({ type: 'EDIT_COMPONENT', payload: component});
  }

  function deleteComponent(component) {
    dispatch({ type: 'DELETE_COMPONENT', payload: component});
  }

  function addAddress(address) {
    dispatch({ type: 'ADD_ADDRESS', payload: address});
  }

  function deleteAddress(address) {
    dispatch({ type: 'DELETE_ADDRESS', payload: address});
  }

  function loadSettings() {
    const settings = localstorage.loadSettings();
    dispatch({ type: 'LOAD_SETTINGS', payload: settings});
  };

  function setSetting(setting, value) {
    localstorage.setSetting(setting, value);
    dispatch({ type: 'SET_SETTING', payload: {setting, value}});
  }

  return {
    loadAppTemplate,
    addTab,
    deleteTab,
    addPage,
    editPage,
    addIntegration,
    deleteIntegration,
    connectIntegration,
    addComponent,
    editComponent,
    deleteComponent,
    addAddress,
    deleteAddress,
    loadSettings,
    setSetting,
  };
};
