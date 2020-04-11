import React from 'react';

import { useComponentsByPageId } from './AppTemplateStore';
import { MarkdownComponent } from './MarkdownComponent';

export const Page = ({ page }) => {
  const components = useComponentsByPageId(page.__id);

  // Render first component for now
  const component = components && Object.keys(components).length > 0 ? components[Object.keys(components)[0]] : undefined;

  if (!component) { return <div>Page has no componenet.  Add one..</div>; }

  switch (component.type) {
    case 'markdown':
      return <MarkdownComponent component={component} />;

    default:

      return <div>Unknown component type: { component.type }</div>;
  }

}
