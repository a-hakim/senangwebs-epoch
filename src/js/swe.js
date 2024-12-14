/**
 * SenangWebs Epoch (SWE) - A JavaScript library for countdown timers and time display
 * Version: 1.1.1
 */

class SWE {
    constructor(element, options = {}) {
        this.element = element;
        this.options = {
            autostart: options.autostart !== undefined ? options.autostart : true,
            duration: options.duration,
            countdownEnd: options.countdownEnd,
            onTick: options.onTick,
            onEnd: options.onEnd,
            onStart: options.onStart,
            onPause: options.onPause,
            onResume: options.onResume,
            onReset: options.onReset,
            onStop: options.onStop
        };
        
        this.intervalId = null;
        this.isPaused = false;
        this.startTime = null;
        this.pausedTimeRemaining = null;
        this.endTime = null;
        
        this.initialize();
    }

    initialize() {
        if (!this.element || !(this.element instanceof HTMLElement)) {
            throw new Error('SWE: Invalid element provided');
        }

        this.mode = this.determineMode();
        this.setupElements();
        
        // Initialize display based on mode
        if (!this.options.autostart) {
            if (this.mode === 'countdown-duration' && this.options.duration) {
                this.updateDisplay(this.options.duration * 1000);
            } else if (this.mode === 'countdown-end' && this.options.countdownEnd) {
                const endDate = new Date(this.options.countdownEnd);
                const now = new Date();
                const remaining = endDate.getTime() - now.getTime();
                this.updateDisplay(remaining > 0 ? remaining : 0);
            }
        } else {
            this.start();
        }
    }

    determineMode() {
        // First check options
        if (this.options.countdownEnd) {
            return 'countdown-end';
        } else if (this.options.duration) {
            return 'countdown-duration';
        }
        
        // Then check attributes for backward compatibility
        if (this.element.hasAttribute('data-swe-countdown-end')) {
            return 'countdown-end';
        } else if (this.element.hasAttribute('data-swe-countdown-duration')) {
            return 'countdown-duration';
        } else if (this.element.hasAttribute('data-swe-current')) {
            return 'current';
        }
        
        // Default to countdown-end if countdownEnd is provided in options
        if (this.options.countdownEnd) {
            return 'countdown-end';
        }
        
        throw new Error('SWE: Invalid mode - missing required configuration');
    }

    setupElements() {
        this.elements = {
            year: this.element.querySelector('[data-swe-year]'),
            month: this.element.querySelector('[data-swe-month]'),
            day: this.element.querySelector('[data-swe-day]'),
            hour: this.element.querySelector('[data-swe-hour]'),
            minute: this.element.querySelector('[data-swe-minute]'),
            second: this.element.querySelector('[data-swe-second]')
        };
    }

    start() {
        if (this.intervalId) {
            return;
        }
        
        this.isPaused = false;
        this.startTime = Date.now();

        switch (this.mode) {
            case 'countdown-end':
                this.startCountdownToDate();
                break;
            case 'countdown-duration':
                this.startCountdownDuration();
                break;
            case 'current':
                this.startCurrentTime();
                break;
        }

        this.dispatchEvent('start');
    }

    startCountdownToDate() {
        const endDate = new Date(this.options.countdownEnd || this.element.getAttribute('data-swe-countdown-end'));
        
        if (isNaN(endDate.getTime())) {
            throw new Error('SWE: Invalid end date format');
        }

        this.endTime = endDate.getTime();
        this.updateTimer();
    }

    startCountdownDuration() {
        const duration = this.options.duration || 
            parseInt(this.element.getAttribute('data-swe-countdown-duration'), 10);
        
        if (isNaN(duration) || duration < 0) {
            throw new Error('SWE: Invalid duration');
        }

        if (this.pausedTimeRemaining !== null) {
            this.endTime = Date.now() + this.pausedTimeRemaining;
        } else {
            this.endTime = Date.now() + (duration * 1000);
        }

        this.updateTimer();
    }

    updateTimer() {
        const update = () => {
            const now = Date.now();
            const remaining = this.endTime - now;

            if (remaining <= 0) {
                this.stop();
                this.updateDisplay(0);
                this.dispatchEvent('end');
                return;
            }

            this.updateDisplay(remaining);
            this.dispatchEvent('tick');
        };

        // Initial update
        update();
        
        // Set interval for subsequent updates
        this.intervalId = setInterval(update, 1000);
    }

    startCurrentTime() {
        const update = () => {
            const now = new Date();
            this.updateCurrentTimeDisplay(now);
            this.dispatchEvent('tick');
        };

        // Initial update
        update();
        
        // Set interval for subsequent updates
        this.intervalId = setInterval(update, 1000);
    }

    updateDisplay(milliseconds) {
        const units = this.calculateTimeUnits(milliseconds);

        Object.entries(this.elements).forEach(([unit, element]) => {
            if (element) {
                this.updateElement(element, units[unit]);
            }
        });
    }

    updateCurrentTimeDisplay(date) {
        if (this.elements.hour) {
            this.updateElement(this.elements.hour, date.getHours());
        }
        if (this.elements.minute) {
            this.updateElement(this.elements.minute, date.getMinutes());
        }
        if (this.elements.second) {
            this.updateElement(this.elements.second, date.getSeconds());
        }
    }

    updateElement(element, value) {
        const format = element.getAttribute('data-swe-format');
        element.textContent = this.formatValue(value, format);
    }

    formatValue(value, format) {
        if (!format) return value.toString();
        return value.toString().padStart(format.length, '0');
    }

    calculateTimeUnits(milliseconds) {
        const seconds = Math.floor(milliseconds / 1000);
        const minutes = Math.floor(seconds / 60);
        const hours = Math.floor(minutes / 60);
        const days = Math.floor(hours / 24);
        const months = Math.floor(days / 30);
        const years = Math.floor(days / 365);

        return {
            year: years,
            month: months % 12,
            day: days % 30,
            hour: hours % 24,
            minute: minutes % 60,
            second: seconds % 60
        };
    }

    dispatchEvent(eventName) {
        // Call the corresponding callback if it exists
        const callbackName = `on${eventName.charAt(0).toUpperCase() + eventName.slice(1)}`;
        if (typeof this.options[callbackName] === 'function') {
            this.options[callbackName].call(this);
        }

        // Dispatch DOM event for backward compatibility
        const event = new CustomEvent(`swe:${eventName}`, {
            bubbles: true,
            detail: { instance: this }
        });
        this.element.dispatchEvent(event);
    }

    pause() {
        if (this.intervalId && !this.isPaused) {
            clearInterval(this.intervalId);
            this.intervalId = null;
            this.isPaused = true;
            this.pausedTimeRemaining = this.endTime - Date.now();
            this.dispatchEvent('pause');
        }
    }

    resume() {
        if (this.isPaused) {
            this.start();
            this.dispatchEvent('resume');
        }
    }

    reset() {
        this.stop();
        this.pausedTimeRemaining = null;
        this.endTime = null;
        
        if (this.mode === 'countdown-end' && this.options.countdownEnd) {
            const endDate = new Date(this.options.countdownEnd);
            const now = new Date();
            const remaining = endDate.getTime() - now.getTime();
            this.updateDisplay(remaining > 0 ? remaining : 0);
        } else if (this.mode === 'countdown-duration' && this.options.duration) {
            this.updateDisplay(this.options.duration * 1000);
        }

        this.dispatchEvent('reset');
        
        if (this.options.autostart) {
            this.start();
        }
    }

    stop() {
        if (this.intervalId) {
            clearInterval(this.intervalId);
            this.intervalId = null;
            this.isPaused = false;
            this.dispatchEvent('stop');
        }
    }
}

// Auto-initialize all SWE elements with data-swe attribute when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('[data-swe]').forEach(element => {
        new SWE(element);
    });
});

export default SWE;

if (typeof window !== 'undefined') {
    window.SWE = SWE;
}