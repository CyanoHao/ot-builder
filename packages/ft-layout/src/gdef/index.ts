import { OtGlyph } from "@ot-builder/ft-glyphs";
import { Data } from "@ot-builder/prelude";
import { Rectify, Trace } from "@ot-builder/rectify";
import { OtVar } from "@ot-builder/variance";

import { LayoutCommon } from "../common";

export namespace Gdef {
    export const Tag = "GDEF";

    export type AttachPointsT<G> = Array<OtGlyph.PointIDRef>;
    export type AttachPointListT<G> = Map<G, AttachPointsT<G>>;

    export interface LigCaretT<X> {
        readonly x: X;
        readonly pointAttachment?: Data.Maybe<OtGlyph.PointIDRef>;
        readonly xDevice?: Data.Maybe<ReadonlyArray<number>>;
    }
    export type LigCaretListT<G, X> = Map<G, Array<LigCaretT<X>>>;

    function rectifyLigCaret<X>(rec: Rectify.Coord.RectifierT<X>, lc: LigCaretT<X>): LigCaretT<X> {
        return { ...lc, x: rec.coord(lc.x) };
    }

    export class TableT<G, X>
        implements
            Rectify.Glyph.RectifiableT<G>,
            Rectify.Coord.RectifiableT<X>,
            Trace.Glyph.TraceableT<G> {
        public glyphClassDef: Data.Maybe<LayoutCommon.ClassDef.T<G>> = null;
        public attachList: Data.Maybe<AttachPointListT<G>> = null;
        public ligCarets: Data.Maybe<LigCaretListT<G, X>> = null;
        public markAttachClassDef: Data.Maybe<LayoutCommon.ClassDef.T<G>> = null;
        public markGlyphSets: Data.Maybe<Array<LayoutCommon.Coverage.T<G>>> = null;

        // Rectify and Tracing
        public traceGlyphs(tracer: Trace.Glyph.TracerT<G>) {}
        public rectifyCoords(rec: Rectify.Coord.RectifierT<X>) {
            if (this.ligCarets) {
                this.ligCarets = Rectify.mapSomeT(
                    rec,
                    this.ligCarets,
                    (r, g) => g,
                    (r, lcs) => Rectify.listSomeT(r, lcs, rectifyLigCaret)
                );
            }
        }
        public rectifyGlyphs(rec: Rectify.Glyph.RectifierT<G>) {
            if (this.glyphClassDef) {
                this.glyphClassDef = Rectify.Glyph.mapSome(rec, this.glyphClassDef);
            }
            if (this.attachList) {
                this.attachList = Rectify.Glyph.mapSome(rec, this.attachList);
            }
            if (this.ligCarets) {
                this.ligCarets = Rectify.Glyph.mapSome(rec, this.ligCarets);
            }
            if (this.markAttachClassDef) {
                this.markAttachClassDef = Rectify.Glyph.mapSome(rec, this.markAttachClassDef);
            }
            if (this.markGlyphSets) {
                this.markGlyphSets = Rectify.listSomeT(
                    rec,
                    this.markGlyphSets,
                    Rectify.Glyph.setSome
                );
            }
        }
    }

    export enum GlyphClass {
        Base = 1,
        Ligature = 2,
        Mark = 3,
        Component = 4
    }

    // alias
    export class Table extends TableT<OtGlyph, OtVar.Value> {}
}
