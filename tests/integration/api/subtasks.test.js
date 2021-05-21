const request = require('supertest');
const app = require('../../../app');
const ctx = require('../../../dp/ctx');

async function emptyDatabase() {
    await ctx.executeQuery('delete from public."Subtasks"; delete from public."Todo";');
}

describe('/api/subtask', () => {
    beforeEach(() => {
        emptyDatabase();
    });

    afterEach(() => {
        emptyDatabase();
    });

    describe('POST /', () => {
        async function POST(data) {
            const res = await request(app)
                .post(`/api/subtask`)
                .send(data);

            return res;
        }

        it('when passing wrong title should return "Bad request"', () => {
            const res = await POST({ title: '', todo_id: 1 });
            expect(res.status).toBe(400);
        });


        it('When passing wrong todo_id should return "Bad request"', () => {
            async () => {
                const res = await POST({ title: 'A title' });
                expect(res.status).toBe(400);
            }
        });

        it('When post a not exists parent record, should return "Not found"', () => {
            async () => {
                const apiResult = await POST({ title: 'A title', todo_id: 1 });
                expect(apiResult.status).toBe(404);
            }
        });

        it('When post valid record, should return "Created"', () => {
            async () => {
                const sqlCommand = `INSERT INTO public."Todo" (title) VALUES ('integration test') RETURNING id`;
                const dbResult = await ctx.executeQuery(sqlCommand);
                const dbResult_todoId = dbResult.rows[0].id;

                const apiResult = await POST({ title: 'A title', todo_id: dbResult_todoId });

                expect(apiResult.status).toBe(201);
            }
        });

        it('when post valid record, should affect database', () => {
            async () => {
                let sqlCommand = `INSERT INTO public."Todo" (title) VALUES ('integration test') RETURNING id`;
                const dbResult = await ctx.executeQuery(sqlCommand);
                const dbResult_todoId = dbResult.rows[0].id;

                const apiResult = await POST({ title: 'A title', todo_id: dbResult_todoId });

                sqlCommand = `select * from public."Subtasks" where id = ${apiResult.body.id}`;
                const dbResultAfterPost = await ctx.executeQuery(sqlCommand);

                expect(apiResult.status).toBe(201);
                expect(apiResult.body.id).toBe(dbResultAfterPost.rows[0].id);
            }
        });
    });

    describe('PUT /', () => {
        async function PUT(data, addr) {
            const res = await request(app)
                    .put(addr || '/api/subtask/abc')
                    .send({ status: 1 });
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
                const res = await PUT({ status: 2 }, `/api/subtask/1`);
                expect(res.status).toBe(400);
            }
        });

        it('When passing not exist id return "Not found"', () => {
            async () => {
                const res = await PUT({ status: 1 }, `/api/subtask/1`);
                expect(res.status).toBe(404);
            }
        });

        it('When put status=1 should affect at database', () => {
            async () => {
                let sqlCommand = `INSERT INTO public."Todo" (title) VALUES ('integration test') RETURNING id;`;
                const dbParentResult = await ctx.executeQuery(sqlCommand);
                const parent_id = dbParentResult.rows[0].id;
                sqlCommand = `insert into public."Subtasks" (title, "todo_id") values ('integration test', ${parent_id})  RETURNING id;`;
                const dbResult = await ctx.executeQuery(sqlCommand);
                const subtaskId = dbResult.rows[0].id;

                const apiResult = await PUT({ status: 1 }, `/api/subtask/${subtaskId}`);                    

                sqlCommand = `select * from public."Subtasks" where id = ${subtaskId} limit 1;`;
                const dbResultAfterPut = await ctx.executeQuery(sqlCommand);

                expect(dbResultAfterPut.rows[0].status).toBe("1");
            }
        });
    });
});
