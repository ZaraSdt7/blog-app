import { Test, TestingModule } from "@nestjs/testing";
import { INestApplication } from "@nestjs/common";
import * as request from "supertest";
import { AppModule } from "../src/app.module";

describe("CommentsController (e2e)", () => {
    let app: INestApplication;
    let token: string;
    let postId: string;

    beforeEach(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [AppModule],
        }).compile();

        app = moduleFixture.createNestApplication();
        await app.init();

        await request(app.getHttpServer())
            .post("/auth/register")
            .send({
                name: "New User",
                email: "newuser@gmail.com",
                password: "password",
            });
        const loginRes = await request(app.getHttpServer())
            .post("/auth/login")
            .send({ email: "test@example.com", password: "password" });
        token = loginRes.body.access_token;

        const postRes = await request(app.getHttpServer())
            .post("/posts")
            .set("Authorization", `Bearer ${token}`)
            .send({
                title: "Test Post",
                content: "This is a test post.",
            });
        postId = postRes.body.id;
    });

    it("/comments (POST) - create comment", async () => {
        return request(app.getHttpServer())
            .post("/comments")
            .set("Authorization", `Bearer ${token}`)
            .send({
                content: "Test Comment",
                postId,
            })
            .expect(201)
            .expect((res) => {
                expect(res.body.content).toEqual("Test Comment");
                expect(res.body.post).toEqual(postId);
            });
    });

    it("/comments/post/:postId (GET) - get comments for post", async () => {
        await request(app.getHttpServer())
            .post("/comments")
            .set("Authorization", `Bearer ${token}`)
            .send({
                content: "Test Comment",
                postId,
            });

        return request(app.getHttpServer())
            .get(`/comments/post/${postId}`)
            .expect(200)
            .expect((res) => {
                expect(res.body.comments).toBeInstanceOf(Array);
                expect(res.body.total).toBeGreaterThan(0);
            });
    });

    it("/comments/:id (PUT) - update comment", async () => {
        const commentRes = await request(app.getHttpServer())
            .post("/comments")
            .set("Authorization", `Bearer ${token}`)
            .send({
                content: "Test Comment",
                postId,
            });

        return request(app.getHttpServer())
            .put(`/comments/${commentRes.body._id}`)
            .set("Authorization", `Bearer ${token}`)
            .send({
                content: "Updated Comment",
            })
            .expect(200)
            .expect((res) => {
                expect(res.body.content).toEqual("Updated Comment");
            });
    });

    it("/comments/:id (DELETE) - delete comment", async () => {
        const commentRes = await request(app.getHttpServer())
            .post("/comments")
            .set("Authorization", `Bearer ${token}`)
            .send({
                content: "Test Comment",
                postId,
            });

        return request(app.getHttpServer())
            .delete(`/comments/${commentRes.body.id}`)
            .set("Authorization", `Bearer ${token}`)
            .expect(200);
    });

    afterAll(async () => {
        await app.close();
    });
});
