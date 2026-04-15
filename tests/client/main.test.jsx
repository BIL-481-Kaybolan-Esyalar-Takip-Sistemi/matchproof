import { createRoot } from 'react-dom/client';

jest.mock('react-dom/client', () => ({
  createRoot: jest.fn(() => ({
    render: jest.fn(),
  })),
}));
jest.mock('../../src/client/App', () => () => <div />);

describe('main.jsx', () => {
  let rootElement;

  beforeEach(() => {
    // Create a dummy element so main.jsx can find it
    rootElement = document.createElement('div');
    rootElement.id = 'root';
    document.body.appendChild(rootElement);
  });

  afterEach(() => {
    document.body.removeChild(rootElement);
    jest.resetModules();
  });

  it('calls createRoot and renders App', () => {
    // Dynamically import main.jsx so it executes
    require('../../src/client/main.jsx');
    
    expect(createRoot).toHaveBeenCalledWith(rootElement);
    const mockRoot = createRoot.mock.results[0].value;
    expect(mockRoot.render).toHaveBeenCalled();
  });
});
