import React from 'react';

import { MarkdownComponent } from './MarkdownComponent';

export const Page = ({ page }) => {

  // Render first component for now

  const component = page.components && page.components.length > 0 ? page.components[0] : undefined;

  if (!component) { return <div>Page has no componenet.  Add one..</div>; }

  switch (component.type) {
    case 'markdown':
      return <MarkdownComponent component={component} />;

  }

  return <div>Unknown component type: { component.type }</div>;
}
