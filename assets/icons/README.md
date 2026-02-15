# AI NETWORK - Icon Library

Professional SVG icon set for AI NETWORK website. All icons follow consistent design system.

## Specifications

- **Format:** SVG (vector)
- **Size:** 24x24px base (scalable)
- **ViewBox:** `0 0 24 24`
- **Stroke:** 1.5px weight
- **Linecap:** round
- **Linejoin:** round
- **Color:** `currentColor` (inherits from parent)
- **Style:** Minimal, modern, professional

## Icon Inventory (27 icons)

### Navigation (4 icons)
- `menu.svg` - Hamburger menu for mobile navigation
- `close.svg` - Close/dismiss button (X)
- `arrow-right.svg` - Directional arrow for CTAs and links
- `external-link.svg` - External link indicator

### Features (5 icons)
- `network.svg` - Connected nodes representing AI network
- `brain.svg` - Stylized brain for AI intelligence
- `lightbulb.svg` - Ideas and innovation
- `rocket.svg` - Growth and launch
- `users.svg` - Community and people

### Events (4 icons)
- `calendar.svg` - Event dates and scheduling
- `location.svg` - Event location/venue
- `clock.svg` - Time and duration
- `ticket.svg` - Event registration/tickets

### Content (4 icons)
- `book.svg` - Knowledge base articles
- `file.svg` - Documents and files
- `video.svg` - Video content
- `download.svg` - Downloadable resources

### Social (1 icon)
- `linkedin.svg` - LinkedIn social link

### Actions (4 icons)
- `check.svg` - Confirmation and success
- `x.svg` - Error and deletion
- `plus.svg` - Add and create
- `search.svg` - Search functionality
- `filter.svg` - Filtering options

### Status (4 icons)
- `info.svg` - Information messages
- `warning.svg` - Warning alerts
- `success.svg` - Success confirmations
- `error.svg` - Error messages

## Usage Examples

### React/Next.js Component

```tsx
// Icon component wrapper
interface IconProps {
  name: string;
  size?: number;
  className?: string;
}

export function Icon({ name, size = 24, className = '' }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      className={className}
    >
      <use href={`/icons/${name}.svg#icon`} />
    </svg>
  );
}

// Usage
<Icon name="network" size={20} className="text-yellow" />
```

### Direct SVG Import

```tsx
import MenuIcon from '@/public/icons/menu.svg';

<MenuIcon className="w-6 h-6 text-gray-900" />
```

### Inline HTML

```html
<svg class="w-6 h-6 text-yellow" viewBox="0 0 24 24">
  <use href="/icons/network.svg#icon" />
</svg>
```

## Color Inheritance

All icons use `currentColor` and automatically inherit text color from parent:

```html
<!-- Yellow icon -->
<div class="text-yellow">
  <Icon name="rocket" />
</div>

<!-- Dark icon -->
<div class="text-dark">
  <Icon name="users" />
</div>
```

## Size Guidelines

| Context | Size | Example |
|---------|------|---------|
| Inline text | 16px | Icon next to text link |
| Buttons | 20px | Icon in CTA button |
| Cards | 24px | Feature card icons |
| Headers | 32-48px | Section header icons |
| Hero | 64px+ | Main illustrations |

## Optimization

All icons are optimized:
- No unnecessary groups or transforms
- Clean paths with minimal points
- Consistent stroke properties
- Ready for production use

## Adding New Icons

When creating new icons:

1. **Maintain consistency:**
   - Use 1.5px stroke weight
   - 24x24 viewBox
   - Round linecaps and linejoins
   - currentColor for stroke

2. **Follow naming:**
   - Lowercase with hyphens
   - Descriptive names (verb-noun format)
   - Example: `edit-file.svg`, `delete-user.svg`

3. **Test inheritance:**
   - Verify color inheritance works
   - Check scaling at different sizes
   - Ensure alignment with text

## File Structure

```
icons/
├── README.md (this file)
├── menu.svg
├── close.svg
├── arrow-right.svg
├── external-link.svg
├── network.svg
├── brain.svg
├── lightbulb.svg
├── rocket.svg
├── users.svg
├── calendar.svg
├── location.svg
├── clock.svg
├── ticket.svg
├── book.svg
├── file.svg
├── video.svg
├── download.svg
├── linkedin.svg
├── check.svg
├── x.svg
├── plus.svg
├── search.svg
├── filter.svg
├── info.svg
├── warning.svg
├── success.svg
└── error.svg
```

## Version

- Version: 1.0
- Created: 2026-02-14
- Total icons: 27
