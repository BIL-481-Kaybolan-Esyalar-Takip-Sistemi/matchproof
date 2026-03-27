const fs = require('fs');

describe('upload service', () => {
  let uploadService;

  beforeEach(() => {
    jest.resetModules();
    uploadService = require('../../../src/server/services/upload.service');
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  test('toPublicImageUrl returns uploads path', () => {
    expect(uploadService.toPublicImageUrl('photo.jpg')).toBe('/uploads/photo.jpg');
  });

  test('deleteStoredImage skips when filename is empty', async () => {
    const unlinkSpy = jest.spyOn(fs.promises, 'unlink').mockResolvedValue();

    await uploadService.deleteStoredImage('');

    expect(unlinkSpy).not.toHaveBeenCalled();
  });

  test('deleteStoredImage ignores ENOENT errors', async () => {
    jest
      .spyOn(fs.promises, 'unlink')
      .mockRejectedValue(Object.assign(new Error('missing'), { code: 'ENOENT' }));

    await expect(uploadService.deleteStoredImage('missing.jpg')).resolves.toBeUndefined();
  });

  test('deleteStoredImage rethrows non-ENOENT errors', async () => {
    jest
      .spyOn(fs.promises, 'unlink')
      .mockRejectedValue(Object.assign(new Error('no permission'), { code: 'EACCES' }));

    await expect(uploadService.deleteStoredImage('forbidden.jpg')).rejects.toMatchObject({
      code: 'EACCES',
    });
  });

  test('deleteUploadedFile delegates to deleteStoredImage', async () => {
    const unlinkSpy = jest.spyOn(fs.promises, 'unlink').mockResolvedValue();

    await uploadService.deleteUploadedFile('tmp.jpg');

    expect(unlinkSpy).toHaveBeenCalledTimes(1);
  });

  test('singleImageUpload middleware is exposed as a function', () => {
    expect(typeof uploadService.singleImageUpload).toBe('function');
  });
});
