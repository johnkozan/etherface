import React from 'react';

import { Switch, Route } from 'react-router-dom';

import { useAppTemplate } from './AppTemplateStore';

import { Tab } from './Tab';
import { Settings } from './Settings';

const Main = () => {
  return <div>Main!</div>;
};

export const Routes = () => {
  const appTemplate = useAppTemplate();

  return (
    <Switch>
      { appTemplate.tabs && Object.keys(appTemplate.tabs).map((tabId, k) => (
        <Route exact key={tabId} path={`/${appTemplate.tabs[tabId].slug}`} render={() => <Tab tab={appTemplate.tabs[tabId]} />} />
      ))}

      <Route exact path="/settings" component={Settings} />
      <Route path="/" component={Main} />
    </Switch>
  );

}
