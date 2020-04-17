import { BinaryView, Frag } from "@ot-builder/bin-util";
import { readSfntBuf } from "@ot-builder/io-bin-sfnt";
import { Head } from "@ot-builder/ot-metadata";
import { TestFont } from "@ot-builder/test-util";

import { HeadIo } from ".";

test("Read-write roundtrip : head", () => {
    const bufFont = TestFont.get("SourceSerifVariable-Roman.ttf");
    const sfnt = readSfntBuf(bufFont);
    const head = new BinaryView(sfnt.tables.get(Head.Tag)!).next(HeadIo);
    const frHead = new Frag().push(HeadIo, head);
    const head2 = new BinaryView(Frag.pack(frHead)).next(HeadIo);

    expect(head).toEqual(head2);
});
