import React, { useState } from "react";

import { Query } from "./Query";
import { ShowDatatable } from './ShowDatatable';
import { useIntegration } from '../../../../contexts/AppTemplateContext';
import { useRemoteSchema } from '../../../../lib/thegraph';
import { typeNameToQuerySingle, fieldsForTypeName } from '../../../../lib/graphql';
import { Spinner } from '../../../../components/Controls/Spinner';

export const GraphQLComponent = ({ component }) => {
  const integration = useIntegration(component.data_source.type, component.data_source.endpoint);
  const [selectedQuery, setSelectedQuery] = useState();
  const needSchema = selectedQuery !== undefined && selectedQuery.model !== component.options.typeName;
  const remoteSchema = useRemoteSchema(needSchema ? integration.endpoint : undefined);

  const onCancel = () => {
    setSelectedQuery(undefined);
  };

  if (selectedQuery) {

    if (!remoteSchema && needSchema) {
      return <Spinner />;
    }

    const model = needSchema ? typeNameToQuerySingle(selectedQuery.model, remoteSchema) : component.options.singleQuery;
    const fields = needSchema ? fieldsForTypeName(selectedQuery.model, remoteSchema) : component.options.fields;
    return <Query
      model={model}
      id={selectedQuery.id}
      fields={fields}
      graph_client={integration.__instance}
      schema={remoteSchema}
      onCancel={onCancel}
      setSelectedQuery={setSelectedQuery}
    />;
  }

  return <ShowDatatable
    component={component}
    setSelectedQuery={setSelectedQuery}
    graph_client={integration.__instance}
  />
}
