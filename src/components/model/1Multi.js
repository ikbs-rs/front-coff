import React, { useState } from "react";
import { MultiSelect } from "primereact/multiselect";

export default function Multi() {
  const [selectedCities, setSelectedCities] = useState(null);
  const cities = [
    { name: "New York", code: "NY" },
    { name: "Rome", code: "RM" },
    { name: "London", code: "LDN" },    
    { name: "Istanbul", code: "IST" },
    { name: "Paris", code: "PRS" },
  ];
  const onNesto = (e) => {
    console.log(e.value, "-------------------");
    setSelectedCities(e.value);
  };
  return (
    <div className="card flex justify-content-center">
      <form  className="flex flex-column align-items-center gap-2">
      <MultiSelect
        value={selectedCities}
        onChange={(e) => onNesto(e)}
        options={cities}
        optionLabel="name"
        placeholder="Select Cities"
        maxSelectedLabels={3}
        className="w-full md:w-20rem"
      />
      </form>
    </div>
  );
}
