import React, { useState } from 'react';
import {
  Card,
  CardContent,
  Grid,
  Typography,
} from '@material-ui/core';

import { useActions } from 'actions';

import { DataTableOptions } from './DataTableOptions';
import { MarkdownOptions } from './MarkdownOptions';
import { Web3TxOptions } from './Web3TxOptions';

const COMPONENT_TYPES = [
  { value: 'markdown', label: 'Text', component: MarkdownOptions },
  { value: 'datatable', label: 'TheGraph data table', component: DataTableOptions },
  { value: 'web3transaction', label: 'Web3 Transaction', component: Web3TxOptions },
];

export const NewComponent = ({page_id}) => {
  const [componentType, setComponentType] = useState();
  const { addComponent } = useActions();

  const onCancel = () => { setComponentType(undefined); }

  const onCreate = (component) => {
    addComponent({...component, __page_id: page_id });
  }

  if (componentType) {
    const OptionsComponent = COMPONENT_TYPES.find(t => t.value === componentType).component;
    if (!OptionsComponent) { throw new Error('Unknown component type'); }
    return <OptionsComponent onCancel={onCancel} onCreate={onCreate} />;
  }

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
};
