import React, { useState } from 'react';
import {
  Card,
  CardActions,
  CardContent,
  CardHeader,
  FormControl,
  Grid,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
  TextField,
  Typography,
} from '@material-ui/core';

import { useForm } from 'react-hooks-useform';
import { useActions } from './actions';

import { DataTableOptions } from './DataTableOptions';

const COMPONENT_TYPES = [
  { value: 'markdown', label: 'Text' },
  { value: 'datatable', label: 'TheGraph data table' },
];

export const NewComponent = ({page_id}) => {
  const [componentType, setComponentType] = useState();
  const { addComponent } = useActions();

  const onCancel = () => { setComponentType(undefined); }

  const onCreate = (component) => {
    addComponent({...component, __page_id: page_id });
    console.log('Added!');
  }

  switch (componentType) {
    case 'markdown':
      return <div>Mark down opts</div>;

    case 'datatable':
      return <DataTableOptions onCancel={onCancel} onCreate={onCreate} />;

    default:
      return (
        <div>

          <Typography>Add component to page</Typography>

          <Grid container>
            { COMPONENT_TYPES.map(componentType => (
              <Grid item  key={componentType.value}>
                <Card onClick={() => setComponentType(componentType.value)}>
                  <CardContent>
                    { componentType.label }
                  </CardContent>
            </Card>
          </Grid>
            )) }
          </Grid>


        </div>
      );
  }
};
