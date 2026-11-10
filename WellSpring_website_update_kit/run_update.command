#!/bin/bash
cd "$(dirname "$0")" || exit 1
python3 apply_updates.py
printf '\nPress Return to close this window.\n'
read -r
