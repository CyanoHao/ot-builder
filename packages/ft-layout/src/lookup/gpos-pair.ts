import { Rectify, Trace } from "@ot-builder/rectify";

import { LayoutCommon } from "../common";
import { DicingStore } from "../dicing-store";

import { GeneralLookupT } from "./general";

// We use a "flat" representation to record all the kerning data here
export class GposPairLookupT<G, X, L> implements GeneralLookupT<G, X, L> {
    public rightToLeft = false;
    public ignoreGlyphs = new Set<G>();
    public adjustments = new DicingStore<G, G, LayoutCommon.Adjust.PairT<X>>();

    public rectifyGlyphs(rec: Rectify.Glyph.RectifierT<G>) {
        this.ignoreGlyphs = Rectify.Glyph.setSome(rec, this.ignoreGlyphs);

        const adjustments1 = new DicingStore<G, G, LayoutCommon.Adjust.PairT<X>>();
        const cdFirst = this.adjustments.getXClassDef();
        const cdSecond = this.adjustments.getYClassDef();
        for (let c1 = 0; c1 < cdFirst.length; c1++) {
            for (let c2 = 0; c2 < cdSecond.length; c2++) {
                const adj = this.adjustments.getByClass(c1, c2);
                if (adj == null) continue;
                const cFirst1 = Rectify.Glyph.listSome(rec, cdFirst[c1]);
                const cSecond1 = Rectify.Glyph.listSome(rec, cdSecond[c2]);
                if (cFirst1 && cFirst1.length && cSecond1 && cSecond1.length) {
                    adjustments1.set(new Set(cFirst1), new Set(cSecond1), adj);
                }
            }
        }
        this.adjustments = adjustments1;
    }
    public traceGlyphs(marker: Trace.Glyph.TracerT<G>) {}
    public rectifyCoords(rec: Rectify.Coord.RectifierT<X>) {
        const adjustments1 = new DicingStore<G, G, LayoutCommon.Adjust.PairT<X>>();
        const cdFirst = this.adjustments.getXClassDef();
        const cdSecond = this.adjustments.getYClassDef();
        for (let c1 = 0; c1 < cdFirst.length; c1++) {
            for (let c2 = 0; c2 < cdSecond.length; c2++) {
                const adj = this.adjustments.getByClass(c1, c2);
                if (adj == null) continue;
                const adj1: LayoutCommon.Adjust.PairT<X> = [
                    LayoutCommon.Adjust.rectify(rec, adj[0]),
                    LayoutCommon.Adjust.rectify(rec, adj[1])
                ];
                const cFirst = cdFirst[c1];
                const cSecond = cdSecond[c2];
                if (cFirst && cFirst.length && cSecond && cSecond.length) {
                    adjustments1.set(new Set(cFirst), new Set(cSecond), adj1);
                }
            }
        }
        this.adjustments = adjustments1;
    }
    public cleanupEliminable() {
        const cdFirst = this.adjustments.getXClassDef();
        const cdSecond = this.adjustments.getYClassDef();
        for (let c1 = 0; c1 < cdFirst.length; c1++) {
            for (let c2 = 0; c2 < cdSecond.length; c2++) {
                const cFirst = cdFirst[c1];
                const cSecond = cdSecond[c2];
                const adj = this.adjustments.getByClass(c1, c2);
                if (cFirst.length || cSecond.length || adj != null) return false;
            }
        }
        return true;
    }
    public rectifyLookups(rec: Rectify.Lookup.RectifierT<L>) {}
}
