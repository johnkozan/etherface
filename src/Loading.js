import React, { useState, useEffect, useMemo } from 'react';
import { useWeb3React } from '@web3-react/core'
import { InjectedConnector } from '@web3-react/injected-connector'

import { injected, useWeb3ConnectExisting } from 'lib/web3';
import { useActions } from './actions';
import { useAppTemplate, useSettings } from 'contexts/AppTemplateContext';
import localstorageBackend from 'lib/localstorage';
import { Spinner } from 'components/Controls/Spinner';

import exampleTemplate from 'examples/default.json';

export const Loading = ({ children }) => {
  const appTemplate = useAppTemplate();
  const [settingsLoaded, setSettingsLoaded] = useState(false);
  const { integrations } = appTemplate;
  const { loadAppTemplate, connectIntegration, loadSettings } = useActions();
  const { activate, active } = useWeb3React();
  const triedWeb3Existing = useWeb3ConnectExisting();
  const [initialLoad, setInitialLoad] = useState(true);

  // load user settings
  useEffect(() => {
    if (!settingsLoaded) {
      loadSettings();
      setSettingsLoaded(true);
    }
  }, [settingsLoaded]);

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

  // connect metamask if exists
  // probably could check for a infura integration here and add it as well.
  useEffect(() => {
    if (triedWeb3Existing) {
      activate(injected);
    }
  }, []);


  //if (web3context.error) {
    //return <div>web3 error: { web3context.error }</div>;
  //}

  if (!appTemplate.__loaded || (!triedWeb3Existing)) {
    return <Spinner />;
  }

  const connectingStatuses = Object.keys(integrations).map(integrationKey => integrations[integrationKey].__connected);
  if (connectingStatuses.includes(false)) {
    return <Spinner />;
  }

  return (
    <div>
      { children }
    </div>
  );

}
