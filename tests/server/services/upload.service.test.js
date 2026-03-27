const fs = require('fs');
const path = require('path');

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

describe('upload service multer configuration', () => {
  beforeEach(() => {
    jest.resetModules();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  test('configures storage filename and accepts allowed mimetype', () => {
    const diskStorage = jest.fn((config) => config);
    const single = jest.fn(() => 'single-middleware');
    const multerFactory = jest.fn(() => ({ single }));
    multerFactory.diskStorage = diskStorage;

    jest.doMock('multer', () => multerFactory);

    const service = require('../../../src/server/services/upload.service');

    expect(multerFactory).toHaveBeenCalledWith(
      expect.objectContaining({
        limits: { fileSize: 5 * 1024 * 1024 },
      })
    );

    const multerOptions = multerFactory.mock.calls[0][0];
    const filenameCallback = jest.fn();
    const file = { originalname: 'Photo.PNG', mimetype: 'image/png' };

    multerOptions.storage.filename({}, file, filenameCallback);

    expect(filenameCallback).toHaveBeenCalledWith(
      null,
      expect.stringMatching(/\.png$/)
    );

    const fileFilterCallback = jest.fn();
    multerOptions.fileFilter({}, file, fileFilterCallback);

    expect(fileFilterCallback).toHaveBeenCalledWith(null, true);
    expect(service.singleImageUpload).toBe('single-middleware');
  });

  test('rejects unsupported mimetype with INVALID_FILE_TYPE', () => {
    const diskStorage = jest.fn((config) => config);
    const single = jest.fn(() => 'single-middleware');
    const multerFactory = jest.fn(() => ({ single }));
    multerFactory.diskStorage = diskStorage;

    jest.doMock('multer', () => multerFactory);

    require('../../../src/server/services/upload.service');
    const multerOptions = multerFactory.mock.calls[0][0];

    const callback = jest.fn();
    multerOptions.fileFilter(
      {},
      { originalname: 'evil.gif', mimetype: 'image/gif' },
      callback
    );

    const [errorArg] = callback.mock.calls[0];
    expect(errorArg).toMatchObject({
      code: 'INVALID_FILE_TYPE',
      statusCode: 400,
    });
    expect(errorArg.message).toBe('Only JPEG, PNG, or WEBP images are allowed.');
  });

  test('uses configured upload directory for destination', () => {
    const diskStorage = jest.fn((config) => config);
    const single = jest.fn(() => 'single-middleware');
    const multerFactory = jest.fn(() => ({ single }));
    multerFactory.diskStorage = diskStorage;

    jest.doMock('multer', () => multerFactory);

    const service = require('../../../src/server/services/upload.service');
    const multerOptions = multerFactory.mock.calls[0][0];
    const destinationCallback = jest.fn();

    multerOptions.storage.destination({}, {}, destinationCallback);

    expect(destinationCallback).toHaveBeenCalledWith(null, service.uploadRoot);
    expect(service.uploadRoot).toBe(path.resolve(process.cwd(), 'uploads'));
  });
});
