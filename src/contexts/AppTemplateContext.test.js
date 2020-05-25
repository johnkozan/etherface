import React from 'react';
import { reducer } from './AppTemplateContext';

import exampleTemplate from '../examples/default.json';

it('loads existing template json into internal state', () => {
  const initialState = {};
  const action = {type: 'LOAD_TEMPLATE', payload: {template: exampleTemplate}};
  const state = reducer(initialState, action);

  expect(Object.keys(state.tabs).length).toBe(2);
  expect(Object.keys(state.pages).length).toBe(2);
  expect(Object.keys(state.components).length).toBe(6);
  expect(state.addresses.length).toBe(2);
});
