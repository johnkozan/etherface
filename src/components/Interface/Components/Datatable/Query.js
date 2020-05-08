import React, { useState } from 'react';
import { makeStyles } from "@material-ui/styles";
import {
  Button,
  Table,
  TableBody,
  TableCell,
  TableRow,
  Typography,
} from '@material-ui/core';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';

import gql from "graphql-tag";
import { useQuery } from "@apollo/react-hooks";

import { Spinner } from "components/Controls/Spinner";

const useStyles = makeStyles(theme => ({
  fakelink: {
    cursor: 'pointer',
    textDecoration: 'underline',
  },
}));

export const Query = ({ graph_client, model, id, fields, onCancel, setSelectedQuery }) => {
  const classes = useStyles();
  const [expandLists, setExpandLists] = useState({});

  if (!model) { throw new Error('Model name required'); }

  const toggleExpand = (field) => {
    if (expandLists[field]) {
      setExpandLists({...expandLists, [field]: false});
    } else {
      setExpandLists({...expandLists, [field]: true});
    }
  };

  const fieldQuery = field => {
    if (field.kind === 'LIST' || field.kind === 'OBJECT') {
      return `${field.name} { id }`;
    } else {
      return field.name;
    }
  };

  const query = gql`
    query Query {
      ${model}(id: "${id}") {
        ${fields.map(fieldQuery).join('\n')}
      }
    }
  `;

  const { loading, error, data } = useQuery(query, {
    client: graph_client,
  });

  if (loading) {
    return <Spinner />;
  }

  if (error) {
    return <div>Error: {error.toString()}</div>;
  }

  const renderCell = (value) => {
    if (value === null) { return value; }
    if (typeof(value) === 'string') { return value; }
    if (typeof(value) === 'object' && !!value.id && !!value.__typename) {
      return <div
        className={classes.fakelink}
        onClick={() => setSelectedQuery({model: value.__typename, id: value.id})}
      >
        { value.__typename} - { value.id }
      </div>;
    }

    return value;
  }

  const rows = Object.keys(data[model]).filter(k => k.substr(0,2) !== '__');
  const m = data[model];

  return (
    <div>
      <Typography variant="h5">
        {model}
      </Typography>
      <Typography variant="h6">
        {id}
      </Typography>
      <Table>
        <TableBody>
          { rows.map(rowName =>
            <>
            <TableRow>
              <TableCell>
                <strong>{rowName}</strong>
              </TableCell>
              <TableCell>
                { Array.isArray(m[rowName]) ?
                    <div className={classes.fakelink} onClick={() => toggleExpand(rowName)}>
                      { m[rowName].length } { m[rowName].length > 0 ? m[rowName][0].__typename ? m[rowName][0].__typename : 'record' : undefined}{m[rowName].length > 1 ? 's' : undefined}
                      { expandLists[rowName] ? <KeyboardArrowDownIcon /> : <ChevronRightIcon /> }
                    </div>
                    : renderCell(data[model][rowName])
                }
              </TableCell>
            </TableRow>
            { Array.isArray(m[rowName]) && expandLists[rowName] ?
                m[rowName].map((row, k) =>
                <TableRow key={`${row}-${k}`}>
                <TableCell></TableCell>
                <TableCell>
                  { renderCell(row) }
                </TableCell>
                  </TableRow>
                )
                : undefined }
            </>

            ) }

          </TableBody>
        </Table>

        <br />

        <Button variant="outlined" onClick={onCancel}>Back</Button>
      </div>
  );
}
