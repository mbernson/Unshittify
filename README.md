# Unshittify

A browser plugin that unshittifies some news. It replaces news articles that mention some people who get too much attention, with colourful blocks.

It works on most dutch, and on some american newspapers. For now. Help is welcome. 

## Installing (Safari 27)

1. In Safari, go to Settings › Advanced and turn on "Show features for web developers".
2. In Settings › Developer, add a temporary extension, allow unsigned extensions, and select this folder.

After changing the code, reload the extension from the Developer settings.

To install it permanently, build the containing macOS app with `scripts/package-safari.sh --install`. This needs Xcode and an Apple Development signing certificate. Then enable Unshittify in Safari › Settings › Extensions.
