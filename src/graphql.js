// graphql helpers

export function typeNameToQueryMany(typeName, schema) {
  const queryType = schema.types.find(t => t.kind === 'OBJECT' && t.name === 'Query');
  const field = queryType.fields.find(f =>
    f.type.kind === 'NON_NULL' &&
    f.type.ofType &&
    f.type.ofType.kind === 'LIST' &&
    f.type.ofType.ofType.kind === 'NON_NULL' &&
    f.type.ofType.ofType.ofType.kind === 'OBJECT' &&
    f.type.ofType.ofType.ofType.name === typeName
  );
  return field ? field.name : undefined;
};

export function typeNameToQuerySingle(typeName, schema) {
  const queryType = schema.types.find(t => t.kind === 'OBJECT' && t.name === 'Query');
  const field = queryType.fields.find(f =>
    f.type.kind === 'OBJECT' &&
    f.type.name === typeName
  );
  return field ? field.name : undefined;
};
