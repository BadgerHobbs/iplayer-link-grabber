# iPlayer Link Grabber

This Firefox Web Extension allows you to collect BBC iPlayer episode links from multiple pages into a single, de-duplicated list. It's designed for easily gathering content for use with download managers like `yt-dlp`.

## Features

- **Collect from Multiple Pages**: Add URLs from any iPlayer page to a persistent list.
- **De-duplicated List**: Automatically removes duplicate links, ensuring you only have unique URLs.
- **Persistent Storage**: Your collected list is saved, so you can close the popup or browser and continue collecting later.
- **Multiple Export Formats**: Copy the final list as plain URLs or as a ready-to-use `yt-dlp` shell script.
- **Simple UI**: A clean, straightforward interface that shows a running count of your collected links.

## File Structure

The extension is composed of the following files:

```
iplayer-link-grabber/
├── icons/
│   ├── icon16.png
│   ├── icon48.png
│   └── icon128.png
├── manifest.json
├── popup.html
├── popup.js
└── README.md
```

## Setup and Installation

Since this is an unsigned, local extension, it must be loaded as a "temporary add-on" in Firefox. It will remain active until you close the browser.

1.  Open Firefox and navigate to the `about:debugging` page by typing it in the address bar and pressing Enter.
2.  In the left-hand menu, click on **"This Firefox"**.
3.  Click the **"Load Temporary Add-on..."** button.
4.  Navigate to your `iplayer-link-grabber` folder and select the `manifest.json` file.
5.  The extension's icon will now appear in your Firefox toolbar.

_Note: If you are updating the extension, it is best to first **Remove** the old version from the `about:debugging` page and then load the new one._

## Usage Instructions

1.  Navigate to a `bbc.co.uk/iplayer` page that contains episode links (e.g., a series or category page).
2.  Click the extension icon in your toolbar to open the control panel.

### Collecting URLs

- **Collect URLs from this Page**: Click this button to find all unique episode links on the current page and add them to your master list.
- The "Collected URLs" counter will update to show the total number of unique links you've gathered so far.
- You can navigate to other iPlayer pages and repeat this process to add more links to your list.

### Copying Links

- **Copy All URLs**: Copies the complete list of unique, collected URLs to your clipboard, with each URL on a new line.
- **Copy All as yt-dlp Script**: Copies a shell script to your clipboard, containing a `yt-dlp` command for every URL in your list.

### Clearing the List

- **Clear List**: Click this button to completely erase the collected URL list and reset the counter to zero. This allows you to start a new collection session.
