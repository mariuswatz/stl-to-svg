# stl-to-svg

A tool to render 3D models (in STL or OBJ format) as 2D vector drawings that can be exported as SVGs. This is useful for creating plotter drawings of 3D models.

The underlying 3D engine is Michael Fogleman's [ln renderer](https://github.com/fogleman/ln), ported to JavaScript by Brandon Dail: [ln.js](https://github.com/aweary/ln.js).

To parse STL files I use [stl-parser](https://github.com/amandaghassaei/stl-parser) by Amanda Ghassaei.

# Usage

- Install packages with `npm i`.
- Run the application with `npm run dev`.
- The application runs on [localhost:5173](http://localhost:5173/).

# User interface

<img src="https://raw.githubusercontent.com/mariuswatz/stl-to-svg/main/public/stl-to-svg%20screenshot.png" width="800">

To upload a STL / OBJ file, just drag it onto the browser window. The model should load automatically.

The user interface has the following buttons:

- **Save SVG** - Exports render to SVG
- **Reduce Mesh** - Calculates median triangle area and removes triangles less than 5% of the median. The logic here could be better, but it does get rid of small and zero-area faces.
- **+X, -X, +Y, -Y, +Z, -Z** Rotates 90 / -90 degrees around indicated axis. Useful to compensate for model orientation.
- **Reset rotations** Removes all rotations

There is minimal keyboard control for the camera as follows:

- Arrow key UP/DOWN: Set the y position of the "eye" vector
- Arrow key LEFT/RIGHT: Rotate the model around the Y axis, in steps of 30 degrees

This camera navigation is less than ideal, but sufficient for my purposes so far.

---

[Marius Watz](https://mariuswatz.com), July 2024
