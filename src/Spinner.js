import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import LinearProgress from "@material-ui/core/LinearProgress";
import CircularProgress from "@material-ui/core/CircularProgress";

const useStyles = makeStyles(theme => ({
  root: {
    width: "100%",
    "& > * + *": {
      marginTop: theme.spacing(2)
    }
  }
}));

export const Spinner = props => {
  const { variant, ...rest } = props;
  const classes = useStyles();

  const SpinnerComponent =
    variant === "circle" ? CircularProgress : LinearProgress;

  return (
    <div className={classes.root}>
      <SpinnerComponent {...rest} />
    </div>
  );
};
