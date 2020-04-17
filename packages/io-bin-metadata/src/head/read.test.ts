import { BinaryView } from "@ot-builder/bin-util";
import { readSfntBuf } from "@ot-builder/io-bin-sfnt";
import { Head } from "@ot-builder/ot-metadata";
import { TestFont } from "@ot-builder/test-util";

import { HeadIo } from ".";

test("Reading : head", () => {
    const bufFont = TestFont.get("SourceSerifVariable-Roman.ttf");
    const sfnt = readSfntBuf(bufFont);
    const head = new BinaryView(sfnt.tables.get(Head.Tag)!).next(HeadIo);
    expect(head.unitsPerEm).toBe(1000);
    expect(head.fontRevision).toBe(3);
});
