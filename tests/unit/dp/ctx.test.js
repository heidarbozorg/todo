const ctx = require('../../../dp/ctx');

describe('dp.ctx', () => {
    it('should return null if sqlCommand is empty', () => {
        const values = [null, '', undefined];
        values.forEach(async (val) => {            
            const result = await ctx.executeQuery(val); 
            expect(result).toBeNull();
        });        
    });
});