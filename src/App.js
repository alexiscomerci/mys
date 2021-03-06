import "./App.css";
import "katex/dist/katex.min.css";

import {
  Button,
  Container,
  Grid,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import React, { useEffect, useRef, useState } from "react";

import { BlockMath } from "react-katex";
import Comparador from "./Comparador";
import EquationEditor from "equation-editor-react";
import MySlider from "./MySlider";
import Plot from "react-plotly.js";
import helper from "./helper";
import Tooltip from "@mui/material/Tooltip";
import InfoIcon from "@mui/icons-material/Info";

function App() {
  const [equation, setEquation] = useState("\\sin(x)");
  const [a, setA] = useState(0);
  const [b, setB] = useState(1);
  const [N, setN] = useState(10);
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
    return `\\int_{${a}}^{${b}} \\left(${equation}\\right) \\, dx`.replace(
      /(\d+\d)/g,
      "{$1}"
    );
  }

  return (
    <Container>
      <Grid container spacing={5}>
        <Grid item xs={12} md={6} container spacing={2}>
          <Grid item xs={12}>
            <Typography variant="h5" component="h5">
              Funci??n
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <div
              id="equationContainer"
              onClick={() =>
                eqInputRef.current.element.current.children[0].children[0].focus()
              }
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
          <Grid item xs={12}>
            <Typography variant="h7" component="h5">
              Teclado Virtual
            </Typography>
          </Grid>
          <Grid item xs={12} container spacing={2}>
            <Grid item xs={2}>
              <Button
                variant="outlined"
                size="small"
                style={{ textTransform: "none" }}
                fullWidth
                onClick={() => {
                  addToEquation("+");
                }}
              >
                <BlockMath>{"+"}</BlockMath>
              </Button>
            </Grid>
            <Grid item xs={2}>
              <Button
                variant="outlined"
                size="small"
                style={{ textTransform: "none" }}
                fullWidth
                onClick={() => {
                  addToEquation("-");
                }}
              >
                <BlockMath>{"-"}</BlockMath>
              </Button>
            </Grid>
            <Grid item xs={2}>
              <Button
                variant="outlined"
                size="small"
                style={{ textTransform: "none" }}
                fullWidth
                onClick={() => {
                  addToEquation("\\cdot");
                }}
              >
                <BlockMath>{"\\cdot"}</BlockMath>
              </Button>
            </Grid>
            <Grid item xs={2}>
              <Button
                variant="outlined"
                size="small"
                style={{ textTransform: "none" }}
                fullWidth
                onClick={() => {
                  addToEquation("\\frac{}{}");
                }}
              >
                <BlockMath>{"/"}</BlockMath>
              </Button>
            </Grid>
            <Grid item xs={2}>
              <Button
                variant="outlined"
                size="small"
                style={{ textTransform: "none" }}
                fullWidth
                onClick={() => {
                  addToEquation("x^2");
                }}
              >
                <BlockMath>{"x^2"}</BlockMath>
              </Button>
            </Grid>
            <Grid item xs={2}>
              <Button
                variant="outlined"
                size="small"
                style={{ textTransform: "none" }}
                fullWidth
                onClick={() => {
                  addToEquation("\\sqrt{x}");
                }}
              >
                <BlockMath>{"\\sqrt{x}"}</BlockMath>
              </Button>
            </Grid>
            <Grid item xs={2}>
              <Button
                variant="outlined"
                size="small"
                style={{ textTransform: "none" }}
                fullWidth
                onClick={() => {
                  addToEquation("\\sin(x)");
                }}
              >
                <BlockMath>{"\\sin(x)"}</BlockMath>
              </Button>
            </Grid>
            <Grid item xs={2}>
              <Button
                variant="outlined"
                size="small"
                style={{ textTransform: "none" }}
                fullWidth
                onClick={() => {
                  addToEquation("\\cos(x)");
                }}
              >
                <BlockMath>{"\\cos(x)"}</BlockMath>
              </Button>
            </Grid>
            <Grid item xs={2}>
              <Button
                variant="outlined"
                size="small"
                style={{ textTransform: "none" }}
                fullWidth
                onClick={() => {
                  addToEquation("\\tan(x)");
                }}
              >
                <BlockMath>{"\\tan(x)"}</BlockMath>
              </Button>
            </Grid>
            <Grid item xs={2}>
              <Button
                variant="outlined"
                size="small"
                style={{ textTransform: "none" }}
                fullWidth
                onClick={() => {
                  addToEquation("\\log(x)");
                }}
              >
                <BlockMath>{"\\log(x)"}</BlockMath>
              </Button>
            </Grid>
            <Grid item xs={2}>
              <Button
                variant="outlined"
                size="small"
                style={{ textTransform: "none" }}
                fullWidth
                onClick={() => {
                  addToEquation("\\pi");
                }}
              >
                <BlockMath>{"\\pi"}</BlockMath>
              </Button>
            </Grid>
            <Grid item xs={2}>
              <Button
                variant="outlined"
                size="small"
                style={{ textTransform: "none" }}
                fullWidth
                onClick={() => {
                  addToEquation("\\sqrt[3]{x}");
                }}
              >
                <BlockMath>{"\\sqrt[3]{x}"}</BlockMath>
              </Button>
            </Grid>
          </Grid>
        </Grid>

        <Grid item xs={12} md={6} container spacing={2}>
          <Grid item xs={12}>
            <Typography variant="h5" component="h5">
              Integral
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <BlockMath>{latexExp()}</BlockMath>
          </Grid>
          <Grid item xs={12}>
            <Typography variant="h7" component="h5">
              Ejemplos
            </Typography>
          </Grid>
          <Grid item xs={12} container spacing={2}>
            <Grid item xs={3}>
              <Button
                variant="outlined"
                size="small"
                style={{ textTransform: "none" }}
                fullWidth
                onClick={() => {
                  changeEquation("x^2+5");
                }}
              >
                <BlockMath>{"f(x)=x^2+5"}</BlockMath>
              </Button>
            </Grid>
            <Grid item xs={3}>
              <Button
                variant="outlined"
                size="small"
                style={{ textTransform: "none" }}
                fullWidth
                onClick={() => {
                  changeEquation("x^3+2x");
                }}
              >
                <BlockMath>{"f(x)=x^3+2x"}</BlockMath>
              </Button>
            </Grid>
            <Grid item xs={3}>
              <Button
                variant="outlined"
                size="small"
                style={{ textTransform: "none" }}
                fullWidth
                onClick={() => {
                  changeEquation("\\sin(x)");
                }}
              >
                <BlockMath>{"f(x)=sin(x)"}</BlockMath>
              </Button>
            </Grid>
            <Grid item xs={3}>
              <Button
                variant="outlined"
                size="small"
                style={{ textTransform: "none" }}
                fullWidth
                onClick={() => {
                  changeEquation("\\sqrt{x}");
                }}
              >
                <BlockMath>{"f(x)=\\sqrt{x}"}</BlockMath>
              </Button>
            </Grid>
            <Grid item xs={12}>
              <Button
                variant="outlined"
                size="small"
                style={{ visibility: "hidden" }}
              >
                <BlockMath>{"f(x)="}</BlockMath>
              </Button>
            </Grid>
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
              <MySlider value={a} setValue={setA} label="a" min={-10} max={0} />
            </Grid>
            <Grid item xs={4}>
              <MySlider value={b} setValue={setB} label="b" min={1} max={10} />
            </Grid>
            <Grid item xs={4}>
              <MySlider value={N} setValue={setN} label="N" min={1} max={100} />
            </Grid>
          </Grid>
        </Grid>
      </Grid>

      {/* METODO EXACTO */}
      {MyCard(
        "Valor de referencia",
        <TextField
          label="Resultado"
          variant="outlined"
          value={exact.result || 0}
          InputProps={{
            readOnly: true,
          }}
          fullWidth
        />,
        MyPlot(getExactData()),
        "El m??todo de exacta es un m??todo utilizado para resolver ecuaciones diferenciales. El mismo consiste en calcular el comportamiento de una funci??n en el paso de un tiempo (dentro de los intervalos establecidos)."
      )}

      {/* METODO RECT??NGULO */}
      {MyCard(
        "Rect??ngulo",
        <Grid xs={12} sm={12} md={12} lg={12}>
          <TextField
            label="Resultado"
            variant="outlined"
            value={rectangle.result || 0}
            InputProps={{
              readOnly: true,
            }}
            fullWidth
          />
          <Comparador
            comparedResult={rectangle.result}
            exactResult={exact.result}
          ></Comparador>
        </Grid>,
        MyPlot(getRectangleData()),
        "El m??todo de integraci??n por rect??ngulos (M??todo del rect??ngulo) es un m??todo utilizado para calcular el ??rea bajo una curva. El mismo consiste en dividir en ???N??? intervalos una funci??n, generando subintervalos m??s peque??os (peque??os rect??ngulos) que abarquen toda el ??rea bajo la curva, para as?? calcular la misma."
      )}

      {/* METODO TRAPECIO */}
      {MyCard(
        "Trapecio",
        <Grid xs={12} sm={12} md={12} lg={12}>
          <TextField
            label="Resultado"
            variant="outlined"
            value={trapezium.result || 0}
            InputProps={{
              readOnly: true,
            }}
            fullWidth
          />
          <Comparador
            comparedResult={trapezium.result}
            exactResult={exact.result}
          ></Comparador>
        </Grid>,
        MyPlot(getTrapeziumData()),
        "El m??todo de integraci??n por trapecios (M??todo del trapecio) es otro de los m??todos utilizados para calcular el ??rea bajo una curva, para esto se establecen limites sobre los cuales se divide a la funci??n en N sub ??reas para luego calcular su valor, asumiendo a cada sub ??rea como un peque??o trapecio."
      )}

      {/* METODO SIMPSON */}
      {MyCard(
        "Simpson",
        <Grid xs={12} sm={12} md={12} lg={12}>
          <TextField
            label="Resultado"
            variant="outlined"
            value={simpson.result || 0}
            InputProps={{
              readOnly: true,
            }}
            fullWidth
          />
          <Comparador
            comparedResult={simpson.result}
            exactResult={exact.result}
          ></Comparador>
        </Grid>,
        MyPlot(getSimpsonData()),
        "El m??todo de integraci??n por Simpson es un m??todo de aproximaci??n de integrales definidas, el cual tiene dos variantes donde cada una toma como base a un m??todo de integraci??n."
      )}

      {/* METODO MONETECARLO */}
      {MyCard(
        "Monte Carlo",
        <Grid xs={12} sm={12} md={12} lg={12}>
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
          <Comparador
            comparedResult={montecarlo.result}
            exactResult={exact.result}
          ></Comparador>
        </Grid>,
        MyPlot(getMontecarloData()),
        "El M??todo de Monte Carlo es un m??todo estad??stico utilizado para aproximar expresiones matem??ticas complejas que son costosas de evaluar con exactitud. En este caso pr??ctico se utiliza para aproximar el ??rea bajo una curva."
      )}

      {!!fxVsN && (
        <Paper elevation={3}>
          <Grid container spacing={2} mt={5} mb={20} px={3} pb={3}>
            <Grid
              item
              xs={12}
              style={{ display: "flex", alignItems: "center" }}
            >
              <Typography variant="h5" component="h5" mr={1}>
                f(x) vs N
              </Typography>
              <Tooltip
                placement="right"
                title={
                  <Typography fontSize={18}>
                    Este grafico representa una comparaci??n entre tres m??todos
                    (Rect??ngulo ??? Trapecio ??? Simpson), en la cual podemos
                    apreciar como cada m??todo de integraci??n va mejorando su
                    aproximaci??n al incrementar los N (puntos) en el calculo de
                    los mismos.
                  </Typography>
                }
              >
                <InfoIcon />
              </Tooltip>
            </Grid>
            <Grid item xs={12}>
              {MyPlot(getFxVsNData(), "N")}
            </Grid>
          </Grid>
        </Paper>
      )}
    </Container>
  );

  function MyCard(title, data, graph, description) {
    return (
      <Paper elevation={3}>
        <Grid container spacing={2} mt={5} px={3} pb={3}>
          <Grid item xs={12} style={{ display: "flex", alignItems: "center" }}>
            <Typography variant="h5" component="h5" mr={1}>
              {title}
            </Typography>
            <Tooltip
              placement="right"
              title={<Typography fontSize={18}>{description}</Typography>}
            >
              <InfoIcon />
            </Tooltip>
          </Grid>
          <Grid item xs={12} md={2}>
            {data}
          </Grid>
          <Grid item xs={12} md={10}>
            {graph}
          </Grid>
        </Grid>
      </Paper>
    );
  }

  function changeEquation(eq) {
    eqInputRef.current.mathField.latex(eq);
  }

  function addToEquation(eq) {
    eqInputRef.current.mathField.latex(equation + eq);
  }

  function getExactData() {
    return [
      {
        x: exact.x,
        y: exact.y,
        mode: "lines",
        fill: "tonexty",
        name: "Referencia",
      },
    ];
  }

  function getRectangleData() {
    return [
      {
        x: rectangle.x,
        y: rectangle.y,
        marker: { color: "green" },
        width: (b - a) / N,
        type: "bar",
        name: "Rect??ngulo",
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
        marker: { color: "green", size: 4 },
        mode: "markers",
        type: "scatter",
        name: "Montecarlo",
        legendgroup: "montecarlo",
        showlegend: true,
      },
      {
        x: montecarlo.blue?.x,
        y: montecarlo.blue?.y,
        marker: { color: "blue", size: 4 },
        mode: "markers",
        type: "scatter",
        name: "Montecarlo",
        legendgroup: "montecarlo",
        showlegend: false,
      },
      {
        x: montecarlo.red?.x,
        y: montecarlo.red?.y,
        marker: { color: "red", size: 4 },
        mode: "markers",
        type: "scatter",
        name: "Montecarlo",
        legendgroup: "montecarlo",
        showlegend: false,
      },
      {
        x: exact.x,
        y: exact.y,
        mode: "lines",
        name: "Referencia",
        marker: { color: "black" },
      },
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
        name: "Rect??ngulo",
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
