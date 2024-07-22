import * as ln from "@lnjs/core";

// removes faces from mesh that are smaller than "percentile" % of median area.
// should be useful for faces that are invalid or too small to bother with.
export const removeSmallTriangles = (mesh: ln.Mesh, percentile: number) => {
  let tri: ln.Triangle[] = [];
  let triArea: number[] = [];

  // build index of areas for each triangle in mesh
  mesh.triangles.forEach((t) => {
    tri.push(t);
    triArea.push(triangleArea(t));
  });

  // find median triangle area by sorting all area values
  let tmp: number[] = triArea.map((x) => x);
  tmp.sort();

  let medianArea = tmp[Math.floor(tmp.length / 2)];
  let minArea = medianArea * percentile; // median area * percentile

  let triFixed: ln.Triangle[] = [];
  for (let id = 0; id < tri.length; id++)
    if (triArea[id] > minArea) triFixed.push(tri[id]);

  console.log(
    "median area",
    tmp[Math.floor(tmp.length / 2)].toFixed(2),
    "faces - before",
    tri.length,
    "after",
    triFixed
  );
  return new ln.Mesh(triFixed);
};

export function triangleArea(tri: ln.Triangle) {
  let v3 = new ln.Vector(tri.v3.x, tri.v3.y, tri.v3.z);
  v3 = v3.sub(tri.v2);
  let v1 = new ln.Vector(tri.v1.x, tri.v1.y, tri.v1.z);
  v1 = v1.sub(tri.v2);

  // from threejs.Vector3
  // _v0.subVectors( this.c, this.b );
  // _v1.subVectors( this.a, this.b );
  // return _v0.cross( _v1 ).length() * 0.5;

  return v3.cross(v1).length() * 0.5;
}
