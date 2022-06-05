import "./App.css";
import "katex/dist/katex.min.css";

import { Container, Grid, InputAdornment, TextField, Typography } from "@mui/material";
import React, { useEffect, useRef, useState } from "react";

import { BlockMath } from "react-katex";
import EquationEditor from "equation-editor-react";
import Plot from "react-plotly.js";
import helper from "./helper";

function App() {
  const [equation, setEquation] = useState("");
  const [a, setA] = useState(0);
  const [b, setB] = useState(1);
  const [N, setN] = useState(2);
  const [dots, setDots] = useState(100);
  const integralIntervals = 1000;
  const [exact, setExact] = useState({ x: [], y: [], result: 0 });
  const [rectangle, setRectangle] = useState({ x: [], y: [], result: 0 });
  const [trapezium, setTrapezium] = useState({ x: [], y: [], result: 0 });
  const [simpson, setSimpson] = useState({ x: [], y: [], result: 0 });
  const [montecarlo, setMontecarlo] = useState({ x: [], y: [], result: 0 });
  const [fxVsN, setFxVsN] = useState();
  const eqInputRef = useRef(null);

  useEffect(() => {
    try {
      let integralExact = helper.integral(a, b, equation, integralIntervals);
      setExact(integralExact);
      setRectangle(helper.integralRectangle(a, b, equation, N));
      setTrapezium(helper.integralTrapezium(a, b, equation, N));
      setSimpson(helper.integralSimpson(a, b, equation, N));
      setFxVsN(helper.fxVsN(a, b, equation, N));
    } catch (e) {
      console.log(e);
    }
  }, [equation, a, b, N, integralIntervals]);

  useEffect(() => {
    try {
      setMontecarlo(helper.integralMontecarlo(equation, dots, a, b, exact));
    } catch (e) {
      console.log(e);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [exact, dots]);

  function latexExp() {
    return `\\int_{${a}}^{${b}} \\left(${equation}\\right) \\, dx`.replace(/(\d+\d)/g, "{$1}");
  }

  return (
    <Container>
      <Grid container spacing={2}>
        <Grid item xs={6} container spacing={2}>
          <Grid item xs={12}>
            <Typography variant="h5" component="h5">
              Función
            </Typography>
          </Grid>
          <Grid item xs={12}>
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
        </Grid>

        <Grid item xs={6} container spacing={2}>
          <Grid item xs={12}>
            <Typography variant="h5" component="h5">
              Integral
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <BlockMath>{latexExp()}</BlockMath>
          </Grid>
        </Grid>

        <Grid item xs={12} container spacing={2}>
          <Grid item xs={12} pt={5}>
            <Typography variant="h5" component="h5">
              Variables generales
            </Typography>
          </Grid>
          <Grid item xs={12} container spacing={2}>
            <Grid item xs={4}>
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
            <Grid item xs={4}>
              <TextField
                variant="outlined"
                value={b}
                onChange={(e) => setB(e.target.value)}
                InputProps={{
                  startAdornment: <InputAdornment position="start">b=</InputAdornment>,
                }}
                fullWidth
                type="number"
              />
            </Grid>
            <Grid item xs={4}>
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
          </Grid>
        </Grid>
      </Grid>
      <Grid container spacing={2} pt={5}>
        <Grid item xs={12}>
          <Typography variant="h5" component="h5">
            Exacta
          </Typography>
        </Grid>
        <Grid item xs={12} lg={4}>
          <TextField
            label="Resultado"
            variant="outlined"
            value={exact.result || 0}
            InputProps={{
              readOnly: true,
            }}
          />
        </Grid>
        <Grid item xs={12} lg={8}>
          {MyPlot(getExactData())}
        </Grid>
      </Grid>

      <Grid container spacing={2} pt={5}>
        <Grid item xs={12} pt={5}>
          <Typography variant="h5" component="h5">
            Rectángulo
          </Typography>
        </Grid>
        <Grid item xs={12} lg={4}>
          <TextField
            label="Resultado"
            variant="outlined"
            value={rectangle.result || 0}
            InputProps={{
              readOnly: true,
            }}
          />
        </Grid>
        <Grid item xs={12} lg={8}>
          {MyPlot(getRectangleData())}
        </Grid>
      </Grid>

      <Grid container spacing={2} pt={5}>
        <Grid item xs={12}>
          <Typography variant="h5" component="h5">
            Trapecio
          </Typography>
        </Grid>
        <Grid item xs={12} lg={4}>
          <TextField
            label="Resultado"
            variant="outlined"
            value={trapezium.result || 0}
            InputProps={{
              readOnly: true,
            }}
          />
        </Grid>
        <Grid item xs={12} lg={8}>
          {MyPlot(getTrapeziumData())}
        </Grid>
      </Grid>

      <Grid container spacing={2} pt={5}>
        <Grid item xs={12}>
          <Typography variant="h5" component="h5">
            Simpson
          </Typography>
        </Grid>
        <Grid item xs={12} lg={4}>
          <TextField
            label="Resultado"
            variant="outlined"
            value={simpson.result || 0}
            InputProps={{
              readOnly: true,
            }}
          />
        </Grid>
        <Grid item xs={12} lg={8}>
          {MyPlot(getSimpsonData())}
        </Grid>
      </Grid>

      <Grid container spacing={2} pt={5}>
        <Grid item xs={12}>
          <Typography variant="h5" component="h5">
            Montecarlo
          </Typography>
        </Grid>
        <Grid item xs={12} lg={4}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                label="Puntos"
                variant="outlined"
                value={dots}
                onChange={(e) => setDots(e.target.value)}
                fullWidth
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Resultado"
                variant="outlined"
                value={montecarlo.result || 0}
                InputProps={{
                  readOnly: true,
                }}
                fullWidth
              />
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={12} lg={8}>
          {MyPlot(getMontecarloData())}
        </Grid>
      </Grid>

      {!!fxVsN && (
        <Grid container spacing={2} pt={5} pb={20}>
          <Grid item xs={12}>
            <Typography variant="h5" component="h5">
              f(x) vs N
            </Typography>
          </Grid>
          <Grid item xs={12}>
            {MyPlot(getFxVsNData(), "N")}
          </Grid>
        </Grid>
      )}
    </Container>
  );

  function getExactData() {
    return [{ x: exact.x, y: exact.y, mode: "lines", name: "Exacta" }];
  }

  function getRectangleData() {
    return [
      {
        x: rectangle.x,
        y: rectangle.y,
        marker: { color: "green" },
        width: (b - a) / N,
        type: "bar",
        name: "Rectángulo",
      },
    ];
  }

  function getTrapeziumData() {
    return [
      {
        x: trapezium.x,
        y: trapezium.y,
        marker: { color: "red" },
        type: "scatter",
        fill: "tonexty",
        name: "Trapecio",
      },
    ];
  }

  function getSimpsonData() {
    return [
      {
        x: simpson.x,
        y: simpson.y,
        marker: { color: "blue" },
        type: "scatter",
        fill: "tonexty",
        name: "Simpson",
      },
    ];
  }

  function getMontecarloData() {
    return [
      {
        x: montecarlo.green?.x,
        y: montecarlo.green?.y,
        marker: { color: "green" },
        mode: "markers",
        type: "scatter",
        name: "Montecarlo",
        legendgroup: "montecarlo",
        showlegend: true,
      },
      {
        x: montecarlo.blue?.x,
        y: montecarlo.blue?.y,
        marker: { color: "blue" },
        mode: "markers",
        type: "scatter",
        name: "Montecarlo",
        legendgroup: "montecarlo",
        showlegend: false,
      },
      {
        x: montecarlo.red?.x,
        y: montecarlo.red?.y,
        marker: { color: "red" },
        mode: "markers",
        type: "scatter",
        name: "Montecarlo",
        legendgroup: "montecarlo",
        showlegend: false,
      },
      { x: exact.x, y: exact.y, mode: "lines", name: "Exacta" },
    ];
  }

  function getFxVsNData() {
    return [
      {
        x: fxVsN.x,
        y: fxVsN.y.rectangle,
        marker: { color: "green" },
        mode: "markers",
        type: "scatter",
        name: "Rectángulo",
      },
      {
        x: fxVsN.x,
        y: fxVsN.y.trapezium,
        marker: { color: "red" },
        mode: "markers",
        type: "scatter",
        name: "Trapecio",
      },
      {
        x: fxVsN.x,
        y: fxVsN.y.simpson,
        marker: { color: "blue" },
        mode: "markers",
        type: "scatter",
        name: "Simpson",
      },
    ];
  }

  function MyPlot(data, xaxisTitle) {
    return (
      <Plot
        data={data}
        layout={{
          xaxis: {
            title: xaxisTitle || "x",
            zeroline: true,
          },
          yaxis: {
            title: "f(x)",
            zeroline: true,
            yanchor: "top",
          },
          legend: {
            orientation: "h",
            y: 999,
          },
          margin: {
            l: 60,
            r: 20,
            b: 40,
            t: 20,
            pad: 2,
          },
        }}
        config={{ responsive: true }}
        useResizeHandler={true}
        style={{ width: "100%", height: "100%", minHeight: "300px" }}
      />
    );
  }
}

export default App;
