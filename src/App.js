import "./App.css";
import "katex/dist/katex.min.css";

import { Container, Grid, InputAdornment, TextField } from "@mui/material";
import React, { useRef, useState } from "react";

import { BlockMath } from "react-katex";
import EquationEditor from "equation-editor-react";
import Mexp from "math-expression-evaluator";
import Plot from "react-plotly.js";

function App() {
  const [equation, setEquation] = useState("x");
  // const [exp, setExp] = useState("x");
  const [a, setA] = useState(0);
  const [b, setB] = useState(10);
  const [N, setN] = useState(10);
  const eqInputRef = useRef(null);

  var xValues = [];
  var yValues = [];
  console.log(latexToNormal());
  let expNormal = latexToNormal();
  for (var x = +a; x <= +b; x += 0.1) {
    x = +x.toFixed(1);
    xValues.push(x);
    try {
      // console.log(
      //   x,
      //   latexToNormal().replaceAll("x", `(${x})`).replaceAll("^", "**"),
      //   eval(latexToNormal().replaceAll("x", `(${x})`).replaceAll("^", "**")),
      //   Mexp.eval(latexToNormal().replaceAll("x", `(${x})`))
      // );
      // let y = eval(latexToNormal().replaceAll("x", `(${x})`).replaceAll("^", "**"));
      let y = Mexp.eval(expNormal.replaceAll("x", `(${x})`));
      yValues.push(y);
    } catch (e) {
      console.log(e);
    }
  }

  function latexExp() {
    return `f(x)=\\int_{${a}}^{${b}} ${equation} \\, dx = ???`.replace(/(\d+\d)/g, "{$1}");
  }

  function latexToNormal() {
    let eq = equation
      .replaceAll("\\left", "(")
      .replaceAll("\\right", ")")
      .replaceAll("\\cdot", "*")
      .replaceAll("\\pi", Math.PI);
    eq = replaceFracs(eq);
    return eq;
  }

  function replaceFracs(str) {
    let i = str.indexOf("\\frac{");
    while (i >= 0) {
      let left = getGroup(str, i + 6);
      let right = getGroup(str, left.end + 2);
      // console.log("left", left);
      // console.log("right", right);
      // console.log(
      //   `${str.substring(0, left.start - 6)}(${left.content})/(${right.content})${str.substring(right.end + 1)}`
      // );
      str = `${str.substring(0, left.start - 6)}(${left.content})/(${right.content})${str.substring(right.end + 1)}`;
      i = str.indexOf("\\frac{");
    }
    return str;
  }

  function getGroup(str, start) {
    let count = 1;
    let i = start;
    for (; count > 0 && i < str.length; i++) {
      const char = str[i];
      if (char === "{") count++;
      else if (char === "}") count--;
      // console.log(char + " = " + count);
    }
    return {
      start,
      end: i - 1,
      content: str.substring(start, i - 1),
    };
  }

  return (
    <Container>
      <Grid container spacing={2}>
        {/* <Grid item xs={12} md={6}>
          <TextField
            variant="outlined"
            value={exp}
            onChange={(e) => setExp(e.target.value)}
            InputProps={{
              startAdornment: <InputAdornment position="start">f(x)=</InputAdornment>,
            }}
            fullWidth
          />
        </Grid> */}
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
              autoOperatorNames="sin cos tan"
              ref={eqInputRef}
            />
          </div>
        </Grid>
        <Grid item md={6}></Grid>
        {/* <Grid item xs={12} md={6}>
          {equation}
        </Grid>
        <Grid item xs={12} md={6}>
          {latexToNormal()}
        </Grid> */}
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
        {/* <Grid item xs={4} md={2}>
          <TextField
            variant="outlined"
            value={N}
            onChange={(e) => setN(e.target.value)}
            InputProps={{
              startAdornment: <InputAdornment position="start">N=</InputAdornment>,
            }}
            fullWidth
          />
        </Grid> */}
        <Grid item xs={12}>
          <BlockMath>{latexExp()}</BlockMath>
        </Grid>
        <Grid item xs={12}>
          <Plot
            data={[{ x: xValues, y: yValues, mode: "lines" }]}
            layout={{
              width: "100%",
              height: "100%",
              xaxis: {
                title: "x",
              },
              yaxis: { scaleanchor: "x", scaleratio: "1", title: "f(x)", titlefont: "" },
            }}
          />
        </Grid>
      </Grid>
    </Container>
  );
}

export default App;
