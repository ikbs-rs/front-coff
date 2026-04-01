import React from 'react';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';

const DeleteDialog = ({ visible, inAction, item, onHide, onDelete }) => {
  let action = inAction||"action"
  const deleteProductDialogFooter = (
    <div className="delete-confirm-dialog__footer">
      <Button label="Cancel" icon="pi pi-times" className="p-button-outlined p-button-secondary" onClick={onHide} />
      <Button label="Delete" icon="pi pi-trash" className="p-button-danger" onClick={onDelete} />
    </div>
  );

  return (
    <Dialog
      visible={visible}
      style={{ width: '450px' }}
      header="Confirm"
      modal
      footer={deleteProductDialogFooter}
      onHide={onHide}
      className="delete-confirm-dialog"
    >
      <div className="delete-confirm-dialog__content">
        <div className="delete-confirm-dialog__icon">
          <i className="pi pi-exclamation-triangle" />
        </div>
        {item && (
          <span className="delete-confirm-dialog__text">
           Are you sure you want to confirm the deletion: <b>{item}</b>?
          </span>
        )}
      </div>
    </Dialog>
  );
};

export default DeleteDialog;
