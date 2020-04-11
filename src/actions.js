//import { types } from "./reducers";
import React from 'react';
import { AppTemplateStore } from './AppTemplateStore';

export const useActions = () => {
  const { dispatch } = React.useContext(AppTemplateStore);

  function loadAppTemplate(template) {
    dispatch({ type: 'LOAD_TEMPLATE', payload: template });
  }

  function addIntegration(integration) {
    dispatch({ type: 'ADD_INTEGRATION', payload: integration });
  }

  function editComponent(component) {
    dispatch({ type: 'EDIT_COMPONENT', payload: component});
  }

  return {
    loadAppTemplate,
    addIntegration,
    editComponent,
  };
};
