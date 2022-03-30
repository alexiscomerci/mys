import "./App.css";
import "katex/dist/katex.min.css";

import { Container, Grid, InputAdornment, TextField } from "@mui/material";
import React, { useEffect, useRef, useState } from "react";

import { BlockMath } from "react-katex";
import EquationEditor from "equation-editor-react";
import Mexp from "math-expression-evaluator";
import Plot from "react-plotly.js";
import helper from "./helper";

function App() {
  const [equation, setEquation] = useState("");
  // const [exp, setExp] = useState("x");
  const [a, setA] = useState(0);
  const [b, setB] = useState(1);
  const [N, setN] = useState(2);
  const [integralIntervals, setIntegralIntervals] = useState(1000);
  // const [integralValues, setIntegralValues] = useState({ x: [], y: [] });
  const [integral, setIntegral] = useState({ x: [], y: [], result: 0 });
  const [rectangle, setRectangle] = useState({ x: [], y: [], result: 0 });
  // const [integralResult, setIntegralResult] = useState(0);
  const eqInputRef = useRef(null);

  useEffect(() => {
    try {
      setIntegral(helper.integral(a, b, equation, integralIntervals));
      setRectangle(helper.areaRectangle(a, b, equation, N));
    } catch (e) {
      console.log(e);
    }
  }, [equation, a, b, N, integralIntervals]);

  function latexExp() {
    return `f(x)=\\int_{${a}}^{${b}} \\left(${equation}\\right) \\, dx = ${integral.result.toFixed(4)}`.replace(
      /(\d+\d)/g,
      "{$1}"
    );
  }

  return (
    <Container>
      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <div
            id="equationContainer"
            onClick={() => eqInputRef.current.element.current.children[0].children[0].focus()}
          >
            <span id="fx">f(x) = </span>
            <EquationEditor
              value={equation}
              onChange={setEquation}
              autoCommands="pi theta sqrt sum prod alpha beta gamma rho"
              autoOperatorNames="sin cos tan arcsin arccos arctan"
              ref={eqInputRef}
            />
          </div>
        </Grid>
        <Grid item md={6}></Grid>
        <Grid item xs={4} md={2}>
          <TextField
            variant="outlined"
            value={a}
            onChange={(e) => setA(e.target.value)}
            InputProps={{
              startAdornment: <InputAdornment position="start">a=</InputAdornment>,
            }}
            fullWidth
          />
        </Grid>
        <Grid item xs={4} md={2}>
          <TextField
            variant="outlined"
            value={b}
            onChange={(e) => setB(e.target.value)}
            InputProps={{
              startAdornment: <InputAdornment position="start">b=</InputAdornment>,
            }}
            fullWidth
          />
        </Grid>
        <Grid item xs={4} md={2}>
          <TextField
            variant="outlined"
            value={N}
            onChange={(e) => setN(e.target.value)}
            InputProps={{
              startAdornment: <InputAdornment position="start">N=</InputAdornment>,
            }}
            fullWidth
          />
        </Grid>
        <Grid item xs={12}>
          <BlockMath>{latexExp()}</BlockMath>
        </Grid>
        <Grid item xs={12}>
          Rect: {rectangle.result}
        </Grid>

        {/* <Grid item xs={12}>
          {equation}
        </Grid> */}
        <Grid item xs={12}>
          <Plot
            data={[
              { x: integral.x, y: integral.y, mode: "lines", name: "Exacta" },
              {
                x: rectangle.x,
                y: rectangle.y,
                width: (b - a) / N,
                type: "bar",
                name: "Rectángulo",
              },
            ]}
            layout={{
              width: "100%",
              height: "100%",
              xaxis: {
                title: "x",
                zeroline: true,
              },
              yaxis: {
                scaleanchor: "x",
                scaleratio: "1",
                title: "f(x)",
                zeroline: true,
              },
            }}
          />
        </Grid>
      </Grid>
    </Container>
  );
}

export default App;
