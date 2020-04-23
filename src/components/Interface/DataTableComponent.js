import React, { useState } from "react";
import { makeStyles } from "@material-ui/styles";
import {
  Card,
  CardActions,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableFooter,
  TablePagination,
  TableHead,
  TableRow,
  Paper
} from "@material-ui/core";

import { TablePaginationActions } from './TablePaginationActions';
import { Spinner } from "components/Controls/Spinner";

import gql from "graphql-tag";
import { useQuery } from "@apollo/react-hooks";


const useStyles = makeStyles(theme => ({
  root: {},
  submitButton: {},
  error: {
    color: "red"
  },
  fakelink: {
    cursor: 'pointer',
    textDecoration: 'underline',
  },
}));

const PER_PAGE_OPTS = [10, 25, 50];

export const DataTableComponent = ({ component, setSelectedQuery, graph_client }) => {
  const classes = useStyles();
  const { fields } = component.options;
  const [page, setPage] = useState(0);
  const [perPage, setPerPage] = useState(PER_PAGE_OPTS[0]);

  const queryFields = fields.filter(f => f.type === 'ID' || (f.enabled && f.kind !== 'LIST'));
  const skip = page * perPage;

  const query = gql`
      query Query {
        ${component.options.listQuery}(first: ${perPage}, skip: ${skip}) {
          ${queryFields.map(f => f.name).join('\n')}
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

  // hacky
  const rows = data[Object.keys(data)[0]];

  if (rows.length < 1) {
    return <div>No data</div>;
  }

  const cols = Object.keys(rows[0]).filter(r => r.substr(0, 2) !== "__");

  function renderCell(value, colName, type) {
    if (colName === 'id') {
      return <div className={classes.fakelink} onClick={() => setSelectedQuery({model: type, id: value})}>{ value }</div>
    }

    return value;
  }

  const handleChangePage = (val) => {
  };

  const handleChangeRowsPerPage = (evt => {
    setPerPage(evt.target.value);
  });

  return (
    <div className={classes.root}>
      <Card>
        <CardContent>
          <div>
            <TableContainer component={Paper}>
              <Table className={classes.table} aria-label="table">
                <TableHead>
                  <TableRow>
                    {cols.map((c, k) => (
                      <TableCell key={`col-${k}`}>
                        {c}
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {rows.map((r, k) => (
                    <TableRow key={`row-${k}`}>
                      {cols.map((c, kk) => (
                        <TableCell key={`cell-${k}-${kk}`}>
                          { renderCell(r[c], c, r.__typename) }
                        </TableCell>
                      ))}
                    </TableRow>
                  ))}
                </TableBody>

                <TableFooter>
                  <TablePagination
                    rowsPerPageOptions={PER_PAGE_OPTS}
                    colSpan={3}
                    pageCount={rows.length}
                    rowsPerPage={perPage}
                    page={page}
                    SelectProps={{
                      inputProps: { 'aria-label': 'rows per page' },
                      native: true,
                    }}
                    onChangePage={handleChangePage}
                    onChangeRowsPerPage={handleChangeRowsPerPage}
                    ActionsComponent={TablePaginationActions}
                  />
                </TableFooter>

              </Table>
            </TableContainer>
          </div>
        </CardContent>

        <CardActions></CardActions>
      </Card>
    </div>
  );
};
