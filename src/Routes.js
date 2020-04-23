import React from 'react';

import { Switch, Route, Redirect } from 'react-router-dom';

import { useAppTemplate } from './AppTemplateStore';

import { Tab } from 'components/Interface/Tab';
import { Settings } from 'components/Settings/Settings';

export const SETTINGS_ROUTE = '/_/settings';

export const Routes = () => {
  const appTemplate = useAppTemplate();

  // Default tab is first one for now
  const defaultTab = appTemplate.tabs[Object.keys(appTemplate.tabs)[0]];

  return (
    <Switch>
      { appTemplate.tabs && Object.keys(appTemplate.tabs).map((tabId, k) => (
        <Route exact key={tabId} path={`/${appTemplate.tabs[tabId].slug}`} render={() => <Tab tab={appTemplate.tabs[tabId]} />} />
      ))}

      <Route path={SETTINGS_ROUTE} component={Settings} />

      <Route path="/" render={() => <Redirect to={`/${defaultTab.slug}`} /> } />
    </Switch>
  );
}
