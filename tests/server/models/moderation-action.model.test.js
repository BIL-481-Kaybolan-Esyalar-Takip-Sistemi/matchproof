jest.mock('../../../src/server/services/db', () => ({
  query: jest.fn(),
}));

const { query } = require('../../../src/server/services/db');
const moderationActionModel = require('../../../src/server/models/moderation-action.model');

describe('moderation-action.model', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('createModerationAction inserts a new moderation row', async () => {
    query.mockResolvedValue({
      rows: [
        {
          id: 1,
          itemId: 10,
          adminUserId: 2,
          reason: 'Inappropriate content',
          actionType: 'remove',
        },
      ],
    });

    const result = await moderationActionModel.createModerationAction({
      itemId: 10,
      adminUserId: 2,
      reason: 'Inappropriate content',
      actionType: 'remove',
    });

    expect(result.id).toBe(1);
    expect(result.itemId).toBe(10);
    expect(query).toHaveBeenCalledTimes(1);

    const sqlStr = query.mock.calls[0][0];
    const sqlParams = query.mock.calls[0][1];

    expect(sqlStr).toContain('INSERT INTO moderation_actions');
    expect(sqlStr).toContain('RETURNING');
    expect(sqlParams).toEqual([10, 2, 'Inappropriate content', 'remove']);
  });
});
