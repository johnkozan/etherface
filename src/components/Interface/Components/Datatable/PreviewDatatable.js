import React from 'react';
import {
  Typography,
} from '@material-ui/core';

export const PreviewDatatable = ({ component }) => {

  return (
    <div>
      <Typography>Data source: { component.data_source.endpoint }</Typography>
      <Typography>Type: { component.options.typeName }</Typography>
      <Typography>Fields: { component.options.fields.map(f => f.name).join(' ') }</Typography>
    </div>
  );
}
