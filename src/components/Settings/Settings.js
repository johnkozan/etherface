import React from 'react';
import { Switch, Route } from 'react-router-dom';

import { SettingsMain } from './SettingsMain';
import { Addresses } from './Addresses';
import { EditAddress } from './EditAddress';
import { Integrations } from './Integrations';
import { Tabs } from './Tabs';
import { JsonView } from './JsonView';


export const Settings = () => {

  return (
    <Switch>

      <Route exact path={`/_/tabs`} component={Tabs} />
      <Route exact path={`/_/integrations`} component={Integrations} />
      <Route exact path={`/_/addresses/:network/:address`} component={EditAddress} />
      <Route exact path={`/_/addresses`} component={Addresses} />

      <Route path={`/_/json`} component={JsonView} />
      <Route path={`/_/settings`} component={SettingsMain} />

    </Switch>
  );
}
