import React, { useState } from "react";

import clsx from "clsx";
import Portal from "@material-ui/core/Portal";
import CloseIcon from "@material-ui/icons/Close";
import ErrorIcon from "@material-ui/icons/Error";
import IconButton from "@material-ui/core/IconButton";
import Snackbar from "@material-ui/core/Snackbar";
import SnackbarContent from "@material-ui/core/SnackbarContent";
import { amber, green } from "@material-ui/core/colors";
import { makeStyles } from "@material-ui/core/styles";

  const useStyles = makeStyles(theme => ({
    success: {
      backgroundColor: green[600]
    },
    error: {
      backgroundColor: theme.palette.error.dark
    },
    info: {
      backgroundColor: theme.palette.primary.main
    },
    warning: {
      backgroundColor: amber[700]
    },
    icon: {
      fontSize: 20
    },
    iconVariant: {
      opacity: 0.9,
      marginRight: theme.spacing(1)
    },
    message: {
      display: "flex",
      alignItems: "center"
    }
  }));

export const ErrorMsg = ({ message }) => {
  const variant = "error";
  const [open, setOpen] = React.useState(true);

  const classes = useStyles();

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setOpen(false);
  };

  if (!open) {
    return null;
  }

  return (
    <Portal>
      <Snackbar
        anchorOrigin={{
          vertical: "top",
          horizontal: "center"
        }}
        open={open}
        onClose={handleClose}
      >
        <SnackbarContent
          className={clsx(classes[variant])}
          aria-describedby="client-snackbar"
          message={
            <span id="client-snackbar">
              <ErrorIcon className={clsx(classes.icon, classes.iconVariant)} />
              {message}
            </span>
          }
          action={[
            <IconButton
              key="close"
              aria-label="close"
              color="inherit"
              onClick={handleClose}
            >
              <CloseIcon className={classes.icon} />
            </IconButton>
          ]}
          onClose={handleClose}
        />
      </Snackbar>
    </Portal>
  );
};
