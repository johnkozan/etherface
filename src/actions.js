//import { types } from "./reducers";
import React from 'react';
import { AppTemplateStore, useExportTemplate } from './AppTemplateStore';

import { connectTheGraph } from 'lib/thegraph';
import localstorage from 'lib/localstorage';

export const useActions = () => {
  const { state, dispatch } = React.useContext(AppTemplateStore);
  const exportTemplate = useExportTemplate();

  function autoSave() {
    if (state.settings.autosave) {
      console.log('Autosaving...');
      const exportedTemplate = exportTemplate();
      console.log('Exported template to autosave:: ', exportedTemplate);
      localstorage.saveAppTemplate(exportedTemplate);
      console.log('autosaved');
    }
  }

  function loadAppTemplate(template) {
    dispatch({ type: 'LOAD_TEMPLATE', payload: template });
  }

  function addTab(tab){
    dispatch({ type: 'ADD_TAB', payload: tab });
    autoSave();
  }

  function deleteTab(tab){
    dispatch({ type: 'DELETE_TAB', payload: tab });
    autoSave();
  }

  function addPage(page){
    dispatch({ type: 'ADD_PAGE', payload: page });
    autoSave();
  }

  function editPage(page) {
    dispatch({ type: 'EDIT_PAGE', payload: page});
    autoSave();
  }

  function addIntegration(integration) {
    dispatch({ type: 'ADD_INTEGRATION', payload: integration });
    autoSave();
  }

  function deleteIntegration(integration) {
    dispatch({ type: 'DELETE_INTEGRATION', payload: integration });
    autoSave();
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
    autoSave();
  }

  function editComponent(component) {
    dispatch({ type: 'EDIT_COMPONENT', payload: component});
    autoSave();
  }

  function deleteComponent(component) {
    dispatch({ type: 'DELETE_COMPONENT', payload: component});
    autoSave();
  }

  function addAddress(address) {
    dispatch({ type: 'ADD_ADDRESS', payload: address});
    autoSave();
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
    loadSettings,
    setSetting,
  };
};
