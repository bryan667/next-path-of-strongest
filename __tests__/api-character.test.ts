import fetch from "node-fetch";
import { GET } from "../app/api/character/route";

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

describe("GET /api/character", () => {
  beforeEach(() => {
    fetchMock.mockReset();
    (global as any).__characterCache?.clear?.();
    process.env.API_URL = "https://server-prox.vercel.app";
    process.env.DEFAULT_ACCOUNT_NAME = "Default#1234";
  });

  it("returns 500 when API_URL is missing", async () => {
    delete process.env.API_URL;

    const request = new Request(
      "http://localhost/api/character?accountName=A&characterName=Char"
    );
    const response = await GET(request);
    const payload = await response.json();

    expect(response.status).toBe(500);
    expect(payload.hasError).toBe(true);
  });

  it("returns 400 when required params are missing", async () => {
    const request = new Request("http://localhost/api/character?accountName=A");
    const response = await GET(request);
    const payload = await response.json();

    expect(response.status).toBe(400);
    expect(payload.hasError).toBe(true);
  });

  it("fetches character data and returns payload", async () => {
    const mockData = { character: { name: "Hero" }, items: [] };
    fetchMock.mockResolvedValueOnce(createFetchResponse(mockData));

    const request = new Request(
      "http://localhost/api/character?accountName=A&characterName=Hero"
    );
    const response = await GET(request);
    const payload = await response.json();

    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(payload).toEqual(mockData);
  });

  it("caches character data by account and character", async () => {
    const mockData = { character: { name: "Hero" }, items: [] };
    fetchMock.mockResolvedValue(createFetchResponse(mockData));

    const request = new Request(
      "http://localhost/api/character?accountName=A&characterName=Hero"
    );

    const first = await GET(request);
    const second = await GET(request);

    await first.json();
    await second.json();

    expect(fetchMock).toHaveBeenCalledTimes(1);
  });
});
