import * as ln from "@lnjs/core";
import { triangleArea } from "./ln-mesh-tools";

export function modifyMesh(tri: ln.Triangle[]): ln.Triangle[] {
  let triArea: number[] = [];
  tri.forEach((t) => {
    triArea.push(triangleArea(t));
  });

  for (let i = 0; i < 50; i++) {
    let id = Math.floor(Math.random() * tri.length);
    let t: ln.Triangle = tri[id];
    let v1 = new ln.Vector(t.v1.x, t.v1.y, t.v1.z);
    let v2 = new ln.Vector(t.v2.x, t.v2.y, t.v2.z);
    let v3 = new ln.Vector(t.v3.x, t.v3.y, t.v3.z);
    let v1D = v1.sub(v2);
    let v3D = v3.sub(v2);

    let D = [
      v1D.length(),
      v3D.length(),
      new ln.Vector(v3.x - v1.x, v3.y - v1.y, v3.z - v1.z).length(),
    ];
    let maxD = Math.max(D[0], Math.max(D[1], D[2]));
    let invalid = false;

    D = D.map((val) => {
      val = val / maxD;
      if (val < 0.3) invalid = true;
      return val;
    });

    console.log("distances", D, invalid ? "INVALID" : "");

    if (!invalid) {
      if (D[0] > 0.9) {
        tri.splice(id, 1);

        let v1Mid = new ln.Vector(v1.x, v1.y, v1.z).sub(
          v1D.multiplyScalar(0.5)
        );
        tri.push(new ln.Triangle(v1, v1Mid, v3));
        tri.push(new ln.Triangle(v2, v1Mid, v3));
      } else if (D[1] > 0.8) {
        tri.splice(id, 1);
        let v3Mid = new ln.Vector(v3.x, v3.y, v3.z).sub(
          v3D.multiplyScalar(0.5)
        );
        tri.push(new ln.Triangle(v1, v3Mid, v2));
        tri.push(new ln.Triangle(v1, v3Mid, v3));
      } else tri.push(t);
    }
  }

  return tri;
}
