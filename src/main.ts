import * as ln from "@lnjs/core";
import { Path } from "@lnjs/core/lib/path";
import { Scene } from "@lnjs/core";
import { getModel } from "./stl-reader";

const canvas = <HTMLCanvasElement>document.getElementById("canvas");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
const ctx = <CanvasRenderingContext2D>canvas.getContext("2d");
ctx.imageSmoothingEnabled = true;
ctx.translate(0.5, 0.5);

let models = [
  "PolyTowerFat03BMulti 001.001.stl",
  "PolyTowerFat03BMulti 001.001U.stl",
  "PolyTowerFat03BMulti 001.002.stl",
  "PolyTowerFat03BMulti 001.002U.stl",
  "PolyTowerFat03BMulti 001.002.stl",
  "PolyTowerFat03BMulti 001.002U.stl",
];

let filename = models[1];
getModel(`/src/models/${filename}`, renderMesh);

function degrees(degrees: number): number {
  return (degrees * 180) / Math.PI;
}

let eye = new ln.Vector(-0.5, 0.5, 2);
eye = new ln.Vector(0, 0.75, 2);
let center = new ln.Vector(0, 0, 0);
let up = new ln.Vector(0, 1, 0);

let parsed: ln.Mesh;

function renderMesh(data: ln.Mesh) {
  let rotate = ln.radians(90);
  let mesh = data;
  parsed = data;

  mesh.unitCube();

  let width = window.innerWidth;
  let height = window.innerHeight;

  mesh.transform(ln.rotate(new ln.Vector(1, 0, 0), ln.radians(90)));

  let scene: Scene;

  function render() {
    scene = new ln.Scene();
    ctx.clearRect(0, 0, width, height);
    scene.add(
      new ln.TransformedShape(mesh, ln.rotate(new ln.Vector(0, 1, 0), rotate))
    );
    let paths = scene.render(
      eye,
      center,
      up,
      width,
      height,
      35,
      0.1,
      100,
      0.01
    );
    paths.forEach((path: Path) => {
      ctx.beginPath();
      path.forEach((v) => {
        ctx.lineTo(width - v.x, height - v.y);
      });
      ctx.strokeStyle = "black";
      ctx.lineWidth = 1;
      ctx.stroke();
    });

    ctx.font = "24px sans-serif";

    ctx.fillStyle = "#000";
    ctx.fillText(
      `${filename} f=${parsed ? parsed.triangles.length : "--"}`,
      20,
      30
    );
    ctx.fillText(
      `y ${degrees(rotate).toFixed(1)} eye <${eye.x.toFixed(1)},${eye.y.toFixed(
        1
      )},${eye.z.toFixed(1)}>`,
      20,
      30 + 36
    );
  }
  render();

  window.onkeydown = (e: KeyboardEvent) => {
    if (e.code == "KeyS") {
      saveSVG(scene);
    } else if (e.key == "ArrowRight") {
      rotate = (rotate + ln.radians(30)) % (Math.PI * 2);
      // right arrow
    } else if (e.key == "ArrowLeft") {
      rotate = (rotate - ln.radians(30)) % (Math.PI * 2);
      // right arrow
    } else if (e.key == "ArrowDown") {
      eye = new ln.Vector(eye.x, eye.y - 0.2, eye.z);
      // right arrow
    } else if (e.key == "ArrowUp") {
      eye = new ln.Vector(eye.x, eye.y + 0.2, eye.z);
      // right arrow
    }

    render();
  };
}

function saveSVG(scene: ln.Scene) {
  console.log(`SAVE SVG - ${filename}`);
  let width = window.innerWidth;
  let height = window.innerHeight;
  let paths = scene.render(eye, center, up, width, height, 100, 0.1, 100, 0.01);
  let svg = ln.toSVG(paths, width, height);

  var svgEl = document.getElementById("svg");

  if (svgEl) {
    svgEl.innerHTML = svg;

    var svgBlob = new Blob([svg], { type: "image/svg+xml;charset=utf-8" });
    var svgUrl = URL.createObjectURL(svgBlob);
    var downloadLink = document.createElement("a");
    downloadLink.href = svgUrl;
    downloadLink.download = `${filename}.svg`;
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
  }
}
