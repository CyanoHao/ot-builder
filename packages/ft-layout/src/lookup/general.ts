import { Data, Rectify, Trace } from "@ot-builder/prelude";

/** General lookup type */
export interface GeneralLookupT<G, X, L>
    extends Trace.Glyph.TraceableT<G>,
        Rectify.Glyph.RectifiableT<G>,
        Rectify.Coord.RectifiableT<X>,
        Rectify.Lookup.RectifiableT<L>,
        Rectify.Elim.Eliminable {
    rightToLeft: boolean;
    ignoreGlyphs: Data.Maybe<Set<G>>;
}
