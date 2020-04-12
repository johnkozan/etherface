//import { types } from "./reducers";
import React from 'react';
import { AppTemplateStore } from './AppTemplateStore';

import { connectTheGraph } from './thegraph';

export const useActions = () => {
  const { dispatch } = React.useContext(AppTemplateStore);

  function loadAppTemplate(template) {
    dispatch({ type: 'LOAD_TEMPLATE', payload: template });
  }

  function addTab(tab){
    dispatch({ type: 'ADD_TAB', payload: tab });
  }

  function deleteTab(tab){
    dispatch({ type: 'DELETE_TAB', payload: tab });
  }

  function addIntegration(integration) {
    dispatch({ type: 'ADD_INTEGRATION', payload: integration });
  }

  function deleteIntegration(integration) {
    dispatch({ type: 'DELETE_INTEGRATION', payload: integration });
  }

  function addComponent(component) {
    dispatch({ type: 'ADD_COMPONENT', payload: component });
  }

  function editComponent(component) {
    dispatch({ type: 'EDIT_COMPONENT', payload: component});
  }

  function connectIntegration(integration) {
    console.log('Connecting...');
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

  return {
    loadAppTemplate,
    addTab,
    deleteTab,
    addIntegration,
    deleteIntegration,
    connectIntegration,
    addComponent,
    editComponent,
  };
};
