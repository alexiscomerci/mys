import logo from "./logo.svg";
import "./App.css";
import Plot from "react-plotly.js";
import { Container, TextField } from "@mui/material";
import React, { useState } from "react";

function App() {
  const [exp, setExp] = useState("x");

  var xValues = [];
  var yValues = [];
  for (var x = -10; x <= 10; x += 0.1) {
    xValues.push(x);
    try {
      yValues.push(eval(exp));
    } catch {}
  }

  return (
    <Container>
      <TextField
        id="outlined-basic"
        label="Outlined"
        variant="outlined"
        value={exp}
        onChange={(e) => setExp(e.target.value)}
      />
      <Plot
        data={[{ x: xValues, y: yValues, mode: "lines" }]}
        layout={{ width: "100%", height: "100%", title: "Título" }}
      />
    </Container>
  );
}

export default App;
