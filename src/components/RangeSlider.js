import React from 'react';
import Slider from '@material-ui/core/Slider';

function round(v) {
  if (v >= 1000000000000) {
    const f = Math.pow(10, 1 + Math.floor(Math.log10(v / 1000)));
    v = Math.round(v / f) * f;
  } else if (v >= 1000000000) {
    const f = Math.pow(10, 1 + Math.floor(Math.log10(v / 1000)));
    v = Math.round(v / f) * f;
  } else if (v >= 1000000) {
    const f = Math.pow(10, 1 + Math.floor(Math.log10(v / 1000)));
    v = Math.round(v / f) * f;
  } else if (v >= 1000) {
    const f = Math.pow(10, 1 + Math.floor(Math.log10(v / 1000)));
    v = Math.round(v / f) * f;
  }
  if (v > 0) {
    return Math.ceil(v);
  }
  return Math.floor(v);
}

const fmt = (v) => {
  if (v >= 1000000000000) {
    const r = v / 1000000000000;
    return r.toFixed(2 - Math.floor(Math.log10(r))) + 'T'
  }
  if (v >= 1000000000) {
    const r = v / 1000000000;
    return r.toFixed(2 - Math.floor(Math.log10(r))) + 'B'
  }
  if (v >= 1000000) {
    const r = v / 1000000;
    return r.toFixed(2 - Math.floor(Math.log10(r))) + 'M'
  }
  if (v >= 1000) {
    const r = v / 1000;
    return r.toFixed(2 - Math.floor(Math.log10(r))) + 'K'
  }
  if (v > 0) {
    return Math.ceil(v);
  }
  return Math.floor(v);
}

const fmts = (v) => {
  if (v >= 1000000000000) {
    const r = v / 1000000000000;
    return r + 'T';
  }
  if (v >= 1000000000) {
    const r = v / 1000000000;
    return r + 'B';
  }
  if (v >= 1000000) {
    const r = v / 1000000;
    return r + 'M';
  }
  if (v >= 1000) {
    const r = v / 1000;
    return r + 'K';
  }
  return v;
}

export default function RangeSlider(props) {
  const id = props.id
  const bounds = props.bounds[id];
  const filters = props.filters[id];
  const [value, setValue] = React.useState(filters);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const update = (event, newValue) => {
    props.update(id, [round(newValue[0]), round(newValue[1])]);
  }

  const marks = [
    {
      label: fmts(bounds[0]),
      value: round(bounds[0])
    },
    {
      label: fmts(bounds[0] + (bounds[1] - bounds[0]) / 4),
      value: round(bounds[0] + (bounds[1] - bounds[0]) / 4)
    },
    {
      label: fmts((bounds[1] + bounds[0]) / 2),
      value: round((bounds[1] + bounds[0]) / 2)
    },
    {
      label: fmts(bounds[0] + 3 * (bounds[1] - bounds[0]) / 4),
      value: round(bounds[0] + 3 * (bounds[1] - bounds[0]) / 4)
    },
    {
      label: fmts(bounds[1]),
      value: round(bounds[1])
    }
  ];

  return (
    <Slider
      min={bounds[0]}
      max={bounds[1]}
      marks={marks}
      value={value}
      onChange={handleChange}
      onChangeCommitted={update}
      valueLabelDisplay="auto"
      valueLabelFormat={fmt}
      aria-labelledby="range-slider"
    />
  );
}