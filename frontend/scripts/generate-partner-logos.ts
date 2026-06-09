import ZAI from 'z-ai-web-dev-sdk';
import fs from 'fs';
import path from 'path';

const outputDir = './public/partners';

const partnerLogos = [
  {
    name: 'oss',
    prompt: 'Professional logo design for OSS (Observatoire du Sahara et du Sahel), Sahara and Sahel Observatory organization, clean minimalist design, blue and teal colors, circular or shield shape, water/environment theme, transparent background, high quality, corporate identity'
  },
  {
    name: 'omvs',
    prompt: 'Professional logo design for OMVS (Organisation pour la Mise en Valeur du fleuve Sénégal), Senegal River Basin Development Organization, clean minimalist design, blue colors, water/river theme, transparent background, high quality, corporate identity'
  },
  {
    name: 'omvg',
    prompt: 'Professional logo design for OMVG (Organisation pour la Mise en Valeur du fleuve Gambie), Gambia River Basin Development Organization, clean minimalist design, green and blue colors, water/river theme, transparent background, high quality, corporate identity'
  },
  {
    name: 'gef',
    prompt: 'Professional logo design for GEF (Global Environment Facility), environmental organization, clean minimalist design, green and blue globe theme, transparent background, high quality, corporate identity'
  },
  {
    name: 'unep',
    prompt: 'Professional logo design for UNEP (United Nations Environment Programme), UN environmental organization, clean minimalist design, blue and green colors, globe/leaf theme, transparent background, high quality, corporate identity'
  }
];

async function generateLogos() {
  console.log('🎨 Generating partner logos...');
  
  // Ensure output directory exists
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  const zai = await ZAI.create();

  for (const partner of partnerLogos) {
    try {
      console.log(`Generating ${partner.name} logo...`);
      
      const response = await zai.images.generations.create({
        prompt: partner.prompt,
        size: '1024x1024'
      });

      const imageBase64 = response.data[0].base64;
      const buffer = Buffer.from(imageBase64, 'base64');
      const outputPath = path.join(outputDir, `${partner.name}.png`);
      
      fs.writeFileSync(outputPath, buffer);
      console.log(`✅ Saved: ${outputPath}`);
      
    } catch (error) {
      console.error(`❌ Failed to generate ${partner.name}:`, error);
    }
  }

  console.log('🎉 Logo generation complete!');
}

generateLogos();
