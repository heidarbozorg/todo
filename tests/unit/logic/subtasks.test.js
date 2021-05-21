const subtasksLogic = require('../../../logic/subtasks');
const subtasksDB = require('../../../dp/subtasks');

describe('logic.subtasks.insert', () =>{
    it('When passing invalid todo_id, should return 400 as status and error message', () => {
        const values = [null, '', undefined, 'ab', 0, -1];
        values.forEach(async (todo_id) => {     
            const data = {title: 'A title', todo_id: todo_id};
            const result = await subtasksLogic.insert(data); 
            expect(result).toMatchObject({status: 400});
            expect(result).toHaveProperty('body');
            expect(result.body).toMatch(/todo_id/);
        });        
    });

    it('When passing invalid title, should return 400 as status and error message', () => {
        const values = [null, '', undefined, 'ab', 0, -1];
        values.forEach(async (title) => {            
            const data = {title: title, todo_id: 1};
            const result = await subtasksLogic.insert(data); 
            expect(result).toMatchObject({status: 400});
            expect(result).toHaveProperty('body');
            expect(result.body).toMatch(/title/);
        });        
    });

    it('When passing valid data should call "subtasksDB.insert" method 1 times.', async () => {
        subtasksDB.insert = jest.fn();
        const data = {title: 'A title', todo_id: 1};
        await subtasksLogic.insert(data); 
        expect(subtasksDB.insert).toHaveBeenCalledTimes(1);
    });

    it('When passing valid data should call "subtasksDB.insert" method and passing exact values.', async () => {
        subtasksDB.insert = jest.fn();

        const data = {title: 'A title', todo_id: 1};
        await subtasksLogic.insert(data); 
        expect(subtasksDB.insert.mock.calls[0][0]).toBe(data.title);
        expect(subtasksDB.insert.mock.calls[0][1]).toBe(data.todo_id);
    });

    it('When passing valid data, should return 201 as status and exact data.', async () => {
        const dbResult = {data: {id: 1}};
        subtasksDB.insert = jest.fn().mockReturnValue(dbResult);
        const data = {title: 'A title', todo_id: 1};
        const result = await subtasksLogic.insert(data); 
        expect(result.status).toBe(201);
        expect(result.body).toMatchObject(dbResult.data);
    });
});

describe('logic.subtasks.update', () =>{
    it('When passing invalid id, should return 400 as status and error message', () => {
        const values = [null, '', undefined, 'ab', 0, -1];
        values.forEach(async (id) => {     
            const result = await subtasksLogic.update(id, {status: 1}); 
            expect(result).toMatchObject({status: 400});
            expect(result).toHaveProperty('body');
            expect(result.body).toMatch(/id/);
        });        
    });

    it('When passing invalid status, should return 400 as status and error message', () => {
        const values = [null, '', undefined, 'ab', 2, -1];
        values.forEach(async (status) => {            
            const result = await subtasksLogic.update(1, {status: status}); 
            expect(result).toMatchObject({status: 400});
            expect(result).toHaveProperty('body');
            expect(result.body).toMatch(/status/);
        });        
    });

    it('When passing valid data should call "subtasksDB.update" method 1 times.', async () => {
        subtasksDB.update = jest.fn();
        await subtasksLogic.update(1, {status: 1}); 
        expect(subtasksDB.update).toHaveBeenCalledTimes(1);
    });

    it('When passing valid data should call "subtasksDB.update" method and passing exact values.', async () => {
        subtasksDB.update = jest.fn();

        await subtasksLogic.update(1, {status: 1}); 
        expect(subtasksDB.update.mock.calls[0][0]).toBe(1);
        expect(subtasksDB.update.mock.calls[0][1]).toBe(1);
    });
});
