import { describe, it, expect } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import App from '@/App';

describe('App availability check', () => {
  it('F5: switching rooms resets the result and the next check uses that room bookings', () => {
    render(<App />);

    fireEvent.click(screen.getByRole('button', { name: /check availability/i }));
    expect(screen.getByRole('heading', { name: 'Available' })).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: /B-204/ }));
    expect(screen.queryByRole('heading', { name: 'Available' })).not.toBeInTheDocument();
    expect(screen.getByText(/Select a room and enter start\/end times/)).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: /check availability/i }));
    expect(screen.getByRole('heading', { name: 'Unavailable' })).toBeInTheDocument();
    expect(screen.getByText(/overlaps an existing booking/)).toBeInTheDocument();
  });

  it('F4: too many attendees shows the no-match empty state', () => {
    render(<App />);

    fireEvent.change(screen.getByLabelText('Attendees'), { target: { value: '61' } });
    expect(screen.getByText('No rooms match these filters.')).toBeInTheDocument();
  });
});
