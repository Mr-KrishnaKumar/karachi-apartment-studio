# Reconstruction record

Source: `public/assets/original-plan.jpg`, 740 × 960 pixels. The image contains a rendered plan with furniture, not construction dimensions for every wall and opening.

Coordinates use meters: X increases rightward in the image, Z increases downward, Y increases upward. The origin is Bedroom 1's northwest finished interior corner. Room dimensions are clear finished dimensions, not outer wall dimensions. All declared wall thicknesses are assumed to be 0.1524 m.

| Space | Interior X | Interior Z | Clear width X | Clear depth Z | Source label |
| --- | ---: | ---: | ---: | ---: | --- |
| Bedroom 1 | 0.0000 | 0.0000 | 4.4196 | 3.6576 | 14′6″ × 12′ |
| Drawing room | 5.7912 | 0.0000 | 4.5720 | 3.6576 | 15′ × 12′ |
| Bedroom 2 | 0.0000 | 7.7724 | 3.8100 | 4.2672 | 12′6″ × 14′ |
| Bedroom 3 | 7.7724 | 8.0772 | 3.8100 | 3.9624 | 12′6″ × 13′ |
| Lounge | 3.9624 | 3.8100 | 3.6576 | 6.0960 | 12′ × 20′ |
| Kitchen | 7.7724 | 3.8100 | 2.7432 | 2.1336 | 9′ × 7′ |
| Bathroom 1 | 0.0000 | 3.8100 | 2.4384 | 1.8288 | 8′ × 6′ |
| Bathroom 2 | 0.0000 | 5.7912 | 2.4384 | 1.8288 | 8′ × 6′ |
| Bathroom 3 | 9.2964 | 6.0960 | 2.4384 | 1.8288 | 8′ × 6′ |
| Store | 7.7724 | 6.0960 | 1.3716 | 1.8288 | 4′6″ × 6′ appears in image |
| Terrace | 3.9624 | 10.0584 | 3.6576 | 1.5240 | 12′ × 5′ |
| Balcony | -0.9144 | 0.0000 | 0.7620 | 2.7432 | 2′6″ × 9′ appears in image |
| Powder room | 10.5156 | 0.0000 | 1.0668 | 1.8288 | Width appears 3′6″; depth inferred |
| Entrance passage | 4.5720 | 0.0000 | 1.0668 | 3.8100 | Inferred |
| Dining / circulation | 2.5908 | 3.8100 | 1.3716 | 3.8100 | Inferred; no east partition |

The left bathroom corridor's minimum nominal clear width, beside Bedroom 2's eastern wall projection, is 1.2192 m. The upper entrance passage is 1.0668 m clear. The foyer-to-lounge passage is 1.2192 m between wall centerline opening endpoints; side partitions reduce the effective foyer width to 1.0668 m. Bedroom door openings are 0.9 m, bathroom / store / balcony doors 0.8 m, powder door 0.75 m, kitchen passage 1.05 m and terrace doorway 1.2 m. These are provisional opening widths, not measurements recovered from the image.

The lounge's upper western side opens into the dining/circulation area, preserving the wider public space visible in the image. The 12′ × 20′ label is assigned to its core rectangle; the additional dining/circulation area is separately reported.

Clear labeled spaces sum to 1269 ft². Separately modeled clear entrance and dining/circulation sum to 100 ft². These figures do not establish how the source's 1383 ft² net and 171 ft² circulation were calculated. Exterior outlines, structural shafts, common building circulation and gross-wall accounting are not documented in the raster.

## Geometric conflicts and ambiguities

- The source rendering is not uniformly scaled. Direct pixel-to-meter conversion produces contradictory horizontal and vertical ratios. Therefore the reconstruction preserves labels and adjacencies, with inferred offsets explicitly specified.
- Store width (4′6″) + Bathroom 3 width (8′) equals Bedroom 3 width (12′6″) before a partition is added. All three cannot have coincident outer edges with a nonzero partition and those clear dimensions. The model preserves clear dimensions and adds a 152.4 mm eastward step at Bathroom 3. This is an inferred exterior detail.
- Kitchen width and drawing-room edges similarly produce a small east-side offset when clear dimensions and wall thickness are preserved.
- The exact Bath 3 doorway is ambiguous; access from Bedroom 3's north side is assumed. Its source furniture orientation and fixtures are approximations.
- Door swings, hinges, powder depth, window sill heights, window heights, ceiling heights, construction materials, ceiling fans and AC placements are assumptions.
- Bedroom furniture and drawing-room seating follow the visible broad arrangement. Lounge furniture is compact enough to retain the store and terrace routes. Exact product forms and precise raster furniture measurements cannot be established.
- The balcony source label appears 9′ long, rather than the brief's approximately 6′. The source store depth appears 6′, rather than 6′6″. These choices are exposed in the app and source.
- The indicated plan-up direction is not asserted to be geographic north. Karachi daylight is illustrative.

## Validation

`npm run validate` checks exact room label conversions, three-bedroom count, nonoverlapping clear rooms, shared store/bath wall alignment, duplicate wall segments, opening coverage, furniture containment, preset invariance, closed/open entrance collision, high-speed wall collision and all-room reachability with furniture and open doors. Navigation uses a 55 mm grid and 220 mm radius player.

The tests verify the authored model, not the source's physical truth or browser behavior. Default assumptions can be revised through the separate in-app geometry editor or source file. Applying geometry changes invalidates the default navigation result until reviewed again.
