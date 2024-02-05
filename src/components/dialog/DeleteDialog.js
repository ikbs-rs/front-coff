import React from 'react';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';

const DeleteDialog = ({ visible, inAction, item, onHide, onDelete }) => {
  let action = inAction||"action"
  const deleteProductDialogFooter = (
    <div>
      <Button label="Cancel" icon="pi pi-times" className="p-button-text" onClick={onHide} />
      <Button label="Delete" icon="pi pi-trash" className="p-button-danger" onClick={onDelete} />
    </div>
  );

  return (
    <Dialog visible={visible} style={{ width: '450px' }} header="Confirm" modal footer={deleteProductDialogFooter} onHide={onHide}>
      <div className="flex align-items-center justify-content-center">
        <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
        {item && (
          <span>
           Are you sure you want to confirm the deletion: <b>{item}</b>?
          </span>
        )}
      </div>
    </Dialog>
  );
};

export default DeleteDialog;
