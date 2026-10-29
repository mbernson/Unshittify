#!/bin/sh
# Builds Unshittify.app, a macOS app that contains the Safari extension, into build/.
# The Xcode project is regenerated from the current source on every run, so it is
# never edited or committed.
#
# Usage: scripts/package-safari.sh [--install]
#   --install   copy the app to /Applications and open it once, so Safari picks it up
#
# Signing uses the team of your "Apple Development" certificate; override with TEAM_ID=….
set -eu

APP_NAME=Unshittify
BUNDLE_ID=nl.duckson.Unshittify
EXTENSION_FILES="manifest.json js.js icons"

cd "$(dirname "$0")/.."
ROOT=$(pwd)
BUILD="$ROOT/build"
VERSION=$(plutil -extract version raw manifest.json)

TEAM_ID=${TEAM_ID:-$(security find-certificate -c "Apple Development" -p 2>/dev/null \
  | openssl x509 -noout -subject 2>/dev/null | sed -n 's/.*OU=\([A-Z0-9]*\).*/\1/p')}
if [ -z "$TEAM_ID" ]; then
  echo "No Apple Development certificate found; run with TEAM_ID=<your team id>." >&2
  exit 1
fi

echo "→ Staging extension files"
rm -rf "$BUILD"
mkdir -p "$BUILD/extension"
for f in $EXTENSION_FILES; do cp -R "$f" "$BUILD/extension/"; done
find "$BUILD/extension" -name .DS_Store -delete

echo "→ Generating Xcode project"
xcrun safari-web-extension-packager "$BUILD/extension" \
  --project-location "$BUILD/xcode" --app-name "$APP_NAME" --bundle-identifier "$BUNDLE_ID" \
  --macos-only --swift --copy-resources --no-open --no-prompt --force
PROJECT=$(find "$BUILD/xcode" -maxdepth 3 -name '*.xcodeproj' | head -n 1)

echo "→ Building $APP_NAME $VERSION (team $TEAM_ID)"
xcodebuild -project "$PROJECT" -scheme "$APP_NAME" -configuration Release \
  -destination 'platform=macOS,arch=arm64' \
  -derivedDataPath "$BUILD/DerivedData" -allowProvisioningUpdates -quiet \
  DEVELOPMENT_TEAM="$TEAM_ID" CODE_SIGN_STYLE=Automatic MARKETING_VERSION="$VERSION" \
  build
APP="$BUILD/DerivedData/Build/Products/Release/$APP_NAME.app"
echo "Built $APP"

if [ "${1:-}" = "--install" ]; then
  echo "→ Installing to /Applications"
  rm -rf "/Applications/$APP_NAME.app"
  cp -R "$APP" /Applications/
  open "/Applications/$APP_NAME.app"
  echo "Enable $APP_NAME in Safari › Settings › Extensions (only needed the first time)."
fi
