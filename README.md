# stl-to-svg

A tool to render 3D models (in STL format) as 2D vector drawings that can be exported as SVGs. This is useful for creating plotter drawings of 3D models.

The underlying 3D engine is Michael Fogleman's [ln renderer](https://github.com/fogleman/ln), ported to JavaScript by Brandon Dail: [ln.js](https://github.com/aweary/ln.js).

To parse STL files I use [stl-parser](https://github.com/amandaghassaei/stl-parser) by Amanda Ghassaei.

# Usage

Install packages with `npm i`, then run the application with `npm run dev`. The application runs on [localhost:5173](http://localhost:5173/).

To upload a STL file, just drag it onto the browser window. The model should load automatically.

Minimal keyboard control as follows:

- Arrow key UP/DOWN: Set the y position of the "eye" vector
- Arrow key LEFT/RIGHT: Rotate the model around the up axis, in steps of 30 degrees

I haven't added any options to change what default rotation the mesh might need, currently I rotate my models 90 degrees around the Z axis. You may need to change with the default mesh setup in the `renderMesh()`code.

This is the line I'm using for now:

`mesh.transform(ln.rotate(new ln.Vector(1, 0, 0), ln.radians(90)));`

---

[Marius Watz](https://mariuswatz.com), July 2024
