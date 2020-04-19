import fs from 'fs';
import { typeNameToQueryMany, typeNameToQuerySingle } from './graphql';

it('determines query from type name', () => {

  const compoundSchema = fs.readFileSync('test/fixtures/compound-schema.json');
  const schema = JSON.parse(compoundSchema);

  const typeName = 'Account';
  const multiple = typeNameToQueryMany(typeName, schema);
  const single = typeNameToQuerySingle(typeName, schema);

  expect(multiple).toBe('accounts');
  expect(single).toBe('account');

  const singleAccountCToken = typeNameToQuerySingle('AccountCToken', schema);

  expect(singleAccountCToken).toBe('accountCToken');
});
