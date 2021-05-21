const ctx = require('../../../dp/ctx');
const todo = require('../../../dp/todo');

describe('dp.todo.getById', () => {
    it('When passing invalid id should return null as data and error message', () => {
        const values = [null, '', undefined, 0, -1];
        values.forEach(async (id) => {            
            const result = await todo.getById(id); 
            expect(result.data).toBeNull();
            expect(result.error).not.toBeNull();
            expect(result.errorCode).toBe(400);
        });        
    });

    it('When passing valid id should call "executeQuery" method 1 times.', async () => {
        ctx.executeQuery = jest.fn();

        await todo.getById(1);
        expect(ctx.executeQuery).toHaveBeenCalledTimes(1);
    });

    it('When passing valid id should call "executeQuery" and pass table name.', async () => {
        ctx.executeQuery = jest.fn();

        await todo.getById(1);
        expect(ctx.executeQuery.mock.calls[0][0]).toMatch(/public."Todo"/);
    });

    it('When passing valid id should return data and empty error message', async () => {
        ctx.executeQuery = jest.fn().mockReturnValue(
            {
                rows: [{}],
                rowCount: 1
            }
        );

        const result = await todo.getById(1);
        expect(result.data).not.toBeNull();
        expect(result.error).toBe('');
    });
});

describe('dp.todo.getAll', () => {
    it('When passing invalid pageSize should return null as data and error message', () => {
        const values = [null, '', undefined, 0, -1];
        values.forEach(async (pageSize) => {            
            const result = await todo.getAll(0, pageSize); 
            expect(result.data).toBeNull();
            expect(result.error).not.toBeNull();
            expect(result.errorCode).toBe(400);
        });        
    });

    it('When passing invalid startIndex should return null as data and error message', () => {
        const values = [null, '', undefined, -1];
        values.forEach(async (startIndex) => {            
            const result = await todo.getAll(startIndex, 1); 
            expect(result.data).toBeNull();
            expect(result.error).not.toBeNull();
            expect(result.errorCode).toBe(400);
        });        
    });

    it('When passing valid params should call "executeQuery" method 1 times.', async () => {
        ctx.executeQuery = jest.fn();

        await todo.getAll(1, 1);
        expect(ctx.executeQuery).toHaveBeenCalledTimes(1);
    });

    it('When passing valid params should return arrays as data and empty error message', async () => {
        ctx.executeQuery = jest.fn().mockReturnValue(
            {
                rows: [{}],
                rowCount: 1
            }
        );

        const result = await todo.getAll(1, 1);
        expect(result.data).not.toBeNull();
        expect(result.error).toBe('');
    });
});

describe('dp.todo.insert', () =>{
    it('When passing valid data should call "executeQuery" method 1 times.', async () => {
        ctx.executeQuery = jest.fn();

        await todo.insert('title'); 
        expect(ctx.executeQuery).toHaveBeenCalledTimes(1);
    });

    it('When passing valid data should call "executeQuery" method and passing table name.', async () => {
        ctx.executeQuery = jest.fn();

        await todo.insert('title'); 
        expect(ctx.executeQuery.mock.calls[0][0]).toMatch(/Todo/);
    });

    describe('dp.todo.update', () =>{
        it('When passing invalid id should return null as data and error message', () => {
            const values = [null, '', undefined, 0, -1];
            values.forEach(async (id) => {            
                const result = await todo.update(id, 1); 
                expect(result.data).toBeNull();
                expect(result.error).not.toBeNull();
                expect(result.errorCode).toBe(400);
            });        
        });
    
        it('When passing valid data should call "executeQuery" method 1 times.', async () => {
            ctx.executeQuery = jest.fn();
    
            await todo.update(1, 1); 
            expect(ctx.executeQuery).toHaveBeenCalledTimes(1);
        });
    
        it('When passing valid data should call "executeQuery" method and passing table name.', async () => {
            ctx.executeQuery = jest.fn();
    
            await todo.update(1, 1); 
            expect(ctx.executeQuery.mock.calls[0][0]).toMatch(/public."Todo"/);          //for update todo
            expect(ctx.executeQuery.mock.calls[0][0]).toMatch(/public."Subtasks"/);      //for update subtasks
        });
    });
});
