/* antiCopy.js
 * Simple deterrent script: logs a warning and optionally prevents right-click on desktop.
 * NOTE: This is only a visual/UX deterrent. It does NOT prevent copying or mirroring.
 */

// Console warning for anyone inspecting the site
console.log("Warning: Cloning or copying this site without permission is not allowed.");

(function() {
    // Detect if the device likely supports touch (mobile/tablet)
    const isTouchDevice = (('ontouchstart' in window) || (navigator.maxTouchPoints && navigator.maxTouchPoints > 0));

    // Only prevent right-click on non-touch devices (desktop) to avoid breaking mobile UX
    if (!isTouchDevice) {
        try {
            document.addEventListener('contextmenu', function (e) {
                // Prevent the context menu as a mild deterrent
                e.preventDefault();
            }, { passive: false });
        } catch (err) {
            // Fail silently; do not break the page if the browser disallows non-passive listeners
            console.warn('antiCopy: could not attach contextmenu listener', err);
        }
    }

    // Additional mild deterrent: intercept common save shortcuts (Ctrl/Cmd+S) on desktop
    if (!isTouchDevice) {
        document.addEventListener('keydown', function(e) {
            const isSave = (e.key === 's' || e.key === 'S') && (e.ctrlKey || e.metaKey);
            if (isSave) {
                e.preventDefault();
                // Optional feedback to the user via console (avoid intrusive alerts)
                console.log('Saving the page is discouraged without permission.');
            }
        }, { passive: false });
    }
})();
