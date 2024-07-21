import { loadSTL, STLMesh } from "@amandaghassaei/stl-parser";
import * as ln from "@lnjs/core";

export const getModel = (
  url: string,
  file: File,
  callback: (f: File, mesh: ln.Mesh) => void
) => {
  console.log("getModel", url);
  let stl: STLMesh;
  loadSTL(url, (mesh: STLMesh) => {
    console.log("vert", mesh.vertices.length);
    stl = mesh.mergeVertices();
    callback(file, getTriangles(stl));
  });
};

export const getTriangles = (mesh: STLMesh) => {
  let v: ln.Vector[] = [];
  console.log("face indices", mesh.facesIndices.length);
  let vn = mesh.vertices.length / 3;
  console.log("merged vert", mesh.vertices.length, vn);

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
  console.log("v", v.length, v);

  let tri: ln.Triangle[] = [];

  id = 0;
  vn = mesh.facesIndices.length / 3;
  for (let i = 0; i < vn; i++) {
    tri.push(
      new ln.Triangle(
        v[mesh.facesIndices[id++]],
        v[mesh.facesIndices[id++]],
        v[mesh.facesIndices[id++]]
      )
    );
  }

  return new ln.Mesh(tri);
};
