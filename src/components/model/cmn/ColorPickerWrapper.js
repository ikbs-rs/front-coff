import React, { useRef } from 'react';
import { ColorPicker } from 'primereact/colorpicker';

const ColorPickerWrapper = (props) => {
  const colorPickerRef = useRef(null);

  const handleEvent = (event) => {
    // Ovde možete dodati svoju logiku ili onemogućiti akcije koje želite
    event.preventDefault();
    event.stopPropagation();
  };

  return (
    <ColorPicker
      ref={(el) => (colorPickerRef.current = el)}
      onMouseDown={handleEvent}
      onMouseUp={handleEvent}
      onClick={handleEvent}
      {...props}
    />
  );
};

export default ColorPickerWrapper;
