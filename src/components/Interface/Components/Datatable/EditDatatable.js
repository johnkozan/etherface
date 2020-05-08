import React, { useState } from 'react';
import {
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Checkbox,
  List,
  ListItem,
  ListItemIcon,
  ListItemSecondaryAction,
  ListItemText,
  Typography,
} from '@material-ui/core';

import { useActions } from 'actions';

export const EditDatatable = ({ component, onCancel }) => {
  const { editComponent } = useActions();

  const componentFields = component.options.fields;
  const initialChecked = componentFields.map((f,k) => f.enabled ? k : undefined).filter(f => !!f);
  const [checked, setChecked] = useState(initialChecked);

  const handleToggle = (value) => () => {
    const currentIndex = checked.indexOf(value);
    const newChecked = [...checked];
    if (currentIndex === -1) {
      newChecked.push(value);
    } else {
      newChecked.splice(currentIndex, 1);
    }
    setChecked(newChecked);
  };

  const handleSubmit = () => {
    let newComponent = Object.assign({}, component);
    // apply checks
    newComponent.options.fields.forEach((f,k) => {
      newComponent.options.fields[k].enabled = checked.includes(k);
    });
    editComponent(newComponent);
    onCancel();
  }

  return (
    <div>
      <Card>
        <CardHeader title="Editing component" />
        <CardContent>
          <Typography gutterBottom>Fields</Typography>
          <List dense={false}>
            { componentFields && componentFields.map((field,k) => (
              <ListItem key={k} value={k} button onClick={handleToggle(k)}>
                <ListItemIcon>
                  <Checkbox
                    edge="start"
                    checked={checked.indexOf(k) !== -1}
                    tabIndex={-1}
                    disableRipple
                    inputProps={{ 'aria-labelledby': 'checkbox-list-label-' }}
                  />
                </ListItemIcon>
                <ListItemText
                  primary={field.name}
                  secondary={field.type}
                />
                <ListItemSecondaryAction>
                </ListItemSecondaryAction>
              </ListItem>
            )) }
          </List>
        </CardContent>

        <CardActions>
          <Button variant="outlined" color="primary" onClick={handleSubmit}>Save</Button>
          <Button variant="outlined" onClick={onCancel}>Cancel</Button>
        </CardActions>
      </Card>
    </div>
  );
};
