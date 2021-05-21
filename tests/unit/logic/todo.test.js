const todo = require('../../../logic/todo');
const todoDB = require('../../../dp/todo');
const subtasksDB = require('../../../dp/subtasks');

describe('logic.todo.getAll', () => {
    it('When passing invalid pageSize should return null as data and error message', () => {
        const values = ['ab', -1];
        values.forEach(async (pageSize) => {
            const result = await todo.getAll(0, pageSize);
            expect(result).toHaveProperty('status', 400);
            expect(result).toHaveProperty('body');
            expect(result.body).toMatch(/pageSize/);
        });
    });

    it('When passing invalid startIndex should return null as data and error message', () => {
        const values = ['ab', -1];
        values.forEach(async (startIndex) => {
            const result = await todo.getAll(startIndex, 1);
            expect(result).toHaveProperty('status', 400);
            expect(result).toHaveProperty('body');
            expect(result.body).toMatch(/startIndex/);
        });
    });

    it('When passing valid params should call "todoDB.getAll" method 1 times and not call "subtasksDB.getAll".', async () => {
        todoDB.getAll = jest.fn();
        subtasksDB.getAll = jest.fn();

        await todo.getAll(0, 1);
        expect(todoDB.getAll).toHaveBeenCalledTimes(1);
        expect(subtasksDB.getAll).not.toHaveBeenCalled();
    });

    it('When passing valid params should return arrays as data and empty error message', async () => {
        todoDB.getAll = jest.fn().mockReturnValue(
            {
                data: [{ id: 1 }]
            }
        );
        subtasksDB.getAll = jest.fn();

        const result = await todo.getAll(1, 1);
        expect(result).toHaveProperty('status', 200);
        expect(result).toHaveProperty('body');
        expect(result.body).not.toBeNull();
        expect(result.body).not.toBeUndefined();
    });

    it('When passing valid params should call "todoDB.getAll" method 1 times and call "subtasksDB.getAll" as array length.', async () => {
        const data = [
            { id: 1 },
            { id: 2 }
        ];
        todoDB.getAll = jest.fn().mockReturnValue(
            {
                data: data
            }
        );
        subtasksDB.getAll = jest.fn();

        await todo.getAll(0, 1);

        expect(todoDB.getAll).toHaveBeenCalledTimes(1);
        expect(subtasksDB.getAll).toHaveBeenCalledTimes(data.length);
    });
});

describe('logic.todo.insert', () => {
    it('When passing invalid title should return 400 as status and error message', () => {
        const values = [null, '', undefined, 'ab', 0, -1];
        values.forEach(async (title) => {
            const data = { title: title };
            const result = await todo.insert(data);
            expect(result).toMatchObject({ status: 400 });
            expect(result).toHaveProperty('body');
            expect(result.body).toMatch(/title/);
        });
    });

    it('When passing valid data should call "todoDB.insert" method 1 times.', async () => {
        todoDB.insert = jest.fn();
        const data = { title: 'A title' };
        await todo.insert(data);
        expect(todoDB.insert).toHaveBeenCalledTimes(1);
    });

    it('When passing valid data should call "todoDB.insert" method and passing exact values.', async () => {
        todoDB.insert = jest.fn();

        const data = { title: 'A title' };
        await todo.insert(data);
        expect(todoDB.insert.mock.calls[0][0]).toBe(data.title);
    });
});

describe('logic.todo.update', () =>{
    it('When passing invalid id should return 400 as status and error message', () => {
        const values = [null, '', undefined, 'ab', 0, -1];
        values.forEach(async (id) => {
            const result = await todo.update(id, {status: 1});
            expect(result).toMatchObject({status: 400});
            expect(result).toHaveProperty('body');
            expect(result.body).toMatch(/id/);
        });
    });

    it('When passing invalid status should return 400 as status and error message', () => {
        const values = [null, '', undefined, 'ab', 2, -1];
        values.forEach(async (status) => {
            const result = await todo.update(1, {status: status});
            expect(result).toMatchObject({status: 400});
            expect(result).toHaveProperty('body');
            expect(result.body).toMatch(/status/);
        });
    });

    it('When passing valid data should call "todoDB.update" method 1 times.', async () => {
        todoDB.update = jest.fn();
        await todo.update(1, {status: 1});
        expect(todoDB.update).toHaveBeenCalledTimes(1);
    });

    it('When passing valid data should call "todoDB.update" method and passing exact values.', async () => {
        todoDB.update = jest.fn();

        await todo.update(1, {status: 1});
        expect(todoDB.update.mock.calls[0][0]).toBe(1);
        expect(todoDB.update.mock.calls[0][1]).toBe(1);
    });
});