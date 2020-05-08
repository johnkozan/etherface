import React from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';

import 'emoji-mart/css/emoji-mart.css';
import data from 'emoji-mart/data/apple.json'
import { NimblePicker } from 'emoji-mart';

export const EmojiPicker = ({ onSelect, onRemove }) => {
  return (
    <div>
      <Dialog
        open={true}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >

      <DialogContent>
        <NimblePicker set="apple" onSelect={onSelect} data={data} />
      </DialogContent>

      <DialogActions>
        <Button onClick={onRemove}>
          Remove Icon
        </Button>
      </DialogActions>
    </Dialog>

  </div>
  );
};
