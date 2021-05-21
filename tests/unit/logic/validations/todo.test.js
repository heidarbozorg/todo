const todo = require('../../../../logic/validations/todo');

describe('logic.validations.todo.validateGetAll', () => {
    it('should return error when passing invalid startIndex', () => {
        const values = [null, '', undefined, 'ab', -1];
        values.forEach((startIndex) => {
            const data = { startIndex: startIndex, pageSize: 1 };
            const result = todo.validateGetAll(data);
            expect(result.error).not.toBeUndefined();
        });
    });

    it('should return error when passing invalid pageSize', () => {
        const values = [null, '', undefined, 0, -1, 'ab'];
        values.forEach((pageSize) => {
            const data = { startIndex: 0, pageSize: pageSize };
            const result = todo.validateGetAll(data);
            expect(result.error).not.toBeUndefined();
        });
    });

    it('should return undefined when passing valid data', () => {
        const data = { startIndex: 0, pageSize: 1 };
        const result = todo.validateGetAll(data);
        expect(result.error).toBeUndefined();
    });
});

describe('logic.validations.todo.validateInsert', () => {
    it('should return error when passing invalid title', () => {
        const values = [null, '', undefined, 'ab', 1];
        values.forEach(async (title) => {
            const data = { title: title };
            const result = todo.validateInsert(data);
            expect(result.error).not.toBeUndefined();
        });
    });

    it('should return undefined when passing valid data', () => {
        const data = { title: 'title' };
        const result = todo.validateInsert(data);
        expect(result.error).toBeUndefined();
    });
});

describe('logic.validations.todo.validateUpdate', () => {
    it('should return error when passing invalid status', () => {
        const values = [null, '', undefined, 'ab', 2, -1];
        values.forEach(async (status) => {
            const data = { id: 1, status };
            const result = todo.validateUpdate(data);
            expect(result.error).not.toBeUndefined();
        });
    });

    it('should return error when passing invalid id', () => {        
        const values = [null, '', undefined, 'ab', 0, -1];
        values.forEach(async (id) => {
            const data = { status: 1, id };
            const result = todo.validateUpdate(data);
            expect(result.error).not.toBeUndefined();
        });
    });

    it('should return undefined when passing valid data', () => {
        const data = { id: 1, status: 1 };
        const result = todo.validateUpdate(data);
        expect(result.error).toBeUndefined();
    });
});