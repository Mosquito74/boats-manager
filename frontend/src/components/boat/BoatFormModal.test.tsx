import { describe, it, expect, vi } from 'vitest';
import userEvent from '@testing-library/user-event';
import { screen } from '../../test/test-utils';
import { renderWithProviders } from '../../test/test-utils';
import { BoatFormModal } from './BoatFormModal';

describe('BoatFormModal', () => {
  it('validates required name field', async () => {
    const onSubmit = vi.fn();
    const onClose = vi.fn();

    const u = userEvent.setup();
    renderWithProviders(<BoatFormModal open onClose={onClose} onSubmit={onSubmit} />);

    const saveBtn = await screen.findByRole('button', { name: /save/i });
    await u.click(saveBtn);

    expect(onSubmit).not.toHaveBeenCalled();
    const nameInput = screen.getByLabelText(/boat name/i);
    expect(nameInput).toHaveAttribute('aria-invalid', 'true');
  });

  it('submits correct payload', async () => {
    const onSubmit = vi.fn();
    const onClose = vi.fn();

    const u = userEvent.setup();
    renderWithProviders(<BoatFormModal open onClose={onClose} onSubmit={onSubmit} />);

    await u.type(screen.getByLabelText(/boat name/i), 'Sea Breeze');
    await u.type(screen.getByLabelText(/description/i), 'A nice boat');
    await u.type(screen.getByLabelText(/^type$/i), 'Sloop');
    await u.type(screen.getByLabelText(/length \(ft\)/i), '25');
    await u.type(screen.getByLabelText(/make/i), 'Yamaha');
    await u.type(screen.getByLabelText(/year/i), String(new Date().getFullYear()));

    await u.click(screen.getByRole('button', { name: /save/i }));

    expect(onSubmit).toHaveBeenCalledWith({
      name: 'Sea Breeze',
      description: 'A nice boat',
      type: 'Sloop',
      length: 25,
      make: 'Yamaha',
      launchYear: new Date().getFullYear(),
    });
  });
});
