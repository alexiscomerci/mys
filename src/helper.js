import Mexp from "math-expression-evaluator";

export const helper = {
  integral(min, max, equationLatex, num) {
    min = +min;
    max = +max;
    num = +num;
    let equation = this.latexToNormal(equationLatex);
    // console.log(equation);
    let x = [];
    let y = [];
    let result = 0;
    let x1 = min;
    let y1 = this.func(equation, min);
    let y2;
    let dx = (max - min) / num;
    let yMin = Number.MAX_SAFE_INTEGER;
    let yMax = Number.MIN_SAFE_INTEGER;
    for (let i = 0; i <= num; i++) {
      y2 = this.func(equation, x1);
      let area = ((y1 + y2) * dx) / 2;
      result += area;
      y1 = y2;
      x.push(x1);
      y.push(y2);
      yMin = Math.min(yMin, y2);
      yMax = Math.max(yMax, y2);
      x1 += dx;
    }

    result = +result.toFixed(4);

    return {
      x,
      y,
      result,
      yMin,
      yMax,
    };
  },

  integralRectangle(min, max, equationLatex, N) {
    min = +min;
    max = +max;
    N = +N;
    let equation = this.latexToNormal(equationLatex);
    let h = (max - min) / N;
    let x = [];
    let y = [];
    let result = 0;
    for (let i = 0; i < N; i++) {
      let xLeft = min + i * h;
      let xRight = xLeft + h;
      let xMid = (xLeft + xRight) / 2;
      let res = helper.func(equation, xMid);
      result += res;
      x.push(xMid);
      y.push(res);
    }
    result = +(h * result).toFixed(4);

    return {
      x,
      y,
      result,
    };
  },

  integralTrapezium(min, max, equationLatex, N) {
    min = +min;
    max = +max;
    N = +N;
    let equation = this.latexToNormal(equationLatex);
    let h = (max - min) / N;
    let x = [];
    let y = [];
    let result = 0;
    let f0 = helper.func(equation, min);
    x.push(min);
    y.push(f0);
    for (let i = 1; i < N; i++) {
      let xLeft = min + i * h;
      let res = helper.func(equation, xLeft);
      result += res;
      x.push(xLeft);
      y.push(res);
    }
    let fN = helper.func(equation, max);
    x.push(max);
    y.push(fN);
    result = +(h * (f0 / 2 + result + fN / 2)).toFixed(4);

    return {
      x,
      y,
      result,
    };
  },

  integralSimpson(min, max, equationLatex, N) {
    min = +min;
    max = +max;
    N = +N;
    let equation = this.latexToNormal(equationLatex);
    let h = +((max - min) / N).toFixed(4);
    let x = [];
    let y = [];
    let result = 0;
    let multiplier = 4;
    let f0 = helper.func(equation, min);
    x.push(min);
    y.push(f0);
    for (let i = 1; i < N; i++) {
      x.push(min + i * h);
    }
    for (let i = 1; i < x.length; i++) {
      let res = helper.func(equation, x[i]);
      result += res * multiplier;
      y.push(res);
      // console.log(`i: ${i} - x: ${x[i]} - mult: ${multiplier} - y: ${res * multiplier}`);
      multiplier = multiplier === 4 ? 2 : 4;
    }
    let fN = helper.func(equation, max);
    x.push(max);
    y.push(fN);
    result = +((h / 3) * (f0 + result + fN)).toFixed(4);

    return {
      x,
      y,
      result,
    };
  },

  integralMontecarlo(equationLatex, N, xMin, xMax, integralExact) {
    xMin = +xMin;
    xMax = +xMax;
    N = +N;
    let yMin = Math.min(integralExact.yMin, 0);
    let yMax = integralExact.yMax;
    // yMin = yMin - 0.1 * Math.abs(yMin);
    // yMax = yMax + 0.1 * Math.abs(yMax);
    let H = yMax - yMin;
    let equation = this.latexToNormal(equationLatex);
    let green = {
      x: [],
      y: [],
      count: 0,
    };
    let blue = JSON.parse(JSON.stringify(green));
    let red = JSON.parse(JSON.stringify(green));
    for (let i = 0; i < N; i++) {
      let randX = this.randomFloatFromInterval(xMin, xMax);
      let randY = this.randomFloatFromInterval(yMin, yMax);
      let res = helper.func(equation, randX);
      // console.log(`equation: ${equation} - randX: ${randX} - randY: ${randY} - res: ${res}`)
      // console.log(randX)
      if (res > 0 && randY > 0 && randY <= res) {
        green.x.push(randX);
        green.y.push(randY);
        green.count++;
      } else if (res < 0 && randY < 0 && randY >= res) {
        blue.x.push(randX);
        blue.y.push(randY);
        blue.count++;
      } else {
        red.x.push(randX);
        red.y.push(randY);
      }
    }
    let squareArea = (xMax - xMin) * H;
    let result = ((squareArea * (green.count - blue.count)) / N).toFixed(4);

    // console.log("yMin", yMin, "yMax", yMax, "H", H, "green", green, "blue", blue);

    return {
      green,
      blue,
      red,
      result,
    };
  },

  fxVsN(min, max, equationLatex, N) {
    let x = [];
    let y = { rectangle: [], trapezium: [], simpson: [] };
    for (let i = 1; i <= N; i++) {
      x.push(i);
      y.rectangle.push(
        this.integralRectangle(min, max, equationLatex, i).result
      );
      y.trapezium.push(
        this.integralTrapezium(min, max, equationLatex, i).result
      );
      y.simpson.push(this.integralSimpson(min, max, equationLatex, i).result);
    }

    return {
      x,
      y,
    };
  },

  func(ecuation, x) {
    try {
      //   console.log(
      //     ecuation.replaceAll("x", `(${x.toFixed(5)})`),
      //     Mexp.eval(ecuation.replaceAll("x", `(${x.toFixed(5)})`))
      //   );
      let ec = this.prepareEcuation(ecuation, x);
      //   console.log(ecuation, ec);
      return Mexp.eval(ec);
      // return eval(
      //   expNormal
      //     .replaceAll("x", `(${x.toFixed(5)})`)
      //     .replaceAll("^", "**")
      //     .replaceAll("{", "")
      //     .replaceAll("}", "")
      // );
    } catch (e) {
      console.log(e);
    }
  },

  //TODO: Calcular primero lo que está en parentesis más chicos
  prepareEcuation(ec, x) {
    ec = ec.replace(/\d+(?=[a-z])/g, "$&*");
    ec = ec.replaceAll("x", `(${x.toFixed(5)})`);
    ec = this.replaceSqrts(ec);
    ec = this.replaceTrigFunc(ec, "\\sin");
    ec = this.replaceTrigFunc(ec, "\\cos");
    ec = this.replaceTrigFunc(ec, "\\tan");
    ec = this.replaceTrigFunc(ec, "\\arcsin");
    ec = this.replaceTrigFunc(ec, "\\arccos");
    ec = this.replaceTrigFunc(ec, "\\arctan");
    ec = this.replaceExtraParenthesis(ec);
    ec = ec.replaceAll("{", "(");
    ec = ec.replaceAll("}", ")");
    return ec;
  },

  replaceTrigFunc(str, func) {
    let i = str.indexOf(func);
    while (i >= 0) {
      let param = this.getGroup(str, i + func.length + 1, "(", ")");
      let res = 0;
      switch (func) {
        case "\\sin":
          res = Math.sin(Mexp.eval(param.content));
          break;
        case "\\cos":
          res = Math.cos(Mexp.eval(param.content));
          break;
        case "\\tan":
          res = Math.tan(Mexp.eval(param.content));
          break;
        case "\\arcsin":
          res = Math.asin(Mexp.eval(param.content));
          break;
        case "\\arccos":
          res = Math.acos(Mexp.eval(param.content));
          break;
        case "\\arctan":
          res = Math.atan(Mexp.eval(param.content));
          break;
        default:
          break;
      }
      str = `${str.substring(
        0,
        param.start - func.length - 1
      )}${res}${str.substring(param.end + 1)}`;
      i = str.indexOf(func);
    }
    return str;
  },

  replaceSqrts(str) {
    let i = str.indexOf("\\sqrt");
    while (i >= 0) {
      let exp = this.getGroup(str, i + str.indexOf("[") + 1, "[", "]");
      let param = this.getGroup(str, i + str.indexOf("{") + 1, "{", "}");
      let val = 0;
      let isSquare = exp.end === str.length - 1;

      if (isSquare) val = Math.sqrt(Mexp.eval(param.content)) || 0;
      else {
        let number = +param.content.substring(1, param.content.length - 1);
        if (+exp.content % 2 === 0 && number < 0) val = 0;
        else
          val =
            Math.pow(Math.abs(number), 1 / +exp.content) *
            (number > 0 ? 1 : -1);
      }

      str = `${str.substring(
        0,
        param.start - str.indexOf("{") - 2
      )}${val}${str.substring(param.end + 1)}`;
      i = str.indexOf("\\sqrt");
    }
    return str;
  },

  replaceExtraParenthesis(str) {
    let prev = "";
    do {
      prev = str;
      str = str
        .replace(/(\([.0-9]*\))/g, "leftdel$1rightdel")
        .replaceAll("leftdel(", "")
        .replaceAll(")rightdel", "");
    } while (prev !== str);
    return str;
  },

  latexToNormal(equation) {
    let eq = equation
      .replaceAll("\\left", "(")
      .replaceAll("\\right", ")")
      .replaceAll("\\cdot", "*")
      .replaceAll("\\pi", Math.PI);
    eq = this.replaceFracs(eq);
    return eq;
  },

  replaceFracs(str) {
    let i = str.indexOf("\\frac{");
    while (i >= 0) {
      let left = this.getGroup(str, i + 6, "{", "}");
      let right = this.getGroup(str, left.end + 2, "{", "}");
      str = `${str.substring(0, left.start - 6)}(${left.content})/(${
        right.content
      })${str.substring(right.end + 1)}`;
      i = str.indexOf("\\frac{");
    }
    return str;
  },

  getGroup(str, start, charOpen, charClose) {
    let count = 1;
    let i = start;
    for (; count > 0 && i < str.length; i++) {
      const char = str[i];
      if (char === charOpen) count++;
      else if (char === charClose) count--;
    }
    return {
      start,
      end: i - 1,
      content: str.substring(start, i - 1),
    };
  },

  randomFloatFromInterval(min, max) {
    return +(Math.random() * (min - max) + max).toFixed(4);
  },
};

export default helper;
