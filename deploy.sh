#!/bin/bash
set -e

echo "→ Building static export..."
npm run build

echo "→ Zipping the out/ folder..."
rm -f deploy.zip
cd out
zip -r ../deploy.zip .
cd ..

echo ""
echo "✅ Done! deploy.zip is ready."
echo ""
echo "In cPanel:"
echo "  1. Go to File Manager → public_html"
echo "  2. Create a folder called 'catalog'"
echo "  3. Upload deploy.zip into that folder"
echo "  4. Extract it there"
echo "  5. Visit: https://yourdomain.com/catalog/"
