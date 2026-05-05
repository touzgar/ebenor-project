import { render, screen, fireEvent } from '@testing-library/react';
import { SortableHighlightItem } from '../SortableHighlightItem';
import { DndContext } from '@dnd-kit/core';

// Mock the useSortable hook
jest.mock('@dnd-kit/sortable', () => ({
  useSortable: () => ({
    attributes: {},
    listeners: {},
    setNodeRef: jest.fn(),
    transform: null,
    transition: null,
    isDragging: false,
  }),
}));

describe('SortableHighlightItem', () => {
  const mockOnRemove = jest.fn();
  const defaultProps = {
    id: '0',
    highlight: 'Plus de 20 ans d\'expérience',
    index: 0,
    onRemove: mockOnRemove,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders the highlight text', () => {
    render(
      <DndContext>
        <SortableHighlightItem {...defaultProps} />
      </DndContext>
    );

    expect(screen.getByText('Plus de 20 ans d\'expérience')).toBeInTheDocument();
  });

  it('calls onRemove when remove button is clicked', () => {
    render(
      <DndContext>
        <SortableHighlightItem {...defaultProps} />
      </DndContext>
    );

    // Get all buttons and select the remove button (second one)
    const buttons = screen.getAllByRole('button');
    const removeButton = buttons[1]; // Second button is the remove button
    fireEvent.click(removeButton);

    expect(mockOnRemove).toHaveBeenCalledWith(0);
  });

  it('displays drag handle', () => {
    render(
      <DndContext>
        <SortableHighlightItem {...defaultProps} />
      </DndContext>
    );

    // Check for drag handle SVG
    const dragHandle = screen.getAllByRole('button')[0];
    expect(dragHandle).toHaveClass('cursor-grab');
  });

  it('applies correct styling classes', () => {
    const { container } = render(
      <DndContext>
        <SortableHighlightItem {...defaultProps} />
      </DndContext>
    );

    const itemDiv = container.firstChild;
    expect(itemDiv).toHaveClass('bg-neutral-50');
    expect(itemDiv).toHaveClass('border-neutral-200');
    expect(itemDiv).toHaveClass('rounded-lg');
  });
});
