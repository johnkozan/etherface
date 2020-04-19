import React, { useState, useEffect } from 'react';
import {
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  List,
  ListItem,
  ListItemText,
  Typography,
} from '@material-ui/core';

import { useAppTemplate } from './AppTemplateStore';
import { useRemoteSchema } from './thegraph';
import { typeNameToQueryMany, typeNameToQuerySingle } from './graphql';
import { Spinner } from './Spinner';


export const DataTableOptions = ({ onCreate, onCancel }) => {
  const appTemplate = useAppTemplate();
  const { integrations } = appTemplate;
  //const [dataLink, setDatalink] = useState();
  //const [remoteSchema, setRemoteSchema] = useState();
  const [selectedModel, setSelectedModel] = useState();
  const [selectedFields, setSelectedFields] = useState();

  // TODO: Select Graph datalink if multiple
  const thegraphLinks = Object.filter(integrations, i => i.type === 'thegraph');

  const dataLink = thegraphLinks[0];
  const remoteSchema = useRemoteSchema(dataLink.endpoint);

  //useEffect(() => {
    //(
    //async () => {
      //if (!dataLink || remoteSchema) { return; }
      //const schema = await fetchGraphqlSchema(dataLink.endpoint);
      //setRemoteSchema(JSON.parse(schema));
    //})();
  //}, [dataLink, remoteSchema]);

  //if (Object.keys(thegraphLinks).length === 0) {
    //return <div>TheGraph data link reqired.</div>;
  //}
  if (!remoteSchema) {
    //setDatalink(thegraphLinks[0]);
    return <Spinner />;
  }

  const handleOnCreate = () => {
    // Determine query list name
    const queryObj = remoteSchema.types.find(
      t => t.kind === 'OBJECT' &&
      t.name === remoteSchema.queryType.name);

    //const list = queryObj.fields.find(f =>
        //f.type.kind === 'NON_NULL' &&
        //f.type.ofType.kind === 'LIST' &&
        //f.type.ofType.ofType.kind === 'NON_NULL' &&
        //f.type.ofType.ofType.ofType.kind === 'OBJECT' &&
        //f.type.ofType.ofType.ofType.name === selectedModel
    //);

    // determine field types
    console.log('Remote Schea:: ', remoteSchema);
    const model = remoteSchema.types.find(
      t => t.kind === 'OBJECT' &&
      t.name === selectedModel);
    console.log('MODEL ', model);

    const singleQuery = typeNameToQuerySingle(selectedModel, remoteSchema);
    const listQuery = typeNameToQueryMany(selectedModel, remoteSchema);

    //const allFields = remoteSchema.types.find(t => t.name === model).fields;
    const fields = model.fields.map((field, order) => {
      //const field = model.fields.find(f => f.name === fieldName);
      const { description, name } = field;
      const enabled = selectedFields.includes(field.name);
      console.log('field: ', field);
      if (field.type.ofType && field.type.ofType.kind === 'LIST') {
        return {
          name,
          description,
          kind: 'LIST',
          type: field.type.ofType.ofType.ofType.name,
          enabled,
          order,
        };
      }

      // NON_NULL
      if (field.type.kind === 'NON_NULL') {
        return {
          name,
          description,
          kind: field.type.ofType.kind,
          type: field.type.ofType.name,
          enabled,
          order,
        };
      }

      // ID or Object or Scalar
      return {
        name,
        description,
        kind: field.type.kind,
        type: field.type.name,
        enabled,
        order,
      };
    });

    onCreate({
      type: 'datatable',
      options: { typeName: selectedModel, fields, singleQuery, listQuery },
      data_source: {type: dataLink.type, endpoint: dataLink.endpoint },
    });
  };

  return (
    <Card>
      <CardHeader title="Adding Data Table" />
      <CardContent>

        <Typography gutterBottom>Selected data link: { dataLink.endpoint }</Typography>

        <br />

        { selectedModel ?
            <Typography gutterBottom>Selected model: { selectedModel }</Typography>
            :
            <ModelSelect schema={remoteSchema} onNext={setSelectedModel} />
        }

        { selectedFields ?
            <Typography gutterBottom>Selected fields: { selectedFields.join(', ') }</Typography>
            :
            <FieldsSelect schema={remoteSchema} model={selectedModel} onNext={setSelectedFields} />
        }

      </CardContent>
      <CardActions>
        <Button disabled={!selectedModel || !selectedFields} onClick={handleOnCreate}>Create Data Table</Button>
        <Button onClick={onCancel}>Cancel</Button>
      </CardActions>

    </Card>
  );
};

const ModelSelect = ({ schema, onNext }) => {
  const [selectedModel, setSelectedModel] = useState();

  if (!schema) {
    return <div>Loading schema...</div>;
  }

  console.log('SCHEMA::: ', schema);

  const models = schema.types.filter(
    t => t.kind === 'OBJECT' &&
    t.name.substr(0, 2) !== '__' &&
    t.name !== schema.queryType.name && t.name !== schema.subscriptionType.name
  );

  return (
    <div>
      <Typography>Select model:</Typography>
      <Button disabled={selectedModel === undefined} variant="outlined" color="primary" onClick={() => onNext(selectedModel)}>Next</Button>
      <List dense={true}>
        {  models.map(model => (
          <ListItem key={model.name}
            selected={model.name === selectedModel}
            onClick={() => model.name === selectedModel ? setSelectedModel(undefined) : setSelectedModel(model.name)}
          >
            <ListItemText
              primary={model.name}
              secondary={model.description}
            />
          </ListItem>
        )) }
      </List>

    </div>
  );
}

const FieldsSelect = ({ schema, model, onNext }) => {
  const [selectedFields, setSelectedFields] = useState([]);

  if (!model) {
    return <div></div>;
  }

  const fields = schema.types.find(t => t.name === model).fields;

  const toggleSelected = (field) => {
    if (selectedFields.includes(field)) {
      setSelectedFields(selectedFields.filter(f => f !== field));
    } else {
      setSelectedFields([field, ...selectedFields]);
    }
  };

  const selectAll = () => {
    setSelectedFields(fields.map(f => f.name));
  };

  return (
    <div>
      <Typography>Select fields:</Typography>
      <Button disabled={selectedFields.length === 0} variant="outlined" color="primary" onClick={() => onNext(selectedFields)}>Next</Button>
      <Typography onClick={selectAll}>Select All</Typography>
      <List dense={true}>
        {  fields.map(field => (
          <ListItem key={field.name}
            selected={selectedFields.includes(field.name)}
            onClick={() => toggleSelected(field.name)}
          >
            <ListItemText
              primary={field.name}
              secondary={field.description}
            />
          </ListItem>
        )) }
      </List>
    </div>
  );
}
