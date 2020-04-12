import React, { useState } from "react";
import { makeStyles } from "@material-ui/styles";
import {
  Grid,
  Button,
  TextField,
  Typography,
  Card,
  CardContent,
  CardActions,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper
} from "@material-ui/core";

import { Spinner } from "./Spinner";

import gql from "graphql-tag";
import { useQuery } from "@apollo/react-hooks";

import { useIntegration } from './AppTemplateStore';

const useStyles = makeStyles(theme => ({
  root: {},
  submitButton: {},
  error: {
    color: "red"
  }
}));

export const DataTableComponent = ({ component }) => {
  const graph_client = useIntegration(component.data_source.type, component.data_source.endpoint);
  //const { content, options, contract, graph_client } = props;
  const classes = useStyles();
  //const dtContent = JSON.parse(content);
  const { model, fields } = component.options;


  const perPage = 10;

  const query = gql`
    query Query {
      ${component.options.model}(first: ${perPage}) {
        ${component.options.fields.join('\n')}
      }
    }
  `;

  console.log("CLIENT:: ", graph_client);
  console.log("GRAPH QUERY: ", query);

  const { loading, error, data } = useQuery(query, {
    client: graph_client
  });
  if (!graph_client) {
    return <div>Data Link not configured.</div>;
  }

  if (loading) {
    return <Spinner />;
  }

  if (error) {
    return <div>Error: {error.toString()}</div>;
  }

  const rows = data[model];

  if (rows.length < 1) {
    return <div>No data</div>;
  }

  const cols = Object.keys(rows[0]).filter(r => r.substr(0, 2) !== "__");

  return (
    <div className={classes.root}>
      <Card>
        <CardContent>
          <div>
            <Typography variant="h3">Title...</Typography>

            <Typography>description ...</Typography>

            <TableContainer component={Paper}>
              <Table className={classes.table} aria-label="table">
                <TableHead>
                  <TableRow>
                    {cols.map((c, k) => (
                      <TableCell key={`col-${k}`}>{c}</TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {rows.map((r, k) => (
                    <TableRow key={`row-${k}`}>
                      {cols.map((c, kk) => (
                        <TableCell key={`cell-${k}-${kk}`}> {r[c]}</TableCell>
                      ))}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </div>
        </CardContent>

        <CardActions></CardActions>
      </Card>
    </div>
  );
};
