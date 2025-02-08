document.getElementById('startButton').addEventListener('click', async () => {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  
  if (!tab.url.includes('youtube.com/feed/channels')) {
    alert('Please navigate to YouTube\'s subscription page first!');
    return;
  }

  try {
    await chrome.scripting.executeScript({
      target: { tabId: tab.id },
      files: ['unsubscribe.js']
    });
  } catch (err) {
    console.error('Failed to execute script:', err);
    alert('Error: ' + err.message);
  }
});
