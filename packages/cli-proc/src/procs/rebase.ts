import * as Ot from "@ot-builder/font";
import * as Rectify from "@ot-builder/rectify-font";
import { StdPointAttachRectifier } from "../support/point-rectifier";

export function rebaseFont<GS extends Ot.GlyphStore>(font: Ot.Font<GS>, newUpm: number) {
    Rectify.rectifyFontCoords(
        createAxisRectifier(),
        createValueRectifier(newUpm, font.head.unitsPerEm),
        new StdPointAttachRectifier(Rectify.PointAttachmentRectifyManner.TrustAttachment),
        font
    );
    font.head.unitsPerEm = newUpm;
}

function createAxisRectifier(): Rectify.AxisRectifier {
    return {
        dim: a => a,
        axis: a => a,
        addedAxes: []
    };
}

function createValueRectifier(newUpm: number, oldUpm: number): Rectify.CoordRectifier {
    return {
        coord: x => Ot.Var.Ops.scale(newUpm / oldUpm, x),
        cv: x => Ot.Var.Ops.scale(newUpm / oldUpm, x)
    };
}
