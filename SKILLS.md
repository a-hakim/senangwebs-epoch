---
name: senangwebs-epoch
description: Dynamic countdown timers, duration timers, and current-time displays with flexible formatting and event callbacks.
version: 1.1.4
package: senangwebs-epoch
---

# SenangWebs Epoch (SWE)

## Quick Reference

- **Purpose**: Countdown-to-date, countdown-duration, and current-time displays
- **Entry**: `dist/swe.js`
- **Dependencies**: none
- **Scripts**: `npm run build`, `npm run dev`, `npm run test`

## Workflow

Start in `C:\wamp64\www\sw-libraries\senangwebs-epoch`. Read `README.md`, `package.json`, and touched source files. Match existing patterns, CSS prefix `swe-`.

## HTML Data Attributes

### Container
| Attribute | Values |
|---|---|
| `data-swe` | flag |
| `data-swe-countdown-end` | ISO 8601 date string |
| `data-swe-countdown-duration` | non-negative duration in seconds |
| `data-swe-current` | flag for current-time mode |

### Time unit display elements
| Attribute | Description |
|---|---|
| `data-swe-year` | container for years |
| `data-swe-month` | container for months |
| `data-swe-day` | container for days |
| `data-swe-hour` | container for hours |
| `data-swe-minute` | container for minutes |
| `data-swe-second` | container for seconds |
| `data-swe-format` | padding token; its length sets the minimum width |

## JavaScript API

```js
const timer = new SWE(element, {
  autostart, countdownEnd, duration,
  onTick, onEnd, onStart, onPause, onResume, onReset, onStop
})

timer.start()
timer.pause()
timer.resume()
timer.reset()
timer.stop()
```

### DOM Events
`swe:tick`, `swe:end`, `swe:start`, `swe:pause`, `swe:resume`, `swe:reset`, `swe:stop`

## Focus Areas

- Countdown accuracy: handle timezone differences, past dates, invalid dates
- Duration mode: decrementing timer with pause/resume/reset
- Clock mode: real-time display updating every second
- Format options: zero-padded vs natural number display
- Completed timer state: display zero, do not create or retain an interval, fire `onEnd`/`swe:end` once

## Implementation Guidance

- Preserve backward compatibility for all attributes and event names
- Handle edge cases: invalid dates should show error state, not crash
- Use ISO 8601 countdown dates such as `2027-01-01T00:00:00`
- Test across timezone changes (DST boundaries)
- Verify pause/resume doesn't drift accumulated time

## Validation

```bash
npm run build
npm test
```
