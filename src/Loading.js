import React, { useEffect } from 'react';

import { useActions } from './actions';
import { useAppTemplate } from './AppTemplateStore';
import localstorageBackend from './localstorage';

import exampleTemplate from './example.json';

export const Loading = ({ children }) => {
  const appTemplate = useAppTemplate();
  const { integrations } = appTemplate;
  const { loadAppTemplate, connectIntegration } = useActions();

  // Load saved app template from localstorage if exsits, otherwise load example template
  useEffect(() => {
    const savedTemplate = localstorageBackend.loadAppTemplate();
    if (!savedTemplate) {
      loadAppTemplate(exampleTemplate);
    } else {
      loadAppTemplate(savedTemplate);
    }
  }, []);

  // Connect integrations
  useEffect(() => {
    if (!appTemplate.__loaded) { return; }
    const integrationKeys = Object.keys(integrations);
    for (let x=0; x < integrationKeys.length; x++) {
      const integration = integrations[integrationKeys[x]];
      if (!integration.__connected) { connectIntegration(integration); }
    }
  }, [appTemplate.__loaded, integrations]);

  if (!appTemplate.__loaded) {
    return <div>Loading...</div>;
  }

  const connectingStatuses = Object.keys(integrations).map(integrationKey => integrations[integrationKey].__connected);
  if (connectingStatuses.includes(false)) {
    return <div>Connecting...</div>;
  }

  return (
    <div>
      { children }
    </div>
  );

}
