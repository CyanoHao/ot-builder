import { BinaryView } from "@ot-builder/bin-util";
import { Config } from "@ot-builder/cfg-log";
import { OtListGlyphStoreFactory } from "@ot-builder/ft-glyphs";
import { Base } from "@ot-builder/ft-layout";
import { readGlyphStore, SkipReadGlyphs } from "@ot-builder/io-bin-glyph-store";
import { readOtMetadata } from "@ot-builder/io-bin-metadata";
import { SfntOtf } from "@ot-builder/io-bin-sfnt";
import { Data } from "@ot-builder/prelude";
import { TestFont } from "@ot-builder/test-util";
import { OV } from "@ot-builder/variance";

import { BaseTableIo } from "./index";

describe("BASE read", () => {
    function readBASE(file: string) {
        const bufFont = TestFont.get(file);
        const sfnt = new BinaryView(bufFont).next(SfntOtf);
        const cfg = Config.create({ fontMetadata: {}, glyphStore: {} });
        const md = readOtMetadata(sfnt, cfg);
        const axes = md.fvar ? Data.Order.fromList("Axes", md.fvar.axes) : null;

        const { gOrd } = readGlyphStore(sfnt, cfg, md, OtListGlyphStoreFactory, SkipReadGlyphs);
        const base = new BinaryView(sfnt.tables.get(Base.Tag)!).next(BaseTableIo, gOrd, axes);
        return { base };
    }

    test("Source Serif Variable", () => {
        const { base } = readBASE("SourceSerifVariable-Roman.otf");
        expect(base.horizontal).toBeTruthy();
        const baseH = base.horizontal!;
        expect(baseH.baselineTags).toEqual(["ideo", "romn"]);
        const baseHDflt = baseH.scripts.get(`DFLT`)!.baseValues!;
        expect(baseHDflt.defaultBaselineIndex).toBe(1);
        expect(OV.equal(1, baseHDflt.baseValues.get("romn")!.at)).toBe(true);
    });
});
