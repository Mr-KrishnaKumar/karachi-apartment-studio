# Karachi Residence — Apartment Studio

A local React + Vite + Three.js + React Three Fiber + Drei apartment walkthrough and design studio, reconstructed from the supplied Type A marketing floor plan.

## Start locally

Use Node.js 20.19+ or 22.12+ and a browser with WebGL / hardware acceleration.

```sh
cd /Users/krishna/karachi-apartment
npm install
npm run validate
npm run dev -- --open
```

Vite prints the local URL, normally **http://127.0.0.1:5173**. Keep the terminal running while using the studio. On macOS you can also open `Launch Studio.command`.

For a production build:

```sh
npm run build
npm run preview -- --open
```

No API keys, accounts, backend, paid assets, or runtime asset CDN are required. The first `npm install` requires internet access. All interior textures are generated locally in the browser. The original plan, dimensioned SVG and coordinate specification are included in `public/assets/`.

## Verification status in the authoring environment

- **Passed:** 12 architecture, scale, geometry, collision, furniture containment, preset invariance and navigation checks (`npm run validate`).
- **Passed:** all seven source JS/JSX files parsed using Babel's JSX parser.
- **Passed:** Vite production build with the installed, locked dependencies.
- **Not completed:** live WebGL rendering, keyboard/pointer-lock interactions and browser visual QA. The browser harness could not connect to Chrome in the authoring environment. Do not treat a successful production build and geometry checks as proof that the WebGL experience has been browser-tested.

## Walkthrough

The studio opens in roofless dollhouse mode. Select **Walkthrough**, then **Enter walkthrough**. You start outside the upper central entrance, facing the entrance passage and lounge. Press **E** to open the main door, then walk inside.

| Input | Action |
| --- | --- |
| W / A / S / D | Walk forward / left / back / right |
| Mouse | Look around while pointer is locked |
| Shift | Walk faster |
| E | Toggle the nearest door within 1.8 m |
| Esc | Release mouse to access the studio |
| M | Toggle minimap |
| R | Reset the active camera; walkthrough returns to entrance |
| Orbit / Dollhouse | Drag to rotate, right-drag to pan, scroll to zoom |

Click doors directly in overview modes. The walking camera remains at a 1.65 m eye height by default. Movement uses a 0.22 m radius circle, wall / window solids, door leaves and furniture footprints. Movement is divided into ≤ 0.06 m increments to avoid passing through thin walls. Opening and closing a door is refused if its final leaf position would intersect the player. Door animation uses the same hinge and swing convention as collision; intermediate swept-volume collision is not simulated.

Some spaces are narrow, especially the balcony and powder room. This is a human walking simulation and **does not certify wheelchair accessibility or building-code compliance**.

## Architecture and accuracy

Read [docs/RECONSTRUCTION.md](docs/RECONSTRUCTION.md) first. The source is a low-resolution illustrated marketing plan, not a surveyed CAD drawing. Exact construction accuracy cannot be recovered from it.

1. Room dimensions use exact conversions: **1 inch = 0.0254 m**, **1 foot = 0.3048 m**. Clear room dimensions are preserved rather than stretching rooms to fit the raster.
2. Room count is **three bedrooms + one drawing room**, plus lounge, kitchen, three bathrooms, powder room, store, terrace, balcony and circulation.
3. All wall endpoints, opening endpoints, inferred offsets, heights and furniture geometry are explicit. Assumptions are exposed in the studio's accuracy dialog.
4. Source-label discrepancies: balcony appears **9′ × 2′6″**; store appears **4′6″ × 6′0″**. These override the approximate sizes in the text brief. Powder room width appears 3′6″; its 6′ depth is inferred.
5. The marketing figures **1383 ft² net + 171 ft² circulation = 1554 ft²** are retained as stated references. The labeled modeled spaces sum to **1269 ft²**, plus **100 ft²** of modeled clear circulation. Neither sum nor the stepped model footprint is asserted to reproduce the marketing area calculation.
6. The drawing is not uniformly to scale. Walls are provisionally 152.4 mm thick; ceiling height is 3.048 m. The store + bath clear widths total Bedroom 3's width before adding their partition. To preserve clear dimensions, Bath 3 extends 152.4 mm beyond Bedroom 3's east edge. That exterior offset is an assumption.
7. Door positions, widths, hinges, swings, windows, Bath 3 access from Bedroom 3 and the powder entrance are provisional. Furniture follows the image in broad arrangement, with sizes adjusted to preserve actual walking routes. The lounge console and seating are kept compact to avoid blocking the store and terrace.
8. Geographic location is Karachi; compass orientation is unknown. Sun direction and time are illustrative, not a solar/site study.

The 2D SVG and JSON were generated **before the 3D interior implementation**. The interactive 2D plan and 3D shell use the same runtime room / wall / opening data.

## Edit assumptions

Open **The space → Accuracy & assumptions → Edit provisional construction assumptions**. You can edit ceiling height, eye height, door height, sill height, window height, opening endpoints, and door swing direction. Changes apply to every design, save separately from finishes and reload the studio. Restore defaults from the same editor. The editor rejects invalid heights, openings outside their wall and overlapping openings; it does not perform a new navigation flood fill in the browser. Custom geometry needs renewed review.

The coordinate download in the studio exports current assumptions. The bundled downloadable SVG is the **default reconstruction**. To revise inferred room offsets, partition thickness or labeled dimensions, edit `src/architecture.js`, then run:

```sh
npm run spec
npm run validate
```

The validation report applies to source defaults. Browser assumption overrides live in `karachi-residence-assumptions-v1` and do not automatically modify source files or the bundled SVG.

## Design studio

Six global presets: Modern Luxury Karachi, Traditional Pakistani, Minimalist Modern, Premium Contemporary, Budget-Friendly Karachi, Scandinavian / Japandi.

Each room can follow the global preset or use its own preset. Edit wall color, upholstery, floor material, sofa style, bed style, cabinetry, lighting and ceiling treatment independently. Global preset switching intentionally clears individual overrides. Geometry, doors, windows, room sizes and circulation never depend on a design preset.

Press **Esc** while walking, change the design, then **Resume walkthrough** to continue at the same position. Saving uses browser local storage. **Load** restores that saved design. **Export / Import** exchange a validated JSON finish file, without changing structure.

**Compare** renders two views side by side. A is your current room-customized design; B is the selected global comparison preset. B copies camera A's position, quaternion and field of view every frame. Control camera A to compare the same viewpoint. Doors are shared. On smaller displays, comparison is best in landscape orientation.

## Materials and performance

The source implements physically based materials, deterministic canvas-generated marble / wood / tile / fabric / rug textures, an internally generated environment map, directional sunlight, warm room lights, soft shadows and contact shadows. Furniture and fixtures are assembled from rounded geometry with real-world sizes. There are no photogrammetry furniture models or photographic PBR texture scans in this delivery. The visual quality is an **architectural PBR visualization**, not a verified photoreal render; photorealism and Apple silicon frame rate remain unverified until browser QA is possible.

Included: beds, sofas, chairs, dining set, tables, media consoles, kitchen counters/cabinets, sink, stove, fridge, bathroom basins/toilets/showers, store shelves, plants, fans, split ACs, curtains, optional grills and ceiling treatments.

Default resolution is capped at 1.5× device pixel ratio with a 2048 shadow map. **The space → Render quality → Efficient** caps it at 1× and reduces the shadow map to 1024. Compare mode renders twice and costs more GPU time.

## Cost estimates

The cost panel uses adjustable illustrative PKR allowances, not live market data. Painting uses 2.5× the stated net floor area, flooring uses 1383 ft², cabinetry uses a provisional 95 ft², and furniture/lighting/fixtures/labor are lump-sum base allowances. The global preset applies a displayed quality multiplier. Individual room overrides are excluded. Export the estimate as JSON to review with a contractor.

## Source map

| File | Purpose |
| --- | --- |
| `src/architecture.js` | Exact conversion helpers, room rectangles, merged wall centerlines, openings, assumptions |
| `src/furniture.js` | Furniture positions, dimensions, orientations and collision footprints |
| `src/physics.js` | Circle vs rectangle collision, door geometry, movement, proximity |
| `src/designs.js` | Six presets, room overrides, cost model |
| `src/materials.js` | Local procedural texture generation and PBR floor materials |
| `src/Scene.jsx` | Shell, detailed furnishings, lights, animated doors/fans, camera controls |
| `src/main.jsx` | Design UI, minimap, assumptions editor, save/load, comparison, costs |
| `scripts/export-plan.mjs` | Generates dimensioned SVG and room/wall/door JSON |
| `scripts/validate.mjs` | Geometry assertions and navigation flood fill with doors/furniture |
| `docs/coordinates.json` | Default architectural coordinate specification |
| `docs/navigation-report.json` | Per-room walking reachability results |
| `docs/validation-report.json` | Latest validation result |

`window.apartmentStudio.snapshot()` exposes current mode, camera pose, designs, doors and location for later browser testing.

## GitHub repository and Pages hosting

The repository must remain **private**. `.github/workflows/deploy.yml` builds and deploys on pushes to `main`; it uses the committed `package-lock.json`, validates geometry, builds `dist/`, and publishes through the GitHub Pages environment. Assets use the Vite base URL so a project repository URL works without hardcoding the account or repository name.

GitHub Pages from a private repository requires an eligible GitHub paid plan. The published Pages website is ordinarily public even when its repository is private. Do not change repository visibility to make Pages available.

To publish from your Mac, double-click `Publish to GitHub.command`, or run:

```sh
node scripts/publish-github.mjs
```

The publisher opens GitHub sign-in when needed, verifies the production build, creates a private repository, pushes the source, enables Pages if your plan allows it and waits for the deployment. It stops rather than making the repository public. It can resume against its own matching private origin after a partial failure.

Alternatively, once authenticated with GitHub CLI, create and push the private repository:

```sh
gh repo create karachi-apartment-studio --private --source=. --remote=origin --push
```

Enable Pages with **Settings → Pages → Source → GitHub Actions**, then run the deployment workflow. The resulting website address is returned by the deployment job. The source repository and live website have not been created merely by adding this workflow.
