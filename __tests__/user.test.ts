import { getUserId } from "../utils/user";

describe("Get user id", () => {

    const unmockedFetch = global.fetch;

    beforeAll(() => {
        // mock fetch
        global.fetch = jest.fn(() =>
            Promise.resolve({
                json: () => Promise.resolve({
                    mock_name: "mockName",
                    id: "mockId"
                }),
            }),
        ) as jest.Mock;
    });

    afterAll(() => {
        // restore fetch
        global.fetch = unmockedFetch
        jest.restoreAllMocks();
    });

    it("correctly retrieves the user id", async () => {
        const userId = await getUserId('mock_refresh_token');
        expect(userId).toEqual("mockId");
    });

    // TODO: change mock fetch return value
    it("correctly handles response if it is an API error", async () => {
        const userId = await getUserId('mock_refresh_token');
        expect(userId).toThrowError("Internal server error, unable to retrieve the user's ID");
    });
})