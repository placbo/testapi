npm i

# Check if testapi process is already running
if pm2 describe testapi > /dev/null 2>&1; then
    echo "testapi is already running, reloading..."
    pm2 reload testapi
else
    echo "Starting testapi for the first time..."
    pm2 start index.js --name testapi
fi

