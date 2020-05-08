import React, { useState } from 'react';
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  Grid,
} from '@material-ui/core';

import { useActions } from 'actions';
import { useComponentsByPageId } from 'contexts/AppTemplateContext';

import { COMPONENT_TYPES, componentForType } from '.';
import { defaultLayout } from 'components/Interface/Page';

export const NewComponent = ({page_id, row, column, preSave}) => {
  const [componentType, setComponentType] = useState();
  const { addComponent } = useActions();
  const existingComponents = useComponentsByPageId(page_id);

  const onCancel = () => { setComponentType(undefined); }

  const onCreate = (component) => {
    let layout = Object.assign({}, defaultLayout);
    if (row) {
      layout.row = row;
    } else {
      let maxRow = 0;
      Object.keys(existingComponents).forEach(componentKey => {
        const existingRow = (existingComponents[componentKey].layout || defaultLayout).row;
        if (existingRow > maxRow) {
          maxRow = existingRow;
        }
      });
      layout.row = maxRow + 1;
    }
    layout.column = column || 1;
    if (preSave) { preSave(); }
    addComponent({...component, __page_id: page_id, layout });
  }

  if (componentType) {
    const EditComponent = componentForType(componentType, 'new');
    return <EditComponent onCancel={onCancel} onCreate={onCreate} />;
  }

  return (
    <div>
      <Card>
        <CardHeader title="New Component" />
        <CardContent>

        <Grid container>
          { COMPONENT_TYPES.map(componentType => (
            <Grid item key={componentType.value} spacing={3}>
              <Card >
                <CardContent>
                  <Button onClick={() => setComponentType(componentType.value)}>{ componentType.label }</Button>
                </CardContent>
              </Card>
            </Grid>
          )) }
        </Grid>
      </CardContent>
    </Card>

    </div>
  );
};
