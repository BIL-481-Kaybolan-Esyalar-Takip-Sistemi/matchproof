jest.mock('fs/promises', () => ({
  access: jest.fn(),
  mkdir: jest.fn(),
}));

jest.mock('sharp', () => {
  const sharpMock = jest.fn(() => ({
    autoOrient: jest.fn().mockReturnThis(),
    resize: jest.fn().mockReturnThis(),
    grayscale: jest.fn().mockReturnThis(),
    removeAlpha: jest.fn().mockReturnThis(),
    raw: jest.fn().mockReturnThis(),
    toBuffer: jest.fn().mockImplementation(function (options) {
      if (options && options.resolveWithObject) {
        return Promise.resolve({
          data: Buffer.alloc(16 * 16 * 3, 128),
          info: { channels: 3 },
        });
      }
      return Promise.resolve(Buffer.alloc(16 * 17, 128));
    }),
  }));
  return sharpMock;
});

jest.mock('@xenova/transformers', () => {
  const extractorMock = jest.fn().mockResolvedValue({
    data: [new Array(384).fill(0.1)], // Mock embedding array
  });
  return {
    pipeline: jest.fn().mockResolvedValue(extractorMock),
  };
});

jest.mock('../../../src/server/models/item.model', () => ({
  findItemById: jest.fn(),
  findMatchCandidates: jest.fn(),
}));

const fs = require('fs/promises');
const itemModel = require('../../../src/server/models/item.model');
const matchingService = require('../../../src/server/services/matchingService');

describe('matchingService AI Logic', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    itemModel.findItemById.mockResolvedValue({
      id: 1,
      itemType: 'lost',
      title: 'Black iPhone',
      description: 'Lost my black iPhone 13 at the library',
      category: 'Electronics',
      location: 'Library Main Hall',
      status: 'open',
      imagePath: 'iphone-lost.jpg',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });

    itemModel.findMatchCandidates.mockResolvedValue([
      {
        id: 2,
        itemType: 'found',
        title: 'Found an iPhone',
        description: 'Black iPhone 13 found near Library',
        category: 'Electronics',
        location: 'Library',
        status: 'open',
        imagePath: 'iphone-found.jpg',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: 3,
        itemType: 'found',
        title: 'Red Backpack',
        description: 'Red bag found in cafeteria',
        category: 'Bags',
        location: 'Cafeteria',
        status: 'open',
        imagePath: null,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ]);
    
    fs.access.mockResolvedValue(true);
  });

  test('getMatchesForItem calculates similarity and returns descending matches', async () => {
    const result = await matchingService.getMatchesForItem({ itemId: 1, itemModel });

    expect(result.sourceItemId).toBe(1);
    expect(result.matches).toBeInstanceOf(Array);
    
    // There are 2 candidates. The iPhone candidate (id: 2) should score higher than the Backpack (id: 3)
    if (result.matches.length > 0) {
      expect(result.matches[0].itemId).toBe(2);
      expect(result.matches[0].matchedFields.category).toBe(true); // Same "Electronics" Category
      expect(result.matches[0].score).toBeGreaterThan(0.1); 
    }
  });

  test('getMatchesForItem throws if item is not found', async () => {
    itemModel.findItemById.mockResolvedValue(null);

    await expect(matchingService.getMatchesForItem({ itemId: 99, itemModel }))
      .rejects.toThrow('Item not found');
  });

  test('getMatchesForItem throws if item is removed', async () => {
    itemModel.findItemById.mockResolvedValue({
      id: 1,
      status: 'removed',
    });

    await expect(matchingService.getMatchesForItem({ itemId: 1, itemModel }))
      .rejects.toThrow('Removed item cannot be matched');
  });

  test('getMatchesForItem handles missing image files safely (ENOENT)', async () => {
    itemModel.findItemById.mockResolvedValue({
      id: 1,
      itemType: 'lost',
      title: 'Black iPhone',
      description: 'Lost my black iPhone 13 at the library',
      category: 'Electronics',
      location: 'Library Main Hall',
      status: 'open',
      imagePath: 'novel-missing-image-1.jpg',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });

    itemModel.findMatchCandidates.mockResolvedValue([
      {
        id: 2,
        itemType: 'found',
        title: 'Found an iPhone',
        description: 'Black iPhone 13 found near Library',
        category: 'Electronics',
        location: 'Library',
        status: 'open',
        imagePath: 'novel-missing-image-2.jpg',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }
    ]);

    fs.access.mockRejectedValue(new Error('ENOENT: no such file or directory'));
    
    const result = await matchingService.getMatchesForItem({ itemId: 1, itemModel });

    expect(result.matches.length).toBeGreaterThan(0);
    // Since images are missing, imageSimilarity should be skipped or adjust gracefully
    expect(result.matches[0].matchedFields.imageSimilarity).toBe(null);
  });
});
