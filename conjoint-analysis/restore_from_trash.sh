#!/bin/bash
# File location: conjoint-analysis/restore_from_trash.sh
# Purpose: Restore Session_0_Data_Package.zip from Trash and extract it
# Why: macOS permission restrictions require manual steps to restore from Trash

echo "=== RESTORE DATA PACKAGE FROM TRASH ==="
echo ""
echo "The zip file is in your Trash folder, but we need to restore it manually."
echo ""
echo "OPTION 1: Manual Restore (Easiest)"
echo "  1. Open Finder"
echo "  2. Click on Trash in the sidebar"
echo "  3. Find 'Session_0_Data_Package.zip'"
echo "  4. Right-click and select 'Put Back' (if you know where it was)"
echo "     OR drag it to: $(pwd)"
echo "  5. Then run this script again with: bash restore_from_trash.sh extract"
echo ""
echo "OPTION 2: Restore from Terminal"
echo "  If you have permissions, you can run:"
echo "  cp ~/.Trash/Session_0_Data_Package.zip ."
echo ""

if [ "$1" == "extract" ]; then
    if [ -f "Session_0_Data_Package.zip" ]; then
        echo "✓ Found zip file, extracting..."
        unzip -o Session_0_Data_Package.zip
        echo ""
        echo "=== EXTRACTED FILES ==="
        ls -la
        echo ""
        echo "✓ Done! Now run quick_start.R to see what we recovered."
    else
        echo "✗ Zip file not found in current directory."
        echo "Please copy Session_0_Data_Package.zip to this folder first."
    fi
fi


