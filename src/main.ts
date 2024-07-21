import * as ln from "@lnjs/core";
import { Path } from "@lnjs/core/lib/path";
import { Scene } from "@lnjs/core";
import { setupDropHandler } from "./draganddrop";

let uploadedFile: File;

const canvas = <HTMLCanvasElement>document.getElementById("canvas");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
const ctx = <CanvasRenderingContext2D>canvas.getContext("2d");
ctx.imageSmoothingEnabled = true;
ctx.translate(0.5, 0.5);

// models are loaded by dropping STL files onto canvas
if (canvas) setupDropHandler(canvas, renderMesh);

// on load, there will be no model
ctx.font = "24px sans-serif";
ctx.fillStyle = "#000";
ctx.fillText("No file loaded. Drag STL file into window.", 20, 30);

function degrees(degrees: number): number {
  return (degrees * 180) / Math.PI;
}

// Set up eye / venter / up vectors
let eye = new ln.Vector(-0.5, 0.5, 2);
eye = new ln.Vector(0, 0.75, 2);
let center = new ln.Vector(0, 0, 0);
let up = new ln.Vector(0, 1, 0);

let parsed: ln.Mesh;

export function renderMesh(f: File, data: ln.Mesh) {
  uploadedFile = f;

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
      `${uploadedFile.name} f=${parsed ? parsed.triangles.length : "--"}`,
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
  console.log(`SAVE SVG - ${uploadedFile.name}`);
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
    downloadLink.download = `${uploadedFile.name}.svg`;
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
  }
}
