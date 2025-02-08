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
    console.log("🔄 Starting YouTube mass unsubscribe process...");

    let unsubscribedCount = 0;
    
    while (true) {
        // Wait for elements to load
        await new Promise(resolve => setTimeout(resolve, 3000));

        // Find all "Subscribed" buttons
        let subscribedButtons = Array.from(document.querySelectorAll('yt-button-shape button'))
            .filter(btn => btn.innerText.trim().toLowerCase() === "subscribed");

        if (subscribedButtons.length === 0) {
            console.log("✅ No more subscriptions found! Stopping script.");
            break;
        }

        console.log(`📢 Found ${subscribedButtons.length} subscriptions to remove.`);

        for (let i = 0; i < subscribedButtons.length; i++) {
            try {
                let button = subscribedButtons[i];

                // Locate the closest channel name
                let channelContainer = button.closest('ytd-channel-renderer, ytd-grid-channel-renderer, ytd-rich-grid-media');
                let channelName = channelContainer ? channelContainer.querySelector('yt-formatted-string')?.innerText?.trim() : "Unknown Channel";

                console.log(`➡️ Unsubscribing from: ${channelName}`);

                button.click(); // Click "Subscribed" to open the menu

                // Wait for the "Unsubscribe" option to appear
                await new Promise(resolve => setTimeout(resolve, 1500));

                // Find and click the "Unsubscribe" option
                let unsubscribeOption = Array.from(document.querySelectorAll('tp-yt-paper-item, yt-formatted-string'))
                    .find(el => el.innerText.trim().toLowerCase() === "unsubscribe");

                if (unsubscribeOption) {
                    unsubscribeOption.click();
                    console.log(`🔘 Clicked 'Unsubscribe' for: ${channelName}`);
                } else {
                    console.warn(`⚠️ No 'Unsubscribe' option found for: ${channelName}. Skipping...`);
                    continue;
                }

                // Wait for confirmation popup
                await new Promise(resolve => setTimeout(resolve, 2000));

                // Find and click the confirmation "Unsubscribe" button inside the popup
                let confirmBtn = document.querySelector('yt-button-renderer#confirm-button button');

                if (confirmBtn) {
                    confirmBtn.click();
                    console.log(`✅ Successfully unsubscribed from: ${channelName}`);
                } else {
                    console.warn(`⚠️ No confirmation button found for: ${channelName}. Skipping...`);
                    continue;
                }

                unsubscribedCount++;

                // Wait before moving to the next channel to avoid rate limits
                let delay = Math.floor(Math.random() * 2000) + 1000; // 1-3 sec delay
                console.log(`⏳ Waiting ${delay / 1000} seconds before next unsubscription...`);
                await new Promise(resolve => setTimeout(resolve, delay));

            } catch (error) {
                console.error(`❌ Error unsubscribing from channel ${i + 1}:`, error);
            }
        }
    }

    console.log(`🎉 Finished unsubscribing from ${unsubscribedCount} channels.`);
})();
