import app from "../app";
import request from "supertest";

describe("Test MainController", () => {
    it("Get / should return valid response!", async () => {
        const result = await request(app).get("/").send();

        expect(result.status).toBe(200);
        expect(result.body.hello).toBe("world");
    });
});
