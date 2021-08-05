import React from 'react';
import { CustomPicker } from 'react-color';
import {
  EditableInput,
  Hue,
  Saturation,
} from 'react-color/lib/components/common';

export function ColorPicker({ hex, hsl, hsv, onChange }) {
  return (
    <div>
      <div>
        <Hue hsl={hsl} onChange={onChange} />
      </div>

      <div>
        <Saturation hsl={hsl} hsv={hsv} onChange={onChange} />
      </div>

      <div>
        <EditableInput value={hex} onChange={onChange} />
        <div />
      </div>
    </div>
  );
}

export default CustomPicker(ColorPicker);
