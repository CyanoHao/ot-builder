// RECTIFICATION INTERFACES
export namespace Rectify {
    export function Id<R, X>(r: R, x: X): X {
        return x;
    }
    export function maybeT<R, X>(
        rec: R,
        x: null | undefined | X,
        fn: (rec: R, x: X) => null | undefined | X
    ) {
        if (!x) return x;
        else return fn(rec, x);
    }
    export function setAllT<R, X>(
        rec: R,
        xs: ReadonlySet<X>,
        fn: (rec: R, x: X) => null | undefined | X
    ) {
        let xs1: Set<X> = new Set();
        for (let x of xs) {
            const x1 = fn(rec, x);
            if (x1) xs1.add(x1);
            else return null;
        }
        return xs1;
    }
    export function setSomeT<R, X>(
        rec: R,
        xs: ReadonlySet<X>,
        fn: (rec: R, x: X) => null | undefined | X
    ) {
        let xs1: Set<X> = new Set();
        for (let x of xs) {
            const x1 = fn(rec, x);
            if (x1) xs1.add(x1);
        }
        return xs1;
    }
    export function listAllT<R, X>(
        rectifier: R,
        m: ReadonlyArray<X>,
        fn: (re: R, x: X) => null | undefined | X
    ) {
        let m1: X[] = [];
        for (const x of m) {
            const x1 = fn(rectifier, x);
            if (x1 == null) return null;
            else m1.push(x1);
        }
        return m1;
    }
    export function listSomeT<R, X>(
        rectifier: R,
        m: ReadonlyArray<X>,
        fn: (re: R, x: X) => null | undefined | X
    ) {
        let m1: X[] = [];
        for (const x of m) {
            const x1 = fn(rectifier, x);
            if (x1 != null) m1.push(x1);
        }
        return m1;
    }
    export function listSparseT<R, X>(
        rectifier: R,
        m: ReadonlyArray<null | undefined | X>,
        fn: (re: R, x: X) => null | undefined | X
    ) {
        let m1: Array<null | undefined | X> = [];
        for (const x of m) {
            if (x == null) m1.push(x);
            else m1.push(fn(rectifier, x));
        }
        return m1;
    }
    export function mapAllT<R, X, Y>(
        rectifier: R,
        m: ReadonlyMap<X, Y>,
        fnX: (re: R, x: X) => null | undefined | X,
        fnY: (re: R, y: Y) => null | undefined | Y
    ) {
        let m1 = new Map<X, Y>();
        for (const [x, y] of m) {
            const x1 = fnX(rectifier, x);
            if (x1 == null) return null;
            const y1 = fnY(rectifier, y);
            if (y1 == null) return null;
            m1.set(x1, y1);
        }
        return m1;
    }
    export function mapSomeT<R, X, Y>(
        rectifier: R,
        m: ReadonlyMap<X, Y>,
        fnX: (re: R, x: X) => null | undefined | X,
        fnY: (re: R, y: Y) => null | undefined | Y
    ) {
        let m1 = new Map<X, Y>();
        for (const [x, y] of m) {
            const x1 = fnX(rectifier, x);
            if (x1 == null) continue;
            const y1 = fnY(rectifier, y);
            if (y1 == null) continue;
            m1.set(x1, y1);
        }
        return m1;
    }

    ////// "GLYPH" rectifier (VERY frequently used)
    export namespace Glyph {
        export interface RectifierT<G> {
            glyph(from: G): null | undefined | G;
        }
        export interface RectifiableT<G> {
            rectifyGlyphs(rectifier: RectifierT<G>): void | boolean;
        }
        function single<G>(rectifier: RectifierT<G>, g: G) {
            return rectifier.glyph(g);
        }
        export function setAll<G>(rec: RectifierT<G>, gs: ReadonlySet<G>) {
            return Rectify.setAllT(rec, gs, single);
        }
        export function setSome<G>(rec: RectifierT<G>, gs: ReadonlySet<G>) {
            return Rectify.setSomeT(rec, gs, single);
        }
        export function listAll<G>(rec: RectifierT<G>, gs: ReadonlyArray<G>) {
            return Rectify.listAllT(rec, gs, single);
        }
        export function listSome<G>(rec: RectifierT<G>, gs: ReadonlyArray<G>) {
            return Rectify.listSomeT(rec, gs, single);
        }
        export function listSparse<G>(rec: RectifierT<G>, gs: ReadonlyArray<G>) {
            return Rectify.listSparseT(rec, gs, single);
        }
        export function bimapAll<G>(rec: RectifierT<G>, gm: ReadonlyMap<G, G>) {
            return Rectify.mapAllT(rec, gm, single, single);
        }
        export function bimapSome<G>(rec: RectifierT<G>, gm: ReadonlyMap<G, G>) {
            return Rectify.mapSomeT(rec, gm, single, single);
        }
        export function mapAll<G, X>(rec: RectifierT<G>, gm: ReadonlyMap<G, X>) {
            return Rectify.mapAllT(rec, gm, single, (r, x) => x);
        }
        export function mapSome<G, X>(rec: RectifierT<G>, gm: ReadonlyMap<G, X>) {
            return Rectify.mapSomeT(rec, gm, single, (r, x) => x);
        }
        export function comapAll<G, X>(rec: RectifierT<G>, gm: ReadonlyMap<X, G>) {
            return Rectify.mapAllT(rec, gm, (r, x) => x, single);
        }
        export function comapSome<G, X>(rec: RectifierT<G>, gm: ReadonlyMap<X, G>) {
            return Rectify.mapSomeT(rec, gm, (r, x) => x, single);
        }
        export function mapAllT<G, X>(
            rec: RectifierT<G>,
            gm: ReadonlyMap<G, X>,
            fn: (rec: RectifierT<G>, x: X) => null | undefined | X
        ) {
            return Rectify.mapAllT(rec, gm, single, fn);
        }
        export function mapSomeT<G, X>(
            rec: RectifierT<G>,
            gm: ReadonlyMap<G, X>,
            fn: (rec: RectifierT<G>, x: X) => null | undefined | X
        ) {
            return Rectify.mapSomeT(rec, gm, single, fn);
        }
        export function comapAllT<G, X>(
            rec: RectifierT<G>,
            gm: ReadonlyMap<X, G>,
            fn: (rec: RectifierT<G>, x: X) => null | undefined | X
        ) {
            return Rectify.mapAllT(rec, gm, fn, single);
        }
        export function comapSomeT<G, X>(
            rec: RectifierT<G>,
            gm: ReadonlyMap<X, G>,
            fn: (rec: RectifierT<G>, x: X) => null | undefined | X
        ) {
            return Rectify.mapSomeT(rec, gm, fn, single);
        }
    }

    ////// "Axis" rectifier
    export namespace Axis {
        export interface RectifierT<A> {
            axis(axis: A): null | undefined | A;
            readonly addedAxes: ReadonlyArray<A>;
        }
        export interface RectifiableT<A> {
            rectifyAxes(rectifier: RectifierT<A>): void;
        }
    }

    ////// "Coord" rectifier
    export namespace Coord {
        export interface RectifierT<X> {
            coord(value: X): X;
            cv(value: X): X;
        }
        export interface RectifiableT<X> {
            rectifyCoords(rectifier: RectifierT<X>): void;
        }

        function single<X>(rec: RectifierT<X>, x: X) {
            return rec.coord(x);
        }
        export function list<X>(rec: RectifierT<X>, arr: ReadonlyArray<X>) {
            return Rectify.listSomeT(rec, arr, single);
        }
    }

    ////// "Lookup" rectifier
    export namespace Lookup {
        export interface RectifierT<L> {
            lookup(l: L): null | undefined | L;
        }
        export interface RectifiableT<L> {
            rectifyLookups(rectifier: RectifierT<L>): void;
        }
    }

    ////// "Elim" rectifier
    export namespace Elim {
        export interface Eliminable {
            cleanupEliminable(): boolean;
        }
        export function findInSet<L>(l: null | undefined | L, ls: ReadonlySet<L>) {
            if (l == null || !ls.has(l)) return null;
            else return l;
        }
        export function comapSomeT<K, L, A extends any[]>(
            a: ReadonlyMap<K, L>,
            fn: (l: L, ...args: A) => null | undefined | L,
            ...args: A
        ) {
            let a1 = new Map<K, L>();
            for (const [key, value] of a) {
                const l1 = fn(value, ...args);
                if (l1 != null) a1.set(key, l1);
            }
            return a1;
        }
        export function listSomeT<L, A extends any[]>(
            a: ReadonlyArray<L>,
            fn: (l: L, ...args: A) => null | undefined | L,
            ...args: A
        ) {
            let a1: L[] = [];
            for (const item of a) {
                const l1 = fn(item, ...args);
                if (l1 != null) a1.push(l1);
            }
            return a1;
        }
        export function listSome<L>(a: ReadonlyArray<L>, ls: ReadonlySet<L>) {
            let a1: L[] = [];
            for (const item of a) {
                const l1 = findInSet(item, ls);
                if (l1 != null) a1.push(l1);
            }
            return a1;
        }
        export function listSomeOpt<L>(a: ReadonlyArray<L>, ls: ReadonlySet<L>) {
            let a1: L[] = [];
            for (const item of a) {
                const l1 = findInSet(item, ls);
                if (l1 != null) a1.push(l1);
            }
            if (!a1.length) return null;
            return a1;
        }
    }
}

// TRACING INTERFACES
export namespace Trace {
    export namespace Glyph {
        export interface TracerT<G> {
            has(glyph: G): boolean;
            add(glyph: G): void;
        }
        export interface TraceableT<G> {
            traceGlyphs(marker: TracerT<G>): void;
        }
    }
}
