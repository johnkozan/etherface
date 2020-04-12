import React from 'react';

import { useComponentsByPageId } from './AppTemplateStore';

import { DataTableComponent } from './DataTableComponent';
import { MarkdownComponent } from './MarkdownComponent';
import { NewComponent } from './NewComponent';

export const Page = ({ page }) => {
  const components = useComponentsByPageId(page.__id);

  // Render first component for now
  const component = components && Object.keys(components).length > 0 ? components[Object.keys(components)[0]] : undefined;

  if (!component) { return <NewComponent page_id={page.__id} />; }

  switch (component.type) {
    case 'markdown':
      return <MarkdownComponent component={component} />;

    case 'datatable':
      return <DataTableComponent component={component} />;

    default:
      return <div>Unknown component type: { component.type }</div>;
  }

}
