import React, { useState } from "react";

import { Query } from "./Query";
import { useIntegration } from './AppTemplateStore';
import { useRemoteSchema } from './thegraph';
import { typeNameToQuerySingle } from './graphql';
import { Spinner } from './Spinner';

export const GraphQLComponent = ({ component, RenderComponent }) => {
  const integration = useIntegration(component.data_source.type, component.data_source.endpoint);
  const [selectedQuery, setSelectedQuery] = useState();
  const needSchema = selectedQuery && selectedQuery === component.options.typeName;
  const remoteSchema = useRemoteSchema(needSchema ? integration.endpoint : undefined);

  if (!RenderComponent) { throw new Error('No render component'); }

  const onCancel = () => {
    setSelectedQuery(undefined);
  };

  if (selectedQuery) {

    if (!remoteSchema && needSchema) {
      return <Spinner />;
    }

    const model = needSchema ? typeNameToQuerySingle(selectedQuery.model, remoteSchema) : component.options.singleQuery;
    console.log('QUERY MODE:  ', model,   ' selectedQuery: ', selectedQuery);
    return <Query
      model={model}
      id={selectedQuery.id}
      fields={component.options.fields}
      graph_client={integration.__instance}
      schema={remoteSchema}
      onCancel={onCancel}
      setSelectedQuery={setSelectedQuery}
    />;
  }

  return <RenderComponent
    component={component}
    setSelectedQuery={setSelectedQuery}
    graph_client={integration.__instance}
  />
}
