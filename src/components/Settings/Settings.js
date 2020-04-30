import React from 'react';
import { Switch, Route } from 'react-router-dom';

import { SettingsMain } from './SettingsMain';
import { Addresses } from './Addresses';
import { Integrations } from './Integrations';
import { Tabs } from './Tabs';
import { JsonView } from './JsonView';


export const Settings = () => {

  return (
    <Switch>

      <Route exact path={`/_/settings/tabs`} component={Tabs} />
      <Route exact path={`/_/settings/integrations`} component={Integrations} />
      <Route exact path={`/_/settings/addresses`} component={Addresses} />

      <Route path={`/_/settings/json`} component={JsonView} />
      <Route path={`/_/settings`} component={SettingsMain} />

    </Switch>
  );
}
