import { BinaryView, Frag } from "@ot-builder/bin-util";
import { Config } from "@ot-builder/cfg-log";
import { OtFont } from "@ot-builder/font";
import { OtGlyph, OtGlyphStore, OtListGlyphStoreFactory } from "@ot-builder/ft-glyphs";
import { FontIoConfig, readFont, writeFont } from "@ot-builder/io-bin-font";
import { SfntOtf } from "@ot-builder/io-bin-sfnt";
import { Rectify } from "@ot-builder/rectify";
import { rectifyFontGlyphs, traceGlyphs } from "@ot-builder/rectify-font";
import * as fs from "fs";
import * as path from "path";

const file = process.argv[2];
const subsetText = process.argv[3];
const fileOut = process.argv[4];

///////////////////////////////////////////////////////////////////////////////////////////////////

const cfg = Config.create<FontIoConfig>({});

///////////////////////////////////////////////////////////////////////////////////////////////////

console.log("demo start");

const bufFont = fs.readFileSync(path.resolve(file));
const sfnt = new BinaryView(bufFont).next(SfntOtf);
const font = readFont(sfnt, OtListGlyphStoreFactory, cfg);
console.log("read complete");

///////////////////////////////////////////////////////////////////////////////////////////////////

const rectifier = createSubsetRectifier(font, subsetText);
rectifyFontGlyphs(rectifier, font, OtListGlyphStoreFactory);

///////////////////////////////////////////////////////////////////////////////////////////////////

console.log("write start");

const sfnt1 = writeFont(font, cfg);
const buf1 = Frag.packFrom(SfntOtf, sfnt1);
fs.writeFileSync(path.resolve(fileOut), buf1);

console.log("write complete");

function createSubsetRectifier<GS extends OtGlyphStore>(font: OtFont<GS>, text: string) {
    const init: Set<OtGlyph> = new Set();
    const gOrd = font.glyphs.decideOrder();
    init.add(gOrd.at(0)); // keep NOTDEF

    const codePoints = [...text].map(s => s.codePointAt(0)!);
    if (font.cmap) {
        for (const code of codePoints) {
            const g = font.cmap.unicode.get(code);
            if (g) init.add(g);
        }
    }
    const collected = traceGlyphs(font, init);
    const rect: Rectify.Glyph.RectifierT<OtGlyph> = {
        glyph(g: OtGlyph) {
            if (collected.has(g)) return g;
            else return undefined;
        }
    };
    return rect;
}
