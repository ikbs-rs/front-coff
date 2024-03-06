import React, { useState, useEffect } from "react";
import { InputNumber } from "primereact/inputnumber";

export default function YourComponent(props) {
  const [values, setValues] = useState({});

  const data =[
    { id: 1, um: 1, name: 'Espreso', izlaz: '1', img: 'assets/img/menu/1.jpg', description: '' },
  ]

  // Postavite vrednosti na početnu vrednost kada se podaci promene
  useEffect(() => {
    const initialValues = {};
    data.forEach((item) => {
      initialValues[item.id] = item.izlaz || 0; // Postavite na 0 ako je izlaz null ili undefined
    });
    setValues(initialValues);
  }, [data]);

  // Ažurirajte vrednost kada korisnik promeni vrednost
  const handleValueChange = (id, newValue) => {
    setValues((prevValues) => ({
      ...prevValues,
      [id]: newValue
    }));
  };

  const handleCancelClick = () => {
    props.handleDialogClose({ obj: data, cenaTip: props.cenaTip, refresh: true});
    props.setVisible(false);
};

  return (
    <div>
      {data.map((item) => (
        <div key={item.id}>
          <label htmlFor={`input-${item.id}`}>{item.text}</label>
          <InputNumber
            id={`input-${item.id}`}
            value={values[item.id] || 0} // Postavite na 0 ako je vrednost null ili undefined
            onValueChange={(e) => handleValueChange(item.id, e.value)}
            showButtons
            buttonLayout="horizontal"
            step={1}
            decrementButtonClassName="p-button-danger"
            incrementButtonClassName="p-button-success"
            incrementButtonIcon="pi pi-plus"
            decrementButtonIcon="pi pi-minus"
          />
        </div>
      ))}
    </div>
  );
}
