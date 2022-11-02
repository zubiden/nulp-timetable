import { addSearchParameters, getCurrentParameters, getHash, replaceHistory, setSearchParameters } from "../utils/history";
import { expect, test } from '@jest/globals';

let windowSpy;

beforeEach(() => {
    let testURL = new URL('https://student.lpnu.ua/');
    windowSpy = jest.spyOn(window, "window", "get");
    windowSpy.mockImplementation(() => ({
        location: testURL,
    }));

    replaceHistory({
        replace: (path, state) => {
            testURL = new URL(testURL.origin + path);
        },
    });
});

afterEach(() => {
    windowSpy.mockRestore();
});

test('setSearchParameters', () => {
    setSearchParameters({ test: 1 });
    expect(window.location.search).toBe('?test=1');
    setSearchParameters({ test: 2 });
    expect(window.location.search).toBe('?test=2');
    setSearchParameters({ test: 3, test2: 4 });
    expect(window.location.search).toBe('?test=3&test2=4');
})

test('addSearchParameters', () => {
    addSearchParameters({ test: 1 });
    expect(window.location.search).toBe('?test=1');
    addSearchParameters({ test: 2 }, false);
    expect(window.location.search).toBe('?test=1');
    addSearchParameters({ test: 2 });
    expect(window.location.search).toBe('?test=2');
});

test('getHash', () => {
    window.location.hash = '#/Settings';
    expect(getHash()).toBe('Settings');
    window.location.hash = '#/Settings/1';
    expect(getHash()).toBe('Settings/1');
    window.location.hash = '#/Settings/1/2';
    expect(getHash()).toBe('Settings/1/2');
});

test('getCurrentParameters', () => {
    window.location.search = '?test=1';
    expect(getCurrentParameters()).toEqual({ test: '1' });
    window.location.search = '?test=1&test2=2';
    expect(getCurrentParameters()).toEqual({ test: '1', test2: '2' });
});
