jest.mock('../../../src/server/services/db', () => ({
  query: jest.fn(),
}));

const { query } = require('../../../src/server/services/db');
const itemModel = require('../../../src/server/models/item.model');

describe('item.model', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('createItem calls query with correct INSERT statement', async () => {
    query.mockResolvedValue({ rows: [{ id: 1 }] });

    const result = await itemModel.createItem({
      ownerId: 9,
      itemType: 'found',
      title: 'A watch',
      description: 'Silver colored',
      category: 'Jewelry',
      location: 'Park',
      imagePath: 'watch.jpg',
      isPrivate: true,
    });

    expect(result).toEqual({ id: 1 });
    expect(query).toHaveBeenCalledTimes(1);
    expect(query.mock.calls[0][0]).toContain('INSERT INTO items');
    expect(query.mock.calls[0][1]).toEqual([
      9,
      'found',
      'A watch',
      'Silver colored',
      'Jewelry',
      'Park',
      'watch.jpg',
      true,
    ]);
  });

  test('findItemById calls query with correct SELECT statement', async () => {
    const mockItem = { id: 5, title: 'Item 5' };
    query.mockResolvedValue({ rows: [mockItem] });

    const result = await itemModel.findItemById(5);

    expect(result).toEqual(mockItem);
    expect(query).toHaveBeenCalledTimes(1);
    expect(query.mock.calls[0][0]).toContain('FROM items');
    expect(query.mock.calls[0][0]).toContain('JOIN users ON users.id = items.owner_id');
    expect(query.mock.calls[0][0]).toContain('WHERE items.id = $1');
    expect(query.mock.calls[0][1]).toEqual([5]);
  });

  test('findItemById returns null if not found', async () => {
    query.mockResolvedValue({ rows: [] });

    const result = await itemModel.findItemById(99);

    expect(result).toBeNull();
  });

  test('searchItems constructs dynamic WHERE clauses and pagination', async () => {
    query.mockResolvedValueOnce({ rows: [{ id: 1 }] }); // rows
    query.mockResolvedValueOnce({ rows: [{ total: 1 }] }); // count

    const result = await itemModel.searchItems({
      queryText: 'test',
      category: 'Electronics',
      itemType: 'lost',
      status: 'open',
      dateFrom: '2026-03-01',
      dateTo: '2026-03-31',
      page: 2,
      pageSize: 10,
    });

    expect(result).toEqual({ items: [{ id: 1 }], total: 1 });

    // Ensure both queries ran
    expect(query).toHaveBeenCalledTimes(2);

    // Rows Query
    const rowsQueryStr = query.mock.calls[0][0];
    const rowsQueryParams = query.mock.calls[0][1];
    
    expect(rowsQueryStr).toContain('FROM items');
    expect(rowsQueryStr).toContain('WHERE items.status <> \'removed\'');
    expect(rowsQueryStr).toContain('ORDER BY items.created_at DESC');
    expect(rowsQueryStr).toContain('LIMIT $');
    expect(rowsQueryStr).toContain('OFFSET $');

    // Values include: queryText (2 fields ILIKE), category, itemType, status, dateFrom, dateTo, limit, offset
    // %test%, Electronics, lost, open, 2026-03-01, 2026-03-31, 10, 10
    expect(rowsQueryParams).toEqual([
      '%test%',
      'Electronics',
      'lost',
      'open',
      '2026-03-01',
      '2026-03-31',
      10, // limit
      10, // offset
    ]);

    // Count Query
    const countQueryStr = query.mock.calls[1][0];
    expect(countQueryStr).toContain('SELECT COUNT(*)::INT AS total');
    expect(query.mock.calls[1][1]).toEqual([
      '%test%',
      'Electronics',
      'lost',
      'open',
      '2026-03-01',
      '2026-03-31',
    ]);
  });

  test('searchItems with minimal query params', async () => {
    query.mockResolvedValueOnce({ rows: [] });
    query.mockResolvedValueOnce({ rows: [{ total: 0 }] });

    const result = await itemModel.searchItems({
      queryText: null,
      page: 1,
      pageSize: 20,
    });

    expect(result).toEqual({ items: [], total: 0 });

    const rowsQueryParams = query.mock.calls[0][1];
    expect(rowsQueryParams).toEqual([20, 0]); // Just limit and offset
  });

  test('updateItemStatusById calls UPDATE with correct fields', async () => {
    query.mockResolvedValue({ rows: [{ id: 3 }] });

    const result = await itemModel.updateItemStatusById(3, 'resolved');

    expect(result).toEqual({ id: 3 });
    expect(query.mock.calls[0][0]).toContain('UPDATE items');
    expect(query.mock.calls[0][0]).toContain('SET');
    expect(query.mock.calls[0][0]).toContain('status = $2');
    expect(query.mock.calls[0][1]).toEqual([3, 'resolved']);
  });

  test('markItemAsRemovedById sets status to removed and clears image', async () => {
    query.mockResolvedValue({ rows: [{ id: 4 }] });

    const result = await itemModel.markItemAsRemovedById(4);

    expect(result).toEqual({ id: 4 });
    const sqlStr = query.mock.calls[0][0];
    expect(sqlStr).toContain('status = \'removed\'');
    expect(sqlStr).toContain('image_path = NULL');
    expect(query.mock.calls[0][1]).toEqual([4]);
  });

  test('updateItemById modifies mutable fields', async () => {
    query.mockResolvedValue({ rows: [{ id: 2 }] });

    const fields = {
      itemType: 'found',
      title: 'New Title',
      description: 'New Desc',
      category: 'New Cat',
      location: 'New Loc',
      imagePath: 'new.jpg',
      isPrivate: false,
    };

    const result = await itemModel.updateItemById(2, fields);

    expect(result).toEqual({ id: 2 });
    const sqlStr = query.mock.calls[0][0];
    expect(sqlStr).toContain('UPDATE items');
    expect(query.mock.calls[0][1]).toEqual([
      2,
      'found',
      'New Title',
      'New Desc',
      'New Cat',
      'New Loc',
      'new.jpg',
      false,
    ]);
  });

  test('deleteItemById performs hard delete', async () => {
    query.mockResolvedValue({ rows: [{ id: 10 }] });

    const result = await itemModel.deleteItemById(10);

    expect(result).toEqual({ id: 10 });
    const sqlStr = query.mock.calls[0][0];
    expect(sqlStr).toContain('DELETE FROM items');
    expect(sqlStr).toContain('WHERE id = $1');
    expect(query.mock.calls[0][1]).toEqual([10]);
  });

  test('returns null when updates/deletes return no rows', async () => {
    query.mockResolvedValue({ rows: [] });

    expect(await itemModel.updateItemStatusById(99, 'open')).toBeNull();
    expect(await itemModel.markItemAsRemovedById(99)).toBeNull();
    expect(await itemModel.updateItemById(99, {})).toBeNull();
    expect(await itemModel.deleteItemById(99)).toBeNull();
  });
});
