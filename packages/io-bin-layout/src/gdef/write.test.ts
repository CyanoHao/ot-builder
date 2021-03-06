import { BinaryView, Frag } from "@ot-builder/bin-util";
import { readGlyphStore, SkipReadGlyphs } from "@ot-builder/io-bin-glyph-store";
import { readOtMetadata } from "@ot-builder/io-bin-metadata";
import { readSfntOtf } from "@ot-builder/io-bin-sfnt";
import { OtListGlyphStoreFactory } from "@ot-builder/ot-glyphs";
import { Gdef } from "@ot-builder/ot-layout";
import { BimapCtx, GdefIdentity, TestFont } from "@ot-builder/test-util";
import { WriteTimeIVS } from "@ot-builder/var-store";
import { OtVar } from "@ot-builder/variance";

import { GdefTableIo } from "./index";

describe("GDEF write", () => {
    function gdefRoundTrip(file: string) {
        const bufFont = TestFont.get(file);
        const sfnt = readSfntOtf(bufFont);
        const cfg = { fontMetadata: {}, glyphStore: {}, layout: {} };
        const md = readOtMetadata(sfnt, cfg);
        const designSpace = md.fvar ? md.fvar.getDesignSpace() : null;

        const { gOrd } = readGlyphStore(sfnt, cfg, md, OtListGlyphStoreFactory, SkipReadGlyphs);
        const gdefDat = new BinaryView(sfnt.tables.get(Gdef.Tag)!).next(
            GdefTableIo,
            gOrd,
            designSpace
        );

        const ivsW = WriteTimeIVS.create(new OtVar.MasterSet());
        const gdefBuf = Frag.pack(
            Frag.from(GdefTableIo, gdefDat.gdef, cfg, gOrd, ivsW, designSpace)
        );

        const gdefDat2 = new BinaryView(gdefBuf).next(GdefTableIo, gOrd, designSpace);

        GdefIdentity.test(BimapCtx.from(gOrd, gOrd), gdefDat.gdef, gdefDat2.gdef);
    }

    test("Source Serif Variable", () => {
        gdefRoundTrip("SourceSerifVariable-Roman.otf");
    });
    test("Inter Regular", () => {
        gdefRoundTrip("Inter-Regular.otf");
    });
    test("Scheherazade Regular", () => {
        gdefRoundTrip("Scheherazade-Regular.ttf");
    });
    test("Noto Sans Regular", () => {
        gdefRoundTrip("NotoSans-Regular.ttf");
    });
});
