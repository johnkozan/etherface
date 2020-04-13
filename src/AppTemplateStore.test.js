import React from 'react';
//import { shallow } from 'enzyme';
import { reducer } from './AppTemplateStore';

it('loads existing template json into internal state', () => {
  const initialState = {};
  const template = JSON.parse(`{"tabs":[{"name":"Welcome","slug":"welcome","icon":"Home","pages":[{"title":"test page","components":[{"type":"markdown","content":"# Test page\\n\\n\\nthis is the test page\\n"}]}]},{"name":"CRM","slug":"CRM","pages":[{"components":[{"type":"datatable","options":{"model":"accounts","fields":["hasBorrowed","countLiquidator","countLiquidated","id"]},"data_source":{"type":"thegraph","endpoint":"https://api.thegraph.com/subgraphs/name/graphprotocol/compound-v2"}}]}]}],"integrations":[{"type":"thegraph","endpoint":"https://api.thegraph.com/subgraphs/name/graphprotocol/compound-v2"}]}`);
  const action = {type: 'LOAD_TEMPLATE', payload: template};
  const state = reducer(initialState, action);

  expect(Object.keys(state.tabs).length).toBe(2);
  expect(Object.keys(state.pages).length).toBe(2);
  expect(Object.keys(state.components).length).toBe(2);
});
