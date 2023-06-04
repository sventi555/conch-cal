import { render, screen } from '@testing-library/react';
import { App } from './App';

describe('App', () => {
  it('should be defined', () => {
    render(<App />);

    expect(screen.getByText(/Hello World!/i)).toBeDefined();
  });
});
