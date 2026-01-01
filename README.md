# SenangWebs Epoch (SWE)

SenangWebs Epoch (SWE) is a lightweight JavaScript library for creating dynamic countdown timers and time displays. Whether you need to count down to a specific date, create a duration-based timer, or display the current time, SWE provides an elegant solution with minimal setup. The library supports flexible formatting, responsive design, and comprehensive event handling.

## Features

- Multiple timer modes:
  - Countdown to specific date/time
  - Duration-based countdown
  - Current time display
- Easy integration with existing projects
- Customizable time unit formatting
- Responsive design out of the box
- Comprehensive event system
- Pause, resume, and reset functionality
- No external dependencies
- Built-in default styling with CSS
- Works on all modern browsers

## Installation

### Using npm

```bash
npm install senangwebs-epoch
```

### Using a CDN

Include SenangWebs Epoch directly in your HTML file:

```html
<link rel="stylesheet" href="https://unpkg.com/senangwebs-epoch@latest/dist/swe.css">
<script src="https://unpkg.com/senangwebs-epoch@latest/dist/swe.js"></script>
```

## Usage

1. Include the SWE CSS and JavaScript files in your HTML:

```html
<link rel="stylesheet" href="path/to/swe.css">
<script src="path/to/swe.js"></script>
```

2. Create your timer structure using data attributes:

### Countdown to a specific date

```html
<div data-swe data-swe-countdown-end="2025-01-01 00:00:00">
    <div data-swe-year data-swe-format="yyyy"></div>
    <div data-swe-month data-swe-format="mm"></div>
    <div data-swe-day data-swe-format="dd"></div>
    <div data-swe-hour data-swe-format="HH"></div>
    <div data-swe-minute data-swe-format="mm"></div>
    <div data-swe-second data-swe-format="ss"></div>
</div>
```

### Duration-based countdown

```html
<div data-swe data-swe-countdown-duration="60">
    <div data-swe-minute data-swe-format="mm"></div>
    <div data-swe-second data-swe-format="ss"></div>
</div>
```

### Current time display

```html
<div data-swe data-swe-current>
    <div data-swe-hour data-swe-format="HH"></div>
    <div data-swe-minute data-swe-format="mm"></div>
    <div data-swe-second data-swe-format="ss"></div>
</div>
```

## Configuration Options

### Data Attributes

- `data-swe`: Marks the container element as a timer
- `data-swe-countdown-end`: Specifies target date/time for countdown
- `data-swe-countdown-duration`: Specifies duration in seconds
- `data-swe-current`: Enables current time display mode
- Time unit attributes:
  - `data-swe-year`
  - `data-swe-month`
  - `data-swe-day`
  - `data-swe-hour`
  - `data-swe-minute`
  - `data-swe-second`
- `data-swe-format`: Specifies display format for each unit

### Format Options

The format string determines zero-padding based on its length:

| Unit | Format | Output Example | Description |
|------|--------|----------------|-------------|
| Year | `yyyy` | `2026` | Four-digit year |
| Month | `m` | `5` | Single digit month |
| Month | `mm` | `05` | Two-digit month |
| Day | `d` | `5` | Single digit day |
| Day | `dd` | `05` | Two-digit day |
| Day | `ddd` | `005` | Three-digit day (for long countdowns) |
| Hour | `H` | `9` | Single digit hour |
| Hour | `HH` | `09` | Two-digit hour |
| Minute | `m` | `7` | Single digit minute |
| Minute | `mm` | `07` | Two-digit minute |
| Second | `s` | `3` | Single digit second |
| Second | `ss` | `03` | Two-digit second |

### JavaScript Initialization

```javascript
const timer = new SWE(element, {
    autostart: true,
    duration: 60, // for countdown-duration mode
    countdownEnd: '2025-01-01 00:00:00', // for countdown-end mode
    onTick: () => {
        console.log('Timer ticked!');
    },
    onEnd: () => {
        console.log('Timer finished!');
    },
    onStart: () => {
        console.log('Timer started!');
    },
    onPause: () => {
        console.log('Timer paused!');
    },
    onResume: () => {
        console.log('Timer resumed!');
    },
    onReset: () => {
        console.log('Timer reset!');
    },
    onStop: () => {
        console.log('Timer stopped!');
    }
});
```

## Methods

- `start()`: Start or resume the timer
- `pause()`: Pause the timer
- `resume()`: Resume the timer from paused state
- `reset()`: Reset the timer to initial state
- `stop()`: Stop the timer completely

## Events

SWE emits events that you can listen to:

```javascript
timer.element.addEventListener('swe:tick', (e) => {
    console.log('Timer ticked!');
});

timer.element.addEventListener('swe:end', (e) => {
    console.log('Timer finished!');
});
```

Available events:
- `swe:start`
- `swe:tick`
- `swe:pause`
- `swe:resume`
- `swe:reset`
- `swe:stop`
- `swe:end`

## Styling

SWE comes with default styles that can be customized using CSS:

```css
/* Example custom styling */
[data-swe] {
    /* Container styles */
}

[data-swe] > div {
    /* Time unit container styles */
}

[data-swe] > div::after {
    /* Time unit label styles */
}
```

## Browser Support

SenangWebs Epoch works on all modern browsers, including:
- Chrome
- Firefox
- Safari
- Edge
- Opera

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT License

## Support

If you encounter any issues or have questions, please file an issue on the GitHub repository.
