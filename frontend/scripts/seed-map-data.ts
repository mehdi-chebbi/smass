// scripts/seed-map-data.ts
// Script pour peupler la base de données avec des exemples de couches cartographiques

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding map data...');

  // Créer un utilisateur admin pour les exemples
  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@smas.org' },
    update: {},
    create: {
      email: 'admin@smas.org',
      username: 'admin',
      password: 'hashed_password', // À remplacer par un vrai hash
      firstName: 'Admin',
      lastName: 'SMAS',
      country: 'SENEGAL',
      role: 'ADMIN',
    },
  });

  console.log('✅ Admin user created');

  // 1. Créer des collections
  const hydrographyCollection = await prisma.layerCollection.create({
    data: {
      name: 'Hydrography',
      nameFr: 'Hydrographie',
      description: 'Water bodies, rivers, and aquifer-related features',
      descriptionFr: 'Masses d\'eau, rivières et caractéristiques de l\'aquifère',
      slug: 'hydrography',
      icon: 'Droplets',
      order: 1,
    },
  });

  const infrastructureCollection = await prisma.layerCollection.create({
    data: {
      name: 'Infrastructure',
      nameFr: 'Infrastructure',
      description: 'Roads, buildings, and urban areas',
      descriptionFr: 'Routes, bâtiments et zones urbaines',
      slug: 'infrastructure',
      icon: 'Building',
      order: 2,
    },
  });

  const administrativeCollection = await prisma.layerCollection.create({
    data: {
      name: 'Administrative Boundaries',
      nameFr: 'Frontières Administratives',
      description: 'Country borders and administrative divisions',
      descriptionFr: 'Frontières nationales et divisions administratives',
      slug: 'administrative',
      icon: 'Map',
      order: 3,
    },
  });

  const environmentCollection = await prisma.layerCollection.create({
    data: {
      name: 'Environment',
      nameFr: 'Environnement',
      description: 'Protected areas, vegetation, and ecological zones',
      descriptionFr: 'Zones protégées, végétation et zones écologiques',
      slug: 'environment',
      icon: 'Trees',
      order: 4,
    },
  });

  console.log('✅ Collections created');

  // 2. Créer des couches avec des données GeoJSON d'exemple

  // Couche 1 : Frontières des pays SMAS
  const countriesLayer = await prisma.mapLayer.create({
    data: {
      name: 'SMAS Countries',
      nameFr: 'Pays SMAS',
      description: 'Boundaries of the four SMAS member countries',
      descriptionFr: 'Frontières des quatre pays membres du SMAS',
      slug: 'smas-countries',
      geometryType: 'POLYGON',
      category: 'ADMINISTRATIVE',
      color: '#cc0066',
      fillColor: '#cc0066',
      opacity: 0.8,
      weight: 2,
      fillOpacity: 0.1,
      geoData: {
        type: 'FeatureCollection',
        features: [
          {
            type: 'Feature',
            properties: {
              name: 'Senegal',
              nameFr: 'Sénégal',
              population: 17196308,
              area: 196722,
            },
            geometry: {
              type: 'Polygon',
              coordinates: [[
                [-17.0, 12.0], [-12.0, 12.0], [-12.0, 16.5],
                [-17.0, 16.5], [-17.0, 12.0]
              ]],
            },
          },
          {
            type: 'Feature',
            properties: {
              name: 'Mauritania',
              nameFr: 'Mauritanie',
              population: 4649658,
              area: 1030700,
            },
            geometry: {
              type: 'Polygon',
              coordinates: [[
                [-17.0, 15.0], [-5.0, 15.0], [-5.0, 21.0],
                [-17.0, 21.0], [-17.0, 15.0]
              ]],
            },
          },
        ],
      },
      minLat: 12.0,
      maxLat: 21.0,
      minLng: -17.0,
      maxLng: -5.0,
      collectionId: administrativeCollection.id,
      createdById: adminUser.id,
      isVisible: true,
      isDefault: true,
      legend: {
        create: {
          title: 'SMAS Countries',
          titleFr: 'Pays SMAS',
          legendType: 'categorized',
          items: [
            { value: 'senegal', label: 'Senegal', labelFr: 'Sénégal', color: '#cc0066' },
            { value: 'mauritania', label: 'Mauritania', labelFr: 'Mauritanie', color: '#cc3366' },
            { value: 'gambia', label: 'Gambia', labelFr: 'Gambie', color: '#cc6699' },
            { value: 'guinea-bissau', label: 'Guinea-Bissau', labelFr: 'Guinée-Bissau', color: '#cc99cc' },
          ],
        },
      },
    },
  });

  // Couche 2 : Fleuve Sénégal
  const senegalRiverLayer = await prisma.mapLayer.create({
    data: {
      name: 'Senegal River',
      nameFr: 'Fleuve Sénégal',
      description: 'Main course of the Senegal River',
      descriptionFr: 'Cours principal du fleuve Sénégal',
      slug: 'senegal-river',
      geometryType: 'LINESTRING',
      category: 'HYDROGRAPHY',
      color: '#0066cc',
      opacity: 0.9,
      weight: 3,
      geoData: {
        type: 'FeatureCollection',
        features: [
          {
            type: 'Feature',
            properties: {
              name: 'Senegal River',
              nameFr: 'Fleuve Sénégal',
              length: 1086,
            },
            geometry: {
              type: 'LineString',
              coordinates: [
                [-11.5, 12.3], [-12.0, 13.0], [-13.0, 14.0],
                [-14.0, 15.0], [-15.5, 15.8], [-16.5, 16.0]
              ],
            },
          },
        ],
      },
      minLat: 12.3,
      maxLat: 16.0,
      minLng: -16.5,
      maxLng: -11.5,
      collectionId: hydrographyCollection.id,
      createdById: adminUser.id,
      isVisible: true,
      isDefault: true,
    },
  });

  // Couche 3 : Points d'eau
  const waterPointsLayer = await prisma.mapLayer.create({
    data: {
      name: 'Water Points',
      nameFr: 'Points d\'Eau',
      description: 'Wells and boreholes in the SMAS region',
      descriptionFr: 'Puits et forages dans la région SMAS',
      slug: 'water-points',
      geometryType: 'POINT',
      category: 'HYDROGRAPHY',
      color: '#3399ff',
      opacity: 1.0,
      weight: 1,
      geoData: {
        type: 'FeatureCollection',
        features: [
          {
            type: 'Feature',
            properties: {
              name: 'Well 1',
              nameFr: 'Puits 1',
              type: 'well',
              depth: 25,
              status: 'operational',
            },
            geometry: {
              type: 'Point',
              coordinates: [-14.5, 14.8],
            },
          },
          {
            type: 'Feature',
            properties: {
              name: 'Borehole 1',
              nameFr: 'Forage 1',
              type: 'borehole',
              depth: 45,
              status: 'operational',
            },
            geometry: {
              type: 'Point',
              coordinates: [-13.2, 15.5],
            },
          },
          {
            type: 'Feature',
            properties: {
              name: 'Well 2',
              nameFr: 'Puits 2',
              type: 'well',
              depth: 18,
              status: 'needs_repair',
            },
            geometry: {
              type: 'Point',
              coordinates: [-15.0, 13.5],
            },
          },
        ],
      },
      minLat: 13.5,
      maxLat: 15.5,
      minLng: -15.0,
      maxLng: -13.2,
      collectionId: hydrographyCollection.id,
      createdById: adminUser.id,
      isVisible: true,
      isDefault: false,
      legend: {
        create: {
          title: 'Water Point Status',
          titleFr: 'Statut des Points d\'Eau',
          legendType: 'categorized',
          items: [
            { value: 'operational', label: 'Operational', labelFr: 'Opérationnel', color: '#00cc00' },
            { value: 'needs_repair', label: 'Needs Repair', labelFr: 'Nécessite réparation', color: '#ff9900' },
            { value: 'abandoned', label: 'Abandoned', labelFr: 'Abandonné', color: '#cc0000' },
          ],
        },
      },
    },
  });

  // Couche 4 : Zones de profondeur de l'aquifère
  const aquiferDepthLayer = await prisma.mapLayer.create({
    data: {
      name: 'Aquifer Depth Zones',
      nameFr: 'Zones de Profondeur de l\'Aquifère',
      description: 'Groundwater depth classification',
      descriptionFr: 'Classification de la profondeur de la nappe',
      slug: 'aquifer-depth',
      geometryType: 'POLYGON',
      category: 'HYDROGRAPHY',
      color: '#0066cc',
      fillColor: '#0066cc',
      opacity: 0.7,
      weight: 1,
      fillOpacity: 0.4,
      renderStyle: 'GRADUATED',
      geoData: {
        type: 'FeatureCollection',
        features: [
          {
            type: 'Feature',
            properties: {
              depth_range: '0-10',
              depth_min: 0,
              depth_max: 10,
            },
            geometry: {
              type: 'Polygon',
              coordinates: [[
                [-14.0, 14.0], [-13.5, 14.0], [-13.5, 14.5],
                [-14.0, 14.5], [-14.0, 14.0]
              ]],
            },
          },
          {
            type: 'Feature',
            properties: {
              depth_range: '10-30',
              depth_min: 10,
              depth_max: 30,
            },
            geometry: {
              type: 'Polygon',
              coordinates: [[
                [-13.5, 14.0], [-13.0, 14.0], [-13.0, 14.5],
                [-13.5, 14.5], [-13.5, 14.0]
              ]],
            },
          },
        ],
      },
      minLat: 14.0,
      maxLat: 14.5,
      minLng: -14.0,
      maxLng: -13.0,
      collectionId: hydrographyCollection.id,
      createdById: adminUser.id,
      isVisible: false,
      isDefault: false,
      legend: {
        create: {
          title: 'Groundwater Depth (m)',
          titleFr: 'Profondeur de la nappe (m)',
          legendType: 'graduated',
          items: [
            { value: '0-10', label: '0-10m', color: '#0066cc', min: 0, max: 10 },
            { value: '10-30', label: '10-30m', color: '#3399ff', min: 10, max: 30 },
            { value: '30-50', label: '30-50m', color: '#66ccff', min: 30, max: 50 },
            { value: '50+', label: '50m+', color: '#99e6ff', min: 50, max: 1000 },
          ],
          position: 'bottomright',
        },
      },
    },
  });

  // Couche 5 : Villes principales
  const citiesLayer = await prisma.mapLayer.create({
    data: {
      name: 'Major Cities',
      nameFr: 'Villes Principales',
      description: 'Major urban centers in the SMAS region',
      descriptionFr: 'Principaux centres urbains de la région SMAS',
      slug: 'major-cities',
      geometryType: 'POINT',
      category: 'INFRASTRUCTURE',
      color: '#666666',
      opacity: 1.0,
      weight: 1,
      geoData: {
        type: 'FeatureCollection',
        features: [
          {
            type: 'Feature',
            properties: {
              name: 'Dakar',
              population: 1146053,
              capital: true,
            },
            geometry: {
              type: 'Point',
              coordinates: [-17.4467, 14.7167],
            },
          },
          {
            type: 'Feature',
            properties: {
              name: 'Saint-Louis',
              population: 258592,
              capital: false,
            },
            geometry: {
              type: 'Point',
              coordinates: [-16.4897, 16.0180],
            },
          },
          {
            type: 'Feature',
            properties: {
              name: 'Nouakchott',
              population: 958399,
              capital: true,
            },
            geometry: {
              type: 'Point',
              coordinates: [-15.9785, 18.0735],
            },
          },
        ],
      },
      minLat: 14.7167,
      maxLat: 18.0735,
      minLng: -17.4467,
      maxLng: -15.9785,
      collectionId: infrastructureCollection.id,
      createdById: adminUser.id,
      isVisible: true,
      isDefault: true,
      legend: {
        create: {
          title: 'City Type',
          titleFr: 'Type de Ville',
          legendType: 'categorized',
          items: [
            { value: 'capital', label: 'Capital', labelFr: 'Capitale', color: '#cc0000' },
            { value: 'city', label: 'City', labelFr: 'Ville', color: '#666666' },
          ],
        },
      },
    },
  });

  // Couche 6 : Zones protégées
  const protectedAreasLayer = await prisma.mapLayer.create({
    data: {
      name: 'Protected Areas',
      nameFr: 'Zones Protégées',
      description: 'Environmental protected areas and parks',
      descriptionFr: 'Zones environnementales protégées et parcs',
      slug: 'protected-areas',
      geometryType: 'POLYGON',
      category: 'ENVIRONMENT',
      color: '#009900',
      fillColor: '#009900',
      opacity: 0.6,
      weight: 2,
      fillOpacity: 0.2,
      geoData: {
        type: 'FeatureCollection',
        features: [
          {
            type: 'Feature',
            properties: {
              name: 'Djoudj National Bird Sanctuary',
              nameFr: 'Parc National des Oiseaux du Djoudj',
              type: 'national_park',
              area: 160,
            },
            geometry: {
              type: 'Polygon',
              coordinates: [[
                [-16.5, 16.2], [-16.3, 16.2], [-16.3, 16.4],
                [-16.5, 16.4], [-16.5, 16.2]
              ]],
            },
          },
        ],
      },
      minLat: 16.2,
      maxLat: 16.4,
      minLng: -16.5,
      maxLng: -16.3,
      collectionId: environmentCollection.id,
      createdById: adminUser.id,
      isVisible: false,
      isDefault: false,
    },
  });

  console.log('✅ Layers created');

  // 3. Créer des configurations de carte
  await prisma.mapConfig.create({
    data: {
      key: 'default_center',
      value: {
        lat: 15.5,
        lng: -14.5,
      },
      description: 'Default map center coordinates',
      descriptionFr: 'Coordonnées du centre par défaut de la carte',
    },
  });

  await prisma.mapConfig.create({
    data: {
      key: 'default_zoom',
      value: { zoom: 6 },
      description: 'Default zoom level',
      descriptionFr: 'Niveau de zoom par défaut',
    },
  });

  await prisma.mapConfig.create({
    data: {
      key: 'basemap_options',
      value: {
        osm: {
          name: 'OpenStreetMap',
          url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
          attribution: '&copy; OpenStreetMap contributors',
        },
        satellite: {
          name: 'Satellite',
          url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
          attribution: 'Esri',
        },
      },
      description: 'Available basemap layers',
      descriptionFr: 'Fonds de carte disponibles',
    },
  });

  console.log('✅ Map configurations created');

  console.log(`
╔═══════════════════════════════════════════╗
║   🌍 Map data seeding completed!        ║
║                                           ║
║   Created:                                ║
║   • 4 Collections                         ║
║   • 6 Layers (with legends)               ║
║   • 3 Map configurations                  ║
║                                           ║
║   You can now view the map at:            ║
║   http://localhost:3000/map               ║
╚═══════════════════════════════════════════╝
  `);
}

main()
  .catch((e) => {
    console.error('❌ Error seeding map data:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
