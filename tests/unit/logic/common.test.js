const common = require('../../../logic/common');

describe('logic.common.getError', () => {
    it('When passing null, should return 500 as status', () => {
        const res = common.getError(null);
        expect(res.status).toBe(500);
    });

    it('When errorCode is null, should return 500 as status', () => {
        const dbResult = { errorCode: null, error: 'Something wrong' };
        const res = common.getError(dbResult);
        expect(res.status).toBe(500);
    });

    it('When error is null, should return a default string error', () => {
        const dbResult = { errorCode: 500, error: null };
        const res = common.getError(dbResult);
        expect(res.body).not.toBeNull();
    });

    it('When passing errorCode, should return exact errorCode as status', () => {
        const dbResult = { error: 'Something wrong', errorCode: 404 };
        const res = common.getError(dbResult);
        expect(res.status).toBe(dbResult.errorCode);
    });
});
