import React, { useState } from 'react';
import {
  Typography,
} from '@material-ui/core';
import { Alert, AlertTitle } from '@material-ui/lab';

import { useComponentsByPageId } from 'AppTemplateStore';

import { GraphQLComponent } from './GraphQLComponent';
import { DataTableComponent } from './DataTableComponent';
import { MarkdownComponent } from './MarkdownComponent';
import { NewComponent } from './NewComponent';
import { EditButton } from './EditButton';
import { EditPage } from './EditPage';

export const Page = ({ page }) => {
  const components = useComponentsByPageId(page.__id);
  const [editMode, setEditMode] = useState(false);

  const renderedComponents = components && Object.keys(components).map(componentKey =>
    ((type) => {
      switch (type) {
    case 'markdown':
      return <MarkdownComponent component={components[componentKey]} key={componentKey} />;
    case 'datatable':
      return <GraphQLComponent RenderComponent={DataTableComponent} component={components[componentKey]} key={componentKey} />;
    default:
          throw new Error('Unknown component type ', type);
      }
    })(components[componentKey].type)
  );

  if (editMode) {
    return <EditPage page={page} onCancel={() => setEditMode(false)} />
  }

  const content = !renderedComponents || renderedComponents.length === 0 ?
    <div>
      <Alert severity="warning">
        <AlertTitle>Page has no components</AlertTitle>
      </Alert>
      <NewComponent page_id={page.__id} />
    </div>
    : renderedComponents;

  return (
    <div>
      <Typography variant="h4"> { page.title }</Typography>
      <div>
        { content }
        <EditButton onClick={() => setEditMode(true)} />
      </div>
    </div>
  );

}
