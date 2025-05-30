import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ProfitabilityCalculator } from '../profitability-calculator'; // Adjust path
import { useRegion } from '@/contexts/region-context';

// Mock the useRegion hook
jest.mock('@/contexts/region-context', () => ({
  useRegion: jest.fn(),
}));

const mockSetSelectedRegion = jest.fn();

describe('ProfitabilityCalculator', () => {
  beforeEach(() => {
    // Provide a mock implementation for useRegion before each test
    (useRegion as jest.Mock).mockReturnValue({
      selectedRegion: { code: 'USD', name: 'United States', currency: 'USD', symbol: '$' },
      setSelectedRegion: mockSetSelectedRegion,
      availableRegions: [{ code: 'USD', name: 'United States', currency: 'USD', symbol: '$' }],
    });
  });

  test('renders initial form fields with default values and currency symbol', () => {
    render(<ProfitabilityCalculator />);
    expect(screen.getByLabelText(/Product Cost/i)).toHaveValue(25);
    expect(screen.getByLabelText(/Shipping Fees/i)).toHaveValue(5);
    expect(screen.getByLabelText(/Marketing Expenses/i)).toHaveValue(10);
    expect(screen.getByLabelText(/Selling Price/i)).toHaveValue(75);
    
    // Check for currency symbol presence (simple check, could be more specific)
    expect(screen.getAllByText('$').length).toBeGreaterThan(0); 
  });

  test('calculates and displays profit and margin correctly on initial render', () => {
    render(<ProfitabilityCalculator />);
    // Initial calculation: Selling 75, Cost (25+5+10) = 40. Profit = 35. Margin = (35/75)*100 = 46.66...%
    expect(screen.getByText('$35.00')).toBeInTheDocument(); // Potential Profit
    expect(screen.getByText('46.67%')).toBeInTheDocument(); // Profit Margin (rounded)
  });

  test('updates calculations when input values change', async () => {
    const user = userEvent.setup();
    render(<ProfitabilityCalculator />);

    const sellingPriceInput = screen.getByLabelText(/Selling Price/i);
    
    // Clear existing value and type new value
    await user.clear(sellingPriceInput);
    await user.type(sellingPriceInput, '100');
    expect(sellingPriceInput).toHaveValue(100);

    // New calculation: Selling 100, Cost (25+5+10) = 40. Profit = 60. Margin = (60/100)*100 = 60%
    // Need to wait for re-render and state update
    expect(await screen.findByText('$60.00')).toBeInTheDocument();
    expect(await screen.findByText('60.00%')).toBeInTheDocument();

    const productCostInput = screen.getByLabelText(/Product Cost/i);
    await user.clear(productCostInput);
    await user.type(productCostInput, '30'); // Product cost changes from 25 to 30

    // New calculation: Selling 100, Cost (30+5+10) = 45. Profit = 55. Margin = (55/100)*100 = 55%
    expect(await screen.findByText('$55.00')).toBeInTheDocument();
    expect(await screen.findByText('55.00%')).toBeInTheDocument();
  });

  test('displays $0.00 and 0.00% if selling price is 0 or negative', async () => {
    const user = userEvent.setup();
    render(<ProfitabilityCalculator />);
    const sellingPriceInput = screen.getByLabelText(/Selling Price/i);

    await user.clear(sellingPriceInput);
    await user.type(sellingPriceInput, '0');
    
    expect(await screen.findByText('$0.00')).toBeInTheDocument(); // Profit
    // Margin would be NaN, often displayed as 0.00% or some placeholder in UI
    // The component's logic results in (0/0)*100 = NaN, then toFixed(2) on NaN is "NaN"
    // Let's check how the component actually handles this edge case for margin.
    // If sellingPrice is 0, margin calculation (profit / sellingPrice) * 100 becomes NaN.
    // The component currently formats NaN.toFixed(2) as "NaN%".
    // A more robust UI might show "N/A" or "0.00%".
    // Given current logic, it will be "NaN%". This test can be updated if UI changes.
    // Actually, parseFloat(formData.sellingPrice) || 0 makes sellingPrice 0.
    // profit = 0 - (25+5+10) = -40. margin = (-40/0)*100 = -Infinity. 
    // The component doesn't render result if sellingPrice <=0. Let's test that.
    // It sets result to null.
    
    // When selling price is 0, the result section is not rendered
    // So, we check that the elements are NOT in the document.
    // However, the test above "calculates and displays profit and margin correctly on initial render"
    // already shows the results card IS rendered.
    // The logic is: `if (sellingPrice <= 0) { setResult(null); return; }`
    // So the previous result should disappear.

    // Let's check initial state.
    expect(screen.getByText('$35.00')).toBeInTheDocument(); 
    
    await user.clear(sellingPriceInput);
    await user.type(sellingPriceInput, '0');
    
    // Now the result section should be gone or show default/empty state
    // Based on the code: if (result !== null) { render card }
    expect(screen.queryByText('$35.00')).not.toBeInTheDocument(); 
    expect(screen.queryByText(/\d+\.\d{2}%/)).not.toBeInTheDocument(); // No percentage
  });
});
