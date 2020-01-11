import { BinaryView, Frag } from "@ot-builder/bin-util";
import { Vdmx } from "@ot-builder/ft-metadata";
import { SfntOtf } from "@ot-builder/io-bin-sfnt";
import { TestFont } from "@ot-builder/test-util";
import { VdmxTableIo, VdmxRatioRange } from ".";
import * as fs from "fs";
import * as path from "path";

test("Writing : VDMX", () => {
    const bufFont = TestFont.get("vdmx.ttf");
    const sfnt = new BinaryView(bufFont).next(SfntOtf);
    const vdmx = new BinaryView(sfnt.tables.get(Vdmx.Tag)!).next(VdmxTableIo);

    // Read-write roundtrip
    const frVdmx = new Frag().push(VdmxTableIo, vdmx);
    const frVdmxPack = Frag.pack(frVdmx);
    const vdmx2 = new BinaryView(frVdmxPack).next(VdmxTableIo);
    expect(vdmx).toEqual(vdmx2);

    // VdmxGroup sharing check
    const bp = new BinaryView(frVdmxPack);
    bp.uint16(); // `version`
    expect(bp.uint16()).toBe(2); // `numRecords`
    bp.uint16(); // `numRatios`
    bp.next(VdmxRatioRange);
    bp.next(VdmxRatioRange);
    bp.next(VdmxRatioRange);
    const group0Offset = bp.uint16();
    const group1Offset = bp.uint16();
    const group2Offset = bp.uint16();
    expect(group0Offset).toBe(group2Offset);

    // sfnt.tables.set(Vdmx.Tag, frVdmxPack);
    // const frag = new Frag();
    // frag.push(SfntOtf, sfnt);
    // fs.writeFileSync(path.resolve(__dirname, "../../../../test-fonts/vdmx-rebuilt.ttf"), frag.getDataBuffer());
});
