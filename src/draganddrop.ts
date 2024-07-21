import { getModel } from "./stl-reader";
import * as ln from "@lnjs/core";

let dropHandlerCallback: (f: File, mesh: ln.Mesh) => void;

export let uploadedFile: File;

export const setupDropHandler = (
  canvas: HTMLElement,
  callback: (f: File, mesh: ln.Mesh) => void
) => {
  dropHandlerCallback = callback;

  ["dragenter", "dragover", "dragleave", "drop"].forEach((eventName) => {
    canvas.addEventListener(eventName, preventDefaults, false);
  });

  canvas.ondrop = dropHandler;
  console.log("drop handler", canvas);
};

function preventDefaults(e: Event) {
  e.preventDefault();
  e.stopPropagation();
}

function dropHandler(event: DragEvent) {
  // Prevent default behavior (Prevent file from being opened)
  event.preventDefault();

  if (event?.dataTransfer?.items) {
    // Use DataTransferItemList interface to access the file(s)
    [...event.dataTransfer.items].forEach((item, i) => {
      // If dropped items aren't files, reject them
      if (item.kind === "file") {
        const file: File | null = item.getAsFile();
        if (file && file.name.endsWith("stl")) {
          console.log(`… file[${i}].name = ${file?.name}`, file);
          let url = URL.createObjectURL(file);
          uploadedFile = file;
          getModel(url, file, dropHandlerCallback);
        }
      }
    });
  }
  //   } else {
  //     // Use DataTransfer interface to access the file(s)
  //     if (event.dataTransfer)
  //       [...event.dataTransfer.files].forEach((file, i) => {
  //         console.log(`… file[${i}].name = ${file.name}`, file);
  //       });
  //   }
}