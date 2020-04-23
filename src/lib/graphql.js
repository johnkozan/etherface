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

export function fieldsForTypeName(typeName, schema) {
  const type = schema.types.find(t => t.kind === 'OBJECT' && t.name === typeName);
  const fields = type.fields.map(f => normalizeFieldType(f));
  return fields;
};

export function normalizeFieldType(field) {
  // LIST of Objects
  if (field.type.ofType && field.type.ofType.kind === 'LIST' && field.type.ofType.ofType.ofType.kind === 'OBJECT') {
    return {
      name: field.name,
      kind: 'LIST',
      type: field.type.ofType.ofType.ofType.name,
    };
  }

  // LIST of SCALARS
  if (field.type.ofType && field.type.ofType.kind === 'LIST' && field.type.ofType.ofType.ofType.kind === 'SCALAR') {
    return {
      name: field.name,
      kind: 'SCALAR',
      type: field.type.ofType.ofType.ofType.name,
    };
  }

  // NON_NULL
  if (field.type.kind === 'NON_NULL') {
    return {
      name: field.name,
      kind: field.type.ofType.kind,
      type: field.type.ofType.name,
    };
  }

  // ID or Object or Scalar
  return {
    name: field.name,
    kind: field.type.kind,
    type: field.type.name,
  };
}
