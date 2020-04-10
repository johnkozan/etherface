import React from 'react';

import { Switch, Route, Link, Redirect, useHistory } from 'react-router-dom';

import { useAppTemplate } from './AppTemplateStore';

import { Tab } from './Tab';
import { Settings } from './Settings';

const Main = () => {
  return <div>Main!</div>;
};

export const Routes = () => {
  const history = useHistory();
  const appTemplate = useAppTemplate();

  return (
    <Switch>
      { appTemplate.tabs && appTemplate.tabs.map((tab, k) => (
        <Route exact path={`/${tab.slug}`} render={() => <Tab tab={tab} />} />
      ))}

      <Route exact path="/settings" component={Settings} />
      <Route path="/" component={Main} />
    </Switch>
  );

}
