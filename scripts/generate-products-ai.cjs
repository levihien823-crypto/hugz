const fs = require('fs');
const path = require('path');

const DOMAIN = 'https://thehugzlife.store';
const productsFilePath = path.resolve(__dirname, '../src/data/products.ts');
const publicDir = path.resolve(__dirname, '../public');
const outputDir = path.join(publicDir, 'data');
const outputFile = path.join(outputDir, 'products-ai.json');
const imagesOutputDir = path.join(publicDir, 'images', 'products');

if (!fs.existsSync(productsFilePath)) {
  console.error(`[HUGZ AI] File not found: ${productsFilePath}`);
  process.exit(1);
}

const content = fs.readFileSync(productsFilePath, 'utf8');

// Match PRODUCTS array block in products.ts
const startIdx = content.indexOf('export const PRODUCTS: Product[] = [');
if (startIdx === -1) {
  console.error('[HUGZ AI] Could not find PRODUCTS array in src/data/products.ts');
  process.exit(1);
}

const jsonStr = content.slice(startIdx + 'export const PRODUCTS: Product[] = '.length).trim();
let bracketDepth = 0;
let endIdx = -1;
for (let i = 0; i < jsonStr.length; i++) {
  if (jsonStr[i] === '[') bracketDepth++;
  else if (jsonStr[i] === ']') {
    bracketDepth--;
    if (bracketDepth === 0) {
      endIdx = i + 1;
      break;
    }
  }
}

if (endIdx === -1) {
  console.error('[HUGZ AI] Could not parse PRODUCTS array');
  process.exit(1);
}

const rawProducts = JSON.parse(jsonStr.slice(0, endIdx));

// Format price helper (VND)
const formatPrice = (p) => new Intl.NumberFormat('vi-VN').format(p) + '₫';

// Ensure directories exist
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}
if (!fs.existsSync(imagesOutputDir)) {
  fs.mkdirSync(imagesOutputDir, { recursive: true });
}

// Ensure .nojekyll exists for GitHub Pages
const nojekyllFile = path.join(publicDir, '.nojekyll');
if (!fs.existsSync(nojekyllFile)) {
  fs.writeFileSync(nojekyllFile, '', 'utf8');
}

// Map to clean AI-friendly dataset with absolute URLs
const aiProducts = rawProducts.map((p) => {
  let cleanImageUrl = p.image || '';

  // Case 1: Base64 data URI (Products 1-8) -> Extract to real WebP file in public/images/products/
  if (cleanImageUrl.startsWith('data:image/webp;base64,')) {
    const fileName = `${p.id}.webp`;
    const imageFilePath = path.join(imagesOutputDir, fileName);
    if (!fs.existsSync(imageFilePath)) {
      const base64Data = cleanImageUrl.replace(/^data:image\/webp;base64,/, '');
      fs.writeFileSync(imageFilePath, Buffer.from(base64Data, 'base64'));
    }
    cleanImageUrl = `${DOMAIN}/images/products/${fileName}`;
  } else if (cleanImageUrl.startsWith('/')) {
    // Case 2: Relative path (Products 9-18) -> Convert to absolute URL
    cleanImageUrl = `${DOMAIN}${cleanImageUrl}`;
  } else if (!cleanImageUrl.startsWith('http://') && !cleanImageUrl.startsWith('https://')) {
    cleanImageUrl = `${DOMAIN}/${cleanImageUrl}`;
  }

  const directWebUrl = `${DOMAIN}/?product=${encodeURIComponent(p.id)}`;
  const colorsList = Array.isArray(p.variants) && p.variants.length > 0 
    ? p.variants 
    : (Array.isArray(p.colors) ? p.colors : []);

  return {
    id: p.id,
    name: p.title,
    price: p.price,
    priceFormatted: formatPrice(p.price),
    originalPrice: p.originalPrice || p.price,
    category: p.category,
    categorySlug: p.categorySlug || '',
    description: p.description || p.subtitle || '',
    colors: colorsList,
    variants: Array.isArray(p.variants) ? p.variants : [],
    features: Array.isArray(p.features) ? p.features : [],
    dimensions: p.dimensions || '',
    material: p.material || '',
    imageUrl: cleanImageUrl,
    url: directWebUrl,
    navigation: {
      webUrl: directWebUrl,
      shopeeUrl: p.shopeeUrl || '',
      tiktokUrl: p.tiktokUrl || ''
    },
    shopeeUrl: p.shopeeUrl || '',
    tiktokUrl: p.tiktokUrl || '',
    isBestSeller: Boolean(p.isBestSeller),
    isNew: Boolean(p.isNew),
    rating: p.rating || 5,
    soldCount: p.soldCount || ''
  };
});

fs.writeFileSync(outputFile, JSON.stringify(aiProducts, null, 2), 'utf8');
console.log(`[HUGZ AI] Successfully generated ${outputFile} with ${aiProducts.length} products!`);

// If dist directory exists, sync to dist as well
const distOutputDir = path.resolve(__dirname, '../dist/data');
if (fs.existsSync(path.resolve(__dirname, '../dist'))) {
  if (!fs.existsSync(distOutputDir)) {
    fs.mkdirSync(distOutputDir, { recursive: true });
  }
  fs.writeFileSync(path.join(distOutputDir, 'products-ai.json'), JSON.stringify(aiProducts, null, 2), 'utf8');
  console.log(`[HUGZ AI] Also synced to dist/data/products-ai.json!`);
}
