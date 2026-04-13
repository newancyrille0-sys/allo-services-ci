import ZAI from 'z-ai-web-dev-sdk';
import fs from 'fs';
import path from 'path';

async function generateLogo() {
  console.log('🎨 Généération du logo ALLÔ SERVICES...\n');

  const zai = await ZAI.create();

  const prompt = `Professional modern logo for "ALLÔ SERVICES", a services marketplace platform in Ivory Coast Africa. 

Design elements:
- Clean minimalist design with a stylized speech bubble icon representing "ALLO" (phone call/hello in French)
- The speech bubble should contain a subtle hand/tool icon representing services
- Modern, bold sans-serif typography
- "ALLÔ" in primary teal color (#004150), bold weight
- "SERVICES" in lighter weight below, in orange accent (#FD7613)

Color palette:
- Primary Teal (#004150) - main brand color
- Secondary Orange (#FD7613) - accent color
- Dark Green (#00460E) - subtle success elements
- White background

Style:
- Flat design, no gradients
- Vector-style clean lines
- Professional corporate logo
- Suitable for website header and mobile app icon
- Modern African tech company aesthetic
- Clean geometric shapes

The logo should be versatile and work well at different sizes (favicon, header, app icon).`;

  try {
    const response = await zai.images.generations.create({
      prompt: prompt,
      size: '1024x1024'
    });

    const imageBase64 = response.data[0].base64;
    const buffer = Buffer.from(imageBase64, 'base64');
    
    const outputPath = '/home/z/my-project/download/allo-services-logo.png';
    fs.writeFileSync(outputPath, buffer);

    console.log('✅ Logo généré avec succès!');
    console.log(`📁 Fichier: ${outputPath}`);
    console.log(`📏 Taille: ${buffer.length} bytes`);
    
    return outputPath;
  } catch (error) {
    console.error('❌ Erreur:', error);
    throw error;
  }
}

generateLogo();
