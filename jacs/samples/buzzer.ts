import * as ds from "@devicescript/core"

const btn = new ds.Button()
const buzzer = new ds.Buzzer()


btn.down.subscribe(() => {
    buzzer.playNote(440, 0.1, 200)
})
