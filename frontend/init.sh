
#!/bin/sh

echo "=== Starting Frontend Build Process ==="

# Install dependencies if node_modules doesn't exist
if [ ! -d "node_modules" ]; then
    echo "Installing dependencies..."
    npm install
else
    echo "Dependencies already installed"
fi

# Build the React application
echo "Building React application..."
npm run build

# Check if build was successful
if [ -d "build" ] && [ -f "build/index.html" ]; then
    echo "✅ Build successful! Contents of build directory:"
    ls -la build/
    echo "✅ index.html found in build directory"
else
    echo "❌ Build failed or index.html not found!"
    exit 1
fi

# Keep container running
echo "Frontend container ready. Keeping alive..."
tail -f /dev/null