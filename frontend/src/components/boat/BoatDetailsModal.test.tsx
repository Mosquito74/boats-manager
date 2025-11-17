/** @vitest-environment jsdom */
import { screen, within } from '../../test/test-utils';
import { renderWithProviders } from '../../test/test-utils';
import { vi, type Mock } from 'vitest';
import { useGetBoatByIdQuery } from '../../features/api/boatApi';
import { BoatDetailsModal } from './BoatDetailsModal';

vi.mock('../../features/api/boatApi', () => ({
  useGetBoatByIdQuery: vi.fn(),
}));

const mockedUseGetBoatByIdQuery = useGetBoatByIdQuery as unknown as Mock;

test('displays boat details after loading', async () => {
  mockedUseGetBoatByIdQuery.mockReturnValue({
    data: {
      id: 123,
      name: 'Test Boat',
      description: 'Nice boat',
      type: 'Sailboat',
      length: 12,
    },
    isLoading: false,
    isError: false,
  });

  renderWithProviders(
    <BoatDetailsModal open={true} boatId={123} onClose={vi.fn()} />
  );

  const dialog = await screen.findByRole('dialog');
  const withinDialog = within(dialog);
  expect(withinDialog.getByText('Test Boat')).toBeInTheDocument();
  expect(withinDialog.getByText(/sailboat/i)).toBeInTheDocument();
});

test('calls onClose when clicking the close button', async () => {
  const onClose = vi.fn();
  mockedUseGetBoatByIdQuery.mockReturnValue({
    data: {
      id: 123,
      name: 'Test Boat',
      description: 'Nice boat',
      type: 'Sailboat',
      length: 12,
    },
    isLoading: false,
    isError: false,
  });

  renderWithProviders(
    <BoatDetailsModal open={true} boatId={123} onClose={onClose} />
  );

  const dialog = await screen.findByRole('dialog');
  const closeButton = within(dialog).getByRole('button', { name: /close/i });
  closeButton.click();
  expect(onClose).toHaveBeenCalledTimes(1);
});
