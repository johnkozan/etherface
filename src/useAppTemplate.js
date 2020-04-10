import React, { useContext } from 'react';

import { TemplateContext } from './TemplateContext';
// Hook to get App template
//

export function useAppTemplate() {
  const template = useContext(TemplateContext);


  return { template };
};
