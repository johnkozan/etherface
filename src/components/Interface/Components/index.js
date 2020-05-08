import { NewComponent } from './NewComponent';
import web3Components from './Web3Transaction';
import datatableComponents from './Datatable';
import markdownComponents from './Markdown';

import { defaultLayout } from 'components/Interface/Page'

const COMPONENT_TYPES = [
  { value: 'markdown', label: 'Text', components: markdownComponents },
  { value: 'datatable', label: 'TheGraph data table', components: datatableComponents },
  { value: 'web3transaction', label: 'Web3 Transaction', components: web3Components },
];

function componentForType(type, componentType) {
  const componentRecord = COMPONENT_TYPES.find(t => t.value === type);
  if (!componentRecord) { throw new Error('Unknown component type'); }
  const component = componentRecord.components[componentType];
  if (!component) { throw new Error(`No component for "${type}" "${componentType}"`); }
  return component;
}

function componentsByColumn(components, colNumber) {
  let res = [];
  Object.keys(components).forEach(componentKey => {
    const component = components[componentKey];
    const layout = component.layout || defaultLayout;
    const column = layout.column || 1;
    if (column === colNumber) {
      res.push(component);
    }
  });
  return res;
}

export {
  COMPONENT_TYPES,
  componentForType,
  componentsByColumn,
  NewComponent,
};
