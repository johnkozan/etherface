import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import {
  useMediaQuery,
  Box,
  Button,
  ButtonGroup,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Container,
  Dialog,
  Grid,
  IconButton,
  Slider,
  TextField,
  Typography,
} from '@material-ui/core';
import { useTheme, withStyles } from '@material-ui/core/styles';
import AddIcon from '@material-ui/icons/Add';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';

import { fromJS } from 'immutable';
import { useForm } from 'react-hooks-useform';

import { useComponentsByPageId } from '../../contexts/AppTemplateContext';
import { useActions } from '../../actions';
import { Confirm } from '../../components/Controls/Confirm';
import { GRID_COLS } from '../../constants';
import { defaultLayout } from './Page';
import { NewComponent, componentForType, componentsByColumn } from './Components';


const StyledSlider = withStyles({
  //track: {
    //width: '100% !important',
  //},
})(Slider);

function componentPreview(component, deleteComponent, setEditComponent) {
  const PreviewComponent = componentForType(component.type, 'preview');

  return (
    <Card variant="outlined">
      <CardHeader title={component.name || component.type} />

      <CardContent>
        <PreviewComponent component={component} />
      </CardContent>

      <CardActions>
        <Button size="small" startIcon={<EditIcon />} onClick={() => setEditComponent(component)}>Edit</Button>
        <Confirm onConfirm={() => deleteComponent(component)} title="Delete Component" description="Delete this component?">
          <IconButton edge="end" aria-label="delete">
            <DeleteIcon />
          </IconButton>
        </Confirm>

      </CardActions>

    </Card>
  );
}

const columnWithdsToSliderPositions = (columnWidths) => {
  let sliderPositions = [];
  if (!columnWidths || columnWidths.length === 1) {
    sliderPositions = [GRID_COLS];
  } else {
    for (let x = 1; x < columnWidths.length; x++) {
      sliderPositions.push(GRID_COLS - columnWidths[x]);
    }
  }
  return sliderPositions;
};

const sliderPositionsToColumnWidths = (sliderPositions) => {
  let remainder = 0;
  let columnWidths = [];
  sliderPositions.forEach(c => {
    columnWidths.push(c - remainder);
    remainder = remainder + (c - remainder);
  });
  if (remainder < GRID_COLS) { columnWidths.push(GRID_COLS - remainder); }

  return columnWidths;
};

export const EditPage = ({ page, onCancel }) => {
  const { editPage, deleteComponent } = useActions();
  const components = useComponentsByPageId(page.__id);
  const [editComponent, setEditComponent] = useState();
  const [showAddComponent, setShowAddComponent] = useState(false);
  const history = useHistory();

  let pageColumns;
  let pageColumnPositions;
  if (page.layout && page.layout.columns && Array.isArray(page.layout.columns)) {
    pageColumns = page.layout.columns.length;
    pageColumnPositions = page.layout.columns;
  } else {
    pageColumns = 1;
    pageColumnPositions = [GRID_COLS];
  }
  const [columnCount, setColumnCount] = useState(pageColumns);
  const [sliderPositions, setSliderPositions] = useState(columnWithdsToSliderPositions(pageColumnPositions));
  const [changesMade, setChangesMade] = useState(false);

  const initialValues = fromJS(page);
  const [fields, form] = useForm({
    fields: [
      { name: 'title', label: 'title', required: false },
    ],
    initialValues,
    submit: values => {
      editPage({
        ...page,
        title: values.get('title'),
      });
      onCancel();
    }
  });

  const returnToPage = () => {
    onCancel();
  };

  if (editComponent !== undefined) {
    const component = components[editComponent.__id];
    const EditComponent = componentForType(component.type, 'edit');
    return <EditComponent component={component} onCancel={() => setEditComponent(undefined)} onSave={returnToPage} />;
  }

  let maxRow = 1;
  Object.keys(components).forEach(componentKey => {
    const component = components[componentKey];
    const componentLayout = component.layout || defaultLayout;
    if (componentLayout.row > maxRow) { maxRow = componentLayout.row; }
  });

  const columnWidths = sliderPositionsToColumnWidths(sliderPositions);
  let componentGrid = (
    <Grid container spacing={1}>
      { columnWidths.map((colSize,colNum) => {
        const actualColNum = colNum + 1; // columns are 1 based
        const rowComponents = componentsByColumn(components, actualColNum);
        return <Grid item xs={colSize} key={`col-${actualColNum}`}>
          <Grid container spacing={1}>
            { rowComponents.map(component =>
              <Grid item xs={GRID_COLS} key={`component-${component.__id}`}>
                { componentPreview(component, deleteComponent, setEditComponent) }
              </Grid>
            )}
            <Grid item xs={GRID_COLS} style={{textAlign: 'center'}}>
              <Card>
                <CardContent>
                  <Button color="primary" aria-label="Add component in new row"
                    component="span" startIcon={<AddIcon />}
                    onClick={() => setShowAddComponent({column: actualColNum, row: rowComponents.length + 1})}>
                    Add Component Here
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Grid>
      })}
    </Grid>
  );

  const marks = [
    {value: 1, label: '1'},
    {value: 2, label: '2'},
    {value: 3, label: '3'},
    {value: 4, label: '4'},
    {value: 5, label: '5'},
    {value: 6, label: '6'},
    {value: 7, label: '7'},
    {value: 8, label: '8'},
    {value: 9, label: '9'},
    {value: 10, label: '10'},
    {value: 11, label: '11'},
    {value: 12, label: '12'},
  ];

  const updateColumnCount = (c) => {
    let newSliderPositions = [];
    if (c == 1) {
      newSliderPositions.push(GRID_COLS);
    } else {
      for (let x=1; x <= (c - 1); x++) {
        newSliderPositions.push((GRID_COLS / c) * x);
      }
    }
    setColumnCount(c);
    setSliderPositions(newSliderPositions.sort());
    setChangesMade(true);
  }

  const saveLayoutChanges = () => {
    const columns = sliderPositionsToColumnWidths(sliderPositions);
    editPage({
      ...page,
      layout: {
        ...page.layout,
        columns,
      },
    });
    onCancel();
  };

  const updateSliderPositions = (positions) => {
    setSliderPositions(positions);
    setChangesMade(true);
  };

  return (
    <div>
      { showAddComponent ? <NewComponentModal page_id={page.__id} column={showAddComponent.column} row={showAddComponent.row} preSave={saveLayoutChanges} onCancel={() => setShowAddComponent(false)} /> : undefined }
      <Card>
        <CardHeader title="Page properties" />
        <CardContent>

          <TextField {...fields.title} />

        </CardContent>

        <CardActions>
          <Button color="primary" variant="outlined" onClick={form.submit}>Save</Button>
        </CardActions>

      </Card>

      <Card>
        <CardHeader title="Layout" />
        <CardContent>
          <Grid container>
            <Grid item xs={4}>
              { /* TODO: ButtonGroup should not be inside Typography */ }
              <Typography>
                Columns
                { ' ' }
                <ButtonGroup size="large" color="primary" aria-label="large outlined primary button group">
                  <Button variant="outlined" color={columnCount === 1 ? 'primary' : 'default'} onClick={() => updateColumnCount(1)}>One</Button>
                  <Button variant="outlined" color={columnCount === 2 ? 'primary' : 'default'} onClick={() => updateColumnCount(2)}>Two</Button>
                  <Button variant="outlined" color={columnCount === 3 ? 'primary' : 'default'} onClick={() => updateColumnCount(3)}>Three</Button>
                </ButtonGroup>
              </Typography>
            </Grid>

            <Grid item xs={8}>
              <StyledSlider marks={marks} min={1} max={GRID_COLS} value={sliderPositions} disabled={columnCount === 1} onChange={(evt,val) => updateSliderPositions(val)} />
            </Grid>

          </Grid>

          { componentGrid }

        </CardContent>

      </Card>

      <Box my={4}>
        <Button variant="outlined" onClick={onCancel}>Return to Page</Button>
        { ' ' }
        <Button color="primary" variant="outlined" disabled={!changesMade} onClick={saveLayoutChanges}>Save Layout</Button>
      </Box>
    </div>
  );
}


const NewComponentModal = ({page_id, row, column, onCancel, preSave}) => {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'));

  return (
    <Dialog fullScreen={fullScreen} open={true}>
      <Container fixed>
        <NewComponent page_id={page_id} row={row} column={column} preSave={preSave} />
        <Button variant="outlined" onClick={onCancel}>Cancel</Button>
      </Container>
    </Dialog>
  );
}
