import React, { useState } from 'react';
import {
  Button,
  Card,
  CardActions,
  CardHeader,
  CardContent,
  Typography,
} from '@material-ui/core';

import { useAppTemplate } from './AppTemplateStore';
import { NewIntegration } from './NewIntegration';

export const Settings = () => {
  const  template = useAppTemplate();
  const [showNewIntegration, setShowNewIntegration] = useState(false);

  return (
    <div>
      <Typography variant="h4" guttersBottom>
        Settings
      </Typography>


      <Card>
        <CardHeader title="App Template" />
        <CardContent>
          Name: { template.name }
          <br />
          Location: localstorage

        </CardContent>
      </Card>

      <Card>
        <CardHeader title="Integrations" />
        <CardContent>

          <ul>
            { template.integrations && Object.keys(template.integrations).map((integrationId, k) => (
              <li key={`integration-${k}`}>{ template.integrations[integrationId].type }</li>
            ))}
          </ul>

        { showNewIntegration ? <NewIntegration onCancel={() => setShowNewIntegration(false)} /> : undefined }

        </CardContent>

        <CardActions>
          { showNewIntegration ? undefined :
              <Button onClick={() => setShowNewIntegration(true)}>Add Integration</Button>
          }
        </CardActions>
      </Card>

    </div>
  );
}
