import { render, screen } from '@testing-library/react';

import AppContainer from './AppContainer';

jest.mock('./firebase-config', () => ({
  db: {},
  auth: {
    onAuthStateChanged: (callback) => {
      callback(null);
      return () => {};
    },
  },
  storage: {},
  uploadProfilePic: jest.fn(),
}));

test('renders app shell', () => {
  render(<AppContainer />);
  const footerText = screen.getByText(/footer\.copyright/i);
  expect(footerText).toBeInTheDocument();
});



