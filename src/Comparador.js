import * as React from "react";

import { TextField } from "@mui/material";

export default function Comparador(props) {
  return (
    <React.Fragment>
      <br></br>
      <br></br>
      Diferencia con valor de referencia:
      <TextField
        value={
          Math.abs(
            100 - (props.comparedResult * 100) / props.exactResult
          ).toFixed(2) + "%" || 0 + "%"
        }
        disable={true}
        InputProps={{
          readOnly: true,
        }}
        fullWidth
        variant="filled"
        size="small"
      />
    </React.Fragment>
  );
}
