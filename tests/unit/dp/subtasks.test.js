const ctx = require('../../../dp/ctx');
const subtasks = require('../../../dp/subtasks');

describe('dp.subtasks.getAll', () => {
    it('When passing invalid todo_id should return null as data and error message', () => {
        const values = [null, '', undefined, 0, -1];
        values.forEach(async (todo_id) => {            
            const result = await subtasks.getAll(todo_id); 
            expect(result.data).toBeNull();
            expect(result.error).not.toBeNull();
            expect(result.errorCode).toBe(400);
        });        
    });

    it('When passing valid todo_id should call "executeQuery" method 1 times.', async () => {
        ctx.executeQuery = jest.fn();

        await subtasks.getAll(1);
        expect(ctx.executeQuery).toHaveBeenCalledTimes(1);
    });

    it('When passing valid todo_id should return arrays as data and empty error message', async () => {
        ctx.executeQuery = jest.fn().mockReturnValue(
            {
                rows: [{}],
                rowCount: 1
            }
        );

        const result = await subtasks.getAll(1);
        expect(result.data).not.toBeNull();
        expect(result.error).toBe('');
        expect(result.errorCode).toBeUndefined();
    });
});

describe('dp.subtasks.insert', () =>{
    it('When passing invalid todo_id should return null as data and error message', () => {
        const values = [null, '', undefined, 0, -1];
        values.forEach(async (todo_id) => {            
            const result = await subtasks.insert('title', todo_id); 
            expect(result.data).toBeNull();
            expect(result.error).not.toBeNull();
            expect(result.errorCode).toBe(400);
        });        
    });

    it('When passing valid data should call "executeQuery" method 2 times.', async () => {
        ctx.executeQuery = jest.fn().mockReturnValue(
            {
                rows: [{}],
                rowCount: 1
            }
        );

        await subtasks.insert('title', 1); 
        expect(ctx.executeQuery).toHaveBeenCalledTimes(2);
    });

    it('When passing valid data should call "executeQuery" method and passing table name.', async () => {
        ctx.executeQuery = jest.fn().mockReturnValue(
            {
                rows: [{}],
                rowCount: 1
            }
        );

        await subtasks.insert('title', 1); 
        expect(ctx.executeQuery.mock.calls[0][0]).toMatch(/public."Todo"/);      //for get parent
        expect(ctx.executeQuery.mock.calls[1][0]).toMatch(/public."Subtasks"/);  //for insert
    });
});

describe('dp.subtasks.update', () =>{
    it('When passing invalid todo_id should return null as data and error message', () => {
        const values = [null, '', undefined, 0, -1];
        values.forEach(async (id) => {            
            const result = await subtasks.update(id, 1); 
            expect(result.data).toBeNull();
            expect(result.error).not.toBeNull();
            expect(result.errorCode).toBe(400);
        });        
    });

    it('When passing valid data should call "executeQuery" method 2 times.', async () => {
        ctx.executeQuery = jest.fn().mockReturnValue(
            {
                rows: [{}],
                rowCount: 1
            }
        );

        await subtasks.update(1, 1); 
        expect(ctx.executeQuery).toHaveBeenCalledTimes(2);
    });

    it('When passing valid data should call "executeQuery" method and passing table name.', async () => {
        ctx.executeQuery = jest.fn().mockReturnValue(
            {
                rows: [{}],
                rowCount: 1
            }
        );

        await subtasks.update(1, 1); 
        expect(ctx.executeQuery.mock.calls[0][0]).toMatch(/public."Subtasks"/);      //for get the record
        expect(ctx.executeQuery.mock.calls[1][0]).toMatch(/public."Todo"/);          //for update todo
        expect(ctx.executeQuery.mock.calls[1][0]).toMatch(/public."Subtasks"/);      //for update subtasks
    });
});