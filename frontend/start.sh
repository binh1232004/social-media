#!/bin/bash

# Start Apache2 in the background
/usr/sbin/apache2ctl -D FOREGROUND &

# Start the Next.js application
npm run start