import React, { useState, useEffect } from 'react';
import { useWeb3React } from '@web3-react/core'

import { injected, useWeb3ConnectExisting } from './lib/web3';
import { useActions } from './actions';
import { useAppTemplate } from './contexts/AppTemplateContext';
import localstorageBackend from './lib/localstorage';
import { Spinner } from './components/Controls/Spinner';
import { ErrorMsg } from './components/Controls/ErrorMsg';

import exampleTemplate from './examples/default.json';

export const Loading = ({ children, storage }) => {
  const appTemplate = useAppTemplate();
  const [settingsLoaded, setSettingsLoaded] = useState(false);
  const [loadingError, setLoadingError] = useState(false);
  const { integrations } = appTemplate;
  const { loadAppTemplate, connectIntegration, loadSettings } = useActions();
  const { activate } = useWeb3React();
  const triedWeb3Existing = useWeb3ConnectExisting();

  // load user settings
  useEffect(() => {
    if (!settingsLoaded) {
      loadSettings();
      setSettingsLoaded(true);
    }
  }, [settingsLoaded]);

  // Load saved app template from localstorage if exsits, otherwise load example template
  useEffect(() => {
    (async () => {
      try {
        const savedTemplate = await storage.load();

        const newTemplate = {
          __source: {
            type: storage.type,
            name: storage.name,
            options: storage.options,
          },
          ...(savedTemplate || exampleTemplate),
        };

        loadAppTemplate(newTemplate);

      } catch (err) {
        setLoadingError(err.toString());
      }
    })();
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

  // connect metamask if exists
  // probably could check for a infura integration here and add it as well.
  useEffect(() => {
    if (triedWeb3Existing) {
      activate(injected);
    }
  }, []);

  if (loadingError) {
    return <ErrorMsg message={loadingError} />;
  }

  if (!appTemplate.__loaded || (!triedWeb3Existing)) {
    return <Spinner />;
  }

  const connectingStatuses = Object.keys(integrations).map(integrationKey => integrations[integrationKey].__connected);
  if (connectingStatuses.includes(false)) {
    return <Spinner />;
  }

  return (
    <div>
      { /* web3context.error ? <ErrorMsg message={web3context.error} /> : undefined */ }
      { children }
    </div>
  );

}
