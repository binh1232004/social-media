const fs = require('fs');
const path = require('path');

// Define the public directory
const publicDir = path.join(__dirname, 'public');

// Ensure the public directory exists
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

// Create placeholder image files if they don't exist
const requiredImages = ['home.png', 'friends.png', 'group.png', 'person.png', 'avatar.png'];

requiredImages.forEach(imageName => {
  const imagePath = path.join(publicDir, imageName);
  
  if (!fs.existsSync(imagePath)) {
    console.log(`Creating placeholder for ${imageName}...`);
    
    // Create a simple SVG as placeholder
    // This is just a colored square with the image name inside
    const svgContent = `<svg width="100" height="100" xmlns="http://www.w3.org/2000/svg">
      <rect width="100%" height="100%" fill="#3b82f6"/>
      <text x="50%" y="50%" font-family="Arial" font-size="14" fill="white" text-anchor="middle" dominant-baseline="middle">
        ${imageName.replace('.png', '')}
      </text>
    </svg>`;
    
    fs.writeFileSync(imagePath, Buffer.from(svgContent));
    console.log(`Created ${imageName}`);
  } else {
    console.log(`${imageName} already exists.`);
  }
});

console.log('All sidebar icons are ready!');
