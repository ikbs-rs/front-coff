import React from 'react';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';

const ConfirmDialog = ({ visible, onHide, onConfirm, uPoruka }) => {
  let pPoruka = "Automatski unos, da li ste sigurni?"
  pPoruka = uPoruka||pPoruka
  const confirmDialogFooter = (
    <div>
      <Button label="Cancel" icon="pi pi-times" className="p-button-text" onClick={onHide} />
      <Button label="Confirm" icon="pi pi-check" className="p-button-success" onClick={onConfirm} />
    </div>
  );

  return (
    <Dialog visible={visible} style={{ width: '450px' }} header="Confirm" modal footer={confirmDialogFooter} onHide={onHide}>
      <div className="flex align-items-center justify-content-center">
        <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
        <span>
         {pPoruka}
        </span>
      </div>
    </Dialog>
  );
};

export default ConfirmDialog;
