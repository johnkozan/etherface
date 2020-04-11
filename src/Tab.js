import React from 'react';

import { usePagesByTabId } from './AppTemplateStore';
import { Page } from './Page';

export const Tab = ({ tab }) => {
  const pages = usePagesByTabId(tab.__id);

  // Just render first page for now
  const page = pages && Object.keys(pages).length > 0 ? pages[Object.keys(pages)[0]] : undefined;

  if (!page) {
    return <div>No pages... add one here...</div>;
  }

  return <Page page={page} />;
}
