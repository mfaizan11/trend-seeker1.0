import React from 'react';
import { render, screen } from '@testing-library/react';
import { PageHeader } from '../page-header'; // Adjust path as necessary
import { Lightbulb } from 'lucide-react'; // Import a sample icon

describe('PageHeader', () => {
  test('renders the title correctly', () => {
    render(<PageHeader title="Test Title" />);
    expect(screen.getByText('Test Title')).toBeInTheDocument();
  });

  test('renders the title and icon when icon prop is provided', () => {
    render(<PageHeader title="Title With Icon" icon={Lightbulb} />);
    expect(screen.getByText('Title With Icon')).toBeInTheDocument();
    // Check for svg presence as lucide icons are rendered as svgs
    // A more specific check might involve looking for a specific path or class if needed
    expect(screen.getByRole('img', { hidden: true })).toBeInTheDocument(); // Lucide icons are often SVGs with role="img"
  });

  test('does not render description (as it was removed)', () => {
    render(<PageHeader title="Test Title" description="This should not render" />);
    expect(screen.queryByText('This should not render')).not.toBeInTheDocument();
  });

  test('matches snapshot with title only', () => {
    const { container } = render(<PageHeader title="Snapshot Title" />);
    expect(container.firstChild).toMatchSnapshot();
  });

  test('matches snapshot with title and icon', () => {
    const { container } = render(<PageHeader title="Snapshot With Icon" icon={Lightbulb} />);
    expect(container.firstChild).toMatchSnapshot();
  });
});
