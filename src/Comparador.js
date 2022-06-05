
import {TextField } from "@mui/material";
import * as React from 'react';


export default function Comparador(props) {
    return (
        <React.Fragment>
            <br></br>
            <br></br>
            Diferencia con método exacto:
            <TextField
                value={(Math.abs(100-(props.comparedResult*100)/props.exactResult)).toFixed(4) + "%"|| 0 + "%"}
                disable = {true}
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
