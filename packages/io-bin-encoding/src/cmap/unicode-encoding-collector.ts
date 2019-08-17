import { Cmap } from "@ot-builder/ft-encoding";
import { OtGlyphOrder } from "@ot-builder/ft-glyphs";
import { GID, UInt24 } from "@ot-builder/primitive";

export class UnicodeEncodingCollector {
    constructor(
        private encoding: Cmap.EncodingMap,
        private gOrd: OtGlyphOrder,
        private readonly maxCodePoint: number
    ) {}
    public collect(): [number, number][] {
        let results: Array<[number, number]> = [];
        for (const [code, glyph] of this.encoding.entries()) {
            if (code >= this.maxCodePoint) continue;
            const gid = this.gOrd.reverse(glyph);
            if (gid == null) continue;
            results.push([code, gid]);
        }
        results.sort((p, q) => p[0] - q[0]);
        return results;
    }
}

export class UvsEncodingEntry {
    constructor(public readonly selector: UInt24) {}
    public defaults: UInt24[] = [];
    public nonDefaults: [UInt24, GID][] = [];

    public sort() {
        this.defaults.sort((a, b) => a - b);
        this.nonDefaults.sort((a, b) => a[0] - b[0]);
    }
}
export class UvsEncodingCollector {
    constructor(
        private encoding: Cmap.VsEncodingMap,
        private defaults: Cmap.EncodingMap,
        private gOrd: OtGlyphOrder
    ) {}
    public collect(): UvsEncodingEntry[] {
        let m: Map<number, UvsEncodingEntry> = new Map();

        for (const [code, selector, glyph] of this.encoding.entries()) {
            let ee = m.get(selector);
            if (!ee) {
                ee = new UvsEncodingEntry(selector);
                m.set(selector, ee);
            }
            const gid = this.gOrd.tryReverse(glyph);
            if (gid == null) continue;
            const isDefault = glyph === this.defaults.get(code);
            if (isDefault) {
                ee.defaults.push(code);
            } else {
                ee.nonDefaults.push([code, gid]);
            }
        }

        let a = Array.from(m.values());
        for (const ee of a) ee.sort();
        return a.sort((a, b) => a.selector - b.selector);
    }
}
