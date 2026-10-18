/** @jest-environment jsdom */

import { act, type ReactNode } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import EquipPopupDetails from '../components/EquipPopupDetails';
import EquipIcon from '../components/EquipIcon';

jest.mock('@floating-ui/react', () => ({
  useFloating: () => ({
    refs: { setReference: jest.fn(), setFloating: jest.fn() },
    floatingStyles: { position: 'fixed', left: 12, top: 24 },
  }),
  autoPlacement: jest.fn(),
  shift: jest.fn(),
  size: jest.fn(),
  autoUpdate: jest.fn(),
  offset: jest.fn(),
}));

const modifierFields = [
  'enchantMods',
  'implicitMods',
  'utilityMods',
  'explicitMods',
] as const;

describe('equipment details popup', () => {
  let container: HTMLDivElement;
  let root: Root;

  beforeAll(() => {
    Object.assign(globalThis, { IS_REACT_ACT_ENVIRONMENT: true });
  });

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
    root = createRoot(container);
  });

  afterEach(() => {
    act(() => root.unmount());
    container.remove();
  });

  const render = (node: ReactNode) => act(() => root.render(node));

  const popup = (equip: Record<string, unknown>, isHovered = true) => (
    <EquipPopupDetails
      equip={equip}
      isHovered={isHovered}
      refs={{ setFloating: jest.fn() }}
      floatingStyles={{ position: 'fixed', left: 12, top: 24 }}
    />
  );

  it.each(modifierFields)(
    'renders structured description in %s when the popup is visible',
    (field) => {
      render(popup({ [field]: [{ description: '+25 to maximum Life' }] }));

      expect(container.textContent).toContain('+25 to maximum Life');
      expect(
        container.querySelector('[data-component="popup-details-tooltip"]')
      ).not.toBeNull();
    }
  );

  it('preserves modifier order and colors with mixed string and object entries', () => {
    render(
      popup({
        enchantMods: ['Enchantment', { description: 'Structured enchantment' }],
        implicitMods: ['Implicit modifier'],
        utilityMods: [{ description: 'Utility modifier' }],
        explicitMods: ['Explicit modifier', { description: 'Last modifier' }],
      })
    );

    const lines = Array.from(
      container.querySelectorAll('.text-blue-200, .text-blue-400')
    );
    expect(lines.map((line) => line.textContent)).toEqual([
      'Enchantment',
      'Structured enchantment',
      'Implicit modifier',
      'Utility modifier',
      'Explicit modifier',
      'Last modifier',
    ]);
    expect(lines.slice(0, 4).every((line) => line.className === 'text-blue-200')).toBe(true);
    expect(lines.slice(4).every((line) => line.className === 'text-blue-400')).toBe(true);
  });

  it('keeps item headers, display mode zero properties, and requirements visible', () => {
    render(
      popup({
        name: 'Test Sword',
        baseType: 'Rusted Sword',
        properties: [
          { name: 'Physical Damage', displayMode: 0, values: [['5-12', 0]] },
          { name: 'Unsupported property', displayMode: 9, values: [['hidden', 0]] },
        ],
        requirements: [{ name: 'Level', values: [['10', 0]] }],
      })
    );

    expect(Array.from(container.querySelectorAll('h3')).map((heading) => heading.textContent)).toEqual([
      'Test Sword',
      'Rusted Sword',
    ]);
    expect(container.textContent).toContain('Physical Damage: 5-12');
    expect(container.textContent).toContain('Level 10');
    expect(container.textContent).not.toContain('Unsupported property');
    const tooltip = container.querySelector<HTMLElement>('[data-component="popup-details-tooltip"]');
    expect(tooltip?.style.position).toBe('fixed');
    expect(tooltip?.style.left).toBe('12px');
  });

  it('omits malformed values without rendering objects or crashing', () => {
    render(
      popup({
        name: { unexpected: 'name' },
        baseType: { description: 'Safe base type' },
        properties: [null, { name: 'Damage', displayMode: 0, values: [[{ bad: 1 }, 0]] }],
        requirements: [null, { name: 'Level', values: [[{ bad: 1 }, 0]] }],
        enchantMods: [null, false, {}, { description: {} }, { description: ['bad'] }, ['bad']],
        implicitMods: { description: 'Not an array' },
        utilityMods: 'Not an array',
        explicitMods: ['Valid modifier', { description: 0 }, 12],
      })
    );

    expect(container.textContent).toContain('Safe base type');
    expect(container.textContent).not.toContain('[object Object]');
    expect(container.textContent).not.toContain('Not an array');
    expect(Array.from(container.querySelectorAll('.text-blue-400')).map((line) => line.textContent)).toEqual([
      'Valid modifier', '0', '12',
    ]);
    expect(container.querySelectorAll('.text-blue-200')).toHaveLength(0);
  });

  it('renders numeric zero in properties and requirements', () => {
    render(popup({
      properties: [{ name: 'Charges', displayMode: 0, values: [[0, 0]] }],
      requirements: [{ name: 'Level', values: [[0, 0]] }],
    }));

    expect(container.textContent).toContain('Charges: 0');
    expect(container.textContent).toContain('Level 0');
  });

  it('allows missing arrays and malformed property collections', () => {
    render(popup({ properties: {}, requirements: 'invalid' }));

    expect(container.querySelector('[data-component="popup-details-tooltip"]')).not.toBeNull();
    expect(container.textContent).toBe('');
  });

  it('keeps structured equipment hidden until hovered', () => {
    render(popup({ explicitMods: [{ description: '+25 to maximum Life' }] }, false));

    expect(container.querySelector('[data-component="popup-details-tooltip"]')).toBeNull();
    expect(container.textContent).toBe('');
  });

  it('escapes descriptions as text instead of treating them as HTML', () => {
    const description = '<img src=x onerror="alert(1)">';
    render(popup({ explicitMods: [{ description }] }));

    expect(container.textContent).toContain(description);
    expect(container.querySelector('img')).toBeNull();
  });

  it('opens on hover, closes on leave, and toggles with clicks through EquipIcon', () => {
    render(<EquipIcon equip={{ inventoryId: 'Weapon', explicitMods: [{ description: '+25 to maximum Life' }] }} />);
    const icon = container.firstElementChild as HTMLElement;
    const tooltip = () => container.querySelector('[data-component="popup-details-tooltip"]');

    expect(tooltip()).toBeNull();
    act(() => icon.dispatchEvent(new MouseEvent('mouseover', { bubbles: true })));
    expect(tooltip()?.textContent).toContain('+25 to maximum Life');
    act(() => icon.dispatchEvent(new MouseEvent('mouseout', { bubbles: true })));
    expect(tooltip()).toBeNull();
    act(() => icon.dispatchEvent(new MouseEvent('click', { bubbles: true })));
    expect(tooltip()?.textContent).toContain('+25 to maximum Life');
    act(() => icon.dispatchEvent(new MouseEvent('click', { bubbles: true })));
    expect(tooltip()).toBeNull();
  });
});
