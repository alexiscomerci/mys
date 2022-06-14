import { Grid, InputAdornment, Slider, Stack, TextField } from "@mui/material";
import React, { useState } from "react";

export default function MySlider(props) {
  const [min, setMin] = useState(props.min);
  const [max, setMax] = useState(props.max);

  const handleChange = (event, newValue) => {
    props.setValue(newValue);
    if (newValue < +min) setMin(newValue);
    if (newValue > +max) setMax(newValue);
  };

  return (
    <Grid item xs={12} container spacing={2}>
      <Grid item xs={12}>
        <TextField
          value={props.value}
          onChange={(e) => handleChange(e, e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">{props.label} =</InputAdornment>
            ),
          }}
          fullWidth
          type="number"
        />
      </Grid>
      <Grid item xs={12}>
        <Stack spacing={2} direction="row" sx={{ mb: 1 }} alignItems="center">
          <TextField
            value={min}
            onChange={(e) => setMin(e.target.value)}
            label="Min"
            type="number"
          />
          <Slider
            aria-label="Volume"
            value={props.value}
            onChange={handleChange}
            min={min}
            max={max}
          />
          <TextField
            value={max}
            onChange={(e) => setMax(e.target.value)}
            label="Max"
            type="number"
          />
        </Stack>
      </Grid>
    </Grid>
  );
}
