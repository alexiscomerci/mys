import { Grid, InputAdornment, Slider, Stack, TextField } from "@mui/material";
import React, { useState } from "react";

export default function MySlider(props) {
  const [min, setMin] = useState(props.min || -2);
  const [max, setMax] = useState(props.max || 2);

  const handleChange = (event, newValue) => {
    props.setValue(+newValue);
  };

  return (
    <Grid item xs={12} container spacing={2}>
      <Grid item xs={12}>
        <TextField
          value={props.value}
          onChange={(e) => props.setValue(e.target.value)}
          InputProps={{
            startAdornment: <InputAdornment position="start">{props.label} =</InputAdornment>,
          }}
          fullWidth
        />
      </Grid>
      <Grid item xs={12}>
        <Stack spacing={2} direction="row" sx={{ mb: 1 }} alignItems="center">
          <TextField value={min} onChange={(e) => setMin(+e.target.value)} label="Min" />
          <Slider aria-label="Volume" value={props.value} onChange={handleChange} min={min} max={max} />
          <TextField value={max} onChange={(e) => setMax(+e.target.value)} label="Max" />
        </Stack>
      </Grid>
    </Grid>
  );
}
