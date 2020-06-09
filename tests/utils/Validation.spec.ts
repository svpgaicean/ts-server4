import { objDifference, objIntersection } from "utils/Validation";

describe('Functions', () => {
    beforeEach(() => {
        expect.hasAssertions();
    });

    afterEach(() => {
        jest.resetAllMocks();
    });

    test("objDifference compares two identical objects and returns true", () => {
        const
            subj = {
                title: 'test',
                num: 56,
                name: 'test_test'
            },
            reff = {
                title: 'test',
                num: 56,
                name: 'test_test'
            }

        expect(objDifference<{}>(subj, reff)).toStrictEqual(true);
    });

    test("objDifference compares two different objects and returns false", () => {
        const
            subj = {
                title: 'test',
                num: 56,
                name: 'test_test'
            },
            reff = {
                title: 'test',
                num: 56,
            }

        expect(objDifference<{}>(subj, reff)).toStrictEqual(false);
    });

    test("objIntersection subj has some of reff props and function returns true", () => {
        const
            subj = {
                title: 'test',
                num: 56,
            },
            reff = {
                title: 'test',
                num: 56,
                name: 'test_test'
            }

        expect(objIntersection<{}>(subj, reff)).toStrictEqual(true);
    });

    test("objIntersection subj has none of reff props and function returns false", () => {
        const
            subj = {
                title: 'test',
                num: 56,
            },
            reff = {
                name: 'test_test',
                number: 42,
            }

        expect(objIntersection<{}>(subj, reff)).toStrictEqual(false);
    });

});
