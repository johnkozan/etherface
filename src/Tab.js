import React from 'react';

import { Page } from './Page';

export const Tab = ({ tab }) => {

  const page = tab.pages && tab.pages.length > 0 ? tab.pages[0] : undefined;

  if (!page) {
    return <div>No pages... add one here...</div>;
  }

  return <Page page={page} />;
}
