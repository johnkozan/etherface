import React from 'react';

import { Switch, Route, Redirect } from 'react-router-dom';

import { useAppTemplate } from './AppTemplateStore';

import { Tab } from './Tab';
import { Settings } from './Settings';
import { JsonView } from './JsonView';

export const Routes = () => {
  const appTemplate = useAppTemplate();

  // Default tab is first one for now
  const defaultTab = appTemplate.tabs[Object.keys(appTemplate.tabs)[0]];

  return (
    <Switch>
      { appTemplate.tabs && Object.keys(appTemplate.tabs).map((tabId, k) => (
        <Route exact key={tabId} path={`/${appTemplate.tabs[tabId].slug}`} render={() => <Tab tab={appTemplate.tabs[tabId]} />} />
      ))}

      <Route exact path="/settings" component={Settings} />
      <Route exact path="/settings/json" component={JsonView} />
      <Route path="/" render={() => <Redirect to={`/${defaultTab.slug}`} /> } />
    </Switch>
  );

}
