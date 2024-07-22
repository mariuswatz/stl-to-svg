import { loadSTL, STLMesh } from "@amandaghassaei/stl-parser";
import { loadOBJ } from "@lnjs/core";
import * as ln from "@lnjs/core";

export const getSTLModel = (url: string, callback: (mesh: ln.Mesh) => void) => {
  console.log("getSTLModel", url);
  let stl: STLMesh;
  loadSTL(url, (mesh: STLMesh) => {
    console.log("vert", mesh.vertices.length);
    stl = mesh.mergeVertices();
    callback(getLnMesh(stl));
  });
};

async function fetchFile(path: string): Promise<string> {
  const obj = await window.fetch(path).then((res) => res.text());
  return obj;
}

export const getOBJModel = async (
  url: string,
  callback: (mesh: ln.Mesh) => void
) => {
  console.log("getOBJModel", url);
  fetchFile(url).then((data) => callback(loadOBJ(data)));

  // const obj = await window.fetch(url).then((res) => callback(file, loadOBJ(res.text())))};
};

export const getLnMesh = (mesh: STLMesh) => {
  let v: ln.Vector[] = [];
  let vn = mesh.vertices.length / 3;

  let id = 0;

  for (let i = 0; i < vn; i++) {
    v.push(
      new ln.Vector(
        mesh.vertices[id++],
        mesh.vertices[id++],
        mesh.vertices[id++]
      )
    );
  }
  let tri: ln.Triangle[] = [];

  id = 0;
  vn = mesh.facesIndices.length / 3;
  for (let i = 0; i < vn; i++) {
    let t = new ln.Triangle(
      v[mesh.facesIndices[id++]],
      v[mesh.facesIndices[id++]],
      v[mesh.facesIndices[id++]]
    );
    tri.push(t);
  }

  return new ln.Mesh(tri);
};
