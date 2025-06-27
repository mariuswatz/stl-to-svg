import * as ln from "@lnjs/core";
import { Path } from "@lnjs/core/lib/path";
import { identity, Scene } from "@lnjs/core";
import * as gui from "./gui";
import { degrees, removeSmallTriangles } from "./ln-mesh-tools";
import { modifyMesh } from "./modify-mesh";

let ctx: CanvasRenderingContext2D;
let width: number, height: number;

// Set up eye / venter / up vectors
let eye = new ln.Vector(-0.5, 0.5, 2);
eye = new ln.Vector(1, 0.75, 2);
let center = new ln.Vector(0, 0, 0);
let up = new ln.Vector(0, 1, 0);

export const setupRenderer = () => {
  ctx = gui.getContext();
  width = ctx.canvas.width;
  height = ctx.canvas.height;

  if (scene) render();
};

/// Scene and mesh
let scene: Scene;

let parsed: ln.Mesh;
let mesh: ln.Mesh;
let newMesh: ln.Mesh | undefined;

let rotate = ln.radians(90);

export function renderMesh(data: ln.Mesh) {
  parsed = data;
  mesh = data;

  mesh.unitCube();
  render();
}

/// Rotations

export type Rotation = {
  axis: "X" | "Y" | "Z";
  degrees: number;
};

let axisVectors: { [key: string]: ln.Vector } = {};
axisVectors["X"] = new ln.Vector(1, 0, 0);
axisVectors["Y"] = new ln.Vector(0, 1, 0);
axisVectors["Z"] = new ln.Vector(0, 0, 1);
let rotations: Rotation[] = [];

export const addRotation = (rot: Rotation) => {
  rotations.push(rot);
  render();

  console.log("rotations", rotations);
};

addRotation({ axis: "X", degrees: 90 });

export const resetRotations = () => {
  rotations = [];
  console.log("rotations", rotations);
  addRotation({ axis: "X", degrees: 90 });
  render();
};

function render() {
  if (!mesh) return;

  scene = new ln.Scene();
  ctx.clearRect(0, 0, width, height);
  ctx.fillStyle = "#f1feff";
  ctx.rect(0, 0, width, height);
  ctx.fill();

  if (newMesh) {
    mesh = newMesh;
    newMesh = undefined;
  }

  let mat: ln.Matrix = identity();

  rotations.forEach((rot) => {
    mat = mat.rotate(axisVectors[rot.axis], ln.radians(rot.degrees));
  });
  mat = mat.rotate(new ln.Vector(0, 1, 0), rotate);
  mesh.unitCube();

  scene.add(new ln.TransformedShape(mesh, mat));

  let paths = scene.render(eye, center, up, width, height, 35, 0.1, 100, 0.01);
  paths.forEach((path: Path) => {
    ctx.beginPath();
    path.forEach((v) => {
      ctx.lineTo(width - v.x, height - v.y);
    });
    ctx.strokeStyle = "black";
    ctx.lineWidth = 1;
    ctx.stroke();
  });

  ctx.font = "24px 'Abel'";

  ctx.fillStyle = "#000";
  ctx.fillText(
    `${gui.getUploadedFile()?.name} f=${mesh ? mesh.triangles.length : "--"}`,
    20,
    30
  );
  ctx.fillText(
    `y ${degrees(rotate).toFixed(1)} eye <${eye.x.toFixed(2)},${eye.y.toFixed(
      2
    )},${eye.z.toFixed(2)}>`,
    20,
    30 + 36
  );
}

export const fixMesh = () => {
  newMesh = removeSmallTriangles(mesh, 0.1);
  render();
};

export const subdivideMesh = () => {
  newMesh = new ln.Mesh(modifyMesh(mesh.triangles));
  render();
};

window.onkeydown = (e: KeyboardEvent) => {
  let rotMod = e.shiftKey
    ? ln.radians(5)
    : e.altKey
    ? ln.radians(90)
    : ln.radians(30);
  if (e.code == "KeyS") {
    saveSVG();
  } else if (e.code == "KeyF") {
    fixMesh();
  } else if (e.code == "KeyD") {
    // subdivideMesh();
  } else if (e.code == "KeyX") {
    addRotation({ axis: "X", degrees: 90 });
  } else if (e.code == "KeyR") {
    if (parsed) newMesh = parsed;
    render();
  } else if (e.code == "KeyY") {
    addRotation({ axis: "Y", degrees: 90 });
  } else if (e.code == "KeyZ") {
    addRotation({ axis: "Z", degrees: 90 });
  } else if (e.key == "ArrowRight") {
    rotate = (rotate + rotMod) % (Math.PI * 2);
    render();
    // right arrow
  } else if (e.key == "ArrowLeft") {
    rotate = (rotate - rotMod) % (Math.PI * 2);
    render();
    // right arrow
  } else if (e.key == "ArrowDown") {
    eye = new ln.Vector(eye.x, eye.y - 0.2, eye.z);
    render();
    // right arrow
  } else if (e.key == "ArrowUp") {
    eye = new ln.Vector(eye.x, eye.y + 0.2, eye.z);
    render();
    // right arrow
  }

  if (rotate < 0) rotate += Math.PI * 2;
};

export function saveSVG() {
  let file = gui.getUploadedFile();
  if (!file) {
    console.log("No model loaded.");
    return;
  }

  let filename = `${file?.name}.svg`;
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
    downloadLink.download = filename;
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
  }
}
