/**
 * # YouTube Mass Unsubscribe Script
 * 
 * This script automates the process of unsubscribing from multiple YouTube channels.
 * It runs directly in your browser's console on YouTube's subscription management page.
 * 
 * ## How to Use
 * 
 * 1. Go to YouTube's subscription management page:
 *    - Visit https://www.youtube.com/feed/channels
 *    - Or: YouTube > Settings > Advanced Settings > Manage all subscriptions
 * 
 * 2. Open your browser's Developer Console:
 *    - Mac: Press Command + Option + J (Chrome/Edge) or Command + Option + K (Firefox)
 *    - Windows: Press Control + Shift + J (Chrome/Edge) or Control + Shift + K (Firefox)
 * 
 * 3. Copy this entire script and paste it into the console, then press Enter
 * 
 * ## Features
 * 
 * - 🔄 Automatically processes all visible subscriptions
 * - ✨ Shows real-time progress in the console
 * - 🚫 Includes error handling and skip logic
 * - ⏱️ Random delays to prevent rate limiting
 * - 📝 Logs channel names and status for each action
 * 
 * ## Notes
 * 
 * - The script can be stopped by refreshing the page
 * - Actions cannot be undone - review channels before running
 * - YouTube may change its interface, affecting functionality
 */

(async function unsubscribeAll() {
    // Ask for confirmation
    if (!confirm('⚠️ Warning: This will unsubscribe you from all channels.\nDo you want to continue?')) {
        console.log('❌ Operation cancelled by user.');
        return;
    }

    // Configuration
    const config = {
        maxUnsubscribes: Infinity, // Set a number to limit unsubscriptions
        retryAttempts: 3,
        isPaused: false
    };

    console.log("🔄 Starting YouTube mass unsubscribe process...");
    console.log("ℹ️ Press 'P' to pause/resume the script");

    let unsubscribedCount = 0;
    let totalFound = 0;

    // Add pause/resume listener
    document.addEventListener('keypress', (e) => {
        if (e.key.toLowerCase() === 'p') {
            config.isPaused = !config.isPaused;
            console.log(config.isPaused ? '⏸️ Script paused' : '▶️ Script resumed');
        }
    });

    while (unsubscribedCount < config.maxUnsubscribes) {
        // Check if paused
        while (config.isPaused) {
            await new Promise(resolve => setTimeout(resolve, 1000));
        }

        // Wait for elements to load
        await new Promise(resolve => setTimeout(resolve, 3000));

        // Find all "Subscribed" buttons
        let subscribedButtons = Array.from(document.querySelectorAll('yt-button-shape button'))
            .filter(btn => btn.innerText.trim().toLowerCase() === "subscribed");

        if (subscribedButtons.length === 0) {
            console.log("✅ No more subscriptions found! Stopping script.");
            break;
        }

        totalFound = subscribedButtons.length;
        console.log(`📢 Found ${totalFound} subscriptions to remove.`);

        for (let i = 0; i < subscribedButtons.length && unsubscribedCount < config.maxUnsubscribes; i++) {
            try {
                // Check if paused
                while (config.isPaused) {
                    await new Promise(resolve => setTimeout(resolve, 1000));
                }

                let button = subscribedButtons[i];
                let retryCount = 0;

                // Locate the closest channel name
                let channelContainer = button.closest('ytd-channel-renderer, ytd-grid-channel-renderer, ytd-rich-grid-media');
                let channelName = channelContainer ? channelContainer.querySelector('yt-formatted-string')?.innerText?.trim() : "Unknown Channel";

                console.log(`➡️ Unsubscribing from: ${channelName} (${unsubscribedCount + 1}/${totalFound})`);

                while (retryCount < config.retryAttempts) {
                    try {
                        button.click();
                        await new Promise(resolve => setTimeout(resolve, 1500));

                        let unsubscribeOption = Array.from(document.querySelectorAll('tp-yt-paper-item, yt-formatted-string'))
                            .find(el => el.innerText.trim().toLowerCase() === "unsubscribe");

                        if (!unsubscribeOption) {
                            throw new Error('Unsubscribe option not found');
                        }

                        unsubscribeOption.click();
                        await new Promise(resolve => setTimeout(resolve, 2000));

                        let confirmBtn = document.querySelector('yt-button-renderer#confirm-button button');
                        if (!confirmBtn) {
                            throw new Error('Confirm button not found');
                        }

                        confirmBtn.click();
                        console.log(`✅ Successfully unsubscribed from: ${channelName}`);
                        break;
                    } catch (err) {
                        retryCount++;
                        if (retryCount === config.retryAttempts) {
                            throw err;
                        }
                        console.warn(`⚠️ Retry ${retryCount}/${config.retryAttempts} for: ${channelName}`);
                        await new Promise(resolve => setTimeout(resolve, 2000));
                    }
                }

                unsubscribedCount++;

                // Wait before moving to the next channel to avoid rate limits
                let delay = Math.floor(Math.random() * 2000) + 1000; // 1-3 sec delay
                console.log(`⏳ Waiting ${delay / 1000} seconds before next unsubscription...`);
                await new Promise(resolve => setTimeout(resolve, delay));

            } catch (error) {
                console.error(`❌ Error unsubscribing from ${channelName}:`, error.message);
            }
        }
    }

    console.log(`🎉 Finished unsubscribing from ${unsubscribedCount} channels.`);
})();
