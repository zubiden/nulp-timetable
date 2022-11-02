import { getTimezoneOffset } from "../utils/date";

const HOUR = 60 * 60 * 1000;

test('getTimezoneOffset', () => {
    const offset1 = getTimezoneOffset("Europe/Uzhgorod");
    expect([HOUR * 2, HOUR * 3]).toContain(offset1);

    const offset3 = getTimezoneOffset("Europe/Uzhgorod", new Date(2022, 9, 29));
    expect(offset3).toBe(HOUR * 3);

    const offset2 = getTimezoneOffset("Europe/Uzhgorod", new Date(2022, 9, 30));
    expect(offset2).toBe(HOUR * 2);
});
