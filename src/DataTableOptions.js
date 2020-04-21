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
import { typeNameToQueryMany, typeNameToQuerySingle, normalizeFieldType } from './graphql';
import { Spinner } from './Spinner';


export const DataTableOptions = ({ onCreate, onCancel }) => {
  const appTemplate = useAppTemplate();
  const { integrations } = appTemplate;
  const [selectedModel, setSelectedModel] = useState();
  const [selectedFields, setSelectedFields] = useState();

  // TODO: Select Graph datalink if multiple
  const thegraphLinks = Object.filter(integrations, i => i.type === 'thegraph');

  const dataLink = thegraphLinks[0];
  const remoteSchema = useRemoteSchema(dataLink.endpoint);

  if (!remoteSchema) {
    return <Spinner />;
  }

  const handleOnCreate = () => {
    // Determine query list name
    const queryObj = remoteSchema.types.find(
      t => t.kind === 'OBJECT' &&
      t.name === remoteSchema.queryType.name);

    // determine field types
    const model = remoteSchema.types.find(
      t => t.kind === 'OBJECT' &&
      t.name === selectedModel);

    const singleQuery = typeNameToQuerySingle(selectedModel, remoteSchema);
    const listQuery = typeNameToQueryMany(selectedModel, remoteSchema);

    const fields = model.fields.map((field, order) => {
      const { description, name } = field;
      const enabled = selectedFields.includes(field.name);

      let newField = normalizeFieldType(field);
      newField.description = description;
      newField.name = name;
      newField.order = order;
      newField.enabled = enabled;

      return newField;
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
