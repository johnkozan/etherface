import React, { createContext } from 'react';
import fs from 'fs';
import { act, renderHook } from '@testing-library/react-hooks';

import { SettingsProvider } from './SettingsContext';
import { ToastProvider } from 'react-toast-notifications'
import { BrowserStorage }  from '../lib/storage';
import { CustomToast } from '../Notifications';
import { reducer, AppTemplateProvider, useAppTemplate } from './AppTemplateContext';
import { useActions } from '../actions';

import exampleTemplate from '../examples/default.json';

const exampleInititalState = JSON.parse(fs.readFileSync('test/fixtures/initialState.json'));

const storage = new BrowserStorage('etherface-file');
const wrapper = ({ children }) => (
  <SettingsProvider>
    <ToastProvider components={{Toast: CustomToast}}>
      <AppTemplateProvider initialState={exampleInititalState}>
        {children}
      </AppTemplateProvider>
    </ToastProvider>
  </SettingsProvider>
);


it('loads existing template json into internal state', () => {
  const initialState = {};
  const action = {type: 'LOAD_TEMPLATE', payload: {template: exampleTemplate}};
  const state = reducer(initialState, action);

  expect(Object.keys(state.tabs).length).toBe(2);
  expect(Object.keys(state.pages).length).toBe(2);
  expect(Object.keys(state.components).length).toBe(6);
  expect(state.addresses.length).toBe(2);
});


it('deletes an addresses without deleting all the addresses', () => {
  const address = '0xc0dA01a04C3f3E0be433606045bB7017A7323E38';
  const network = 'mainnet';
  const action = {type: 'DELETE_ADDRESS', payload: {address, network}};

  const state = reducer(exampleInititalState, action);

  expect(state.addresses.length).toBe(1);
});

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

it('prevents an address from being deleted it a web3 component depends on it', () => {
  expect.assertions(1);
  const address = '0xc0dA01a04C3f3E0be433606045bB7017A7323E38';
  const network = 'mainnet';

  const { result, error }  = renderHook(() => useActions(), { wrapper });
  const { deleteAddress } = result.current;

  const t = () =>
    act(() =>
      deleteAddress({address, network})
    );

  expect(t).toThrow();
});

it('allows an address to be deleted if no web3 components depend on it', () => {
  const address = '0x4DA681E4713cC8C4fDbE8a1B027AeBE59c4B332E';
  const network = 'mainnet';

  const { result, error }  = renderHook(() => useActions(), { wrapper });
  const { deleteAddress } = result.current;

  const t = () =>
    act(() =>
      deleteAddress({address, network})
    );

  expect(t).not.toThrow();
});

it('deletes corresponding pages and components when deleting a tab', () => {
  expect(Object.keys(exampleInititalState.tabs).length).toBe(2);
  expect(Object.keys(exampleInititalState.pages).length).toBe(2);
  expect(Object.keys(exampleInititalState.components).length).toBe(6);

  const tabToDelete = {
    __id: 1, // assumes id
  };

  const action = {type: 'DELETE_TAB', payload: tabToDelete};
  const state = reducer(exampleInititalState, action);

  expect(Object.keys(state.tabs).length).toBe(1);
  expect(Object.keys(state.pages).length).toBe(1);
  expect(Object.keys(state.components).length).toBe(4);
});

//TODO: Need to wait betwwen addTabs, or start with existing initialState...
//it('requires Tab to have unique slug', () => {
//expect.assertions(1);

//const { result, error }  = renderHook(() => useActions(), { wrapper });
//const { result: templateResult, error: templateError } = renderHook(() => useAppTemplate(), { wrapper });
//const { addTab } = result.current;

//const tab = {
//name: 'Test 1',
//slug: 'test',
//pages: [],
//};

//const t = () => {
//act(() => {
//console.log('tabs: ', tabs);
//addTab(tab);
//});
//};
//expect(t).toThrow("slug not unique");
//});


// SHould have a warning with templateVersion > current file format supported version
