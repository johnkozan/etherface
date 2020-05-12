import React, { useState } from 'react';
import {
  Grid,
  Typography,
} from '@material-ui/core';
import { Alert, AlertTitle } from '@material-ui/lab';

import { useComponentsByPageId } from '../../contexts/AppTemplateContext';

import { GRID_COLS } from '../../constants';
import { NewComponent, componentForType, componentsByColumn } from './Components';
import { EditButton } from './EditButton';
import { EditPage } from './EditPage';

export const defaultLayout = {row: 1, column: 1};


export const Page = ({ page }) => {
  const components = useComponentsByPageId(page.__id);
  const [editMode, setEditMode] = useState(false);

  if (editMode) {
    return <EditPage page={page} onCancel={() => setEditMode(false)} />
  }

  if (components.length === 0) {
    return (
    <div>
      <Alert severity="warning">
        <AlertTitle>Page has no components</AlertTitle>
      </Alert>
      <NewComponent page_id={page.__id} />
    </div>
    );
  }

  const columnWidths = page.layout && page.layout.columns ? page.layout.columns : [GRID_COLS];
  let componentGrid = (
    <Grid container spacing={1}>
      { columnWidths.map((colSize,colNum) => {
        const actualColNum = colNum + 1; // columns are 1 based
        const rowComponents = componentsByColumn(components, actualColNum);
        return <Grid item xs={colSize} key={`col-${actualColNum}`}>
          <Grid container spacing={1}>
            { rowComponents.map(component => {
              const ShowComponent = componentForType(component.type, 'show');
              return <Grid item xs={GRID_COLS} key={`component-${component.__id}`}>
                <ShowComponent component={component} />
              </Grid>;
            })}
          </Grid>
        </Grid>
      })}
    </Grid>
  );

  return (
    <div>
      <Typography variant="h4"> { page.title }</Typography>
      <div>
        { componentGrid }
      </div>
        <EditButton onClick={() => setEditMode(true)} />
    </div>
  );
}
