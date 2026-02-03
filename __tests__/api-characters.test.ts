import fetch from "node-fetch";
import { GET } from "../app/api/characters/route";

jest.mock("node-fetch", () => ({
  __esModule: true,
  default: jest.fn(),
}));

const fetchMock = fetch as jest.Mock;

const createFetchResponse = (data: any, ok = true, status = 200) => ({
  ok,
  status,
  json: async () => data,
});

describe("GET /api/characters", () => {
  beforeEach(() => {
    fetchMock.mockReset();
    (global as any).__charactersCache?.clear?.();
    process.env.API_URL = "https://server-prox.vercel.app";
    process.env.DEFAULT_ACCOUNT_NAME = "Default#1234";
  });

  it("returns 500 when API_URL is missing", async () => {
    delete process.env.API_URL;

    const request = new Request(
      "http://localhost/api/characters?accountName=A&realm=pc"
    );
    const response = await GET(request);
    const payload = await response.json();

    expect(response.status).toBe(500);
    expect(payload.hasError).toBe(true);
  });

  it("returns 400 when accountName is missing", async () => {
    delete process.env.DEFAULT_ACCOUNT_NAME;
    const request = new Request("http://localhost/api/characters?realm=pc");
    const response = await GET(request);
    const payload = await response.json();

    expect(response.status).toBe(400);
    expect(payload.hasError).toBe(true);
  });

  it("fetches character list and returns payload", async () => {
    const mockData = [{ name: "Hero", level: 99 }];
    fetchMock.mockResolvedValueOnce(createFetchResponse(mockData));

    const request = new Request(
      "http://localhost/api/characters?accountName=A&realm=pc"
    );
    const response = await GET(request);
    const payload = await response.json();

    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(payload).toEqual(mockData);
  });

  it("caches character list by account and realm", async () => {
    const mockData = [{ name: "Hero", level: 99 }];
    fetchMock.mockResolvedValue(createFetchResponse(mockData));

    const request = new Request(
      "http://localhost/api/characters?accountName=A&realm=pc"
    );

    const first = await GET(request);
    const second = await GET(request);

    await first.json();
    await second.json();

    expect(fetchMock).toHaveBeenCalledTimes(1);
  });
});
