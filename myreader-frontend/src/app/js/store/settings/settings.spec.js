import {
    getPageSize, isShowEntryDetails, isShowUnseenEntries, setPageSize, setShowEntryDetails,
    setShowUnseenEntries
} from "./settings";

describe('src/app/js/store/settings/settings.spec.js', () => {

    beforeEach(() => localStorage.clear());
    afterEach(() => localStorage.clear());

    it('should return default pageSize equal to 10', () => {
        expect(getPageSize()).toBe(10);
    });

    it('should return pageSize equal to 20', () => {
        setPageSize(20);
        expect(getPageSize()).toBe(20);
    });

    it('should return default pageSize 10 when given pageSize is greater than 30', () => {
        setPageSize(31);
        expect(getPageSize()).toBe(10);
    });

    it('should return default pageSize 10 when given pageSize is zero', () => {
        setPageSize(0);
        expect(getPageSize()).toBe(10);
    });

    it('should return false for showEntryDetails setting', () => {
        setShowEntryDetails(false);
        expect(isShowEntryDetails()).toBe(false);
    });

    it('should return default value true for showEntryDetails setting', () => {
        expect(isShowEntryDetails()).toBe(true);
    });

    it('should return default true for showUnseenEntries setting', () => {
        expect(isShowUnseenEntries()).toBe(true);
    });

    it('should return false for showUnseenEntries setting', () => {
        setShowUnseenEntries(false);
        expect(isShowUnseenEntries()).toBe(false);
    });

    it('should return default value true for showUnseenEntries setting when given value is undefined', () => {
        setShowUnseenEntries(undefined);
        expect(isShowUnseenEntries()).toBe(true);
    });

    it('should return default value true for showEntryDetails setting when given value is undefined', () => {
        setShowEntryDetails(undefined);
        expect(isShowEntryDetails()).toBe(true);
    });

    describe('settings with malformed json', () => {

        beforeEach(() => localStorage.setItem('myreader-settings', '{'));

        it('should initialize with default values', () => {
            expect(getPageSize()).toBe(10);
            expect(isShowEntryDetails()).toBe(true);
            expect(isShowUnseenEntries()).toBe(true);
        });
    });

    describe('settings with valid json', () => {

        beforeEach(() => localStorage.setItem('myreader-settings', '{"pageSize":20,"showUnseenEntries":false,"showEntryDetails":false}'));

        it('should initialize from persistent values', () => {
            expect(getPageSize()).toBe(20);
            expect(isShowEntryDetails()).toBe(false);
            expect(isShowUnseenEntries()).toBe(false);
        });
    });
});