import { setupDropHandler } from "./draganddrop";
import * as render from "./ln-renderer";

let uploadedFile: File | undefined;
let canvas: HTMLCanvasElement;
let ctx: CanvasRenderingContext2D;

export const getContext = () => {
  return ctx;
};

export const getCanvas = () => {
  return canvas;
};

export const getUploadedFile = () => {
  return uploadedFile ? uploadedFile : undefined;
};

export const setUploadedFile = (f: File) => {
  uploadedFile = f;
};

const guiButtons: HTMLButtonElement[] = [];
export const setupGUI = () => {
  const svgButton = document.createElement("button");
  svgButton.textContent = "Save SVG";
  svgButton.addEventListener("click", (ev) => render.saveSVG());
  guiButtons.push(svgButton);

  const labels = ["Reduce Mesh", "Reset", "+X", "-X", "+Y", "-Y", "+Z", "-Z"];
  const actions: { (ev: MouseEvent): void }[] = [];
  actions.push((ev) => render.fixMesh());
  actions.push((ev) => render.resetRotations());
  actions.push((ev) => render.addRotation({ axis: "X", degrees: 90 }));
  actions.push((ev) => render.addRotation({ axis: "X", degrees: -90 }));
  actions.push((ev) => render.addRotation({ axis: "Y", degrees: 90 }));
  actions.push((ev) => render.addRotation({ axis: "Y", degrees: -90 }));
  actions.push((ev) => render.addRotation({ axis: "Z", degrees: 90 }));
  actions.push((ev) => render.addRotation({ axis: "Z", degrees: -90 }));

  for (let i = 0; i < labels.length; i++) {
    const tmp = document.createElement("button");
    tmp.textContent = labels[i];
    let act = actions[i];
    tmp.addEventListener("click", act);
    guiButtons.push(tmp);
  }

  let menuEl = document.getElementById("menu");
  if (menuEl) guiButtons.forEach((el) => menuEl.appendChild(el));

  canvas = <HTMLCanvasElement>document.getElementById("canvas");
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight - 60;

  ctx = <CanvasRenderingContext2D>canvas.getContext("2d");
  ctx.imageSmoothingEnabled = true;
  //   ctx.translate(0.5, 0.5);
  ctx.fillStyle = "#ddd";
  ctx.rect(0, 0, canvas.width, canvas.height);
  ctx.fill();

  // models are loaded by dropping STL files onto canvas
  if (canvas) setupDropHandler(canvas, render.renderMesh);

  // on load, there will be no model
  ctx.font = "24px 'Abel'";
  ctx.fillStyle = "#000";
  ctx.fillText("No file loaded. Drag OBJ or STL onto window.", 30, 54);
};
