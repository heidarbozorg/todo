const subtasks = require('../../../../logic/validations/subtasks');

describe('logic.validations.subtasks.validateInsert', () => {
    it('should return error when passing invalid title', () => {
        const values = [null, '', undefined, 'ab'];
        values.forEach(async (title) => {
            const data = { title: title, todo_id: 1 };
            const result = subtasks.validateInsert(data);
            expect(result.error).not.toBeUndefined();
        });
    });

    it('should return error when passing invalid todo_id', () => {
        const values = [null, '', undefined, 0, -1];
        values.forEach(async (todo_id) => {
            const data = { title: 'title', todo_id: todo_id };
            const result = subtasks.validateInsert(data);
            expect(result.error).not.toBeUndefined();
        });
    });

    it('should return undefined when passing valid data', () => {
        const data = { title: 'title', todo_id: 1 };
        const result = subtasks.validateInsert(data);
        expect(result.error).toBeUndefined();
    });
});

describe('logic.validations.subtasks.validateUpdate', () => {
    it('should return error when passing invalid status', () => {
        const values = [null, '', undefined, 'ab', 2, -1];
        values.forEach(async (status) => {
            const data = { id: 1, status };
            const result = subtasks.validateUpdate(data);
            expect(result.error).not.toBeUndefined();
        });
    });

    it('should return error when passing invalid id', () => {
        
        const values = [null, '', undefined, 'ab', 0, -1];
        values.forEach(async (id) => {
            const data = { id, status: 1 };
            const result = subtasks.validateUpdate(data);
            expect(result.error).not.toBeUndefined();
        });
    });

    it('should return error, when passing null as data', () => {
        const result = subtasks.validateUpdate(null);
        expect(result.error).not.toBeUndefined();
    });

    it('should return undefined when passing valid data', () => {
        const data = { id: 1, status: 1 };
        const result = subtasks.validateUpdate(data);
        expect(result.error).toBeUndefined();
    });
});