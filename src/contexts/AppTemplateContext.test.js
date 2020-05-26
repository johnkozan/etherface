import React, { createContext } from 'react';
import { act, renderHook } from '@testing-library/react-hooks';

import { ToastProvider } from 'react-toast-notifications'
import { BrowserStorage }  from '../lib/storage';
import { CustomToast } from '../Notifications';
import { reducer, AppTemplateProvider } from './AppTemplateContext';
import { useActions } from '../actions';

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

const storage = new BrowserStorage('etherface-file');
const wrapper = ({ children }) => (
  <ToastProvider components={{Toast: CustomToast}}><AppTemplateProvider>{children}</AppTemplateProvider></ToastProvider>
);

it('requires Tab to have Name', () => {
  expect.assertions(1);

  const { result, error }  = renderHook(() => useActions(), { wrapper });
  const { addTab } = result.current;

  const tab = {
    slug: 'test',
    pages: [],
  };

  const t = () => {
    addTab(tab);
  };
  expect(t).toThrow("data should have required property 'name'");
});

// TODO: Need to wait betwwen addTabs, or start with existing initialState...
//it('requires Tab to have unique slug', () => {
  //expect.assertions(1);

  //const { result, error }  = renderHook(() => useActions(), { wrapper });
  //const { addTab } = result.current;

  //const tab = {
    //name: 'Test 1',
    //slug: 'test',
    //pages: [],
  //};

  //const t = () => {
    //act(() => {
      //addTab(tab);
      //setTimeout(() => addTab(tab), 1000);
    //});
  //};
  //expect(t).toThrow("slug not unique");
//});


// SHould have a warning with templateVersion > current file format supported version
