import * as ds from "@devicescript/core"
import {
    filter,
    fromEvent,
    fromRegister,
    map,
    Observable,
    from,
    scan,
    threshold,
} from "./index"
import { describe, test, expect, runTests } from "@devicescript/test"
const btn = new ds.Button()
const temp = new ds.Temperature()

async function emits<T>(o: Observable<T>, sequence: T[]) {
    const values: T[] = []
    const s = await o.subscribe(v => {
        values.push(v)
    })

    expect(values.length).toBe(sequence.length)
    for (let i = 0; i < values.length; ++i) {
        expect(values[i]).toBe(sequence[i])
    }

    s.unsubscribe()
}

describe("basics", () => {
    test("create observable", async () => {
        // simple example
        const obs = new Observable<string>(async observer => {
            await observer.next("HELLO")
            await observer.next("WORLD")
            if (observer.complete) await observer.complete()
        })
        await obs.subscribe(v => console.log(v))
        await emits(obs, ["HELLO", "WORLD"])
    })
})

describe("creation operators", () => {
    test("of", async () => {
        const obs = from([1, 2, 3, 4, 5])
        await obs.subscribe(v => console.log(v))
    })
    test("fromEvent", async () => {
        const obs = fromEvent(btn.down)
        const unsub = await obs.subscribe(ev => console.log("down"))
        if (unsub) await unsub.unsubscribe()
    })
    test("fromRegister", async () => {
        const obs = fromRegister(temp.temperature)
        await obs.subscribe(v => console.log(v))
    })
})

describe("transform operators", () => {
    test("map", async () => {
        await from([1, 2, 3])
            .pipe(map(x => x * x))
            .subscribe(t => console.log(t))
    })
    test("map", async () => {
        await from([1, 2, 3])
            .pipe(scan(t => t + 1, 0))
            .subscribe(t => console.log(t))
    })
})

describe("filter operators", () => {
    test("threshold", async () => {
        const obs = from([1, 1.2, 1.3, 1.4, 1.5])
        await obs.pipe(threshold(0.2)).subscribe(v => console.log(v))
    })

    test("threshold", async () => {
        await from([1, 2, 3])
            .pipe(filter(t => t > 2))
            .subscribe(t => console.log(t))
    })
})

await runTests()
