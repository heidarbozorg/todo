const request = require('supertest');
const app = require('../../../app');
const ctx = require('../../../dp/ctx');

function emptyDatabase() {
    async () => {
        await ctx.executeQuery('delete from public."Subtasks"; delete from public."Todo";');
    }
}

describe('/api/todo', () => {
    beforeEach(() => {
        emptyDatabase();
    });

    afterEach(() => {
        emptyDatabase();
    });

    describe('GET /', () => {
        async function GET(addr) {
            const apiResult = await request(app).get(addr || '/api/todo');
            return apiResult;
        }

        it('When a record exists, should return it', () => {
            async () => {
                const sqlCommand = `INSERT INTO public."Todo" (title) VALUES ('integration test') RETURNING id`;
                const dbResult = await ctx.executeQuery(sqlCommand);
                const todoId = dbResult.rows[0].id;

                const apiResult = await GET();
                expect(apiResult.status).toBe(200);
                expect(apiResult.body[0].id).toBe(todoId);
            }
        });


        it('should return "Nothing found"', () => {
            async () => {
                const res = await GET();
                expect(res.status).toBe(404);
            }
        });

        it('When passing wrong pageSize should return "Bad request"', () => {
            async () =>{
                const res = await GET(`/api/todo?startIndex=0&pageSize=-1`);
                expect(res.status).toBe(400);
                expect(res.body).toBeMatch(/startIndex/);
            }
        });


        it('When passing wrong startIndex should return "Bad request"', () => {
            async () =>{
                const res = await GET(`/api/todo?startIndex=-1&pageSize=1`);
                expect(res.status).toBe(400);
                expect(res.body).toBeMatch(/startIndex/);
            }
        });
    });

    describe('POST /', () => {
        async function POST(data) {
            const apiResult = await request(app)
                .post(`/api/todo`)
                .send(data);

            return apiResult;
        }

        it('When post result is "created", it should be exists at database', () => {
            async () => {
                const apiResult = await POST({ title: 'A title' });
                const apiTodoId = apiResult.body.id;

                const sqlCommand = `select * from public."Todo" where id = ${apiTodoId}`;
                const dbResult = await ctx.executeQuery(sqlCommand);
                const dbTodoId = dbResult.rows[0].id;

                expect(apiTodoId).toBe(dbTodoId);
            }
        });


        it('When passing wrong title should return "Bad request"', () => {
            async () => {
                const res = await POST({ title: '' });
                expect(res.status).toBe(400);
            }
        });

        it('When passing valid title should return "Created"', () => {
            async () => {
                const res = await POST({ title: 'A title' });
                expect(res.status).toBe(201);
            }
        });

    });

    describe('PUT /', () => {
        async function PUT(data, addr) {
            const res = await request(app)
                .put(addr || `/api/todo/abc`)
                .send(data);
            return res;

        }
        it('When passing invalid id should return "Bad request"', () => {
            async () => {
                const res = await PUT({ status: 1 });
                expect(res.status).toBe(400);
            }
        });

        it('When passing invalid status should return "Bad request"', () => {
            async () => {
                const res = await PUT({ status: 2 });
                expect(res.status).toBe(400);
            }
        });

        it('When passing not exist id return "Not found"', () => {
            async () => {
                const res = await PUT({ status: 1 });
                expect(res.status).toBe(404);
            }
        });

        it('When put status=1 should affect at database', () => {
            async () => {
                let sqlCommand = `INSERT INTO public."Todo" (title) VALUES ('integration test') RETURNING id`;
                const dbResult = await ctx.executeQuery(sqlCommand);

                const apiResult = await PUT({ status: 1 }, `/api/todo/${dbResult.rows[0].id}`)

                sqlCommand = `select * from public."Todo" where id = ${dbResult.rows[0].id}`;
                const dbResultAfterPut = await ctx.executeQuery(sqlCommand);

                expect(dbResultAfterPut.rows[0].status).toBe("1");
            }
        });
    });
});
