import React, { useState, useEffect, useRef } from 'react';
import Markdown from 'react-markdown';
import { GoogleGenAI, Type } from "@google/genai";
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  ReferenceLine 
} from 'recharts';
import { 
  Menu, 
  X, 
  Search, 
  ChevronRight, 
  Map as MapIcon, 
  Layers, 
  Navigation, 
  Globe, 
  Code, 
  BookOpen, 
  Github, 
  ExternalLink,
  Smartphone,
  Monitor,
  Database,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  Zap,
  Shield,
  ShieldCheck,
  Heart,
  Eye,
  Wand2,
  Info,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  ChevronLeft,
  Wind,
  Loader2,
  MapPin,
  Settings,
  History,
  MessageSquare,
  Box,
  Camera,
  Plus,
  Home,
  Folder,
  Cloud,
  BarChart3,
  List,
  FileText,
  PlayCircle,
  Video,
  Compass,
  Code2,
  Rocket,
  DollarSign,
  Share2,
  CloudOff,
  Edit2,
  TrendingUp,
  Info as InfoIcon,
  Truck,
  Sun,
  CloudRain,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Mindmap } from './components/Mindmap';

// --- Types & Constants ---

interface Recommendation {
  product: string;
  service: string;
  pricing?: string;
  documentation: string;
  icon: React.ReactNode;
  isAi?: boolean;
  docsTabId?: string;
}

const DOCS_SECTIONS = [
  { id: 'overview', title: 'Overview', icon: <Info className="w-4 h-4" /> },
  {
    id: 'get-started',
    title: 'Get Started',
    icon: <Rocket className="w-4 h-4" />,
    items: [
      { id: 'gs-platform', title: 'Get Started with Google Maps Platform' },
      { id: 'gs-capabilities', title: 'Capabilities Explorer' },
      { id: 'gs-security', title: 'Security & Compliance' },
      { id: 'gs-reporting', title: 'Reporting & Monitoring' },
      { id: 'gs-faq', title: 'FAQ' },
      { id: 'gs-support', title: 'Support and Resources' },
      { id: 'gs-customer', title: 'Customer Care' },
      { id: 'gs-incident', title: 'Incident Management' },
    ]
  },
  {
    id: 'maps',
    title: 'Maps',
    icon: <MapIcon className="w-4 h-4" />,
    items: [
      { id: 'maps-js', title: 'Maps JavaScript API' },
      { id: 'maps-android', title: 'Maps SDK for Android' },
      { id: 'maps-ios', title: 'Maps SDK for iOS' },
      { id: 'maps-flutter', title: 'Google Maps for Flutter' },
      { id: 'maps-embed', title: 'Maps Embed API' },
      { id: 'maps-static', title: 'Maps Static API' },
      { id: 'maps-sv-insights', title: 'Street View Insights' },
      { id: 'maps-sv-static', title: 'Street View Static API' },
      { id: 'maps-urls', title: 'Maps URLs' },
      { id: 'maps-aerial', title: 'Aerial View API', description: "Lets you create and display aerial view videos rendered using Google's 3D geospatial imagery. Aerial view videos are photorealistic 3D aerial views of a point of interest that simulates video taken by a drone circling overhead." },
      { id: 'maps-elevation', title: 'Elevation API' },
      { id: 'maps-tiles', title: 'Map Tiles API' },
      { id: 'maps-datasets', title: 'Maps Datasets API' },
      { id: 'maps-web-components', title: 'Web Components' },
    ]
  },
  {
    id: 'routes',
    title: 'Routes',
    icon: <Navigation className="w-4 h-4" />,
    items: [
      { id: 'routes-api', title: 'Routes API' },
      { id: 'routes-android', title: 'Navigation SDK for Android' },
      { id: 'routes-ios', title: 'Navigation SDK for iOS' },
      { id: 'routes-flutter', title: 'Navigation for Flutter' },
      { id: 'routes-react-native', title: 'Navigation for React Native' },
      { id: 'routes-roads', title: 'Roads API' },
      { id: 'routes-optimization', title: 'Route Optimization API' },
    ]
  },
  {
    id: 'analytics',
    title: 'Analytics',
    icon: <BarChart3 className="w-4 h-4" />,
    items: [
      { id: 'analytics-earth', title: 'Google Earth' },
      { id: 'analytics-places', title: 'Places Insights' },
      { id: 'analytics-imagery', title: 'Imagery Insights' },
      { id: 'analytics-roads', title: 'Roads Management Insights' },
    ]
  },
  {
    id: 'places',
    title: 'Places',
    icon: <MapPin className="w-4 h-4" />,
    items: [
      { 
        id: 'places-api-main', 
        title: 'Places API',
        children: [
          { id: 'places-overview', title: 'Overview' },
          { id: 'places-ids', title: 'Place IDs' },
          { id: 'places-icons', title: 'Place Icons' },
          { 
            id: 'places-setup-group', 
            title: 'Setup',
            children: [
              { id: 'places-setup-api', title: 'Set up the Places API' },
            ]
          },
          { 
            id: 'places-api-new-group', 
            title: 'Places API (New)',
            children: [
              { 
                id: 'places-new-use', 
                title: 'Use the Places API (New)',
                children: [
                  { id: 'places-new-use-overview', title: 'Overview' },
                  { id: 'places-new-use-nearby', title: 'Nearby Search (New)' },
                  { id: 'places-new-use-text', title: 'Text Search (New)' },
                  { id: 'places-new-use-details', title: 'Place Details (New)' },
                  { id: 'places-new-use-photos', title: 'Place Photos (New)' },
                  { id: 'places-new-use-autocomplete', title: 'Autocomplete (New)' },
                ]
              },
              { 
                id: 'places-new-data', 
                title: 'Work with place data (New)',
                children: [
                  { id: 'places-new-data-types', title: 'Place Types (New)' },
                  { id: 'places-new-data-fields', title: 'Place Data Fields (New)' },
                  { id: 'places-new-data-choose', title: 'Choose fields to return' },
                ]
              },
              { 
                id: 'places-new-tokens', 
                title: 'Use session tokens',
                children: [
                  { id: 'places-new-tokens-about', title: 'About session tokens' },
                  { id: 'places-new-tokens-using', title: 'Using session tokens' },
                  { id: 'places-new-tokens-pricing', title: 'Autocomplete (New) and session pricing' },
                ]
              },
              { 
                id: 'places-new-route', 
                title: 'Search along route',
                children: [
                  { id: 'places-new-route-overview', title: 'Overview' },
                  { id: 'places-new-route-search', title: 'Search along route' },
                  { id: 'places-new-route-calc', title: 'Calculate routing summary' },
                  { id: 'places-new-route-combine', title: 'Combine routing summary with search along route' },
                ]
              },
              { 
                id: 'places-new-summaries', 
                title: 'AI-powered summaries', 
                isAi: true,
                children: [
                  { id: 'places-new-summaries-place', title: 'Place summaries' },
                  { id: 'places-new-summaries-review', title: 'Review summaries' },
                  { id: 'places-new-summaries-area', title: 'Area summaries' },
                ]
              },
              { id: 'places-new-link', title: 'Link to Google Maps' },
              { id: 'places-new-report', title: 'Report inappropriate content' },
              { 
                id: 'places-new-libs', 
                title: 'Client libraries',
                children: [
                  { id: 'places-new-libs-get-started', title: 'Get started with client libraries' },
                  { id: 'places-new-libs-examples', title: 'Client library examples' },
                ]
              },
            ]
          },
        ]
      },
      { id: 'places-sep-3', isSeparator: true },
      { id: 'places-library', title: 'Places Library, Maps JavaScript API' },
      { id: 'places-android', title: 'Places SDK for Android' },
      { id: 'places-ios', title: 'Places SDK for iOS' },
      { id: 'places-geocoding', title: 'Geocoding' },
      { id: 'places-geolocation', title: 'Geolocation API' },
      { id: 'places-address', title: 'Address Validation API' },
      { id: 'places-timezone', title: 'Time Zone API' },
      { id: 'places-aggregate', title: 'Places Aggregate API' },
    ]
  },
  {
    id: 'environment',
    title: 'Environment',
    icon: <Wind className="w-4 h-4" />,
    items: [
      { id: 'env-air', title: 'Air Quality API' },
      { id: 'env-pollen', title: 'Pollen API' },
      { id: 'env-solar', title: 'Solar API' },
      { id: 'env-weather', title: 'Weather API' },
    ]
  },
  {
    id: 'ai-tools',
    title: 'AI & Tools',
    icon: <Sparkles className="w-4 h-4" />,
    items: [
      { id: 'ai-overview', title: 'Generative AI Overview', isAi: true },
      { id: 'ai-maker-concierge', title: 'Maker Concierge', isAi: true },
      { id: 'ai-remix-studio', title: 'Remix Studio', isAi: true },
      { id: 'ai-summaries', title: 'AI-powered summaries', isAi: true },
      { id: 'ai-grounding', title: 'Grounding with Google Maps', isAi: true },
    ]
  },
  {
    id: 'solutions',
    title: 'Solutions',
    icon: <Zap className="w-4 h-4" />,
    items: [
      { id: 'sol-builder', title: 'Maps Builder agent' },
      { id: 'sol-industry', title: 'Industry solutions' },
      { id: 'sol-mobility', title: 'Mobility services' },
    ]
  },
  {
    id: 'additional',
    title: 'Additional Resources',
    icon: <BookOpen className="w-4 h-4" />,
    items: [
      { id: 'res-security', title: 'API Security Best Practices' },
      { id: 'res-signature', title: 'Digital Signature Guide' },
      { id: 'res-coverage', title: 'Map Coverage Details' },
      { id: 'res-optimization', title: 'Optimization Guide' },
      { id: 'res-support', title: 'Mobile OS and software support' },
      { id: 'res-launch', title: 'Launch stages' },
      { id: 'res-legacy', title: 'Legacy products' },
      { id: 'res-deprecations', title: 'Deprecations' },
      { id: 'res-encoding', title: 'URL Encoding' },
      { id: 'res-wordpress', title: 'WordPress Users' },
    ]
  }
];

const PRODUCT_ONTOLOGY: Record<string, Recommendation> = {
  '3d maps': {
    product: "3D Maps",
    service: "Maps SDK",
    pricing: "0.00 (Experimental/Preview)",
    documentation: "https://developers.google.com/maps/documentation/gaming/overview",
    icon: <Box className="w-6 h-6" />
  },
  'aerial view': {
    product: "Aerial View",
    service: "Aerial View API",
    pricing: "0.00 (Preview)",
    documentation: "https://developers.google.com/maps/documentation/aerial-view/overview",
    icon: <Video className="w-6 h-6" />,
    docsTabId: 'maps-sv-static'
  },
  'maps sdks': {
    product: "Maps SDKs",
    service: "Maps JavaScript API / Mobile SDKs",
    pricing: "Free Usage Cap: 28,500 | Cap - 100,000: 7.00 | 100,001+: 5.60",
    documentation: "https://developers.google.com/maps/documentation/javascript/overview",
    icon: <MapIcon className="w-6 h-6" />,
    docsTabId: 'maps-js'
  },
  'static maps': {
    product: "Static Maps",
    service: "Maps Static API",
    pricing: "Free Usage Cap: 100,000 | Cap - 100,000: 2.00 | 100,001+: 1.60",
    documentation: "https://developers.google.com/maps/documentation/maps-static/overview",
    icon: <MapIcon className="w-6 h-6" />,
    docsTabId: 'maps-static'
  },
  'street view': {
    product: "Street View",
    service: "Street View Static API",
    pricing: "Free Usage Cap: 28,500 | Cap - 100,000: 7.00 | 100,001+: 5.60",
    documentation: "https://developers.google.com/maps/documentation/streetview/overview",
    icon: <Camera className="w-6 h-6" />
  },
  'dynamic street view': {
    product: "Dynamic Street View",
    service: "Street View Service",
    pricing: "Free Usage Cap: 14,000 | Cap - 100,000: 14.00 | 100,001+: 11.20",
    documentation: "https://developers.google.com/maps/documentation/javascript/streetview",
    icon: <Camera className="w-6 h-6" />
  },
  'maps tiles': {
    product: "Maps Tiles",
    service: "Map Tiles API",
    pricing: "Free Usage Cap: 28,500 | Cap - 100,000: 7.00 | 100,001+: 5.60",
    documentation: "https://developers.google.com/maps/documentation/tile/overview",
    icon: <Layers className="w-6 h-6" />
  },
  'google earth': {
    product: "Google Earth",
    service: "Integrated Product",
    pricing: "Free / Enterprise Pricing",
    documentation: "https://earth.google.com",
    icon: <Globe className="w-6 h-6" />
  },
  'contextual view': {
    product: "Contextual View",
    service: "Maps AI Kit",
    pricing: "Contact Sales",
    documentation: "https://developers.google.com/maps/documentation/maps-ai-kit",
    icon: <Sparkles className="w-6 h-6" />
  },
  'maps datasets api': {
    product: "Maps Datasets API",
    service: "Data Management",
    pricing: "0.00 (Storage limits apply)",
    documentation: "https://developers.google.com/maps/documentation/datasets/overview",
    icon: <Database className="w-6 h-6" />,
    docsTabId: 'maps-datasets'
  },
  'navigation sdks': {
    product: "Navigation SDKs",
    service: "Navigation SDK",
    pricing: "Contact Sales (Per-trip or Per-user)",
    documentation: "https://developers.google.com/maps/documentation/navigation/overview",
    icon: <Navigation className="w-6 h-6" />
  },
  'roads api': {
    product: "Roads API",
    service: "Routes API",
    pricing: "Free Usage Cap: 20,000 | Cap - 100,000: 10.00 | 100,001+: 8.00",
    documentation: "https://developers.google.com/maps/documentation/roads/overview",
    icon: <Navigation className="w-6 h-6" />,
    docsTabId: 'routes-roads'
  },
  'routes api': {
    product: "Routes API",
    service: "Routes API",
    pricing: "Free Usage Cap: 40,000 | Cap - 100,000: 5.00 | 100,001+: 4.00",
    documentation: "https://developers.google.com/maps/documentation/routes/overview",
    icon: <Navigation className="w-6 h-6" />,
    docsTabId: 'routes-api'
  },
  'directions api': {
    product: "Routes API",
    service: "Routes API",
    pricing: "Free Usage Cap: 40,000 | Cap - 100,000: 5.00 | 100,001+: 4.00",
    documentation: "https://developers.google.com/maps/documentation/directions/overview",
    icon: <Navigation className="w-6 h-6" />,
    docsTabId: 'routes-api'
  },
  'distance matrix api': {
    product: "Distance Matrix API",
    service: "Routes API",
    pricing: "Free Usage Cap: 40,000 | Cap - 100,000: 5.00 | 100,001+: 4.00",
    documentation: "https://developers.google.com/maps/documentation/distance-matrix/overview",
    icon: <Navigation className="w-6 h-6" />,
    docsTabId: 'routes-api'
  },
  'route optimization': {
    product: "Route Optimization",
    service: "Route Optimization API",
    pricing: "Free Usage Cap: 400 | Cap - 100,000: 0.50 | 100,001+: 0.40",
    documentation: "https://developers.google.com/maps/documentation/route-optimization/overview",
    icon: <TrendingUp className="w-6 h-6" />
  },
  'mobility services': {
    product: "Mobility Services",
    service: "Fleet Engine",
    pricing: "Contact Sales",
    documentation: "https://developers.google.com/maps/documentation/mobility/overview",
    icon: <Truck className="w-6 h-6" />
  },
  'grounding lite': {
    product: "Grounding Lite",
    service: "AI + Interfaces",
    pricing: "Contact Sales",
    documentation: "https://developers.google.com/maps/documentation/grounding",
    icon: <Sparkles className="w-6 h-6" />,
    isAi: true
  },
  'address validation': {
    product: "Address Validation",
    service: "Address Validation API",
    pricing: "Free Usage Cap: 0 | Cap - 100,000: 10.00 | 100,001+: 8.00",
    documentation: "https://developers.google.com/maps/documentation/address-validation/overview",
    icon: <CheckCircle2 className="w-6 h-6" />,
    docsTabId: 'places-address'
  },
  'geocoding': {
    product: "Geocoding API",
    service: "Geocoding API",
    pricing: "Free Usage Cap: 40,000 | Cap - 100,000: 5.00 | 100,001+: 4.00",
    documentation: "https://developers.google.com/maps/documentation/geocoding/overview",
    icon: <MapPin className="w-6 h-6" />,
    docsTabId: 'places-geocoding'
  },
  'geolocation': {
    product: "Geolocation API",
    service: "Geolocation API",
    pricing: "Free Usage Cap: 40,000 | Cap - 100,000: 5.00 | 100,001+: 4.00",
    documentation: "https://developers.google.com/maps/documentation/geolocation/overview",
    icon: <MapPin className="w-6 h-6" />,
    docsTabId: 'places-geolocation'
  },
  'places api': {
    product: "Places API",
    service: "Places API",
    pricing: "Free Usage Cap: 11,000 | Cap - 100,000: 17.00 | 100,001+: 13.60",
    documentation: "https://developers.google.com/maps/documentation/javascript/places",
    icon: <Search className="w-6 h-6" />,
    docsTabId: 'places-overview'
  },
  'places autocomplete': {
    product: "Places Autocomplete",
    service: "Places API",
    pricing: "Free Usage Cap: 70,000 | Cap - 100,000: 2.83 | 100,001+: 2.27",
    documentation: "https://developers.google.com/maps/documentation/javascript/places#place_autocomplete",
    icon: <Search className="w-6 h-6" />
  },
  'place details': {
    product: "Place Details",
    service: "Places API",
    pricing: "Free Usage Cap: 11,000 | Cap - 100,000: 17.00 | 100,001+: 13.60",
    documentation: "https://developers.google.com/maps/documentation/javascript/places#place_details",
    icon: <Search className="w-6 h-6" />
  },
  'places text search': {
    product: "Text Search",
    service: "Places API",
    pricing: "Free Usage Cap: 6,250 | Cap - 100,000: 32.00 | 100,001+: 25.60",
    documentation: "https://developers.google.com/maps/documentation/javascript/places#TextSearchRequests",
    icon: <Search className="w-6 h-6" />
  },
  'places photos': {
    product: "Places Photos",
    service: "Places API",
    pricing: "Free Usage Cap: 28,500 | Cap - 100,000: 7.00 | 100,001+: 5.60",
    documentation: "https://developers.google.com/maps/documentation/javascript/places#place_photos",
    icon: <Camera className="w-6 h-6" />
  },
  'analytics': {
    product: "Analytics",
    service: "Reporting & Monitoring",
    pricing: "Free with GMP usage",
    documentation: "https://developers.google.com/maps/reporting-and-monitoring/overview",
    icon: <BarChart3 className="w-6 h-6" />
  },
  'ai tools': {
    product: "AI & Tools",
    service: "Maker Concierge",
    pricing: "Free during Preview",
    documentation: "https://developers.google.com/maps/documentation/maker-concierge",
    icon: <Sparkles className="w-6 h-6" />,
    isAi: true
  },
  'places ui kit': {
    product: "Places UI Kit",
    service: "UI Components",
    documentation: "https://developers.google.com/maps/documentation/javascript/places",
    icon: <Smartphone className="w-6 h-6" />
  },
  'air quality api': {
    product: "Air Quality API",
    service: "Environment APIs",
    pricing: "Free Usage Cap: 40,000 | Cap - 100,000: 5.00 | 100,001+: 4.00",
    documentation: "https://developers.google.com/maps/documentation/air-quality/overview",
    icon: <Cloud className="w-6 h-6" />,
    isAi: true,
    docsTabId: 'env-air'
  },
  'pollen api': {
    product: "Pollen API",
    service: "Environment APIs",
    pricing: "Free Usage Cap: 40,000 | Cap - 100,000: 5.00 | 100,001+: 4.00",
    documentation: "https://developers.google.com/maps/documentation/pollen/overview",
    icon: <Cloud className="w-6 h-6" />,
    isAi: true,
    docsTabId: 'env-pollen'
  },
  'solar api': {
    product: "Solar API",
    service: "Environment APIs",
    pricing: "Free Usage Cap: 40,000 | Cap - 100,000: 5.00 | 100,001+: 4.00",
    documentation: "https://developers.google.com/maps/documentation/solar/overview",
    icon: <Sun className="w-6 h-6" />,
    isAi: true,
    docsTabId: 'env-solar'
  },
  'weather api': {
    product: "Weather API",
    service: "Environment APIs",
    pricing: "Free Usage Cap: 40,000 | Cap - 100,000: 5.00 | 100,001+: 4.00",
    documentation: "https://developers.google.com/maps/documentation/weather/overview",
    icon: <CloudRain className="w-6 h-6" />,
    isAi: true,
    docsTabId: 'env-weather'
  },
  'earth engine': {
    product: "Earth Engine",
    service: "Integrated Product",
    pricing: "Free for Research / Enterprise Pricing",
    documentation: "https://earthengine.google.com",
    icon: <Globe className="w-6 h-6" />
  },
  'places aggregate': {
    product: "Places Aggregate",
    service: "Area Insights API",
    documentation: "https://developers.google.com/maps/documentation/area-insights/overview",
    icon: <BarChart3 className="w-6 h-6" />
  },
  'places insights': {
    product: "Places Insights",
    service: "Data Insights",
    documentation: "https://developers.google.com/maps/documentation/javascript/places",
    icon: <BarChart3 className="w-6 h-6" />
  },
  'roads management insights': {
    product: "Roads Management Insights",
    service: "Data Insights",
    pricing: "Contact Sales",
    documentation: "https://developers.google.com/maps/documentation/roads/insights",
    icon: <Navigation className="w-6 h-6" />
  },
  'streetview insights': {
    product: "Streetview Insights",
    service: "Data Insights",
    pricing: "Contact Sales",
    documentation: "https://developers.google.com/maps/documentation/streetview/insights",
    icon: <Camera className="w-6 h-6" />
  },
  'grounding with google maps in vertex ai': {
    product: "Grounding with Google Maps",
    service: "Vertex AI Integration",
    pricing: "Vertex AI Pricing applies",
    documentation: "https://cloud.google.com/vertex-ai/docs/generative-ai/grounding/overview",
    icon: <Sparkles className="w-6 h-6" />,
    isAi: true
  }
};

const SOLUTION_TEMPLATES: Record<string, string[]> = {
  'checkout': ['autocomplete', 'address validation'],
  'locator': ['maps sdk', 'nearby search', 'distance matrix'],
  'real estate': ['maps sdk', 'place details', 'air quality'],
  'delivery': ['directions', 'distance matrix', 'address validation'],
  'tracking': ['maps sdk', 'directions']
};

const assembleSolution = (message: string): { recommendations: Recommendation[], title: string } => {
  const msg = message.toLowerCase();
  let selectedProducts: string[] = [];
  let title = "Custom Solution";

  // Check for specific solution keywords
  if (msg.includes('checkout') || msg.includes('cart') || msg.includes('payment')) {
    selectedProducts = SOLUTION_TEMPLATES['checkout'];
    title = "Checkout Optimization";
  } else if (msg.includes('locator') || msg.includes('find') || msg.includes('store') || msg.includes('branch')) {
    selectedProducts = SOLUTION_TEMPLATES['locator'];
    title = "Store Locator Solution";
  } else if (msg.includes('real estate') || msg.includes('house') || msg.includes('home') || msg.includes('property')) {
    selectedProducts = SOLUTION_TEMPLATES['real estate'];
    title = "Real Estate Platform";
  } else if (msg.includes('delivery') || msg.includes('logistics') || msg.includes('shipping') || msg.includes('courier')) {
    selectedProducts = SOLUTION_TEMPLATES['delivery'];
    title = "Delivery & Logistics";
  } else if (msg.includes('tracking') || msg.includes('where') || msg.includes('fleet') || msg.includes('asset')) {
    selectedProducts = SOLUTION_TEMPLATES['tracking'];
    title = "Asset Tracking";
  } else {
    // Fallback: check for individual product keywords
    if (msg.includes('autocomplete') || msg.includes('typeahead')) selectedProducts.push('autocomplete');
    if (msg.includes('validate') || msg.includes('verify') || msg.includes('address')) selectedProducts.push('address validation');
    if (msg.includes('directions') || msg.includes('route') || msg.includes('navigation')) selectedProducts.push('directions');
    if (msg.includes('distance') || msg.includes('matrix') || msg.includes('travel time')) selectedProducts.push('distance matrix');
    if (msg.includes('map') || msg.includes('visualize') || msg.includes('display')) selectedProducts.push('maps sdk');
    if (msg.includes('nearby') || msg.includes('search') || msg.includes('around')) selectedProducts.push('nearby search');
    if (msg.includes('details') || msg.includes('info') || msg.includes('place')) selectedProducts.push('place details');
    if (msg.includes('air') || msg.includes('quality') || msg.includes('pollution')) selectedProducts.push('air quality');
    
    if (selectedProducts.length > 0) {
      title = selectedProducts.map(id => PRODUCT_ONTOLOGY[id].product).join(' & ');
    }
  }

  // If still empty, provide a default
  if (selectedProducts.length === 0) {
    selectedProducts = ['autocomplete'];
    title = "Maps Integration";
  }

  // Deduplicate and map to ontology
  return {
    recommendations: Array.from(new Set(selectedProducts)).map(id => PRODUCT_ONTOLOGY[id]),
    title
  };
};

type ViewState = 
  | 'level1' 
  | 'level2-places' | 'level2-places-api' | 'level2-places-uikit' | 'level2-address' | 'level2-geocoding'
  | 'level2-maps' | 'level2-routes' | 'level2-environment' | 'level2-analytics' | 'level2-ai' | 'level2-datasets'
  | 'autocomplete' | 'nearby' | 'details' | 'text-search' | 'photos'
  | 'validate-address'
  | 'geocode' | 'reverse-geocode'
  | 'dynamic-maps' | 'static-maps' | 'street-view'
  | 'directions' | 'distance-matrix' | 'roads'
  | 'air-quality' | 'pollen' | 'solar'
  | 'usage-reports' | 'billing-insights'
  | 'maker-concierge' | 'remix-studio'
  | 'project-details'
  | 'remixing'
  | 'editor'
  | 'docs'
  | 'solution-guide'
  | 'mindmap'
  | 'cost';

const NAV_LINKS = [
  { name: 'Mindmap', icon: <Compass className="w-4 h-4 text-google-blue" />, id: 'mindmap' },
];

const VIEW_TITLES: Record<string, string> = {
  'level1': 'Products',
  'level2-places': 'Places',
  'level2-places-api': 'Places API',
  'level2-places-uikit': 'Places UI Kit',
  'level2-address': 'Address Validation',
  'level2-geocoding': 'Geocoding',
  'level2-maps': 'Maps',
  'level2-routes': 'Routes',
  'level2-environment': 'Environment',
  'level2-analytics': 'Analytics',
  'level2-ai': 'AI & Tools',
  'level2-datasets': 'Datasets',
  'autocomplete': 'Autocomplete',
  'nearby': 'Nearby Search',
  'details': 'Place Details',
  'text-search': 'Text Search',
  'photos': 'Photos',
  'validate-address': 'Address Validation API',
  'geocode': 'Geocoding API',
  'reverse-geocode': 'Reverse Geocoding API',
  'dynamic-maps': 'Dynamic Maps',
  'static-maps': 'Static Maps',
  'street-view': 'Street View',
  'directions': 'Routes API',
  'distance-matrix': 'Distance Matrix',
  'roads': 'Roads API',
  'air-quality': 'Air Quality',
  'pollen': 'Pollen',
  'solar': 'Solar',
  'usage-reports': 'Usage Reports',
  'billing-insights': 'Billing Insights',
  'maker-concierge': 'Maker Concierge',
  'remix-studio': 'Remix Studio',
  'project-details': 'Project Details',
  'remixing': 'Remixing',
  'editor': 'Editor',
  'docs': 'Documentation',
  'solution-guide': 'Solution Guide',
  'mindmap': 'Mindmap',
  'cost': 'Pricing'
};

const getBreadcrumbPath = (view: ViewState, includeCurrent: boolean = false): { title: string, view: ViewState }[] => {
  const path: { title: string, view: ViewState }[] = [];
  const v = view as string;

  if (v === 'level1') return includeCurrent ? [{ title: 'Products', view: 'level1' }] : [];

  // Root
  path.push({ title: 'Products', view: 'level1' });

  // Level 2 Categories (Root children)
  if (v === 'level2-places' || v === 'level2-maps' || v === 'level2-routes' || v === 'level2-environment' || v === 'level2-analytics' || v === 'level2-ai' || v === 'level2-datasets') {
    if (includeCurrent) path.push({ title: VIEW_TITLES[view], view });
    return path;
  }

  // Level 2 Services (Sub-categories)
  if (v === 'level2-places-api' || v === 'level2-address' || v === 'level2-places-uikit' || v === 'level2-geocoding') {
    path.push({ title: 'Places', view: 'level2-places' });
    if (includeCurrent) path.push({ title: VIEW_TITLES[view], view });
    return path;
  }

  if (v === 'level2-datasets') {
    path.push({ title: 'Maps', view: 'level2-maps' });
    if (includeCurrent) path.push({ title: VIEW_TITLES[view], view });
    return path;
  }

  // Level 3 Features
  switch (view) {
    case 'autocomplete':
    case 'nearby':
    case 'details':
    case 'text-search':
    case 'photos':
      path.push({ title: 'Places', view: 'level2-places' });
      path.push({ title: 'Places API', view: 'level2-places-api' });
      break;
    case 'validate-address':
      path.push({ title: 'Places', view: 'level2-places' });
      path.push({ title: 'Address Validation', view: 'level2-address' });
      break;
    case 'geocode':
    case 'reverse-geocode':
      path.push({ title: 'Places', view: 'level2-places' });
      path.push({ title: 'Geocoding', view: 'level2-geocoding' });
      break;
    case 'dynamic-maps':
    case 'static-maps':
    case 'street-view':
      path.push({ title: 'Maps', view: 'level2-maps' });
      break;
    case 'directions':
    case 'distance-matrix':
    case 'roads':
      path.push({ title: 'Routes', view: 'level2-routes' });
      break;
    case 'air-quality':
    case 'pollen':
    case 'solar':
      path.push({ title: 'Environment', view: 'level2-environment' });
      break;
    case 'usage-reports':
    case 'billing-insights':
      path.push({ title: 'Analytics', view: 'level2-analytics' });
      break;
    case 'maker-concierge':
    case 'remix-studio':
      path.push({ title: 'AI & Tools', view: 'level2-ai' });
      break;
  }

  if (includeCurrent) {
    path.push({ title: VIEW_TITLES[view], view });
  }

  return path;
};

const ServiceBreadcrumb = ({ path, currentTitle, setView }: { path: { title: string, view: ViewState }[], currentTitle: string, setView: (v: ViewState, t?: string) => void }) => (
  <div className="flex items-center gap-2 text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-8">
    {path.map((segment, idx) => (
      <React.Fragment key={idx}>
        <button 
          onClick={() => setView(segment.view)} 
          className="hover:text-blue-600 transition-colors"
        >
          {segment.title}
        </button>
        <span className="text-gray-300 mx-1">/</span>
      </React.Fragment>
    ))}
    <span className="text-gray-900 font-bold">{currentTitle}</span>
  </div>
);

const GALLERY_PROJECTS = [
  {
    title: 'Fast E-commerce Flow',
    description: 'Checkout Preview',
    author: 'dev_ryan',
    likes: '3.4k',
    views: '8.1k',
    remixes: '812',
    image: 'https://picsum.photos/seed/checkout/400/250',
    tags: ['E-commerce', 'Autocomplete'],
    difficulty: 'Beginner'
  },
  {
    title: 'Coffee Shop Locator',
    description: 'Locator Preview',
    author: 'cofeeluvr',
    likes: '1.2k',
    views: '2.3k',
    remixes: '456',
    image: 'https://picsum.photos/seed/locator/400/250',
    tags: ['Retail', 'Nearby Search'],
    difficulty: 'Intermediate'
  },
  {
    title: 'Real Estate Dashboard',
    description: 'Property Search',
    author: 'prop_tech',
    likes: '2.8k',
    views: '5.4k',
    remixes: '320',
    image: 'https://picsum.photos/seed/realestate/400/250',
    tags: ['Real Estate', 'Geocoding'],
    difficulty: 'Advanced'
  },
  {
    title: 'Logistics Tracker',
    description: 'Fleet Management',
    author: 'logi_master',
    likes: '950',
    views: '1.8k',
    remixes: '124',
    image: 'https://picsum.photos/seed/logistics/400/250',
    tags: ['Logistics', 'Routes'],
    difficulty: 'Advanced'
  },
  {
    title: 'Travel Planner',
    description: 'Itinerary Builder',
    author: 'globetrotter',
    likes: '4.1k',
    views: '12.3k',
    remixes: '1.1k',
    image: 'https://picsum.photos/seed/travel/400/250',
    tags: ['Travel', 'Places Details'],
    difficulty: 'Intermediate'
  },
  {
    title: 'Local Biz Directory',
    description: 'Business Search',
    author: 'biz_finder',
    likes: '1.5k',
    views: '3.1k',
    remixes: '280',
    image: 'https://picsum.photos/seed/business/400/250',
    tags: ['Directory', 'Search'],
    difficulty: 'Beginner'
  },
  {
    title: 'Smart Parking App',
    description: 'Availability Map',
    author: 'city_dev',
    likes: '2.1k',
    views: '4.2k',
    remixes: '510',
    image: 'https://picsum.photos/seed/parking/400/250',
    tags: ['Smart City', 'Real-time'],
    difficulty: 'Advanced'
  },
  {
    title: 'Food Delivery UI',
    description: 'Order Tracking',
    author: 'foodie_coder',
    likes: '5.6k',
    views: '15.2k',
    remixes: '2.3k',
    image: 'https://picsum.photos/seed/food/400/250',
    tags: ['Delivery', 'Address Validation'],
    difficulty: 'Intermediate'
  },
  {
    title: 'Hiking Trail Finder',
    description: 'Nature Explorer',
    author: 'trail_blazer',
    likes: '1.8k',
    views: '3.9k',
    remixes: '420',
    image: 'https://picsum.photos/seed/hiking/400/250',
    tags: ['Outdoor', 'Elevation'],
    difficulty: 'Intermediate'
  }
];

const RECENT_PROJECTS = [
  {
    title: 'My Custom Map App',
    description: 'Last edited 2h ago',
    author: 'Anna',
    likes: '12',
    views: '45',
    remixes: '2',
    image: 'https://picsum.photos/seed/mymap/400/250',
    tags: ['Personal', 'Maps'],
    difficulty: 'Intermediate'
  },
  {
    title: 'Store Finder Prototype',
    description: 'Last edited 5h ago',
    author: 'Anna',
    likes: '8',
    views: '23',
    remixes: '1',
    image: 'https://picsum.photos/seed/storeproto/400/250',
    tags: ['Retail', 'Nearby'],
    difficulty: 'Beginner'
  },
  {
    title: 'Route Optimizer V2',
    description: 'Last edited 1d ago',
    author: 'Anna',
    likes: '34',
    views: '120',
    remixes: '5',
    image: 'https://picsum.photos/seed/routeopt/400/250',
    tags: ['Logistics', 'Routes'],
    difficulty: 'Advanced'
  }
];

const CAPABILITIES = [
  {
    id: 'maps',
    title: 'Maps',
    description: 'Help users explore the world with detailed, custom map products.',
    icon: <MapIcon className="w-6 h-6" />,
    products: ['3D Maps', 'Aerial View', 'Maps SDKs', 'Tiles', 'Google Earth', 'Contextual View', 'Maps Datasets API'],
    view: 'level2-maps',
    docsTabId: 'maps',
    image: 'https://picsum.photos/seed/maps-3d/800/450'
  },
  {
    id: 'routes',
    title: 'Routes',
    description: 'Help users find the best way to get from A to Z.',
    icon: <Navigation className="w-6 h-6" />,
    products: ['Navigation SDKs', 'Roads API', 'Routes API', 'Route Optimization', 'Mobility Services', 'Grounding Lite'],
    view: 'level2-routes',
    docsTabId: 'routes',
    image: 'https://picsum.photos/seed/maps-routes/800/450'
  },
  {
    id: 'places',
    title: 'Places',
    description: 'Help users discover the world with details for over 200 million places.',
    icon: <MapPin className="w-6 h-6" />,
    products: ['Address Validation', 'geocoding', 'Places API', 'Grounding Lite', 'Places UI Kit'],
    view: 'level2-places',
    docsTabId: 'places',
    image: 'https://picsum.photos/seed/maps-places/800/450'
  },
  {
    id: 'environment',
    title: 'Environment',
    description: 'Build for a sustainable future with environmental data.',
    icon: <Cloud className="w-6 h-6" />,
    products: ['Air Quality API', 'Pollen API', 'Solar API', 'Weather API', 'Earth Engine', 'Grounding Lite'],
    view: 'level2-environment',
    docsTabId: 'environment',
    image: 'https://picsum.photos/seed/maps-env/800/450'
  },
  {
    id: 'datasets',
    title: 'Datasets',
    description: 'Manage your custom location data and geospatial datasets.',
    icon: <Database className="w-6 h-6" />,
    products: ['Places Aggregate', 'Places Insights', 'Roads Management Insights', 'Streetview Insights', 'Grounding with Google Maps in Vertex AI'],
    view: 'level2-datasets',
    docsTabId: 'maps-datasets',
    image: 'https://picsum.photos/seed/maps-data/800/450'
  },
  {
    id: 'ai',
    title: 'AI & Tools',
    description: 'Harness the power of Generative AI to build smarter location-based apps.',
    icon: <Sparkles className="w-6 h-6" />,
    products: ['Grounding with Google Maps', 'Maker Concierge', 'AI Tools', 'Grounding Lite'],
    view: 'level2-ai' as ViewState,
    docsTabId: 'solutions',
    image: 'https://picsum.photos/seed/maps-ai/800/450'
  }
];

const HeroSection = () => {
  return (
    <section className="relative h-[500px] w-full overflow-hidden rounded-[32px] mb-12">
      <img 
        src="https://picsum.photos/seed/3d-driving-map/1920/1080" 
        alt="3D Driving Map background" 
        className="absolute inset-0 w-full h-full object-cover"
        referrerPolicy="no-referrer"
      />
      <div className="absolute inset-0 bg-black/25" />
      
      <div className="absolute top-1/2 left-8 lg:left-16 -translate-y-1/2 z-10">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white/95 backdrop-blur-md p-8 lg:p-12 rounded-[24px] shadow-2xl max-w-[520px] border border-white/20"
        >
          <div className="flex items-center gap-2 mb-4">
            <span className="text-[10px] font-bold text-google-blue uppercase tracking-widest bg-blue-50 px-2 py-1 rounded flex items-center gap-1">
              <Sparkles className="w-3 h-3" /> Generative AI
            </span>
            <span className="text-[10px] font-bold text-white uppercase tracking-widest bg-google-blue px-2 py-1 rounded">NEW</span>
          </div>
          <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4 leading-tight">AI-infused geospatial experiences</h1>
          <p className="text-gray-600 text-lg mb-8 leading-relaxed">
            Build powerful, context-aware applications with Google's latest AI solutions integrated directly into the Maps Platform.
          </p>
          <div className="flex flex-wrap gap-4">
            <button className="google-button-primary">Explore AI solutions</button>
            <button className="google-button-outline">View documentation</button>
          </div>
        </motion.div>
      </div>

      <div className="absolute bottom-8 right-8 z-10 flex items-center gap-2 bg-white/80 backdrop-blur-sm p-2 rounded-full shadow-lg">
        <button className="p-2 hover:bg-white rounded-full transition-colors">
          <Sparkles className="w-6 h-6 text-google-blue" />
        </button>
      </div>
    </section>
  );
};

const CategorySelector = ({ onNavigate }: { onNavigate: (id: ViewState) => void }) => {
  return (
    <section className="mb-20">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Find the right product for the job</h2>
        <p className="text-gray-600 max-w-2xl mx-auto">Discover Google APIs and SDKs to create geospatial experiences, and datasets and tools to access insights for your business.</p>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-6 gap-4 max-w-[1200px] mx-auto">
        {CAPABILITIES.map((cap) => (
          <motion.div
            key={cap.id}
            whileHover={{ y: -4 }}
            onClick={() => onNavigate(cap.view as ViewState)}
            className="bg-white border border-gray-100 rounded-2xl p-6 flex flex-col items-center text-center cursor-pointer hover:shadow-xl transition-all group"
          >
            <div className="mb-4 p-3 rounded-xl group-hover:bg-blue-50 transition-colors relative">
              {cap.icon}
              {cap.id === 'ai' && (
                <div className="absolute top-0 right-0">
                  <Sparkles className="w-3 h-3 text-purple-500 animate-pulse" />
                </div>
              )}
            </div>
            <span className="font-medium text-sm text-gray-900 mb-1">{cap.title}</span>
            <span className="text-[11px] text-google-blue font-medium opacity-0 group-hover:opacity-100 transition-opacity">See all</span>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

// --- Components ---
const PricingTable = ({ pricing }: { pricing: string }) => {
  if (!pricing) return null;
  
  const isTiered = pricing.includes('|');
  
  if (!isTiered) {
    return (
      <div className="inline-flex items-center gap-1.5 text-[10px] font-bold text-green-600 bg-green-50 px-2 py-1 rounded-md border border-green-100 w-fit">
        {pricing}
      </div>
    );
  }

  const tiers = pricing.split('|').map(t => t.trim());
  const parseTier = (tier: string) => {
    const parts = tier.split(':');
    return { label: parts[0]?.trim(), value: parts[1]?.trim() };
  };

  const t1 = parseTier(tiers[0] || '');
  const t2 = parseTier(tiers[1] || '');
  const t3 = parseTier(tiers[2] || '');

  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden w-full bg-white shadow-sm">
      <div className="bg-gray-50 px-3 py-1 border-b border-gray-200 text-[9px] font-bold text-gray-500 uppercase tracking-wider">
        Pricing
      </div>
      <div className="grid grid-cols-3 divide-x divide-gray-100">
        <div className="p-2 flex flex-col gap-0.5 min-w-0">
          <span className="text-[7px] text-gray-400 uppercase font-bold truncate">{t1.label}</span>
          <span className="text-[9px] font-bold text-gray-900 truncate">{t1.value}</span>
        </div>
        <div className="p-2 flex flex-col gap-0.5 min-w-0 border-l border-gray-100">
          <span className="text-[7px] text-gray-400 uppercase font-bold truncate">{t2.label}</span>
          <span className="text-[9px] font-bold text-gray-900 truncate">{t2.value}</span>
        </div>
        <div className="p-2 flex flex-col gap-0.5 min-w-0 border-l border-gray-100">
          <span className="text-[7px] text-gray-400 uppercase font-bold truncate">{t3.label}</span>
          <span className="text-[9px] font-bold text-gray-900 truncate">{t3.value}</span>
        </div>
      </div>
    </div>
  );
};

const Breadcrumbs = ({ view, setView, onNavigateToDocs }: { view: ViewState, setView: (v: ViewState, t?: string) => void, onNavigateToDocs?: (tab: string) => void }) => null;

const getDocsTabForView = (v: ViewState): string => {
  if (v.startsWith('level2-places') || ['autocomplete', 'nearby', 'details'].includes(v)) return 'places';
  if (v === 'level2-address' || v === 'validate-address') return 'address';
  if (v === 'level2-geocoding' || ['geocode', 'reverse-geocode'].includes(v)) return 'geocoding';
  if (v === 'level2-maps' || ['dynamic-maps', 'static-maps', 'street-view'].includes(v)) return 'maps';
  if (v === 'level2-routes' || ['directions', 'distance-matrix', 'roads'].includes(v)) return 'routes';
  if (v === 'level2-environment' || ['air-quality', 'pollen', 'solar'].includes(v)) return 'environment';
  if (v === 'level2-datasets') return 'datasets';
  if (v === 'level2-analytics' || ['usage-reports', 'billing-insights'].includes(v)) return 'analytics';
  if (v === 'level2-ai' || ['maker-concierge', 'remix-studio'].includes(v)) return 'ai';
  return 'overview';
};

const SearchModal = ({ isOpen, onClose, onNavigate, onNavigateToDocs }: { isOpen: boolean, onClose: () => void, onNavigate: (v: ViewState) => void, onNavigateToDocs: (tab: string) => void }) => {
  const [query, setQuery] = useState('');
  const [isAiSearching, setIsAiSearching] = useState(false);
  const [aiResults, setAiResults] = useState<{ title: string, type: string, view: ViewState, icon: React.ReactNode, reason?: string, docsTabId?: string }[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  const ai = React.useMemo(() => new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY }), []);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
    } else {
      setQuery('');
      setAiResults([]);
      setIsAiSearching(false);
    }
  }, [isOpen]);

  const handleAiSearch = async () => {
    if (!query.trim() || isAiSearching) return;
    
    setIsAiSearching(true);
    setAiResults([]);

    try {
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: `User is searching for: "${query}" in a Google Maps Platform developer portal.
        
        Available Products/Categories:
        ${Object.values(PRODUCT_ONTOLOGY).map(p => `- ${p.product}: ${p.service}`).join('\n')}
        ${CAPABILITIES.map(c => `- ${c.title}: ${c.description}`).join('\n')}
        
        Available Documentation Sections:
        ${DOCS_SECTIONS.map(s => `- ${s.title}${s.items ? ': ' + s.items.map(i => i.title).join(', ') : ''}`).join('\n')}
        
        Return the top 3 most relevant products, categories, or documentation topics from the list above that match the user's intent.
        Also include a brief "reason" why it's relevant.`,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                title: { type: Type.STRING },
                reason: { type: Type.STRING }
              },
              required: ["title", "reason"]
            }
          }
        }
      });

      const rawResults = JSON.parse(response.text || '[]');
      const mappedResults = rawResults.map((res: any) => {
        // Try to find in documentation first
        const findDoc = (items: any[]): any => {
          for (const item of items) {
            if (item.title?.toLowerCase() === res.title.toLowerCase()) return item;
            if (item.children) {
              const found = findDoc(item.children);
              if (found) return found;
            }
            if (item.items) {
              const found = findDoc(item.items);
              if (found) return found;
            }
          }
          return null;
        };
        const docItem = findDoc(DOCS_SECTIONS);
        if (docItem) {
          return {
            title: docItem.title,
            type: 'AI Recommended (Docs)',
            view: 'docs' as ViewState,
            icon: docItem.icon || <BookOpen className="w-4 h-4" />,
            reason: res.reason,
            docsTabId: docItem.id
          };
        }

        // Try to find in ontology
        const productKey = Object.keys(PRODUCT_ONTOLOGY).find(k => PRODUCT_ONTOLOGY[k].product.toLowerCase() === res.title.toLowerCase());
        if (productKey) {
          return {
            title: PRODUCT_ONTOLOGY[productKey].product,
            type: 'AI Recommended',
            view: productKey as ViewState,
            icon: PRODUCT_ONTOLOGY[productKey].icon,
            reason: res.reason,
            docsTabId: PRODUCT_ONTOLOGY[productKey].docsTabId
          };
        }
        // Try to find in capabilities
        const cap = CAPABILITIES.find(c => c.title.toLowerCase() === res.title.toLowerCase());
        if (cap) {
          return {
            title: cap.title,
            type: 'AI Recommended',
            view: cap.view as ViewState,
            icon: cap.icon,
            reason: res.reason
          };
        }
        return null;
      }).filter(Boolean);

      setAiResults(mappedResults);
    } catch (error) {
      console.error("AI Search Error:", error);
    } finally {
      setIsAiSearching(false);
    }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (query.trim().length >= 3) {
        handleAiSearch();
      }
    }, 800);
    return () => clearTimeout(timer);
  }, [query]);

  // Search logic
  const results = React.useMemo(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase();
    const matches: { title: string, type: string, view: ViewState, icon: React.ReactNode, isAi?: boolean, reason?: string, docsTabId?: string }[] = [];

    // Search Documentation Sections
    const searchDocs = (items: any[], parentIcon?: React.ReactNode) => {
      items.forEach(item => {
        if (item.isSeparator) return;
        if (item.title?.toLowerCase().includes(q)) {
          matches.push({
            title: item.title,
            type: 'Documentation',
            view: 'docs',
            icon: item.icon || parentIcon || <BookOpen className="w-4 h-4" />,
            docsTabId: item.id,
            isAi: item.isAi
          });
        }
        if (item.children) searchDocs(item.children, item.icon || parentIcon);
        if (item.items) searchDocs(item.items, item.icon || parentIcon);
      });
    };
    searchDocs(DOCS_SECTIONS);

    // Search Categories
    CAPABILITIES.forEach(cap => {
      const isAiMatch = cap.title.toLowerCase().includes('ai') || cap.description.toLowerCase().includes('ai');
      if (cap.title.toLowerCase().includes(q) || cap.description.toLowerCase().includes(q)) {
        matches.push({ 
          title: cap.title, 
          type: 'Category', 
          view: cap.view as ViewState, 
          icon: cap.icon, 
          isAi: isAiMatch,
          docsTabId: (cap as any).docsTabId
        });
      }
      // Search products within categories
      cap.products.forEach(p => {
        if (p.toLowerCase().includes(q)) {
          // Find view for product if possible, otherwise go to category
          const productKey = Object.keys(PRODUCT_ONTOLOGY).find(k => PRODUCT_ONTOLOGY[k].product.toLowerCase() === p.toLowerCase());
          const ontologyItem = productKey ? PRODUCT_ONTOLOGY[productKey] : null;
          matches.push({ 
            title: p, 
            type: 'Product', 
            view: (productKey && (productKey as ViewState)) || (cap.view as ViewState), 
            icon: ontologyItem?.icon || <Box className="w-4 h-4" />,
            isAi: ontologyItem?.isAi || p.toLowerCase().includes('ai'),
            docsTabId: ontologyItem?.docsTabId
          });
        }
      });
    });

    // Search Ontology directly for AI features
    Object.keys(PRODUCT_ONTOLOGY).forEach(key => {
      const item = PRODUCT_ONTOLOGY[key];
      if (item.isAi && (item.product.toLowerCase().includes(q) || q.includes('ai'))) {
        matches.push({
          title: item.product,
          type: 'AI Feature',
          view: key as ViewState,
          icon: item.icon,
          isAi: true,
          docsTabId: item.docsTabId
        });
      }
    });

    // Search Attributes/Entities (Mocked for now based on common requests)
    const attributes = [
      { title: 'Reviews', type: 'Attribute', view: 'details' as ViewState, icon: <MessageSquare className="w-4 h-4" /> },
      { title: 'Photos', type: 'Attribute', view: 'photos' as ViewState, icon: <Camera className="w-4 h-4" /> },
      { title: 'Ratings', type: 'Attribute', view: 'details' as ViewState, icon: <Sparkles className="w-4 h-4" /> },
      { title: 'Opening Hours', type: 'Attribute', view: 'details' as ViewState, icon: <History className="w-4 h-4" /> },
      { title: 'Price Level', type: 'Attribute', view: 'details' as ViewState, icon: <DollarSign className="w-4 h-4" /> },
      { title: 'Address Validation', type: 'Entity', view: 'validate-address' as ViewState, icon: <CheckCircle2 className="w-4 h-4" /> },
    ];

    attributes.forEach(attr => {
      if (attr.title.toLowerCase().includes(q)) {
        matches.push(attr);
      }
    });

    // Deduplicate by title
    return Array.from(new Map(matches.map(m => [m.title, m])).values()).slice(0, 8);
  }, [query]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[15vh] px-4">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-gray-900/40 backdrop-blur-sm"
          />
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden"
          >
            <div className="flex items-center gap-4 px-6 py-4 border-b border-gray-100">
              <Search className="w-6 h-6 text-gray-400" />
              <input 
                ref={inputRef}
                type="text"
                placeholder="Search products, entities, or attributes (e.g. 'Reviews')..."
                className="flex-1 bg-transparent border-none outline-none text-lg text-gray-900 placeholder-gray-400"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleAiSearch();
                }}
              />
              <div className="flex items-center gap-2">
                {isAiSearching && (
                  <div className="flex items-center gap-2 px-3 py-1.5 text-blue-600 text-[10px] font-bold uppercase tracking-widest animate-pulse">
                    <Loader2 className="w-3 h-3 animate-spin" />
                    AI Thinking...
                  </div>
                )}
                <button 
                  onClick={onClose}
                  className="p-1 hover:bg-gray-100 rounded-md transition-colors"
                >
                  <X className="w-5 h-5 text-gray-400" />
                </button>
              </div>
            </div>

            <div className="max-h-[60vh] overflow-y-auto p-2">
              {aiResults.length > 0 && (
                <div className="mb-4">
                  <p className="text-[10px] font-bold text-blue-600 uppercase tracking-widest mb-2 px-4 flex items-center gap-2">
                    <Sparkles className="w-3 h-3" /> AI Recommendations
                  </p>
                  <div className="space-y-1">
                    {aiResults.map((result, idx) => (
                      <div
                        key={`ai-${idx}`}
                        role="button"
                        tabIndex={0}
                        onClick={() => {
                          if (result.type === 'Documentation' && result.docsTabId) {
                            onNavigateToDocs(result.docsTabId);
                          } else if (result.docsTabId && !result.view) {
                            onNavigateToDocs(result.docsTabId);
                          } else {
                            onNavigate(result.view);
                          }
                        }}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault();
                            if (result.type === 'Documentation' && result.docsTabId) {
                              onNavigateToDocs(result.docsTabId);
                            } else if (result.docsTabId && !result.view) {
                              onNavigateToDocs(result.docsTabId);
                            } else {
                              onNavigate(result.view);
                            }
                          }
                        }}
                        className="w-full flex items-center gap-4 p-4 bg-blue-50/50 hover:bg-blue-50 rounded-xl transition-colors group text-left border border-blue-100/50 cursor-pointer"
                      >
                        <div className="p-2 bg-white rounded-lg text-blue-600 shadow-sm">
                          {result.icon}
                        </div>
                        <div className="flex-1">
                          <p className="font-bold text-gray-900 group-hover:text-blue-600 transition-colors">{result.title}</p>
                          <p className="text-xs text-blue-600/70 font-medium leading-relaxed">{result.reason}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          {result.docsTabId && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                onNavigateToDocs(result.docsTabId!);
                              }}
                              className="p-2 text-gray-400 hover:text-blue-600 hover:bg-white rounded-lg transition-all"
                              title="View Documentation"
                            >
                              <BookOpen className="w-4 h-4" />
                            </button>
                          )}
                          <ChevronRight className="w-4 h-4 text-blue-300 group-hover:text-blue-600 transition-colors" />
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="h-px bg-gray-100 my-4 mx-4" />
                </div>
              )}

              {results.length > 0 ? (
                <div className="space-y-1">
                  {results.map((result, idx) => (
                    <div
                      key={idx}
                      role="button"
                      tabIndex={0}
                      onClick={() => {
                        if (result.type === 'Documentation' && result.docsTabId) {
                          onNavigateToDocs(result.docsTabId);
                        } else {
                          onNavigate(result.view);
                        }
                      }}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault();
                          if (result.type === 'Documentation' && result.docsTabId) {
                            onNavigateToDocs(result.docsTabId);
                          } else {
                            onNavigate(result.view);
                          }
                        }
                      }}
                      className="w-full flex items-center gap-4 p-4 hover:bg-blue-50 rounded-xl transition-colors group text-left cursor-pointer"
                    >
                      <div className="p-2 bg-gray-50 rounded-lg text-gray-400 group-hover:bg-white group-hover:text-blue-600 transition-colors">
                        {result.icon}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <p className="font-bold text-gray-900 group-hover:text-blue-600 transition-colors">{result.title}</p>
                          {result.isAi && (
                            <span className="px-1.5 py-0.5 bg-blue-50 text-blue-600 text-[8px] font-bold uppercase tracking-widest rounded border border-blue-100 flex items-center gap-1">
                              <Sparkles className="w-2 h-2" /> AI Enabled
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-gray-400 font-medium uppercase tracking-widest">{result.type}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        {result.docsTabId && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onNavigateToDocs(result.docsTabId!);
                            }}
                            className="p-2 text-gray-400 hover:text-blue-600 hover:bg-gray-50 rounded-lg transition-all"
                            title="View Documentation"
                          >
                            <BookOpen className="w-4 h-4" />
                          </button>
                        )}
                        <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-blue-600 transition-colors" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : query ? (
                <div className="p-12 text-center space-y-4">
                  <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto">
                    <Search className="w-8 h-8 text-gray-300" />
                  </div>
                  <div>
                    <p className="font-bold text-gray-900">No results found for "{query}"</p>
                    <p className="text-sm text-gray-500">Try searching for "Maps", "Reviews", or "Geocoding".</p>
                  </div>
                </div>
              ) : (
                <div className="p-6">
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4 px-2">Quick Links</p>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { title: 'Places API', view: 'level2-places-api' as ViewState, icon: <Search className="w-4 h-4" /> },
                      { title: 'Routes API', view: 'level2-routes' as ViewState, icon: <Navigation className="w-4 h-4" /> },
                      { title: 'Maps SDK', view: 'level2-maps' as ViewState, icon: <MapIcon className="w-4 h-4" /> },
                      { title: 'Pricing', view: 'cost' as ViewState, icon: <DollarSign className="w-4 h-4" /> },
                    ].map((link, i) => (
                      <button
                        key={i}
                        onClick={() => onNavigate(link.view)}
                        className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-xl transition-colors text-left border border-transparent hover:border-gray-100"
                      >
                        <div className="text-gray-400">{link.icon}</div>
                        <span className="text-sm font-medium text-gray-700">{link.title}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="px-6 py-3 bg-gray-50 border-t border-gray-100 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1.5">
                  <kbd className="px-1.5 py-0.5 bg-white border border-gray-200 rounded text-[10px] font-bold text-gray-400">ESC</kbd>
                  <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">to close</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <kbd className="px-1.5 py-0.5 bg-white border border-gray-200 rounded text-[10px] font-bold text-gray-400">↵</kbd>
                  <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">to select</span>
                </div>
              </div>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Search by Google Maps Platform</p>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

const Layout = ({ children, view, setView, isLoggedIn, setIsLoggedIn, chatMessages, onSendMessage, onStartChat, navigateToDocs, onSearchClick }: { children: React.ReactNode, view: ViewState, setView: (v: ViewState, t?: string) => void, isLoggedIn: boolean, setIsLoggedIn: (v: boolean) => void, chatMessages: {role: 'user' | 'assistant', content: string}[], onSendMessage: (msg: string) => void, onStartChat: (msg: string) => void, navigateToDocs: (tab: string) => void, onSearchClick: () => void }) => {
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsUserDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="h-screen bg-white font-sans text-gray-900 flex flex-col overflow-hidden">
      <header className="shrink-0 z-50 bg-white border-b border-gray-100 h-[64px] flex items-center px-4 lg:px-8">
        <div className="flex items-center justify-between w-full max-w-[1440px] mx-auto">
          <div className="flex items-center gap-8">
            <div className="flex items-center gap-2 cursor-pointer" onClick={() => setView('mindmap')}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" fill="#4285F4"/>
                <circle cx="12" cy="9" r="2.5" fill="white"/>
              </svg>
              <span className="font-medium text-[18px] text-[#5f6368] tracking-tight">Google <span className="text-[#5f6368] font-normal">Maps Platform</span></span>
            </div>
            <nav className="hidden xl:flex items-center gap-8 ml-8">
              {NAV_LINKS.map((link) => (
                <button 
                  key={link.name} 
                  onClick={() => {
                    if (link.name === 'Resources') {
                      navigateToDocs(getDocsTabForView(view));
                    } else if (link.name === 'Pricing') {
                      setView('cost', 'Products');
                    } else {
                      setView(link.id as ViewState);
                    }
                  }} 
                  className={`flex items-center gap-1.5 text-[14px] font-medium transition-colors ${view === link.id ? 'text-google-blue' : 'text-gray-600 hover:text-google-blue'}`}
                >
                  {link.name}
                </button>
              ))}
            </nav>
          </div>
          <div className="flex items-center gap-4">
            {false && (
              <button 
                onClick={onSearchClick}
                className="p-2 hover:bg-blue-50 rounded-full transition-colors relative group"
              >
                <Search className="w-5 h-5 text-gray-600 group-hover:text-blue-600" />
                <div className="absolute -top-1 -right-1">
                  <Sparkles className="w-3 h-3 text-purple-500 animate-pulse" />
                </div>
              </button>
            )}
            {false && (
              <button className="hidden sm:block text-[14px] font-medium text-google-blue px-4 py-2 hover:bg-blue-50 rounded-md transition-colors border border-gray-200">
                Contact sales
              </button>
            )}
            {isLoggedIn ? (
              <button 
                onClick={() => setView('level1')}
                className="hidden sm:block text-[14px] font-medium bg-google-blue text-white px-5 py-2 rounded-md hover:bg-blue-700 transition-colors shadow-sm"
              >
                Go to Console
              </button>
            ) : (
              <button 
                onClick={() => setIsLoggedIn(true)}
                className="hidden sm:block text-[14px] font-medium bg-google-blue text-white px-5 py-2 rounded-md hover:bg-blue-700 transition-colors shadow-sm"
              >
                Sign in
              </button>
            )}
            
            <div className="relative ml-2" ref={dropdownRef}>
              <button 
                onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
                className="w-8 h-8 rounded-full bg-purple-600 flex items-center justify-center text-white text-sm font-bold hover:shadow-md transition-all"
              >
                {isLoggedIn ? 'A' : '?'}
              </button>

              <AnimatePresence>
                {isUserDropdownOpen && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute right-0 mt-2 w-56 bg-white border border-gray-200 rounded-xl shadow-xl py-2 z-[100] overflow-hidden"
                  >
                    <div className="px-4 py-3 border-b border-gray-100 mb-1">
                      <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">User Profile</p>
                      <p className="text-sm font-medium text-gray-900 mt-1">{isLoggedIn ? 'Anna Developer' : 'Guest User'}</p>
                    </div>
                    <button 
                      onClick={() => { setIsLoggedIn(true); setIsUserDropdownOpen(false); }}
                      className={`w-full text-left px-4 py-2.5 text-sm flex items-center gap-3 hover:bg-gray-50 transition-colors ${isLoggedIn ? 'text-google-blue font-bold bg-blue-50' : 'text-gray-600'}`}
                    >
                      <div className="w-2 h-2 bg-purple-500 rounded-full" />
                      Switch to Anna
                    </button>
                    <button 
                      onClick={() => { setIsLoggedIn(false); setIsUserDropdownOpen(false); }}
                      className={`w-full text-left px-4 py-2.5 text-sm flex items-center gap-3 hover:bg-gray-50 transition-colors ${!isLoggedIn ? 'text-google-blue font-bold bg-blue-50' : 'text-gray-600'}`}
                    >
                      <div className="w-2 h-2 bg-gray-400 rounded-full" />
                      Logout
                    </button>
                    <div className="mt-2 pt-2 border-t border-gray-100">
                      <button className="w-full text-left px-4 py-2.5 text-sm text-gray-600 hover:text-google-blue transition-colors flex items-center gap-3">
                        <Settings className="w-4 h-4" /> Settings
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </header>
      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar: Navigation + Chat - HIDDEN AS REQUESTED */}
        {false && view !== 'level1' && (
          <aside className="w-80 shrink-0 hidden lg:flex flex-col border-r border-gray-200 bg-gray-50 overflow-hidden">
            <div className="flex-1 overflow-y-auto p-4 no-scrollbar">
              <SidebarChat messages={chatMessages} onSendMessage={onSendMessage} className="border-none h-full" />
            </div>
          </aside>
        )}
        
        <div className="flex-1 overflow-auto">
          <div className={view === 'mindmap' ? "h-full" : "max-w-[1440px] mx-auto px-4 py-8 lg:px-12"}>
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

// --- Editor View ---

const Editor = ({ project, setView, originView }: { project: any, setView: (view: ViewState) => void, originView?: ViewState | null }) => {
  const [isDeploying, setIsDeploying] = useState(false);
  const [isShared, setIsShared] = useState(false);
  const [prompt, setPrompt] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  const [history, setHistory] = useState([
    { role: 'assistant', content: `Hi Anna! I've initialized your project with the **${project?.title}** template. What would you like to build next?` }
  ]);
  const [viewMode, setViewMode] = useState<'preview' | 'code'>('preview');

  const path = getBreadcrumbPath(originView || 'level1', true);

  const handleDeploy = () => {
    setIsDeploying(true);
    setTimeout(() => {
      setIsDeploying(false);
      setIsShared(true);
    }, 2000);
  };

  const handleSendPrompt = () => {
    if (!prompt.trim()) return;
    
    const userMsg = { role: 'user', content: prompt };
    setHistory(prev => [...prev, userMsg]);
    setPrompt('');
    setIsThinking(true);

    // Simulate AI thinking and applying changes
    setTimeout(() => {
      setIsThinking(false);
      const assistantMsg = { 
        role: 'assistant', 
        content: `Great idea! I've updated the map theme to "Midnight Blue" and added a custom marker for your store location. I also optimized the nearby search to prioritize high-rated restaurants.` 
      };
      setHistory(prev => [...prev, assistantMsg]);
    }, 2500);
  };

  return (
    <div className="fixed inset-0 bg-[#0a0a0a] z-[60] flex flex-col font-sans">
      {/* Studio Header */}
      <header className="h-16 bg-[#141414] border-b border-white/5 flex items-center justify-between px-6">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2 text-[10px] font-bold text-gray-500 uppercase tracking-widest">
            {path.map((segment, idx) => (
              <React.Fragment key={idx}>
                <button 
                  onClick={() => setView(segment.view)} 
                  className="hover:text-blue-400 transition-colors"
                >
                  {segment.title}
                </button>
                <span className="text-gray-700 mx-1">/</span>
              </React.Fragment>
            ))}
            <span className="text-gray-300 font-bold">Studio</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center shadow-lg shadow-blue-900/20">
              <MapIcon className="w-4 h-4 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-white">{project?.title || 'Untitled Project'}</span>
                <span className="text-[10px] bg-blue-500/10 text-blue-400 px-2 py-0.5 rounded-full font-bold uppercase tracking-wider border border-blue-500/20">Studio</span>
              </div>
              <p className="text-[10px] text-gray-500 font-medium uppercase tracking-widest mt-0.5">Prompt-Driven Remix</p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex bg-[#1f1f1f] p-1 rounded-xl border border-white/5 mr-4">
            <button 
              onClick={() => setViewMode('preview')}
              className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-2 ${viewMode === 'preview' ? 'bg-white text-black shadow-lg' : 'text-gray-500 hover:text-gray-300'}`}
            >
              <Eye className="w-3.5 h-3.5" /> Preview
            </button>
            <button 
              onClick={() => setViewMode('code')}
              className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-2 ${viewMode === 'code' ? 'bg-white text-black shadow-lg' : 'text-gray-500 hover:text-gray-300'}`}
            >
              <Code className="w-3.5 h-3.5" /> Code
            </button>
          </div>

          <button className="px-4 py-2 text-xs font-bold text-gray-400 hover:text-white transition-colors flex items-center gap-2">
            <Github className="w-4 h-4" /> Export
          </button>
          <button 
            onClick={handleDeploy}
            disabled={isDeploying}
            className={`px-6 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all ${
              isShared 
                ? 'bg-green-600 text-white hover:bg-green-700' 
                : 'bg-blue-600 text-white hover:bg-blue-700 shadow-xl shadow-blue-900/20'
            }`}
          >
            {isDeploying ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" /> Deploying...
              </>
            ) : isShared ? (
              <>
                <CheckCircle2 className="w-4 h-4" /> Deployed
              </>
            ) : (
              <>
                <Zap className="w-4 h-4" /> Go Live
              </>
            )}
          </button>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
        {/* Main Canvas Area */}
        <main className="flex-1 relative bg-[#0f0f0f] overflow-hidden">
          <AnimatePresence mode="wait">
            {viewMode === 'preview' ? (
              <motion.div 
                key="preview"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.02 }}
                className="absolute inset-0 p-6"
              >
                <div className="w-full h-full bg-[#1a1a1a] rounded-3xl border border-white/5 overflow-hidden shadow-2xl relative group">
                  {/* Simulated Map Interface */}
                  <div className="absolute inset-0 bg-[#111] flex items-center justify-center">
                    <img 
                      src="https://picsum.photos/seed/map-dark/1200/800" 
                      alt="Map Preview" 
                      className="w-full h-full object-cover opacity-40 grayscale"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/60" />
                    
                    {/* Simulated Markers */}
                    <motion.div 
                      animate={{ y: [0, -10, 0] }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2"
                    >
                      <div className="w-10 h-10 bg-blue-600 rounded-full border-4 border-white shadow-2xl flex items-center justify-center">
                        <MapPin className="w-5 h-5 text-white" />
                      </div>
                      <div className="mt-2 px-3 py-1 bg-white rounded-lg shadow-xl text-[10px] font-bold text-black whitespace-nowrap">
                        Your Custom Location
                      </div>
                    </motion.div>
                  </div>

                  {/* UI Overlays */}
                  <div className="absolute top-6 left-6 flex flex-col gap-3">
                    <div className="bg-white/10 backdrop-blur-md border border-white/10 p-4 rounded-2xl w-64 shadow-2xl">
                      <div className="flex items-center justify-between mb-4">
                        <span className="text-[10px] font-bold text-white/50 uppercase tracking-widest">Active Filters</span>
                        <Settings className="w-3 h-3 text-white/30" />
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-xs text-white">
                          <span>Nearby Restaurants</span>
                          <div className="w-8 h-4 bg-blue-600 rounded-full relative">
                            <div className="absolute right-0.5 top-0.5 w-3 h-3 bg-white rounded-full" />
                          </div>
                        </div>
                        <div className="flex items-center justify-between text-xs text-white/50">
                          <span>Traffic Overlay</span>
                          <div className="w-8 h-4 bg-white/10 rounded-full relative">
                            <div className="absolute left-0.5 top-0.5 w-3 h-3 bg-white/30 rounded-full" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Thinking Overlay */}
                  <AnimatePresence>
                    {isThinking && (
                      <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 bg-black/40 backdrop-blur-sm flex flex-col items-center justify-center z-20"
                      >
                        <div className="bg-[#1a1a1a] border border-white/10 p-8 rounded-3xl shadow-2xl flex flex-col items-center gap-6 max-w-sm text-center">
                          <div className="relative">
                            <div className="w-20 h-20 border-4 border-blue-600/20 rounded-full" />
                            <motion.div 
                              animate={{ rotate: 360 }}
                              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                              className="absolute inset-0 border-4 border-t-blue-600 rounded-full"
                            />
                            <div className="absolute inset-0 flex items-center justify-center">
                              <Sparkles className="w-8 h-8 text-blue-400 animate-pulse" />
                            </div>
                          </div>
                          <div>
                            <h3 className="text-lg font-bold text-white mb-2">Maker Concierge is thinking...</h3>
                            <p className="text-sm text-gray-400">Applying your changes to the project source code and updating the preview.</p>
                          </div>
                          <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden">
                            <motion.div 
                              initial={{ width: 0 }}
                              animate={{ width: '100%' }}
                              transition={{ duration: 2.5 }}
                              className="bg-blue-600 h-full"
                            />
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Prompt Bar Overlay */}
                  <div className="absolute bottom-8 left-1/2 -translate-x-1/2 w-full max-w-2xl px-6">
                    <div className="bg-black/60 backdrop-blur-xl border border-white/10 p-2 rounded-2xl shadow-2xl flex items-center gap-3">
                      <div className="w-10 h-10 bg-blue-600/20 rounded-xl flex items-center justify-center text-blue-400 shrink-0">
                        <Sparkles className="w-5 h-5" />
                      </div>
                      <input 
                        type="text" 
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSendPrompt()}
                        placeholder="Describe a change (e.g. 'Add a dark mode toggle' or 'Show nearby parks')"
                        className="flex-1 bg-transparent border-none text-sm text-white placeholder-gray-500 focus:outline-none py-2"
                      />
                      <button 
                        onClick={handleSendPrompt}
                        disabled={!prompt.trim() || isThinking}
                        className="p-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all disabled:opacity-50 disabled:hover:bg-blue-600"
                      >
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ) : (
              <motion.div 
                key="code"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="absolute inset-0 p-6 flex flex-col"
              >
                <div className="flex-1 bg-[#0d1117] rounded-3xl border border-white/5 overflow-hidden shadow-2xl flex flex-col">
                  <div className="h-12 bg-white/5 border-b border-white/5 flex items-center px-6 justify-between">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2 text-[10px] font-bold text-gray-500 uppercase tracking-widest">
                        <Code className="w-3 h-3" /> src / App.tsx
                      </div>
                    </div>
                    <div className="text-[10px] text-gray-500 font-mono italic">Read-only in Studio mode</div>
                  </div>
                  <div className="flex-1 p-8 font-mono text-sm leading-relaxed overflow-y-auto text-gray-400">
                    <pre className="whitespace-pre-wrap">
                      {`import React from 'react';
import { GoogleMap, useJsApiLoader } from '@react-google-maps/api';

// This code is automatically managed by Maker Concierge
// Based on your natural language prompts.

const containerStyle = {
  width: '100%',
  height: '100vh'
};

const center = {
  lat: 40.7128,
  lng: -74.0060
};

const mapOptions = {
  styles: midnightBlueTheme,
  disableDefaultUI: true,
  zoomControl: true
};

function RemixApp() {
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: process.env.MAPS_API_KEY
  })

  return isLoaded ? (
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={center}
        zoom={13}
        options={mapOptions}
      >
        { /* AI Generated Components */ }
        <CustomMarker position={center} />
        <NearbySearchFilter active={true} />
      </GoogleMap>
  ) : <LoadingSpinner />
}

export default React.memo(RemixApp)`}
                    </pre>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </main>

        {/* AI Conversation Sidebar - HIDDEN AS REQUESTED */}
        {false && (
          <aside className="w-96 bg-[#141414] border-l border-white/5 flex flex-col">
            <div className="p-6 border-b border-white/5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-600/10 rounded-2xl flex items-center justify-center text-blue-400">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">Maker Concierge</h3>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                    <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Ready to build</span>
                  </div>
                </div>
              </div>
              <button className="p-2 hover:bg-white/5 rounded-xl text-gray-500 transition-colors">
                <History className="w-4 h-4" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-hide">
              {history.map((msg, i) => (
                <motion.div 
                  key={i}
                  initial={{ opacity: 0, x: msg.role === 'user' ? 10 : -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}
                >
                  <div className={`max-w-[85%] p-4 rounded-2xl text-xs leading-relaxed ${
                    msg.role === 'user' 
                      ? 'bg-blue-600 text-white rounded-tr-none shadow-lg shadow-blue-900/20' 
                      : 'bg-white/5 text-gray-300 rounded-tl-none border border-white/5'
                  }`}>
                    <Markdown>{msg.content}</Markdown>
                  </div>
                  <span className="text-[10px] text-gray-600 mt-2 font-medium">
                    {msg.role === 'user' ? 'You' : 'Maker Concierge'} • Just now
                  </span>
                </motion.div>
              ))}
              {isThinking && (
                <div className="flex flex-col items-start">
                  <div className="bg-white/5 p-4 rounded-2xl rounded-tl-none border border-white/5 flex items-center gap-3">
                    <div className="flex gap-1">
                      <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce [animation-delay:-0.3s]" />
                      <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce [animation-delay:-0.15s]" />
                      <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce" />
                    </div>
                    <span className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Updating Code...</span>
                  </div>
                </div>
              )}
            </div>

            <div className="p-6 bg-[#0f0f0f] border-t border-white/5">
              <div className="space-y-3 mb-4">
                <p className="text-[10px] font-bold text-gray-600 uppercase tracking-widest px-1">Quick Actions</p>
                <div className="grid grid-cols-2 gap-2">
                  <button 
                    onClick={() => { setPrompt('Add a dark mode toggle'); handleSendPrompt(); }}
                    className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 text-[10px] text-gray-400 text-left transition-all hover:border-white/10"
                  >
                    Add Dark Mode
                  </button>
                  <button 
                    onClick={() => { setPrompt('Show nearby parks'); handleSendPrompt(); }}
                    className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 text-[10px] text-gray-400 text-left transition-all hover:border-white/10"
                  >
                    Show Parks
                  </button>
                </div>
              </div>
              <div className="relative group">
                <textarea 
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleSendPrompt()}
                  placeholder="Ask Maker Concierge to build something..."
                  className="w-full bg-[#1a1a1a] border border-white/5 rounded-2xl p-4 pr-12 text-xs text-white placeholder-gray-600 focus:outline-none focus:border-blue-500/50 transition-all resize-none h-24 shadow-inner"
                />
                <button 
                  onClick={handleSendPrompt}
                  disabled={!prompt.trim() || isThinking}
                  className="absolute right-3 bottom-3 p-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all disabled:opacity-50 shadow-lg shadow-blue-900/40"
                >
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </aside>
        )}
      </div>
    </div>
  );
};

// --- Remix Project Flow ---

const RemixProject = ({ project, setView, onOpenEditor, originView }: { project: any, setView: (view: ViewState) => void, onOpenEditor: () => void, originView?: ViewState | null }) => {
  const [step, setStep] = useState<'config' | 'provisioning' | 'success'>('config');
  const [projectName, setProjectName] = useState(`${project?.title} (Remix)`);
  const [progress, setProgress] = useState(0);

  const path = getBreadcrumbPath(originView || 'level1', true);

  useEffect(() => {
    if (step === 'provisioning') {
      const interval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 100) {
            clearInterval(interval);
            setTimeout(() => setStep('success'), 500);
            return 100;
          }
          return prev + 2;
        });
      }, 50);
      return () => clearInterval(interval);
    }
  }, [step]);

  if (!project) return null;

  return (
    <div className="max-w-3xl mx-auto py-12">
      <ServiceBreadcrumb 
        path={path} 
        currentTitle="Remix" 
        setView={setView} 
      />
      <AnimatePresence mode="wait">
        {step === 'config' && (
          <motion.div 
            key="config"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
            className="bg-white border border-gray-200 rounded-3xl p-8 shadow-xl space-y-8"
          >
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center text-blue-600">
                <Wand2 className="w-8 h-8" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Remix Project</h2>
                <p className="text-gray-500">Create your own version of <span className="font-bold text-gray-700">{project.title}</span></p>
              </div>
            </div>

            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700">Project Name</label>
                <input 
                  type="text" 
                  value={projectName}
                  onChange={(e) => setProjectName(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                />
              </div>

              <div className="p-4 bg-gray-50 rounded-xl border border-gray-100 space-y-3">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Included Capabilities</p>
                <div className="flex flex-wrap gap-2">
                  {project.tags.map(tag => (
                    <span key={tag} className="px-2 py-1 bg-white border border-gray-200 rounded-md text-[10px] font-medium text-gray-600">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-3 p-4 bg-blue-50 rounded-xl border border-blue-100">
                <div className="p-2 bg-blue-100 rounded-lg text-blue-600">
                  <Info className="w-4 h-4" />
                </div>
                <p className="text-xs text-blue-700 leading-relaxed">
                  Remixing will create a new project in your account with all the necessary API configurations and starter code pre-installed.
                </p>
              </div>
            </div>

            <div className="flex gap-4 pt-4">
              <button 
                onClick={() => setView('level1')}
                className="flex-1 py-4 text-gray-500 font-bold hover:bg-gray-50 rounded-xl transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={() => setStep('provisioning')}
                className="flex-[2] py-4 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-colors shadow-lg shadow-blue-100"
              >
                Create Remix
              </button>
            </div>
          </motion.div>
        )}

        {step === 'provisioning' && (
          <motion.div 
            key="provisioning"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="text-center space-y-8 py-12"
          >
            <div className="relative w-32 h-32 mx-auto">
              <svg className="w-full h-full transform -rotate-90">
                <circle
                  cx="64"
                  cy="64"
                  r="60"
                  stroke="currentColor"
                  strokeWidth="8"
                  fill="transparent"
                  className="text-gray-100"
                />
                <circle
                  cx="64"
                  cy="64"
                  r="60"
                  stroke="currentColor"
                  strokeWidth="8"
                  fill="transparent"
                  strokeDasharray={377}
                  strokeDashoffset={377 - (377 * progress) / 100}
                  className="text-blue-600 transition-all duration-100 ease-linear"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
              </div>
            </div>
            <div className="space-y-2">
              <h2 className="text-2xl font-bold text-gray-900">Provisioning Project...</h2>
              <p className="text-gray-500">Setting up your workspace and API keys</p>
            </div>
            <div className="max-w-xs mx-auto bg-gray-100 rounded-full h-2 overflow-hidden">
              <motion.div 
                className="bg-blue-600 h-full"
                animate={{ width: `${progress}%` }}
              />
            </div>
            <div className="flex flex-col items-center gap-2 text-xs text-gray-400 font-mono">
              <p className={progress > 20 ? 'text-blue-600' : ''}>Cloning repository...</p>
              <p className={progress > 50 ? 'text-blue-600' : ''}>Injecting API credentials...</p>
              <p className={progress > 80 ? 'text-blue-600' : ''}>Starting dev server...</p>
            </div>
          </motion.div>
        )}

        {step === 'success' && (
          <motion.div 
            key="success"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white border border-gray-200 rounded-3xl p-12 shadow-2xl text-center space-y-8"
          >
            <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center text-green-600 mx-auto">
              <CheckCircle2 className="w-12 h-12" />
            </div>
            <div className="space-y-2">
              <h2 className="text-3xl font-bold text-gray-900">Project Ready!</h2>
              <p className="text-gray-500">Your remix of <span className="font-bold text-gray-700">{project.title}</span> has been created successfully.</p>
            </div>
            
            <div className="p-6 bg-gray-50 rounded-2xl border border-gray-100 text-left space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Project URL</span>
                <span className="text-[10px] bg-green-100 text-green-700 px-2 py-0.5 rounded font-bold">LIVE</span>
              </div>
              <div className="flex items-center justify-between bg-white p-3 rounded-xl border border-gray-200">
                <code className="text-sm text-blue-600 font-bold truncate">https://console.cloud.google.com/maps/{projectName.toLowerCase().replace(/\s+/g, '-')}-42</code>
                <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                  <ExternalLink className="w-4 h-4 text-gray-400" />
                </button>
              </div>
            </div>

            <div className="flex gap-4 pt-4">
              <button 
                onClick={() => setView('level1')}
                className="flex-1 py-4 bg-gray-100 text-gray-700 rounded-xl font-bold hover:bg-gray-200 transition-colors"
              >
                Go to Dashboard
              </button>
              <button 
                onClick={onOpenEditor}
                className="flex-[2] py-4 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-colors shadow-lg shadow-blue-100 flex items-center justify-center gap-2"
              >
                Open in Studio <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// --- Project Details Page ---

const ProjectDetails = ({ project, setView, onRemixClick, originView }: { project: any, setView: (view: ViewState) => void, onRemixClick: (project: any) => void, originView?: ViewState | null }) => {
  if (!project) return null;

  const path = getBreadcrumbPath(originView || 'level1', true);

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <ServiceBreadcrumb 
        path={path} 
        currentTitle={project.title} 
        setView={setView} 
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Left Column: Image & Main Info */}
        <div className="lg:col-span-2 space-y-8">
          <div className="aspect-video rounded-2xl overflow-hidden border border-gray-200 shadow-sm">
            <img 
              src={project.image.replace('400/250', '1200/800')} 
              alt={project.title} 
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </div>

          <div className="space-y-4">
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">{project.title}</h1>
                <p className="text-gray-500 flex items-center gap-2 mt-1">
                  <Code className="w-4 h-4" /> Built by <span className="font-bold text-gray-700">{project.author}</span>
                </p>
              </div>
              <div className="flex items-center gap-2">
                <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                  project.difficulty === 'Beginner' ? 'bg-green-100 text-green-700' :
                  project.difficulty === 'Intermediate' ? 'bg-blue-100 text-blue-700' :
                  'bg-purple-100 text-purple-700'
                }`}>
                  {project.difficulty}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-6 py-4 border-y border-gray-100">
              <div className="flex items-center gap-2">
                <Heart className="w-5 h-5 text-red-500" />
                <span className="text-sm font-bold">{project.likes} <span className="text-gray-400 font-normal">likes</span></span>
              </div>
              <div className="flex items-center gap-2">
                <Eye className="w-5 h-5 text-gray-400" />
                <span className="text-sm font-bold">{project.views} <span className="text-gray-400 font-normal">views</span></span>
              </div>
              <div className="flex items-center gap-2">
                <Wand2 className="w-5 h-5 text-blue-500" />
                <span className="text-sm font-bold">{project.remixes} <span className="text-gray-400 font-normal">remixes</span></span>
              </div>
            </div>

            <div className="prose prose-blue max-w-none">
              <h3 className="text-xl font-bold text-gray-900 mb-4">About this project</h3>
              <p className="text-gray-600 leading-relaxed">
                This {project.title} template demonstrates how to integrate Google Maps Platform features into a modern web application. 
                It focuses on providing a seamless user experience for {project.tags.join(', ')} use cases. 
                The project is built with performance and scalability in mind, utilizing best practices for API integration and frontend rendering.
              </p>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6 list-none p-0">
                <li className="flex items-start gap-3 p-4 bg-gray-50 rounded-xl border border-gray-100">
                  <div className="p-2 bg-blue-100 rounded-lg text-blue-600">
                    <Zap className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="font-bold text-sm text-gray-900">Optimized Performance</p>
                    <p className="text-xs text-gray-500">Lazy loading and efficient state management.</p>
                  </div>
                </li>
                <li className="flex items-start gap-3 p-4 bg-gray-50 rounded-xl border border-gray-100">
                  <div className="p-2 bg-purple-100 rounded-lg text-purple-600">
                    <Shield className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="font-bold text-sm text-gray-900">Production Ready</p>
                    <p className="text-xs text-gray-500">Includes error handling and edge case coverage.</p>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Right Column: Actions & Tech Stack */}
        <div className="space-y-8">
        {/* Ready to build? - HIDDEN AS REQUESTED */}
        {false && (
          <div className="p-6 bg-blue-600 rounded-2xl text-white shadow-xl shadow-blue-100 space-y-6">
            <div>
              <h3 className="text-xl font-bold mb-2">Ready to build?</h3>
              <p className="text-blue-100 text-sm">Remix this project to start with this exact configuration in your own workspace.</p>
            </div>
            <button 
              onClick={() => onRemixClick(project)}
              className="w-full py-4 bg-white text-blue-600 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-blue-50 transition-colors"
            >
              <Wand2 className="w-5 h-5" /> Remix Project
            </button>
            <button className="w-full py-4 bg-blue-700 text-white rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-blue-800 transition-colors border border-blue-500">
              <ExternalLink className="w-5 h-5" /> View Live Demo
            </button>
          </div>
        )}

          <div className="p-6 bg-white border border-gray-200 rounded-2xl space-y-6">
            <h3 className="font-bold text-gray-900 flex items-center gap-2">
              <Layers className="w-5 h-5 text-gray-400" />
              Tech Stack
            </h3>
            <div className="space-y-4">
              <div>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">GMP Capabilities</p>
                <div className="flex flex-wrap gap-2">
                  {project.tags.map(tag => (
                    <span key={tag} className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-medium">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">Frameworks</p>
                <div className="flex flex-wrap gap-2">
                  <span className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-medium">React</span>
                  <span className="px-3 py-1 bg-cyan-50 text-cyan-700 rounded-full text-xs font-medium">Tailwind CSS</span>
                  <span className="px-3 py-1 bg-orange-50 text-orange-700 rounded-full text-xs font-medium">Vite</span>
                </div>
              </div>
            </div>
          </div>

          <div className="p-6 bg-gray-900 rounded-2xl text-white space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-sm">Implementation Preview</h3>
              <Code className="w-4 h-4 text-gray-500" />
            </div>
            <div className="bg-black/50 rounded-lg p-4 font-mono text-[11px] text-blue-300 overflow-x-auto">
              <pre>{`// Initialize ${project.title}
const service = new google.maps.places.PlacesService(map);

service.nearbySearch({
  location: pyrmont,
  radius: 500,
  type: ['store']
}, (results, status) => {
  if (status === 'OK') {
    // Render results
  }
});`}</pre>
            </div>
            <button className="w-full py-2 text-xs font-bold text-gray-400 hover:text-white transition-colors flex items-center justify-center gap-2">
              View full source code <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const InspirationGallery = ({ 
  title = "Inspiration Gallery: Remixable Projects",
  description = "Start from a template and customize it in seconds.",
  filterTag,
  onProjectClick,
  onRemixClick,
  projects = GALLERY_PROJECTS
}: { 
  title?: string,
  description?: string,
  filterTag?: string,
  onProjectClick: (project: any) => void,
  onRemixClick: (project: any) => void,
  projects?: any[]
}) => {
  const [activeTab, setActiveTab] = useState(filterTag || 'All');
  const carouselRef = useRef<HTMLDivElement>(null);
  
  const filteredProjects = activeTab === 'All' 
    ? projects 
    : projects.filter(p => p.tags.some(t => t.toLowerCase().includes(activeTab.toLowerCase())) || p.title.toLowerCase().includes(activeTab.toLowerCase()));

  const scroll = (direction: 'left' | 'right') => {
    if (carouselRef.current) {
      const { scrollLeft, clientWidth } = carouselRef.current;
      const scrollTo = direction === 'left' ? scrollLeft - clientWidth : scrollLeft + clientWidth;
      carouselRef.current.scrollTo({ left: scrollTo, behavior: 'smooth' });
    }
  };

  return (
    <section className="relative">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h2 className="text-xl font-bold flex items-center gap-2 mb-1">
            <Sparkles className="w-5 h-5 text-purple-500" />
            {title}
          </h2>
          <p className="text-sm text-gray-500">{description}</p>
        </div>
        {!filterTag && (
          <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 no-scrollbar">
            {['All', 'E-commerce', 'Real Estate', 'Logistics', 'Travel', 'Outdoor'].map(tab => (
              <button 
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all whitespace-nowrap ${
                  activeTab === tab 
                    ? 'bg-blue-600 text-white shadow-md' 
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="relative group">
        <div 
          ref={carouselRef}
          className="flex gap-6 overflow-x-auto pb-6 no-scrollbar snap-x snap-mandatory"
        >
          {filteredProjects.map((project) => (
            <div 
              key={project.title} 
              onClick={() => onProjectClick(project)}
              className="flex-none w-[300px] md:w-[350px] group/card bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-lg transition-all flex flex-col snap-start cursor-pointer"
            >
              <div className="aspect-video relative overflow-hidden">
                <img src={project.image} alt={project.title} className="w-full h-full object-cover group-hover/card:scale-105 transition-transform duration-500" referrerPolicy="no-referrer" />
                <div className="absolute inset-0 bg-black/20 group-hover/card:bg-black/40 transition-colors flex items-center justify-center opacity-0 group-hover/card:opacity-100">
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      onRemixClick(project);
                    }}
                    className="bg-white text-gray-900 px-6 py-2 rounded-full font-bold flex items-center gap-2 shadow-xl transform translate-y-4 group-hover/card:translate-y-0 transition-transform"
                  >
                    <Wand2 className="w-4 h-4" /> Remix
                  </button>
                </div>
                <div className="absolute top-3 left-3 px-2 py-1 bg-white/90 backdrop-blur rounded text-[10px] font-bold uppercase tracking-wider">
                  {project.description}
                </div>
              </div>
              <div className="p-4 flex-1 flex flex-col">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="font-bold text-gray-900">{project.title}</h3>
                    <p className="text-xs text-gray-500 flex items-center gap-1 mt-1">
                      <Code className="w-3 h-3" /> by {project.author}
                    </p>
                  </div>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    project.difficulty === 'Beginner' ? 'bg-green-100 text-green-700' :
                    project.difficulty === 'Intermediate' ? 'bg-blue-100 text-blue-700' :
                    'bg-purple-100 text-purple-700'
                  }`}>
                    {project.difficulty}
                  </span>
                </div>
                <div className="flex flex-wrap gap-1.5 mb-4">
                  {project.tags.map(tag => (
                    <span key={tag} className="text-[10px] bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded">
                      {tag}
                    </span>
                  ))}
                </div>
                <div className="mt-auto flex items-center gap-4 text-xs text-gray-500 font-medium pt-3 border-t border-gray-100">
                  <span className="flex items-center gap-1"><Heart className="w-3 h-3 text-red-500" /> {project.likes}</span>
                  <span className="flex items-center gap-1"><Eye className="w-3 h-3" /> {project.views}</span>
                  <span className="flex items-center gap-1"><Wand2 className="w-3 h-3" /> {project.remixes}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredProjects.length > 0 && (
          <>
            <button 
              onClick={() => scroll('left')}
              className="absolute left-0 top-1/2 -translate-y-1/2 -ml-4 w-10 h-10 bg-white border border-gray-200 rounded-full shadow-lg flex items-center justify-center text-gray-600 hover:text-blue-600 hover:border-blue-200 transition-all opacity-0 group-hover:opacity-100 z-10"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <button 
              onClick={() => scroll('right')}
              className="absolute right-0 top-1/2 -translate-y-1/2 -mr-4 w-10 h-10 bg-white border border-gray-200 rounded-full shadow-lg flex items-center justify-center text-gray-600 hover:text-blue-600 hover:border-blue-200 transition-all opacity-0 group-hover:opacity-100 z-10"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </>
        )}
      </div>

      {filteredProjects.length === 0 && (
        <div className="text-center py-12 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
          <p className="text-gray-500 font-medium">No projects found in this category.</p>
          {!filterTag && <button onClick={() => setActiveTab('All')} className="mt-2 text-blue-600 font-bold hover:underline">View all projects</button>}
        </div>
      )}
    </section>
  );
};

const MakerConciergeHeroModule = ({ onStartChat, onNavigate }: { onStartChat: (msg: string) => void, onNavigate: (id: ViewState) => void }) => {
  const [chatInput, setChatInput] = useState('');

  const handleChatSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (chatInput.trim()) {
      onStartChat(chatInput);
    }
  };

  return (
    <section className="bg-gradient-to-br from-blue-50 to-white p-8 rounded-2xl border border-blue-100 shadow-sm mb-12">
      <div className="max-w-3xl space-y-6">
        <div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Google Maps Platform</h1>
          <p className="text-lg text-gray-600 mb-4">Build the next generation of location-based experiences with the world's most accurate real-time data.</p>
        </div>
        
        <div className="space-y-6">
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-sm font-bold text-blue-700">
              <Sparkles className="w-4 h-4" />
              Describe what you want to build, and let the Maker Concierge do the rest:
            </div>
            <form onSubmit={handleChatSubmit} className="relative">
              <input 
                type="text" 
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                placeholder='E.g., "Create a fast checkout flow with auto-filling addresses"'
                className="w-full pl-4 pr-14 py-4 bg-white border-2 border-blue-200 rounded-xl shadow-inner focus:outline-none focus:border-blue-500 transition-all text-lg"
              />
              <button type="submit" className="absolute right-2 top-2 bottom-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                <ArrowRight className="w-5 h-5" />
              </button>
            </form>
          </div>

          <div className="space-y-4">
            <div className="flex flex-wrap items-center gap-3 text-sm">
              <span className="text-gray-500">Try these popular use cases:</span>
              <button onClick={() => onStartChat("🛒 E-commerce Checkout")} className="px-3 py-1 bg-white border border-gray-200 rounded-full hover:border-blue-400 hover:text-blue-600 transition-all flex items-center gap-1.5">
                🛒 E-commerce Checkout
              </button>
              <button onClick={() => onStartChat("📍 Store Locator")} className="px-3 py-1 bg-white border border-gray-200 rounded-full hover:border-blue-400 hover:text-blue-600 transition-all flex items-center gap-1.5">
                📍 Store Locator
              </button>
              <button onClick={() => onStartChat("🏠 Real Estate Map")} className="px-3 py-1 bg-white border border-gray-200 rounded-full hover:border-blue-400 hover:text-blue-600 transition-all flex items-center gap-1.5">
                🏠 Real Estate Map
              </button>
              <button onClick={() => onStartChat("🚚 Delivery Tracking")} className="px-3 py-1 bg-white border border-gray-200 rounded-full hover:border-blue-400 hover:text-blue-600 transition-all flex items-center gap-1.5">
                🚚 Delivery Tracking
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const Level1MarketingView = ({ onLogin, onNavigate }: { onLogin: () => void, onNavigate: (id: ViewState) => void }) => {
  return (
    <div className="space-y-24 pb-20">
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-[40px] bg-slate-900 text-white p-12 lg:p-24">
        <div className="relative z-10 max-w-3xl space-y-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-500/20 text-blue-400 text-xs font-bold rounded-full border border-blue-500/30">
            <Sparkles className="w-3 h-3" /> Now with Gemini AI
          </div>
          <h1 className="text-6xl lg:text-8xl font-bold tracking-tight leading-[0.85]">
            Build the next generation of <span className="text-blue-500">location-aware</span> apps.
          </h1>
          <p className="text-xl text-slate-400 leading-relaxed max-w-2xl">
            Google Maps Platform provides the most accurate, real-time location data to power your business and delight your users.
          </p>
          <div className="flex flex-wrap gap-4 pt-4">
            <button 
              onClick={onLogin}
              className="px-10 py-5 bg-blue-600 text-white rounded-2xl font-bold hover:bg-blue-700 transition-all flex items-center gap-2 shadow-2xl shadow-blue-600/40 text-lg"
            >
              Get Started for Free <ArrowRight className="w-5 h-5" />
            </button>
            <button className="px-10 py-5 bg-white/10 text-white border border-white/10 rounded-2xl font-bold hover:bg-white/20 transition-all backdrop-blur-sm text-lg">
              Contact Sales
            </button>
          </div>
        </div>
        
        {/* Abstract Background Elements */}
        <div className="absolute top-0 right-0 w-1/2 h-full opacity-30 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-blue-600 rounded-full blur-[160px]" />
          <div className="absolute top-1/4 right-0 w-[500px] h-[500px] bg-purple-600 rounded-full blur-[120px]" />
        </div>
      </section>

      {/* Stats Section */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-12 px-4">
        <div className="space-y-2">
          <p className="text-5xl font-bold text-gray-900">200M+</p>
          <p className="text-gray-500 font-medium">Places and businesses worldwide</p>
        </div>
        <div className="space-y-2">
          <p className="text-5xl font-bold text-gray-900">99%</p>
          <p className="text-gray-500 font-medium">Coverage of the world's population</p>
        </div>
        <div className="space-y-2">
          <p className="text-5xl font-bold text-gray-900">25M+</p>
          <p className="text-gray-500 font-medium">Updates made to the map every day</p>
        </div>
      </section>

      {/* Capabilities Preview */}
      <section className="space-y-12">
        <div className="text-center space-y-4 max-w-2xl mx-auto">
          <h2 className="text-4xl font-bold text-gray-900">Everything you need to build</h2>
          <p className="text-gray-500 text-lg">
            From simple maps to complex logistics, we have the tools to help you succeed.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[
            { title: 'Maps', desc: 'Customized, interactive maps for web and mobile.', icon: <MapIcon className="w-6 h-6" />, color: 'blue', id: 'level2-maps' as ViewState },
            { title: 'Routes', desc: 'High-quality directions and real-time traffic.', icon: <Navigation className="w-6 h-6" />, color: 'red', id: 'level2-routes' as ViewState },
            { title: 'Places', desc: 'Rich details for over 200 million places.', icon: <MapPin className="w-6 h-6" />, color: 'green', id: 'level2-places' as ViewState },
            { title: 'Environment', desc: 'Solar, air quality, and pollen data.', icon: <Cloud className="w-6 h-6" />, color: 'teal', id: 'level2-environment' as ViewState },
            { title: 'Datasets', desc: 'Manage custom location data and geospatial datasets.', icon: <Database className="w-6 h-6" />, color: 'indigo', id: 'level2-datasets' as ViewState },
            { title: 'AI & Tools', desc: 'Harness Generative AI for smarter location apps.', icon: <Sparkles className="w-6 h-6" />, color: 'purple', id: 'level2-ai' as ViewState },
            { title: 'Analytics', desc: 'Monitor usage and gain billing insights.', icon: <BarChart3 className="w-6 h-6" />, color: 'amber', id: 'level2-analytics' as ViewState }
          ].map((item, i) => (
            <div 
              key={i} 
              onClick={() => onNavigate(item.id)}
              className="p-8 bg-white border border-gray-100 rounded-3xl hover:shadow-xl transition-all group cursor-pointer hover:border-blue-100"
            >
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-6 bg-${item.color}-50 text-${item.color}-600 group-hover:bg-${item.color}-600 group-hover:text-white transition-colors`}>
                {item.icon}
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">{item.title}</h3>
              <p className="text-gray-500 text-sm leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

const Level1ProductArea = ({ onNavigate, onProjectClick, onRemixClick, isLoggedIn, onStartChat, onSearchClick, setIsLoggedIn, onLogin }: { onNavigate: (id: ViewState) => void, onProjectClick: (project: any) => void, onRemixClick: (project: any) => void, isLoggedIn: boolean, onStartChat: (msg: string) => void, onSearchClick: () => void, setIsLoggedIn: (v: boolean) => void, onLogin?: () => void }) => {
  if (!isLoggedIn) {
    return <Level1MarketingView onLogin={() => setIsLoggedIn(true)} onNavigate={onNavigate} />;
  }

  return (
    <div className="space-y-20 pb-20">
      <CategorySelector onNavigate={onNavigate} />

      <section className="space-y-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {CAPABILITIES.map((category) => (
            <motion.div 
              key={category.id}
              whileHover={{ y: -5 }}
              className="bg-white border border-gray-100 rounded-[24px] p-8 hover:shadow-2xl transition-all cursor-pointer group flex flex-col h-full"
              onClick={() => onNavigate(category.view as ViewState)}
            >
              <div className="flex items-start justify-between mb-8">
                <div className={`p-4 rounded-2xl transition-colors relative ${
                  category.id === 'maps' ? 'bg-blue-50 text-blue-600' :
                  category.id === 'routes' ? 'bg-red-50 text-red-600' :
                  category.id === 'places' ? 'bg-green-50 text-green-600' :
                  category.id === 'environment' ? 'bg-teal-50 text-teal-600' :
                  category.id === 'ai' ? 'bg-purple-50 text-purple-600' :
                  'bg-gray-50 text-gray-600'
                }`}>
                  {category.icon}
                  {category.id === 'ai' && (
                    <>
                      <div className="absolute -top-1 -right-1">
                        <Sparkles className="w-4 h-4 text-purple-500 animate-pulse" />
                      </div>
                      <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-google-blue text-white text-[8px] font-bold px-1.5 py-0.5 rounded-full shadow-sm">
                        NEW
                      </div>
                    </>
                  )}
                </div>
                <ArrowRight className="w-6 h-6 text-gray-300 group-hover:text-google-blue transition-colors" />
              </div>

              <h3 className="text-2xl font-bold text-gray-900 mb-4 group-hover:text-google-blue transition-colors">{category.title}</h3>
              <p className="text-gray-600 mb-10 leading-relaxed">
                {category.description}
              </p>
              
              <div className="mt-auto">
                <div className="flex flex-wrap gap-2">
                  {category.products.map(product => {
                    const productKey = Object.keys(PRODUCT_ONTOLOGY).find(k => PRODUCT_ONTOLOGY[k].product.toLowerCase() === product.toLowerCase());
                    const isAi = PRODUCT_ONTOLOGY[productKey || '']?.isAi || product.toLowerCase().includes('ai');
                    
                    return (
                      <span 
                        key={product} 
                        className={`px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider rounded-md border transition-colors flex items-center gap-1.5 ${
                          isAi 
                            ? 'bg-blue-50 text-blue-600 border-blue-100 group-hover:bg-blue-600 group-hover:text-white group-hover:border-blue-600' 
                            : 'bg-gray-50 text-gray-500 border-gray-100 group-hover:bg-white group-hover:border-gray-200'
                        }`}
                      >
                        {isAi && <Sparkles className="w-3 h-3" />}
                        {product}
                      </span>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
};

// --- Level 2: Service Entity Page ---

// --- Level 2: Service Entity Page ---

const ImplementationSelector = ({ title, docsTabId, onNavigateToDocs, onNavigate }: { title: string, docsTabId: string, onNavigateToDocs?: (tab: string) => void, onNavigate: (id: ViewState, title?: string, origin?: ViewState) => void }) => {
  const [activePlatform, setActivePlatform] = useState('js');

  return (
    <section className="space-y-8 mt-12">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold text-gray-900">Choose your platform</h2>
        <div className="flex items-center gap-2 text-gray-400 text-sm">
          <ShieldCheck className="w-5 h-5" />
          <span>API Key Protection Enabled</span>
        </div>
      </div>
      
      <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
        <div className="flex border-b border-gray-200 bg-gray-50/50">
          {[
            { id: 'rest', name: 'REST API', icon: <Database className="w-4 h-4" /> },
            { id: 'js', name: 'JavaScript', icon: <Globe className="w-4 h-4" /> },
            { id: 'android', name: 'Android SDK', icon: <Smartphone className="w-4 h-4" /> },
            { id: 'ios', name: 'iOS SDK', icon: <Smartphone className="w-4 h-4" /> }
          ].map((platform) => (
            <button 
              key={platform.id}
              onClick={() => setActivePlatform(platform.id)}
              className={`px-8 py-4 text-sm font-bold transition-all border-b-2 ${
                activePlatform === platform.id 
                  ? 'border-blue-600 text-blue-600 bg-white' 
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <div className="flex items-center gap-2">
                {platform.icon}
                {platform.name}
              </div>
            </button>
          ))}
        </div>
        
        <div className="p-0">
          <div className="grid grid-cols-1 lg:grid-cols-3">
            {/* Left: Setup Steps */}
            <div className="p-8 border-r border-gray-100 space-y-8">
              <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest">Setup Guide</h3>
              <div className="space-y-8">
                {[
                  { step: 1, title: 'Enable API', desc: `Enable the ${title} in the Cloud Console.` },
                  { step: 2, title: 'Get API Key', desc: 'Create and restrict your API key for security.' },
                  { step: 3, title: 'Initialize', desc: 'Add the SDK to your project and initialize.' }
                ].map((step) => (
                  <div key={step.step} className="flex gap-6">
                    <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center font-bold shrink-0">
                      {step.step}
                    </div>
                    <div className="space-y-1">
                      <h4 className="font-bold text-gray-900">{step.title}</h4>
                      <p className="text-sm text-gray-500 leading-relaxed">{step.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
              <button 
                onClick={() => onNavigateToDocs ? onNavigateToDocs(docsTabId) : onNavigate('docs')}
                className="w-full py-3 text-sm font-bold text-blue-600 border border-blue-200 rounded-xl hover:bg-blue-50 transition-colors mt-4"
              >
                Documentation
              </button>
            </div>

            {/* Right: Code Snippet */}
            <div className="lg:col-span-2 bg-gray-900 p-0 flex flex-col">
              <div className="flex items-center justify-between px-6 py-4 border-b border-white/5 bg-white/5">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-red-500/50" />
                  <div className="w-2.5 h-2.5 rounded-full bg-amber-500/50" />
                  <div className="w-2.5 h-2.5 rounded-full bg-green-500/50" />
                  <span className="ml-2 text-[10px] font-mono text-gray-400 uppercase tracking-widest">
                    {activePlatform === 'rest' ? 'cURL Request' : 'Initialization Code'}
                  </span>
                </div>
                <button className="text-[10px] font-bold text-gray-400 hover:text-white transition-colors flex items-center gap-1.5">
                  <Github className="w-3.5 h-3.5" /> View on GitHub
                </button>
              </div>
              <div className="p-8 flex-1 font-mono text-xs leading-relaxed overflow-auto max-h-[450px]">
                {activePlatform === 'rest' && (
                  <pre className="text-blue-300">
                    <span className="text-purple-400">curl</span> -X POST \<br />
                    &nbsp;&nbsp;'https://{title.toLowerCase().replace(' ', '')}.googleapis.com/v1/validateAddress?key=<span className="text-amber-400">YOUR_API_KEY</span>' \<br />
                    &nbsp;&nbsp;-H <span className="text-green-400">'Content-Type: application/json'</span> \<br />
                    &nbsp;&nbsp;-d <span className="text-green-400">'{'{'}<br />
                    &nbsp;&nbsp;&nbsp;&nbsp;"address": {'{'} "addressLines": ["1600 Amphitheatre Pkwy"] {'}'}<br />
                    &nbsp;&nbsp;{'}'}'</span>
                  </pre>
                )}
                {activePlatform === 'js' && (
                  <pre className="text-blue-300">
                    <span className="text-gray-500">// Initialize the {title}</span><br />
                    <span className="text-purple-400">const</span> service = <span className="text-purple-400">new</span> google.maps.{title.replace(' API', '')}Service();<br /><br />
                    <span className="text-purple-400">const</span> request = {'{'}<br />
                    &nbsp;&nbsp;location: <span className="text-purple-400">new</span> google.maps.LatLng(<span className="text-amber-400">-33.867</span>, <span className="text-amber-400">151.195</span>),<br />
                    &nbsp;&nbsp;radius: <span className="text-amber-400">'500'</span>,<br />
                    &nbsp;&nbsp;type: [<span className="text-green-400">'restaurant'</span>]<br />
                    {'}'};<br /><br />
                    service.nearbySearch(request, (results, status) {"=>"} {'{'}<br />
                    &nbsp;&nbsp;<span className="text-purple-400">if</span> (status === <span className="text-green-400">'OK'</span>) {'{'}<br />
                    &nbsp;&nbsp;&nbsp;&nbsp;console.log(results);<br />
                    &nbsp;&nbsp;{'}'}<br />
                    {'}'});
                  </pre>
                )}
                {activePlatform === 'android' && (
                  <pre className="text-blue-300">
                    <span className="text-gray-500">// Android SDK Initialization</span><br />
                    <span className="text-purple-400">val</span> placesClient = Places.createClient(<span className="text-purple-400">this</span>)<br /><br />
                    <span className="text-purple-400">val</span> placeFields = listOf(Place.Field.ID, Place.Field.NAME)<br />
                    <span className="text-purple-400">val</span> request = FindCurrentPlaceRequest.newInstance(placeFields)<br /><br />
                    placesClient.findCurrentPlace(request).addOnSuccessListener {'{'}<br />
                    &nbsp;&nbsp;response {"->"} <span className="text-purple-400">for</span> (placeLikelihood <span className="text-purple-400">in</span> response.placeLikelihoods) {'{'}<br />
                    &nbsp;&nbsp;&nbsp;&nbsp;Log.i(TAG, <span className="text-green-400">"Place: ${'{'}placeLikelihood.place.name{'}'}"</span>)<br />
                    &nbsp;&nbsp;{'}'}<br />
                    {'}'}
                  </pre>
                )}
                {activePlatform === 'ios' && (
                  <pre className="text-blue-300">
                    <span className="text-gray-500">// iOS SDK Initialization</span><br />
                    <span className="text-purple-400">let</span> placesClient = GMSPlacesClient.shared()<br /><br />
                    placesClient.currentPlace {'{'} (placeLikelihoodList, error) <span className="text-purple-400">in</span><br />
                    &nbsp;&nbsp;<span className="text-purple-400">if let</span> error = error {'{'}<br />
                    &nbsp;&nbsp;&nbsp;&nbsp;print(<span className="text-green-400">"Error: \(error.localizedDescription)"</span>)<br />
                    &nbsp;&nbsp;&nbsp;&nbsp;<span className="text-purple-400">return</span><br />
                    &nbsp;&nbsp;{'}'}<br /><br />
                    &nbsp;&nbsp;<span className="text-purple-400">if let</span> list = placeLikelihoodList {'{'}<br />
                    &nbsp;&nbsp;&nbsp;&nbsp;<span className="text-purple-400">for</span> likelihood <span className="text-purple-400">in</span> list.likelihoods {'{'}<br />
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;print(<span className="text-green-400">"Place: \(likelihood.place.name)"</span>)<br />
                    &nbsp;&nbsp;&nbsp;&nbsp;{'}'}<br />
                    &nbsp;&nbsp;{'}'}<br />
                    {'}'}
                  </pre>
                )}
              </div>
              <div className="px-6 py-4 bg-white/5 border-t border-white/5 flex justify-between items-center">
                <span className="text-[10px] text-gray-500 font-mono">Ready to deploy to production</span>
                <button className="px-4 py-1.5 bg-blue-600 text-white text-[10px] font-bold rounded hover:bg-blue-700 transition-colors">
                  Copy Code
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const Level2ServiceEntity = ({ 
  view,
  title, 
  description, 
  features, 
  usageSliders, 
  onNavigate,
  onNavigateToDocs,
  onProjectClick,
  onRemixClick,
  docsTabId = 'overview',
  docsUrl,
  marketingUrl,
  marketingHighlights = [],
  isLoggedIn = true,
  onStartChat,
  pricing,
  onLogin,
  quickLinks,
  children
}: { 
  view: ViewState,
  title: string, 
  description: string, 
  features: { title: string, desc: string, id: ViewState, docsTabId?: string, documentation?: string, isAi?: boolean }[],
  usageSliders: { label: string, value: number, max: number, step: number, setter: (v: number) => void }[],
  onNavigate: (id: ViewState, title?: string, origin?: ViewState) => void,
  onNavigateToDocs?: (tab: string) => void,
  onProjectClick: (project: any) => void,
  onRemixClick: (project: any) => void,
  docsTabId?: string,
  docsUrl?: string,
  marketingUrl?: string,
  marketingHighlights?: { title: string, desc: string }[],
  isLoggedIn?: boolean,
  onStartChat: (msg: string) => void,
  pricing?: string,
  onLogin?: () => void,
  quickLinks?: { title: string, id: ViewState, isAi?: boolean }[],
  children?: React.ReactNode
}) => {
  const path = getBreadcrumbPath(view);

  if (!isLoggedIn) {
    return (
      <PlacesMarketingView 
        title={title}
        description={description}
        marketingUrl={marketingUrl || "https://mapsplatform.google.com/"}
        marketingHighlights={marketingHighlights}
        services={features.map(f => ({
          id: f.id,
          title: f.title,
          desc: f.desc,
          icon: <CheckCircle2 className="w-5 h-5 text-blue-600" />,
          docsTabId: (f as any).docsTabId
        }))}
        onNavigate={onNavigate}
        onNavigateToDocs={onNavigateToDocs}
        onStartChat={onStartChat}
        view={view}
        docsTabId={docsTabId}
        onLogin={onLogin}
      />
    );
  }

  return (
    <div className="flex flex-col lg:flex-row gap-8">
      <div className="flex-1 space-y-12">
        <ServiceBreadcrumb 
          path={path} 
          currentTitle={title} 
          setView={onNavigate} 
        />
        {/* Semantic Hero Block */}
      <section className="space-y-4">
        <div className="flex items-center gap-3">
          <h1 className="text-4xl font-bold text-gray-900">{title}</h1>
          {view === 'level2-ai' && <Sparkles className="w-8 h-8 text-purple-500 animate-pulse" />}
        </div>
        <div className="flex items-center gap-2">
          <button 
            onClick={() => onNavigateToDocs ? onNavigateToDocs(docsTabId || 'overview') : onNavigate('docs')}
            className="inline-flex items-center gap-2 px-3 py-1.5 bg-blue-50 text-blue-700 text-xs font-bold rounded-full border border-blue-100 hover:bg-blue-100 transition-colors w-fit"
          >
            <BookOpen className="w-3.5 h-3.5" />
            Documentation
          </button>
          {pricing && (
            <button 
              onClick={() => onNavigate('cost', title, view)}
              className="inline-flex items-center gap-2 px-3 py-1.5 bg-green-50 text-green-700 text-xs font-bold rounded-full border border-green-100 hover:bg-green-100 transition-colors w-fit"
            >
              <DollarSign className="w-3.5 h-3.5" />
              Pricing: {pricing}
            </button>
          )}
        </div>
        {/* Marketing description hidden as requested */}
        {/* <p className="text-lg text-gray-600 max-w-2xl mb-2">{description}</p> */}
        {/* PricingTable removed as requested */}
      </section>

      {/* Quick Links / Feature Bar */}
      {quickLinks && quickLinks.length > 0 && (
        <section className="flex flex-wrap gap-3">
          {quickLinks.map((link) => (
            <button
              key={link.title}
              onClick={() => onNavigate(link.id)}
              className={`px-6 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2 border ${
                link.isAi 
                  ? 'bg-blue-600 text-white border-blue-600 shadow-lg shadow-blue-600/20 hover:bg-blue-700' 
                  : 'bg-white text-gray-500 border-gray-200 hover:border-blue-400 hover:text-blue-600'
              }`}
            >
              {link.isAi && <Sparkles className="w-4 h-4" />}
              {link.title}
            </button>
          ))}
        </section>
      )}

      {/* Marketing Highlights from Live Site - HIDDEN AS REQUESTED */}
      {false && marketingHighlights.length > 0 && (
        <section className="space-y-6">
          <div className="flex items-center gap-2">
            <div className="h-px flex-1 bg-gray-200"></div>
            <h2 className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400 px-4">Product Highlights from Live Site</h2>
            <div className="h-px flex-1 bg-gray-200"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {marketingHighlights.map((highlight, idx) => (
              <div key={idx} className="space-y-2">
                <div className="flex items-center gap-2 text-blue-600">
                  <CheckCircle2 className="w-4 h-4" />
                  <h3 className="font-bold text-sm text-gray-900">{highlight.title}</h3>
                </div>
                <p className="text-xs text-gray-500 leading-relaxed pl-6">{highlight.desc}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Inspiration Gallery - HIDDEN AS REQUESTED */}
      {false && (
        <InspirationGallery 
          title={`Inspiration: ${title} Projects`}
          filterTag={title}
          onProjectClick={onProjectClick}
          onRemixClick={onRemixClick}
        />
      )}

      {/* Progressive Disclosure */}
      <section>
        <h2 className="text-xl font-bold mb-6">{title} Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {features.map(feature => (
            <div 
              key={feature.title} 
              className={`p-6 bg-white border ${feature.id === view ? 'border-red-500' : 'border-gray-200'} rounded-xl hover:border-blue-500 transition-all cursor-pointer group flex flex-col justify-between`}
              onClick={() => onNavigate(feature.id)}
            >
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="font-bold text-sm group-hover:text-blue-600">{feature.title}</h3>
                  {feature.isAi && <Sparkles className="w-3.5 h-3.5 text-purple-500" />}
                </div>
                <p className="text-xs text-gray-600 mb-4">{feature.desc}</p>
              </div>
              <div className="flex flex-col gap-3 mt-auto">
                {((feature as any).docsTabId || (feature as any).documentation) && (
                  <div className="flex items-center gap-2">
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        const targetTab = (feature as any).docsTabId;
                        if (onNavigateToDocs) {
                          if (targetTab && targetTab !== 'overview') {
                            onNavigateToDocs(targetTab);
                          } else {
                            onNavigateToDocs(docsTabId);
                          }
                        } else {
                          onNavigate('docs');
                        }
                      }}
                      className={`inline-flex items-center gap-1.5 text-[10px] font-bold px-2 py-1 rounded-md border w-fit transition-colors ${
                        (feature as any).docsTabId && (feature as any).docsTabId !== 'overview'
                          ? 'text-blue-600 bg-blue-50 border-blue-100 hover:bg-blue-100'
                          : 'text-red-600 bg-red-50 border-red-100 hover:bg-red-100'
                      }`}
                    >
                      <BookOpen className="w-3 h-3" />
                      Documentation
                    </button>
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        onNavigate('cost', feature.title, feature.id);
                      }}
                      className="inline-flex items-center gap-1.5 text-[10px] font-bold text-green-600 bg-green-50 px-2 py-1 rounded-md border border-green-100 w-fit hover:bg-green-100 transition-colors"
                    >
                      <DollarSign className="w-3 h-3" />
                      Pricing
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      <ImplementationSelector 
        title={title} 
        docsTabId={docsTabId} 
        onNavigateToDocs={onNavigateToDocs} 
        onNavigate={onNavigate} 
      />

      {children}

      {/* Project Blueprint - HIDDEN AS REQUESTED */}
      {/* 
      <ProjectBlueprint 
        usageSliders={usageSliders} 
        onNavigateToDocs={onNavigateToDocs} 
        description={
          <p className="text-gray-600 leading-relaxed text-lg">
            Estimate your monthly usage and see how <span className="font-bold text-gray-900">{title}</span> fits into your project architecture. Adjust the sliders to see dynamic pricing estimates and technical requirements.
          </p>
        }
      />
      */}
    </div>
    </div>
  );
};

const PlacesMarketingView = ({ title, description, marketingHighlights, marketingUrl, services, onNavigate, onNavigateToDocs, onStartChat, pricing, docsUrl, view, docsTabId, onLogin }: { title: string, description: string, marketingHighlights: { title: string, desc: string }[], marketingUrl: string, services?: { id: ViewState, title: string, desc: string, icon: React.ReactNode, docsTabId?: string }[], onNavigate?: (id: ViewState, title?: string, origin?: ViewState) => void, onNavigateToDocs?: (tab: string) => void, onStartChat?: (msg: string) => void, pricing?: string, docsUrl?: string, view?: ViewState, docsTabId?: string, onLogin?: () => void }) => {
  const path = view ? getBreadcrumbPath(view) : [];
  
  return (
    <div className="space-y-16 pb-20">
      {view && onNavigate && (
        <ServiceBreadcrumb 
          path={path} 
          currentTitle={title} 
          setView={onNavigate} 
        />
      )}
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-3xl bg-slate-900 text-white p-12 lg:p-20">
        <div className="relative z-10 max-w-3xl space-y-8">
          <h1 className="text-5xl lg:text-7xl font-bold tracking-tight leading-[0.9]">
            {title}
          </h1>
          <p className="text-xl text-slate-400 leading-relaxed max-w-2xl">
            {description}
          </p>
          {/* PricingTable removed as requested */}
          <div className="flex flex-wrap gap-4 pt-4">
            <button 
              onClick={onLogin}
              className="px-8 py-4 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-all flex items-center gap-2 shadow-lg shadow-blue-600/20"
            >
              Get Started for Free <ArrowRight className="w-5 h-5" />
            </button>
            <button className="px-8 py-4 bg-white/10 text-white border border-white/10 rounded-xl font-bold hover:bg-white/20 transition-all backdrop-blur-sm">
              Contact Sales
            </button>
            <button 
              onClick={() => {
                onNavigateToDocs ? onNavigateToDocs(docsTabId || 'overview') : onNavigate?.('docs');
              }}
              className="px-8 py-4 bg-slate-800 text-slate-300 border border-slate-700 rounded-xl font-bold hover:bg-slate-700 hover:text-white transition-all flex items-center gap-2"
            >
              <BookOpen className="w-5 h-5" /> Documentation
            </button>
          </div>
        </div>
        
        {/* Abstract Background Elements */}
        <div className="absolute top-0 right-0 w-1/2 h-full opacity-20 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-600 rounded-full blur-[120px]" />
          <div className="absolute top-1/4 right-0 w-[400px] h-[400px] bg-purple-600 rounded-full blur-[100px]" />
        </div>
      </section>

      {/* Services Section */}
      {services && (
        <section className="space-y-12">
          <div className="flex items-center gap-4">
            <h2 className="text-2xl font-bold text-slate-900">Services</h2>
            <div className="h-px flex-1 bg-slate-100" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {services.map((service, i) => (
              <div 
                key={i} 
                className="p-8 bg-white border border-slate-100 rounded-2xl hover:border-blue-200 hover:shadow-lg transition-all cursor-pointer group"
                onClick={() => onNavigate?.(service.id)}
              >
                <div className="w-10 h-10 bg-slate-50 rounded-lg flex items-center justify-center mb-6 group-hover:bg-blue-50 transition-colors">
                  {service.icon}
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2 group-hover:text-blue-600 transition-colors">{service.title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed mb-4">{service.desc}</p>
                
                <div className="flex items-center gap-2 mt-auto">
                  {service.docsTabId && (
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        onNavigateToDocs?.(service.docsTabId!);
                      }}
                      className="inline-flex items-center gap-1.5 text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded-md border border-blue-100 hover:bg-blue-100 transition-colors"
                    >
                      <BookOpen className="w-3 h-3" />
                      Documentation
                    </button>
                  )}
                  <div className="flex items-center gap-2 text-xs font-bold text-blue-600 opacity-0 group-hover:opacity-100 transition-opacity ml-auto">
                    Learn more <ArrowRight className="w-3 h-3" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Marketing Highlights Grid */}
      <section className="space-y-12">
        <div className="text-center space-y-4 max-w-2xl mx-auto">
          <h2 className="text-3xl font-bold text-slate-900">Comprehensive & Accurate Place Information</h2>
          <p className="text-slate-500">
            Display highly-accurate place information, including photos and helpful details, 
            and validate and suggest addresses as soon as they’re entered into a search.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {marketingHighlights.map((h, i) => (
            <div key={i} className="p-8 bg-white border border-slate-100 rounded-2xl hover:border-blue-200 hover:shadow-xl hover:shadow-blue-600/5 transition-all group">
              <div className="w-12 h-12 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400 mb-6 group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">{h.title}</h3>
              <p className="text-slate-500 text-sm leading-relaxed">{h.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Industry Solutions */}
      <section className="bg-slate-50 rounded-3xl p-12 lg:p-20 space-y-12">
        <div className="flex flex-col lg:flex-row gap-12 items-center">
          <div className="flex-1 space-y-6">
            <h2 className="text-3xl font-bold text-slate-900">Provide the latest details and locations</h2>
            <div className="space-y-4">
              <div className="flex gap-4">
                <div className="w-10 h-10 shrink-0 bg-white rounded-lg flex items-center justify-center shadow-sm">
                  <MapIcon className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900">Find the best location</h4>
                  <p className="text-sm text-slate-500">Help users find the right places with comprehensive data.</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="w-10 h-10 shrink-0 bg-white rounded-lg flex items-center justify-center shadow-sm">
                  <Search className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900">Make searching faster</h4>
                  <p className="text-sm text-slate-500">Provide fast and accurate search results as users type.</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="w-10 h-10 shrink-0 bg-white rounded-lg flex items-center justify-center shadow-sm">
                  <Sparkles className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900">Explore AI-powered summaries</h4>
                  <p className="text-sm text-slate-500">Discover related products and AI-generated summaries.</p>
                </div>
              </div>
            </div>
          </div>
          <div className="flex-1 w-full aspect-square bg-white rounded-2xl border border-slate-200 shadow-2xl shadow-slate-200/50 flex items-center justify-center text-slate-300 font-mono text-xs p-8 text-center">
            [ Interactive Marketing Visualization Placeholder ]
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="text-center py-12 space-y-8">
        <h2 className="text-4xl font-bold text-slate-900">Start building with {title}</h2>
        <div className="flex justify-center gap-4">
          <button 
            onClick={onLogin}
            className="px-10 py-4 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-all shadow-xl shadow-blue-600/20"
          >
            Create Account
          </button>
          <button 
            onClick={() => onNavigate?.('cost', title, view)}
            className="px-10 py-4 bg-white border border-slate-200 text-slate-900 rounded-xl font-bold hover:bg-slate-50 transition-all"
          >
            View Pricing
          </button>
        </div>
      </section>
    </div>
  );
};

const Level2PlacesOverview = ({ onNavigate, onNavigateToDocs, isLoggedIn, onProjectClick, onRemixClick, onStartChat, onLogin }: { onNavigate: (id: ViewState, title?: string, origin?: ViewState) => void, onNavigateToDocs?: (tab: string) => void, isLoggedIn: boolean, onProjectClick: (project: any) => void, onRemixClick: (project: any) => void, onStartChat: (msg: string) => void, onLogin?: () => void }) => {
  const [placesUsage, setPlacesUsage] = useState(20000);

  const features = [
    { 
      title: 'Address Validation', 
      desc: 'Verify an address and its components to ensure accuracy.', 
      id: 'level2-address' as ViewState, 
      pricing: PRODUCT_ONTOLOGY['address validation']?.pricing, 
      documentation: PRODUCT_ONTOLOGY['address validation']?.documentation, 
      docsTabId: 'places-address' 
    },
    { 
      title: 'Geocoding', 
      desc: 'Convert addresses to coordinates and vice versa.', 
      id: 'level2-geocoding' as ViewState, 
      pricing: PRODUCT_ONTOLOGY['geocoding']?.pricing, 
      documentation: PRODUCT_ONTOLOGY['geocoding']?.documentation, 
      docsTabId: 'places-geocoding' 
    },
    { 
      title: 'Places API', 
      desc: 'Rich data for over 250 million places worldwide.', 
      id: 'level2-places-api' as ViewState, 
      pricing: PRODUCT_ONTOLOGY['places api']?.pricing, 
      documentation: PRODUCT_ONTOLOGY['places api']?.documentation, 
      docsTabId: 'places-overview' 
    },
    { 
      title: 'Grounding Lite', 
      desc: 'AI grounding for places and location data.', 
      id: 'level2-places' as ViewState, 
      pricing: PRODUCT_ONTOLOGY['grounding lite']?.pricing, 
      documentation: PRODUCT_ONTOLOGY['grounding lite']?.documentation, 
      docsTabId: 'overview',
      isAi: true
    },
    { 
      title: 'Places UI Kit', 
      desc: 'Pre-built UI components for Places features.', 
      id: 'level2-places-uikit' as ViewState, 
      pricing: PRODUCT_ONTOLOGY['places ui kit']?.pricing, 
      documentation: PRODUCT_ONTOLOGY['places ui kit']?.documentation, 
      docsTabId: 'places-library' 
    }
  ];

  const usageSliders = [
    { label: 'Monthly Places Requests', value: placesUsage, max: 100000, step: 1000, setter: setPlacesUsage }
  ];

  return (
    <Level2ServiceEntity 
      view="level2-places"
      title="Places" 
      description="The Places product suite provides comprehensive data and tools to help your users find, verify, and explore locations around the world." 
      features={features} 
      usageSliders={usageSliders} 
      onNavigate={onNavigate} 
      onNavigateToDocs={onNavigateToDocs}
      onProjectClick={onProjectClick}
      onRemixClick={onRemixClick}
      docsTabId="places"
      docsUrl="https://developers.google.com/maps/documentation/javascript/places"
      marketingUrl="https://mapsplatform.google.com/maps-products/places/"
      marketingHighlights={[
        { title: "Find the best location", desc: "Help users find the right places with comprehensive data." },
        { title: "Make searching faster", desc: "Provide fast and accurate search results as users type." },
        { title: "Get up-to-date info", desc: "Access the latest details about millions of places." },
        { title: "Bring locations to life", desc: "Use high-quality photos and reviews to showcase places." },
        { title: "Show nearby places", desc: "Help buyers and renters find the perfect spots nearby." },
        { title: "AI-powered summaries", desc: "Explore AI-generated summaries of place information." }
      ]}
      isLoggedIn={isLoggedIn}
      onStartChat={onStartChat}
      pricing={PRODUCT_ONTOLOGY['places api']?.pricing}
      onLogin={onLogin}
      quickLinks={[
        { title: 'Address Validation', id: 'level2-address' },
        { title: 'Geocoding', id: 'level2-geocoding' },
        { title: 'Places API', id: 'level2-places-api' },
        { title: 'Grounding Lite', id: 'level2-places', isAi: true },
        { title: 'Places UI Kit', id: 'level2-places-uikit' }
      ]}
    />
  );
};

const Level2PlacesAPI = ({ onNavigate, onNavigateToDocs, isLoggedIn, onProjectClick, onRemixClick, onStartChat, onLogin }: { onNavigate: (id: ViewState, title?: string, origin?: ViewState) => void, onNavigateToDocs?: (tab: string) => void, isLoggedIn: boolean, onProjectClick: (project: any) => void, onRemixClick: (project: any) => void, onStartChat: (msg: string) => void, onLogin?: () => void }) => {
  const [autocompleteUsage, setAutocompleteUsage] = useState(10000);
  const [detailsUsage, setDetailsUsage] = useState(5000);

  const features = [
    { title: 'Autocomplete', desc: 'Return place predictions as users type.', id: 'autocomplete' as ViewState, documentation: "https://developers.google.com/maps/documentation/javascript/places#place_autocomplete", docsTabId: 'places-overview' },
    { title: 'Nearby Search', desc: 'Find places based on a location.', id: 'nearby' as ViewState, documentation: "https://developers.google.com/maps/documentation/javascript/places#place_search", docsTabId: 'places-overview' },
    { title: 'Text Search', desc: 'Search for places using a text string.', id: 'text-search' as ViewState, documentation: "https://developers.google.com/maps/documentation/javascript/places#TextSearchRequests", docsTabId: 'places-overview' },
    { title: 'Place Details', desc: 'Retrieve rich info like reviews.', id: 'details' as ViewState, documentation: "https://developers.google.com/maps/documentation/javascript/places#place_details", docsTabId: 'places-overview' },
    { title: 'Photos', desc: 'Access high-quality photos of places.', id: 'photos' as ViewState, documentation: "https://developers.google.com/maps/documentation/javascript/places#place_photos", docsTabId: 'places-overview' }
  ];

  const usageSliders = [
    { label: 'Monthly Autocomplete Sessions', value: autocompleteUsage, max: 100000, step: 1000, setter: setAutocompleteUsage },
    { label: 'Place Details (Basic)', value: detailsUsage, max: 50000, step: 500, setter: setDetailsUsage }
  ];

  return (
    <Level2ServiceEntity 
      view="level2-places-api"
      title="Places API"
      description="Help users discover the world with rich data for over 250 million places."
      features={features}
      usageSliders={usageSliders}
      onNavigate={onNavigate}
      onNavigateToDocs={onNavigateToDocs}
      onProjectClick={onProjectClick}
      onRemixClick={onRemixClick}
      docsTabId="places-overview"
      docsUrl="https://developers.google.com/maps/documentation/javascript/places"
      marketingUrl="https://mapsplatform.google.com/maps-products/places/"
      marketingHighlights={[
        { title: "Find the best location", desc: "Help users find the right places with comprehensive data." },
        { title: "Make searching faster", desc: "Provide fast and accurate search results as users type." },
        { title: "Get up-to-date info", desc: "Access the latest details about millions of places." },
        { title: "Bring locations to life", desc: "Use high-quality photos and reviews to showcase places." },
        { title: "EV Charging info", desc: "Get real-time information on EV chargers for drivers." },
        { title: "AI-powered summaries", desc: "Explore AI-generated summaries of place information." }
      ]}
      isLoggedIn={isLoggedIn}
      onStartChat={onStartChat}
      onLogin={onLogin}
      quickLinks={[
        { title: 'Address Validation', id: 'level2-address' },
        { title: 'Geocoding', id: 'level2-geocoding' },
        { title: 'Places API', id: 'level2-places-api' },
        { title: 'Grounding Lite', id: 'level2-places', isAi: true },
        { title: 'Places UI Kit', id: 'level2-places-uikit' }
      ]}
    />
  );
};

const Level2AddressValidation = ({ onNavigate, onNavigateToDocs, isLoggedIn, onProjectClick, onRemixClick, onStartChat, onLogin }: { onNavigate: (id: ViewState, title?: string, origin?: ViewState) => void, onNavigateToDocs?: (tab: string) => void, isLoggedIn: boolean, onProjectClick: (project: any) => void, onRemixClick: (project: any) => void, onStartChat: (msg: string) => void, onLogin?: () => void }) => {
  const [validationUsage, setValidationUsage] = useState(5000);

  const features = [
    { title: 'Address Validation API', desc: 'Verify an address and its components.', id: 'validate-address' as ViewState, documentation: PRODUCT_ONTOLOGY['address validation']?.documentation, docsTabId: 'places-address' }
  ];

  const usageSliders = [
    { label: 'Monthly Address Validations', value: validationUsage, max: 50000, step: 500, setter: setValidationUsage }
  ];

  return (
    <Level2ServiceEntity 
      view="level2-address"
      title="Address Validation"
      description="Ensure accurate deliveries and account sign-ups with high-precision address data."
      features={features}
      usageSliders={usageSliders}
      onNavigate={onNavigate}
      onNavigateToDocs={onNavigateToDocs}
      onProjectClick={onProjectClick}
      onRemixClick={onRemixClick}
      docsTabId="places-address"
      docsUrl="https://developers.google.com/maps/documentation/address-validation"
      marketingUrl="https://mapsplatform.google.com/maps-products/address-validation/"
      marketingHighlights={[
        { title: "Verify address existence", desc: "Confirm that an address actually exists." },
        { title: "Flag incomplete inputs", desc: "Identify missing or incorrect address components." },
        { title: "Format for delivery", desc: "Ensure addresses are correctly formatted for postal services." },
        { title: "Reduce checkout friction", desc: "Speed up the checkout process with accurate address entry." },
        { title: "Improve delivery success", desc: "Increase the likelihood of successful first-time deliveries." }
      ]}
      isLoggedIn={isLoggedIn}
      onStartChat={onStartChat}
      pricing={PRODUCT_ONTOLOGY['address validation']?.pricing}
      onLogin={onLogin}
      quickLinks={[
        { title: 'Address Validation', id: 'level2-address' },
        { title: 'Geocoding', id: 'level2-geocoding' },
        { title: 'Places API', id: 'level2-places-api' },
        { title: 'Grounding Lite', id: 'level2-places', isAi: true },
        { title: 'Places UI Kit', id: 'level2-places-uikit' }
      ]}
    />
  );
};

const Level2Geocoding = ({ onNavigate, onNavigateToDocs, isLoggedIn, onProjectClick, onRemixClick, onStartChat, onLogin }: { onNavigate: (id: ViewState, title?: string, origin?: ViewState) => void, onNavigateToDocs?: (tab: string) => void, isLoggedIn: boolean, onProjectClick: (project: any) => void, onRemixClick: (project: any) => void, onStartChat: (msg: string) => void, onLogin?: () => void }) => {
  const [geocodingUsage, setGeocodingUsage] = useState(10000);
  const [geolocationUsage, setGeolocationUsage] = useState(5000);

  const features = [
    { title: 'Geocoding API', desc: 'Convert addresses to coordinates.', id: 'geocode' as ViewState, documentation: PRODUCT_ONTOLOGY['geocoding']?.documentation, docsTabId: 'places-geocoding' },
    { title: 'Geolocation API', desc: 'Find device location via cell/WiFi.', id: 'level2-geocoding' as ViewState, documentation: PRODUCT_ONTOLOGY['geolocation']?.documentation, docsTabId: 'places-geolocation' }
  ];

  const usageSliders = [
    { label: 'Monthly Geocoding API Requests', value: geocodingUsage, max: 100000, step: 1000, setter: setGeocodingUsage },
    { label: 'Monthly Geolocation API Requests', value: geolocationUsage, max: 100000, step: 1000, setter: setGeolocationUsage }
  ];

  return (
    <Level2ServiceEntity 
      view="level2-geocoding"
      title="Geocoding"
      description="Convert between addresses and geographic coordinates to power location-based features."
      features={features}
      usageSliders={usageSliders}
      onNavigate={onNavigate}
      onNavigateToDocs={onNavigateToDocs}
      onProjectClick={onProjectClick}
      onRemixClick={onRemixClick}
      docsTabId="places-geocoding"
      docsUrl="https://developers.google.com/maps/documentation/geocoding/overview"
      marketingUrl="https://mapsplatform.google.com/maps-products/geocoding/"
      marketingHighlights={[
        { title: "Geocoding API", desc: "Convert addresses into geographic coordinates." },
        { title: "Reverse Geocoding API", desc: "Convert geographic coordinates into human-readable addresses." },
        { title: "Global Coverage", desc: "Access high-quality geocoding data for locations around the world." },
        { title: "High Precision", desc: "Get precise coordinates for accurate mapping and analysis." },
        { title: "Place ID Support", desc: "Use Place IDs for more consistent results across APIs." }
      ]}
      isLoggedIn={isLoggedIn}
      onStartChat={onStartChat}
      onLogin={onLogin}
      quickLinks={[
        { title: 'Address Validation', id: 'level2-address' },
        { title: 'Geocoding', id: 'level2-geocoding' },
        { title: 'Places API', id: 'level2-places-api' },
        { title: 'Grounding Lite', id: 'level2-places', isAi: true },
        { title: 'Places UI Kit', id: 'level2-places-uikit' }
      ]}
    />
  );
};

// --- Level 3: Feature/Method Page ---

// --- Shared Level 3 Components ---


const Level3ValidateAddress = ({ setView, onNavigateToDocs, isLoggedIn, onProjectClick, onRemixClick, onStartChat, onLogin }: { setView: (v: ViewState, t?: string, o?: ViewState) => void, onNavigateToDocs?: (tab: string) => void, isLoggedIn: boolean, onProjectClick: (project: any) => void, onRemixClick: (project: any) => void, onStartChat: (msg: string) => void, onLogin?: () => void }) => {
  const path = getBreadcrumbPath('validate-address');
  if (!isLoggedIn) {
    return <PlacesMarketingView 
      title="Address Validation"
      description="Verify and normalize addresses for accurate delivery and billing."
      marketingHighlights={[
        { title: "Verify address existence", desc: "Confirm that an address actually exists." },
        { title: "Flag incomplete inputs", desc: "Identify missing or incorrect address components." },
        { title: "Format for delivery", desc: "Ensure addresses are correctly formatted for postal services." }
      ]}
      marketingUrl="https://mapsplatform.google.com/maps-products/address-validation/"
      onNavigate={(id) => setView(id as ViewState)} 
      onNavigateToDocs={onNavigateToDocs}
      docsTabId="places-address"
      onLogin={onLogin}
    />;
  }
  return (
    <main className="flex-1 space-y-12">
        <ServiceBreadcrumb 
          path={path} 
          currentTitle="Validate Address" 
          setView={setView} 
        />
        <section className="space-y-4">
          <h1 className="text-3xl font-bold text-gray-900">Address Validation</h1>
          <p className="text-gray-600 leading-relaxed mb-2">
            The Address Validation API is a service that accepts an address. It identifies address components and validates them. 
            It also corrects the address and provides information about the address, such as whether it is a residential or commercial address.
          </p>
          <div className="flex items-center gap-2">
            <button 
              onClick={() => onNavigateToDocs ? onNavigateToDocs('places-address') : setView('docs')}
              className="inline-flex items-center gap-2 px-3 py-1.5 bg-blue-50 text-blue-700 text-xs font-bold rounded-full border border-blue-100 hover:bg-blue-100 transition-colors w-fit"
            >
              <BookOpen className="w-3.5 h-3.5" />
              Documentation
            </button>
            <button 
              onClick={() => setView('cost', 'Address Validation', 'validate-address')}
              className="inline-flex items-center gap-2 px-3 py-1.5 bg-green-50 text-green-700 text-xs font-bold rounded-full border border-green-100 hover:bg-green-100 transition-colors w-fit"
            >
              <DollarSign className="w-3.5 h-3.5" />
              Pricing
            </button>
          </div>
        </section>

        {/* Product Highlights from Live Site - HIDDEN AS REQUESTED */}
        {false && (
          <section className="space-y-6">
            <div className="flex items-center gap-2">
              <div className="h-px flex-1 bg-gray-200"></div>
              <h2 className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400 px-4">Product Highlights from Live Site</h2>
              <div className="h-px flex-1 bg-gray-200"></div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { title: "Verify address existence", desc: "Confirm that an address actually exists." },
                { title: "Flag incomplete inputs", desc: "Identify missing or incorrect address components." },
                { title: "Format for delivery", desc: "Ensure addresses are correctly formatted for postal services." }
              ].map((benefit, idx) => (
                <div key={idx} className="space-y-2">
                  <div className="flex items-center gap-2 text-blue-600">
                    <CheckCircle2 className="w-4 h-4" />
                    <h3 className="font-bold text-sm text-gray-900">{benefit.title}</h3>
                  </div>
                  <p className="text-xs text-gray-500 leading-relaxed pl-6">{benefit.desc}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Code Implementation */}
        <ImplementationSelector 
          title="Address Validation" 
          docsTabId="places-address" 
          onNavigateToDocs={onNavigateToDocs} 
          onNavigate={setView} 
        />

        <Level3TechnicalResources setView={setView} onNavigateToDocs={onNavigateToDocs} onProjectClick={onProjectClick} onRemixClick={onRemixClick} title="Address Validation" docsTabId="places-address" />
      </main>
  );
};

const Level3Geocode = ({ setView, onNavigateToDocs, isLoggedIn, onProjectClick, onRemixClick, onStartChat, onLogin }: { setView: (v: ViewState, t?: string, o?: ViewState) => void, onNavigateToDocs?: (tab: string) => void, isLoggedIn: boolean, onProjectClick: (project: any) => void, onRemixClick: (project: any) => void, onStartChat: (msg: string) => void, onLogin?: () => void }) => {
  const path = getBreadcrumbPath('geocode');
  if (!isLoggedIn) {
    return <PlacesMarketingView 
      title="Geocoding API"
      description="Convert addresses into geographic coordinates and vice versa."
      marketingHighlights={[
        { title: "Geocoding API", desc: "Convert addresses into geographic coordinates." },
        { title: "Global Coverage", desc: "Access high-quality geocoding data for locations around the world." },
        { title: "High Precision", desc: "Get precise coordinates for accurate mapping and analysis." }
      ]}
      marketingUrl="https://mapsplatform.google.com/maps-products/geocoding/"
      onNavigate={(id) => setView(id as ViewState)} 
      onNavigateToDocs={onNavigateToDocs}
      docsTabId="places-geocoding"
      onLogin={onLogin}
    />;
  }
  return (
    <main className="flex-1 space-y-12">
        <ServiceBreadcrumb 
          path={path} 
          currentTitle="Geocoding API" 
          setView={setView} 
        />
        <section className="space-y-4">
          <h1 className="text-3xl font-bold text-gray-900">Geocoding API</h1>
          <div className="flex items-center gap-2">
            <button 
              onClick={() => onNavigateToDocs ? onNavigateToDocs('places-geocoding') : setView('docs')}
              className="inline-flex items-center gap-2 px-3 py-1.5 bg-blue-50 text-blue-700 text-xs font-bold rounded-full border border-blue-100 hover:bg-blue-100 transition-colors w-fit"
            >
              <BookOpen className="w-3.5 h-3.5" />
              Documentation
            </button>
            <button 
              onClick={() => setView('cost', 'Geocoding API', 'geocode')}
              className="inline-flex items-center gap-2 px-3 py-1.5 bg-green-50 text-green-700 text-xs font-bold rounded-full border border-green-100 hover:bg-green-100 transition-colors w-fit"
            >
              <DollarSign className="w-3.5 h-3.5" />
              Pricing
            </button>
          </div>
        </section>

        {/* Product Highlights from Live Site - HIDDEN AS REQUESTED */}
        {false && (
          <section className="space-y-6">
            <div className="flex items-center gap-2">
              <div className="h-px flex-1 bg-gray-200"></div>
              <h2 className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400 px-4">Product Highlights from Live Site</h2>
              <div className="h-px flex-1 bg-gray-200"></div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { title: "Forward Geocoding", desc: "Convert addresses into geographic coordinates." },
                { title: "Global Coverage", desc: "Access high-quality geocoding data for locations around the world." },
                { title: "High Precision", desc: "Get precise coordinates for accurate mapping and analysis." }
              ].map((benefit, idx) => (
                <div key={idx} className="space-y-2">
                  <div className="flex items-center gap-2 text-blue-600">
                    <CheckCircle2 className="w-4 h-4" />
                    <h3 className="font-bold text-sm text-gray-900">{benefit.title}</h3>
                  </div>
                  <p className="text-xs text-gray-500 leading-relaxed pl-6">{benefit.desc}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Code Implementation */}
        <ImplementationSelector 
          title="Geocoding API" 
          docsTabId="places-geocoding" 
          onNavigateToDocs={onNavigateToDocs} 
          onNavigate={setView} 
        />

        <Level3TechnicalResources setView={setView} onNavigateToDocs={onNavigateToDocs} onProjectClick={onProjectClick} onRemixClick={onRemixClick} title="Geocoding API" docsTabId="places-geocoding" />
      </main>
  );
};

const Level3ReverseGeocode = ({ setView, onNavigateToDocs, isLoggedIn, onProjectClick, onRemixClick, onStartChat, onLogin }: { setView: (v: ViewState, t?: string, o?: ViewState) => void, onNavigateToDocs?: (tab: string) => void, isLoggedIn: boolean, onProjectClick: (project: any) => void, onRemixClick: (project: any) => void, onStartChat: (msg: string) => void, onLogin?: () => void }) => {
  const path = getBreadcrumbPath('reverse-geocode');
  if (!isLoggedIn) {
    return <PlacesMarketingView 
      title="Reverse Geocoding API"
      description="Convert geographic coordinates into human-readable addresses."
      marketingHighlights={[
        { title: "Reverse Geocoding API", desc: "Convert geographic coordinates into human-readable addresses." },
        { title: "Global Coverage", desc: "Access high-quality geocoding data for locations around the world." },
        { title: "Place ID Support", desc: "Use Place IDs for more consistent results across APIs." }
      ]}
      marketingUrl="https://mapsplatform.google.com/maps-products/geocoding/"
      onNavigate={(id) => setView(id as ViewState)} 
      onNavigateToDocs={onNavigateToDocs}
      docsTabId="places-geocoding"
      onLogin={onLogin}
    />;
  }
  return (
    <main className="flex-1 space-y-12">
        <ServiceBreadcrumb 
          path={path} 
          currentTitle="Reverse Geocoding API" 
          setView={setView} 
        />
        <section className="space-y-4">
          <h1 className="text-3xl font-bold text-gray-900">Reverse Geocoding API</h1>
          <p className="text-gray-600 leading-relaxed mb-2">
            Reverse geocoding is the process of converting geographic coordinates into a human-readable address.
          </p>
          <div className="flex items-center gap-2">
            <button 
              onClick={() => onNavigateToDocs ? onNavigateToDocs('places-geocoding') : setView('docs')}
              className="inline-flex items-center gap-2 px-3 py-1.5 bg-blue-50 text-blue-700 text-xs font-bold rounded-full border border-blue-100 hover:bg-blue-100 transition-colors w-fit"
            >
              <BookOpen className="w-3.5 h-3.5" />
              Documentation
            </button>
            <button 
              onClick={() => setView('cost', 'Reverse Geocoding API', 'reverse-geocode')}
              className="inline-flex items-center gap-2 px-3 py-1.5 bg-green-50 text-green-700 text-xs font-bold rounded-full border border-green-100 hover:bg-green-100 transition-colors w-fit"
            >
              <DollarSign className="w-3.5 h-3.5" />
              Pricing
            </button>
          </div>
        </section>

        {/* Product Highlights from Live Site - HIDDEN AS REQUESTED */}
        {false && (
          <section className="space-y-6">
            <div className="flex items-center gap-2">
              <div className="h-px flex-1 bg-gray-200"></div>
              <h2 className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400 px-4">Product Highlights from Live Site</h2>
              <div className="h-px flex-1 bg-gray-200"></div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { title: "Reverse Geocoding", desc: "Convert geographic coordinates into human-readable addresses." },
                { title: "Global Coverage", desc: "Access high-quality geocoding data for locations around the world." },
                { title: "Place ID Support", desc: "Use Place IDs for more consistent results across APIs." }
              ].map((benefit, idx) => (
                <div key={idx} className="space-y-2">
                  <div className="flex items-center gap-2 text-blue-600">
                    <CheckCircle2 className="w-4 h-4" />
                    <h3 className="font-bold text-sm text-gray-900">{benefit.title}</h3>
                  </div>
                  <p className="text-xs text-gray-500 leading-relaxed pl-6">{benefit.desc}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Code Implementation */}
        <ImplementationSelector 
          title="Reverse Geocoding API" 
          docsTabId="places-geocoding" 
          onNavigateToDocs={onNavigateToDocs} 
          onNavigate={setView} 
        />

        <Level3TechnicalResources setView={setView} onNavigateToDocs={onNavigateToDocs} onProjectClick={onProjectClick} onRemixClick={onRemixClick} title="Reverse Geocoding API" docsTabId="places-geocoding" />
      </main>
  );
};

const Level3TextSearch = ({ setView, onNavigateToDocs, isLoggedIn, onProjectClick, onRemixClick, onStartChat, onLogin }: { setView: (v: ViewState, t?: string, o?: ViewState) => void, onNavigateToDocs?: (tab: string) => void, isLoggedIn: boolean, onProjectClick: (project: any) => void, onRemixClick: (project: any) => void, onStartChat: (msg: string) => void, onLogin?: () => void }) => {
  const path = getBreadcrumbPath('text-search');
  if (!isLoggedIn) {
    return <PlacesMarketingView 
      title="Text Search"
      description="Search for places using a text string."
      marketingHighlights={[
        { title: "Find the best location", desc: "Help users find the right places with comprehensive data." },
        { title: "Get up-to-date info", desc: "Access the latest details about millions of places." },
        { title: "Bring locations to life", desc: "Use high-quality photos and reviews to showcase places." }
      ]}
      marketingUrl="https://mapsplatform.google.com/maps-products/places/"
      onNavigate={(id) => setView(id as ViewState)} 
      onNavigateToDocs={onNavigateToDocs}
      docsTabId="places-library"
      docsUrl="https://developers.google.com/maps/documentation/javascript/places"
      onLogin={onLogin}
    />;
  }
  return (
    <main className="flex-1 space-y-12">
        <ServiceBreadcrumb 
          path={path} 
          currentTitle="Text Search" 
          setView={setView} 
        />
        <section className="space-y-4">
          <h1 className="text-3xl font-bold text-gray-900">Text Search</h1>
          <p className="text-gray-600 leading-relaxed mb-2">
            Text Search returns information about a set of places based on a string — for example "pizza in New York" or "shoe stores near Ottawa" or "123 Main St". 
            The service responds with a list of places matching the text string and any location bias that has been set.
          </p>
          <div className="flex items-center gap-2">
            <button 
              onClick={() => onNavigateToDocs ? onNavigateToDocs('places-library') : setView('docs')}
              className="inline-flex items-center gap-2 px-3 py-1.5 bg-blue-50 text-blue-700 text-xs font-bold rounded-full border border-blue-100 hover:bg-blue-100 transition-colors w-fit"
            >
              <BookOpen className="w-3.5 h-3.5" />
              Documentation
            </button>
            <button 
              onClick={() => setView('cost', 'Text Search', 'text-search')}
              className="inline-flex items-center gap-2 px-3 py-1.5 bg-green-50 text-green-700 text-xs font-bold rounded-full border border-green-100 hover:bg-green-100 transition-colors w-fit"
            >
              <DollarSign className="w-3.5 h-3.5" />
              Pricing
            </button>
          </div>
        </section>

        {/* Product Highlights from Live Site - HIDDEN AS REQUESTED */}
        {false && (
          <section className="space-y-6">
            <div className="flex items-center gap-2">
              <div className="h-px flex-1 bg-gray-200"></div>
              <h2 className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400 px-4">Product Highlights from Live Site</h2>
              <div className="h-px flex-1 bg-gray-200"></div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { title: "Find the best location", desc: "Help users find the right places with comprehensive data." },
                { title: "Get up-to-date info", desc: "Access the latest details about millions of places." },
                { title: "Bring locations to life", desc: "Use high-quality photos and reviews to showcase places." }
              ].map((benefit, idx) => (
                <div key={idx} className="space-y-2">
                  <div className="flex items-center gap-2 text-blue-600">
                    <CheckCircle2 className="w-4 h-4" />
                    <h3 className="font-bold text-sm text-gray-900">{benefit.title}</h3>
                  </div>
                  <p className="text-xs text-gray-500 leading-relaxed pl-6">{benefit.desc}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Code Implementation */}
        <ImplementationSelector 
          title="Text Search" 
          docsTabId="places-library" 
          onNavigateToDocs={onNavigateToDocs} 
          onNavigate={setView} 
        />

        <Level3TechnicalResources 
          setView={setView} 
          onNavigateToDocs={onNavigateToDocs} 
          onProjectClick={onProjectClick} 
          onRemixClick={onRemixClick} 
          title="Text Search" 
          docsTabId="places-library" 
          docsUrl="https://developers.google.com/maps/documentation/javascript/places"
        />
      </main>
  );
};

const Level3Photos = ({ setView, onNavigateToDocs, isLoggedIn, onProjectClick, onRemixClick, onStartChat, onLogin }: { setView: (v: ViewState, t?: string, o?: ViewState) => void, onNavigateToDocs?: (tab: string) => void, isLoggedIn: boolean, onProjectClick: (project: any) => void, onRemixClick: (project: any) => void, onStartChat: (msg: string) => void, onLogin?: () => void }) => {
  const path = getBreadcrumbPath('photos');
  if (!isLoggedIn) {
    return <PlacesMarketingView 
      title="Places Photos"
      description="Access high-quality photos of places."
      marketingHighlights={[
        { title: "Bring locations to life", desc: "Use high-quality photos to showcase places." },
        { title: "Visual exploration", desc: "Help users explore places visually before they visit." },
        { title: "Rich metadata", desc: "Access attribution and copyright information for photos." }
      ]}
      marketingUrl="https://mapsplatform.google.com/maps-products/places/"
      onNavigate={(id) => setView(id as ViewState)} 
      onNavigateToDocs={onNavigateToDocs}
      docsTabId="places-library"
      docsUrl="https://developers.google.com/maps/documentation/javascript/places"
      onLogin={onLogin}
    />;
  }
  return (
    <main className="flex-1 space-y-12">
        <ServiceBreadcrumb 
          path={path} 
          currentTitle="Photos" 
          setView={setView} 
        />
        <section className="space-y-4">
          <h1 className="text-3xl font-bold text-gray-900">Places Photos</h1>
          <p className="text-gray-600 leading-relaxed mb-2">
            The Place Photos service gives you access to high-quality photographic content kept in the Places database. 
            When you request Place Details, photo references will be returned for the relevant place. 
            The Photos service allows you to access the referenced photos and resize the image to the optimal size for your application.
          </p>
          <div className="flex items-center gap-2">
            <button 
              onClick={() => onNavigateToDocs ? onNavigateToDocs('places-library') : setView('docs')}
              className="inline-flex items-center gap-2 px-3 py-1.5 bg-blue-50 text-blue-700 text-xs font-bold rounded-full border border-blue-100 hover:bg-blue-100 transition-colors w-fit"
            >
              <BookOpen className="w-3.5 h-3.5" />
              Documentation
            </button>
            <button 
              onClick={() => setView('cost', 'Place Photos', 'photos')}
              className="inline-flex items-center gap-2 px-3 py-1.5 bg-green-50 text-green-700 text-xs font-bold rounded-full border border-green-100 hover:bg-green-100 transition-colors w-fit"
            >
              <DollarSign className="w-3.5 h-3.5" />
              Pricing
            </button>
          </div>
        </section>

        {/* Product Highlights from Live Site - HIDDEN AS REQUESTED */}
        {false && (
          <section className="space-y-6">
            <div className="flex items-center gap-2">
              <div className="h-px flex-1 bg-gray-200"></div>
              <h2 className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400 px-4">Product Highlights from Live Site</h2>
              <div className="h-px flex-1 bg-gray-200"></div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { title: "Bring locations to life", desc: "Use high-quality photos to showcase places." },
                { title: "Visual exploration", desc: "Help users explore places visually before they visit." },
                { title: "Rich metadata", desc: "Access attribution and copyright information for photos." }
              ].map((benefit, idx) => (
                <div key={idx} className="space-y-2">
                  <div className="flex items-center gap-2 text-blue-600">
                    <CheckCircle2 className="w-4 h-4" />
                    <h3 className="font-bold text-sm text-gray-900">{benefit.title}</h3>
                  </div>
                  <p className="text-xs text-gray-500 leading-relaxed pl-6">{benefit.desc}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Code Implementation */}
        <ImplementationSelector 
          title="Place Photos" 
          docsTabId="places-library" 
          onNavigateToDocs={onNavigateToDocs} 
          onNavigate={setView} 
        />

        <Level3TechnicalResources 
          setView={setView} 
          onNavigateToDocs={onNavigateToDocs} 
          onProjectClick={onProjectClick} 
          onRemixClick={onRemixClick} 
          title="Places Photos" 
          docsTabId="places-library" 
          docsUrl="https://developers.google.com/maps/documentation/javascript/places"
        />
      </main>
  );
};

const Level3Autocomplete = ({ setView, onNavigateToDocs, isLoggedIn, onProjectClick, onRemixClick, onStartChat, onLogin }: { setView: (v: ViewState, t?: string, o?: ViewState) => void, onNavigateToDocs?: (tab: string) => void, isLoggedIn: boolean, onProjectClick: (project: any) => void, onRemixClick: (project: any) => void, onStartChat: (msg: string) => void, onLogin?: () => void }) => {
  const path = getBreadcrumbPath('autocomplete');
  if (!isLoggedIn) {
    return <PlacesMarketingView 
      title="Place Autocomplete"
      description="Provide fast and accurate search results as users type."
      marketingHighlights={[
        { title: "Make searching faster", desc: "Provide fast and accurate search results as users type." },
        { title: "Find the best location", desc: "Help users find the right places with comprehensive data." },
        { title: "Reduce checkout friction", desc: "Speed up the checkout process with accurate address entry." }
      ]}
      marketingUrl="https://mapsplatform.google.com/maps-products/places/"
      onNavigate={(id) => setView(id as ViewState)} 
      onNavigateToDocs={onNavigateToDocs}
      docsTabId="places-library"
      docsUrl="https://developers.google.com/maps/documentation/javascript/places"
      onLogin={onLogin}
    />;
  }
  return (
    <main className="flex-1 space-y-12">
        <ServiceBreadcrumb 
          path={path} 
          currentTitle="Autocomplete" 
          setView={setView} 
        />
        <section className="space-y-4">
          <h1 className="text-3xl font-bold text-gray-900">Place Autocomplete</h1>
          <p className="text-gray-600 leading-relaxed mb-2">
            The Autocomplete service returns place predictions in response to an HTTP request as the user types. 
            The service can be used to provide autocomplete functionality for text-based geographic searches, 
            by returning places such as businesses, addresses and points of interest as a user types.
          </p>
          <div className="flex items-center gap-2">
            <button 
              onClick={() => onNavigateToDocs ? onNavigateToDocs('places-library') : setView('docs')}
              className="inline-flex items-center gap-2 px-3 py-1.5 bg-blue-50 text-blue-700 text-xs font-bold rounded-full border border-blue-100 hover:bg-blue-100 transition-colors w-fit"
            >
              <BookOpen className="w-3.5 h-3.5" />
              Documentation
            </button>
            <button 
              onClick={() => setView('cost', 'Place Autocomplete', 'autocomplete')}
              className="inline-flex items-center gap-2 px-3 py-1.5 bg-green-50 text-green-700 text-xs font-bold rounded-full border border-green-100 hover:bg-green-100 transition-colors w-fit"
            >
              <DollarSign className="w-3.5 h-3.5" />
              Pricing
            </button>
          </div>
        </section>

        {/* Product Highlights from Live Site - HIDDEN AS REQUESTED */}
        {false && (
          <section className="space-y-6">
            <div className="flex items-center gap-2">
              <div className="h-px flex-1 bg-gray-200"></div>
              <h2 className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400 px-4">Product Highlights from Live Site</h2>
              <div className="h-px flex-1 bg-gray-200"></div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { title: "Make searching faster", desc: "Provide fast and accurate search results as users type." },
                { title: "Find the best location", desc: "Help users find the right places with comprehensive data." },
                { title: "Reduce checkout friction", desc: "Speed up the checkout process with accurate address entry." }
              ].map((benefit, idx) => (
                <div key={idx} className="space-y-2">
                  <div className="flex items-center gap-2 text-blue-600">
                    <CheckCircle2 className="w-4 h-4" />
                    <h3 className="font-bold text-sm text-gray-900">{benefit.title}</h3>
                  </div>
                  <p className="text-xs text-gray-500 leading-relaxed pl-6">{benefit.desc}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Code Implementation */}
        <ImplementationSelector 
          title="Place Autocomplete" 
          docsTabId="places-library" 
          onNavigateToDocs={onNavigateToDocs} 
          onNavigate={setView} 
        />

        {/* Technical Reference Matrix */}
        <section className="space-y-4">
          <div className="flex items-center gap-2">
            <h2 className="text-sm font-bold uppercase tracking-widest text-gray-400">Technical Reference Matrix</h2>
            <div className="px-1.5 py-0.5 bg-gray-100 text-[8px] font-bold rounded text-gray-500">AGENT-READABLE</div>
          </div>
          <div className="border border-gray-200 rounded-xl overflow-hidden">
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-4 py-3 font-bold text-gray-700">Parameter</th>
                  <th className="px-4 py-3 font-bold text-gray-700">Requirement</th>
                  <th className="px-4 py-3 font-bold text-gray-700">Description</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                <tr>
                  <td className="px-4 py-3 font-mono text-blue-600">input</td>
                  <td className="px-4 py-3"><span className="px-2 py-0.5 bg-red-50 text-red-600 text-[10px] font-bold rounded">MANDATORY</span></td>
                  <td className="px-4 py-3 text-gray-600">The text string on which to search.</td>
                </tr>
                <tr>
                  <td className="px-4 py-3 font-mono text-blue-600">types</td>
                  <td className="px-4 py-3"><span className="px-2 py-0.5 bg-gray-100 text-gray-600 text-[10px] font-bold rounded">OPTIONAL</span></td>
                  <td className="px-4 py-3 text-gray-600">Restricts the results to be of certain types.</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <Level3TechnicalResources 
          setView={setView} 
          onNavigateToDocs={onNavigateToDocs} 
          onProjectClick={onProjectClick} 
          onRemixClick={onRemixClick} 
          title="Place Autocomplete" 
          docsTabId="places-library" 
          docsUrl="https://developers.google.com/maps/documentation/javascript/places"
        />
      </main>
  );
};

const Level3NearbySearch = ({ setView, onNavigateToDocs, isLoggedIn, onProjectClick, onRemixClick, onStartChat, onLogin }: { setView: (v: ViewState, t?: string, o?: ViewState) => void, onNavigateToDocs?: (tab: string) => void, isLoggedIn: boolean, onProjectClick: (project: any) => void, onRemixClick: (project: any) => void, onStartChat: (msg: string) => void, onLogin?: () => void }) => {
  const path = getBreadcrumbPath('nearby');
  if (!isLoggedIn) {
    return <PlacesMarketingView 
      title="Nearby Search"
      description="Help users find the perfect spots for their trips."
      marketingHighlights={[
        { title: "Show nearby places", desc: "Help buyers and renters see what's around a property." },
        { title: "Find perfect spots", desc: "Help travelers find the perfect spots for their trips." },
        { title: "Driver assistance", desc: "Make it easy for drivers to find their passengers or destinations." }
      ]}
      marketingUrl="https://mapsplatform.google.com/maps-products/places/"
      onNavigate={(id) => setView(id as ViewState)} 
      onNavigateToDocs={onNavigateToDocs}
      docsTabId="places-library"
      docsUrl="https://developers.google.com/maps/documentation/javascript/places"
      onLogin={onLogin}
    />;
  }
  return (
    <main className="flex-1 space-y-12">
        <ServiceBreadcrumb 
          path={path} 
          currentTitle="Nearby Search" 
          setView={setView} 
        />
        <section className="space-y-4">
          <h1 className="text-3xl font-bold text-gray-900">Nearby Search</h1>
          <p className="text-gray-600 leading-relaxed mb-2">
            Nearby Search lets you search for places within a specified area by a keyword or type. 
            A Nearby Search must always include a location, which can be specified in a number of ways. 
            The most common way to specify a location is with a LatLng object.
          </p>
          <div className="flex items-center gap-2">
            <button 
              onClick={() => onNavigateToDocs ? onNavigateToDocs('places-library') : setView('docs')}
              className="inline-flex items-center gap-2 px-3 py-1.5 bg-blue-50 text-blue-700 text-xs font-bold rounded-full border border-blue-100 hover:bg-blue-100 transition-colors w-fit"
            >
              <BookOpen className="w-3.5 h-3.5" />
              Documentation
            </button>
            <button 
              onClick={() => setView('cost', 'Nearby Search', 'nearby')}
              className="inline-flex items-center gap-2 px-3 py-1.5 bg-green-50 text-green-700 text-xs font-bold rounded-full border border-green-100 hover:bg-green-100 transition-colors w-fit"
            >
              <DollarSign className="w-3.5 h-3.5" />
              Pricing
            </button>
          </div>
        </section>

        {/* Product Highlights from Live Site - HIDDEN AS REQUESTED */}
        {false && (
          <section className="space-y-6">
            <div className="flex items-center gap-2">
              <div className="h-px flex-1 bg-gray-200"></div>
              <h2 className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400 px-4">Product Highlights from Live Site</h2>
              <div className="h-px flex-1 bg-gray-200"></div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { title: "Show nearby places", desc: "Help buyers and renters see what's around a property." },
                { title: "Find perfect spots", desc: "Help travelers find the perfect spots for their trips." },
                { title: "Driver assistance", desc: "Make it easy for drivers to find their passengers or destinations." }
              ].map((benefit, idx) => (
                <div key={idx} className="space-y-2">
                  <div className="flex items-center gap-2 text-blue-600">
                    <CheckCircle2 className="w-4 h-4" />
                    <h3 className="font-bold text-sm text-gray-900">{benefit.title}</h3>
                  </div>
                  <p className="text-xs text-gray-500 leading-relaxed pl-6">{benefit.desc}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Code Implementation */}
        <ImplementationSelector 
          title="Nearby Search" 
          docsTabId="places-library" 
          onNavigateToDocs={onNavigateToDocs} 
          onNavigate={setView} 
        />

        {/* Technical Reference Matrix */}
        <section className="space-y-4">
          <div className="flex items-center gap-2">
            <h2 className="text-sm font-bold uppercase tracking-widest text-gray-400">Technical Reference Matrix</h2>
            <div className="px-1.5 py-0.5 bg-gray-100 text-[8px] font-bold rounded text-gray-500">AGENT-READABLE</div>
          </div>
          <div className="border border-gray-200 rounded-xl overflow-hidden">
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-4 py-3 font-bold text-gray-700">Parameter</th>
                  <th className="px-4 py-3 font-bold text-gray-700">Requirement</th>
                  <th className="px-4 py-3 font-bold text-gray-700">Description</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                <tr>
                  <td className="px-4 py-3 font-mono text-blue-600">location</td>
                  <td className="px-4 py-3"><span className="px-2 py-0.5 bg-red-50 text-red-600 text-[10px] font-bold rounded">MANDATORY</span></td>
                  <td className="px-4 py-3 text-gray-600">The LatLng around which to retrieve place information.</td>
                </tr>
                <tr>
                  <td className="px-4 py-3 font-mono text-blue-600">radius</td>
                  <td className="px-4 py-3"><span className="px-2 py-0.5 bg-red-50 text-red-600 text-[10px] font-bold rounded">MANDATORY</span></td>
                  <td className="px-4 py-3 text-gray-600">The distance (in meters) within which to return place results.</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <Level3TechnicalResources 
          setView={setView} 
          onNavigateToDocs={onNavigateToDocs} 
          onProjectClick={onProjectClick} 
          onRemixClick={onRemixClick} 
          title="Nearby Search" 
          docsTabId="places-library" 
          docsUrl="https://developers.google.com/maps/documentation/javascript/places"
        />
      </main>
  );
};

const Level3PlaceDetails = ({ setView, onNavigateToDocs, isLoggedIn, onProjectClick, onRemixClick, onStartChat, onLogin }: { setView: (v: ViewState, t?: string, o?: ViewState) => void, onNavigateToDocs?: (tab: string) => void, isLoggedIn: boolean, onProjectClick: (project: any) => void, onRemixClick: (project: any) => void, onStartChat: (msg: string) => void, onLogin?: () => void }) => {
  const path = getBreadcrumbPath('details');
  if (!isLoggedIn) {
    return <PlacesMarketingView 
      title="Place Details"
      description="Access the latest information about millions of places."
      marketingHighlights={[
        { title: "Get up-to-date info", desc: "Access the latest information about millions of places." },
        { title: "Bring locations to life", desc: "Use photos, reviews, and ratings to enrich your user experience." },
        { title: "AI-powered summaries", desc: "Get concise summaries of place reviews and descriptions." }
      ]}
      marketingUrl="https://mapsplatform.google.com/maps-products/places/"
      onNavigate={(id) => setView(id as ViewState)} 
      onNavigateToDocs={onNavigateToDocs}
      docsTabId="places-library"
      docsUrl="https://developers.google.com/maps/documentation/javascript/places"
      onLogin={onLogin}
    />;
  }
  return (
    <main className="flex-1 space-y-12">
        <ServiceBreadcrumb 
          path={path} 
          currentTitle="Place Details" 
          setView={setView} 
        />
        <section className="space-y-4">
          <h1 className="text-3xl font-bold text-gray-900">Place Details</h1>
          <p className="text-gray-600 leading-relaxed mb-2">
            Once you have a place ID, you can request more details about a particular establishment or point of interest by initiating a Place Details request. 
            A Place Details request returns more comprehensive information about the indicated place such as its complete address, phone number, user rating and reviews.
          </p>
          <div className="flex items-center gap-2">
            <button 
              onClick={() => onNavigateToDocs ? onNavigateToDocs('places-library') : setView('docs')}
              className="inline-flex items-center gap-2 px-3 py-1.5 bg-blue-50 text-blue-700 text-xs font-bold rounded-full border border-blue-100 hover:bg-blue-100 transition-colors w-fit"
            >
              <BookOpen className="w-3.5 h-3.5" />
              Documentation
            </button>
            <button 
              onClick={() => setView('cost', 'Place Details', 'details')}
              className="inline-flex items-center gap-2 px-3 py-1.5 bg-green-50 text-green-700 text-xs font-bold rounded-full border border-green-100 hover:bg-green-100 transition-colors w-fit"
            >
              <DollarSign className="w-3.5 h-3.5" />
              Pricing
            </button>
          </div>
        </section>

        {/* Product Highlights from Live Site - HIDDEN AS REQUESTED */}
        {false && (
          <section className="space-y-6">
            <div className="flex items-center gap-2">
              <div className="h-px flex-1 bg-gray-200"></div>
              <h2 className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400 px-4">Product Highlights from Live Site</h2>
              <div className="h-px flex-1 bg-gray-200"></div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { title: "Get up-to-date info", desc: "Access the latest information about millions of places." },
                { title: "Bring locations to life", desc: "Use photos, reviews, and ratings to enrich your user experience." },
                { title: "AI-powered summaries", desc: "Get concise summaries of place reviews and descriptions." }
              ].map((benefit, idx) => (
                <div key={idx} className="space-y-2">
                  <div className="flex items-center gap-2 text-blue-600">
                    <CheckCircle2 className="w-4 h-4" />
                    <h3 className="font-bold text-sm text-gray-900">{benefit.title}</h3>
                  </div>
                  <p className="text-xs text-gray-500 leading-relaxed pl-6">{benefit.desc}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Code Implementation */}
        <ImplementationSelector 
          title="Place Details" 
          docsTabId="places-library" 
          onNavigateToDocs={onNavigateToDocs} 
          onNavigate={setView} 
        />

        {/* Technical Reference Matrix */}
        <section className="space-y-4">
          <div className="flex items-center gap-2">
            <h2 className="text-sm font-bold uppercase tracking-widest text-gray-400">Technical Reference Matrix</h2>
            <div className="px-1.5 py-0.5 bg-gray-100 text-[8px] font-bold rounded text-gray-500">AGENT-READABLE</div>
          </div>
          <div className="border border-gray-200 rounded-xl overflow-hidden">
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-4 py-3 font-bold text-gray-700">Parameter</th>
                  <th className="px-4 py-3 font-bold text-gray-700">Requirement</th>
                  <th className="px-4 py-3 font-bold text-gray-700">Description</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                <tr>
                  <td className="px-4 py-3 font-mono text-blue-600">placeId</td>
                  <td className="px-4 py-3"><span className="px-2 py-0.5 bg-red-50 text-red-600 text-[10px] font-bold rounded">MANDATORY</span></td>
                  <td className="px-4 py-3 text-gray-600">A textual identifier that uniquely identifies a place.</td>
                </tr>
                <tr>
                  <td className="px-4 py-3 font-mono text-blue-600">fields</td>
                  <td className="px-4 py-3"><span className="px-2 py-0.5 bg-gray-100 text-gray-600 text-[10px] font-bold rounded">OPTIONAL</span></td>
                  <td className="px-4 py-3 text-gray-600">One or more fields, specifying the types of place data to return.</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <Level3TechnicalResources 
          setView={setView} 
          onNavigateToDocs={onNavigateToDocs} 
          onProjectClick={onProjectClick} 
          onRemixClick={onRemixClick} 
          title="Place Details" 
          docsTabId="places-library" 
          docsUrl="https://developers.google.com/maps/documentation/javascript/places"
        />
      </main>
  );
};

const MakerConciergeSidebarModule = ({ onStartChat }: { onStartChat: (msg: string) => void }) => {
  const [input, setInput] = useState('');
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim()) {
      onStartChat(input);
      setInput('');
    }
  };

  return (
    <div className="p-5 bg-gradient-to-br from-blue-50 to-white rounded-2xl border border-blue-100 shadow-sm space-y-3">
      <div className="flex items-center gap-2 text-[10px] font-bold text-blue-700 uppercase tracking-wider">
        <Sparkles className="w-3.5 h-3.5" />
        Maker Concierge
      </div>
      <p className="text-[11px] text-gray-600 leading-relaxed">
        Describe what you want to build, and let the AI do the rest:
      </p>
      <form onSubmit={handleSubmit} className="relative">
        <input 
          type="text" 
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder='E.g., "Fast checkout"'
          className="w-full pl-3 pr-9 py-2.5 bg-white border border-blue-200 rounded-xl shadow-sm focus:outline-none focus:border-blue-500 transition-all text-[11px]"
        />
        <button type="submit" className="absolute right-1 top-1 bottom-1 px-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
          <ArrowRight className="w-3 h-3" />
        </button>
      </form>
    </div>
  );
};

const SidebarChat = ({ messages, onSendMessage, className = "" }: { messages: {role: 'user' | 'assistant', content: string}[], onSendMessage: (msg: string) => void, className?: string }) => {
  const [input, setInput] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

  const suggestions = [
    "How do I add a dark mode?",
    "Can I add custom markers?",
    "How do I handle multiple locations?",
    "What's the best way to optimize for mobile?",
    "Can I integrate with my own database?"
  ];

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim()) {
      onSendMessage(input);
      setInput('');
    }
  };

  return (
    <div className={`flex flex-col h-full bg-white border-r border-gray-200 ${className}`}>
      <div className="p-4 border-b border-gray-100 bg-blue-50 flex items-center gap-2 shrink-0">
        <Sparkles className="w-4 h-4 text-blue-600" />
        <h3 className="font-bold text-sm text-blue-900">Maker Concierge</h3>
      </div>
      
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-4 space-y-4 no-scrollbar"
      >
        {messages.length === 0 ? (
          <div className="text-center py-8 space-y-4">
            <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center mx-auto text-blue-400">
              <MessageSquare className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <p className="text-xs font-bold text-gray-900">Welcome to Concierge</p>
              <p className="text-[10px] text-gray-500">Describe what you want to build or try a suggestion below.</p>
            </div>
          </div>
        ) : (
          messages.map((msg, i) => (
            <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[90%] p-3 rounded-2xl text-xs leading-relaxed ${
                msg.role === 'user' 
                  ? 'bg-blue-600 text-white rounded-tr-none' 
                  : 'bg-gray-100 text-gray-800 rounded-tl-none'
              }`}>
                {msg.content}
              </div>
            </div>
          ))
        )}

        {/* Suggested Prompts */}
        <div className="pt-4 space-y-2">
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-1">Suggested Prompts</p>
          <div className="flex flex-wrap gap-2">
            {suggestions.map((s, i) => (
              <button
                key={i}
                onClick={() => onSendMessage(s)}
                className="text-[10px] bg-white border border-gray-200 hover:border-blue-400 hover:text-blue-600 px-3 py-1.5 rounded-full transition-all text-left"
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="p-4 border-t border-gray-100 shrink-0">
        <div className="relative">
          <input 
            type="text" 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type a message..."
            className="w-full pl-3 pr-10 py-2 bg-gray-50 border border-gray-200 rounded-lg text-xs focus:outline-none focus:border-blue-500 transition-all"
          />
          <button type="submit" className="absolute right-1.5 top-1.5 bottom-1.5 px-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>
      </form>
    </div>
  );
};

// --- Docs View ---

const PRODUCT_DOCS: Record<string, string> = {
  'gs-platform': `
# Get Started with Google Maps Platform

Google Maps Platform is a set of APIs and SDKs that allow developers to build location-aware applications.

## Key Concepts

1. **API Key**: A unique identifier used to authenticate requests.
2. **Billing Account**: Required to use the platform, even within the free tier.
3. **Project**: A container for your APIs, billing, and credentials.

## Steps to Get Started

1. **Create a Project**: Go to the Google Cloud Console and create a new project.
2. **Enable APIs**: Enable the specific APIs you need (e.g., Maps JavaScript API).
3. **Create Credentials**: Generate an API key and restrict it to your application.
4. **Set Up Billing**: Link a billing account to your project.
  `,
  'gs-capabilities': `
# Capabilities Explorer

Discover the full range of location-based features available through Google Maps Platform.

## Core Capabilities

- **Mapping**: Display customized maps for web and mobile.
- **Routing**: Provide directions, travel times, and distance matrices.
- **Places**: Access rich data for over 250 million places.
- **Environment**: Integrate air quality, pollen, and solar data.

## Advanced Features

- **Advanced Markers**: Highly customizable HTML/CSS markers.
- **Data-driven Styling**: Visualize complex datasets directly on the map.
- **3D Maps**: Immersive 3D visualization for urban environments.
  `,
  'maps-js': `
# Maps JavaScript API

The Maps JavaScript API lets you customize maps with your own content and imagery for display on web pages and mobile devices.

## Features

- **Dynamic Maps**: Interactive maps that users can pan and zoom.
- **Markers**: Highlight specific locations with custom icons.
- **Info Windows**: Display text or images in a popup above a marker.
- **Shapes**: Draw polylines, polygons, circles, and rectangles.
- **Data Layer**: Display GeoJSON and other data formats.

## Basic Example

\`\`\`javascript
function initMap() {
  const map = new google.maps.Map(document.getElementById("map"), {
    center: { lat: -34.397, lng: 150.644 },
    zoom: 8,
  });
}
\`\`\`
  `,
  'routes-api': `
# Routes API

The Routes API provides directions and travel times between locations.

## Capabilities

- **Routes API**: Get directions for driving, walking, bicycling, and transit.
- **Distance Matrix**: Calculate travel times and distances for multiple origins and destinations.
- **Roads API**: Snap coordinates to roads and get speed limits.

## Key Features

- **Real-time Traffic**: Account for current traffic conditions in travel time estimates.
- **Waypoints**: Add intermediate stops to your routes.
- **Route Optimization**: Reorder waypoints for the most efficient path.
  `,
  'routes-roads': `
# Roads API

The Roads API identifies the roads a vehicle is traveling along and provides additional metadata about those roads, such as speed limits.

## Services

- **Snap to Roads**: Snap GPS coordinates to the most likely road segments.
- **Nearest Roads**: Find the closest road segments for a given set of coordinates.
- **Speed Limits**: Get the posted speed limits for road segments.

## Use Cases

- **Asset Tracking**: Improve the accuracy of vehicle tracking by snapping positions to the road network.
- **Driver Safety**: Monitor vehicle speeds against posted limits to encourage safer driving.
- **Mileage Reporting**: Calculate more accurate travel distances for billing or reimbursement.
  `,
  'places-api': `
# Places API

The Places API provides rich information about over 250 million places around the world.

## Services

- **Place Search**: Find places based on location, category, or keyword.
- **Place Details**: Get in-depth information like address, phone number, ratings, and reviews.
- **Place Photos**: Access high-quality photos of places.
- **Autocomplete**: Provide real-time place suggestions as users type.

## Use Cases

- **Store Locators**: Help users find your nearest business locations.
- **Travel Planning**: Allow users to discover and explore new destinations.
- **Address Validation**: Ensure accurate address entry in forms.
  `,
  'env-air': `
# Air Quality API

The Air Quality API provides real-time air quality data for locations around the world.

## Data Points

- **Air Quality Index (AQI)**: A standardized measure of air quality.
- **Pollutants**: Detailed information on specific pollutants like PM2.5, PM10, NO2, etc.
- **Health Recommendations**: Actionable advice based on current air quality levels.

## Features

- **Current Conditions**: Get the latest air quality data for any coordinate.
- **Hourly Forecast**: Plan ahead with air quality predictions for the next 96 hours.
- **History**: Access historical air quality data for analysis.
  `,
  'sol-builder': `
# Maps Builder Agent

The Maps Builder agent is an AI-powered tool that helps you design and implement Google Maps Platform solutions.

## How it Works

1. **Describe Your Goal**: Tell the agent what you want to build (e.g., "a store locator for a retail chain").
2. **AI Analysis**: The agent analyzes your request and recommends the best APIs and implementation strategies.
3. **Code Generation**: Receive boilerplate code and configuration snippets to jumpstart your development.
4. **Interactive Refinement**: Iterate with the agent to fine-tune your solution.

## Benefits

- **Faster Time to Market**: Reduce development time with AI-assisted design.
- **Best Practices**: Ensure your implementation follows Google Maps Platform best practices.
- **Reduced Complexity**: Let the AI handle the intricacies of API selection and configuration.
  `
};

interface DocTile {
  title: string;
  description: string;
  icon: React.ReactNode;
}

const PRODUCT_TILES: Record<string, DocTile[]> = {
  'maps-aerial': [
    { 
      title: 'Get started with Google Maps Platform', 
      description: 'Create an account, generate an API key, generate a session token, and then start building.', 
      icon: <Compass className="w-6 h-6" /> 
    },
    { 
      title: 'Request an existing aerial view video', 
      description: 'This usage assumes that Google has already generated all of the aerial view videos that you need.', 
      icon: <PlayCircle className="w-6 h-6" /> 
    },
    { 
      title: "Request a video's metadata", 
      description: 'View metadata associated with a given video, such as freshness and length.', 
      icon: <FileText className="w-6 h-6" /> 
    },
    { 
      title: 'Generate a new aerial view video', 
      description: "This usage assumes that Google hasn't already generated the aerial view video that you need, and you'll need to generate a new one.", 
      icon: <Video className="w-6 h-6" /> 
    },
    { 
      title: 'View the API reference', 
      description: 'View the Aerial View REST and gRPC API reference.', 
      icon: <Code2 className="w-6 h-6" /> 
    }
  ]
};

const GenericDocContent = ({ 
  title, 
  description, 
  icon, 
  docsUrl, 
  marketingUrl, 
  content,
  tiles,
  onNavigate,
  viewId
}: { 
  title: string, 
  description?: string, 
  icon?: React.ReactNode, 
  docsUrl?: string, 
  marketingUrl?: string, 
  content?: string,
  tiles?: DocTile[],
  onNavigate?: (v: ViewState) => void,
  viewId?: ViewState
}) => (
  <section className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-5xl mx-auto">
    <div className="space-y-8">
      <div className="flex flex-col lg:flex-row items-start justify-between gap-8">
        <div className="space-y-4 flex-1">
          <div className="flex items-center gap-4">
            {icon && <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 shadow-sm">{icon}</div>}
            <h1 className="text-5xl font-bold text-gray-900 tracking-tight">{title}</h1>
          </div>
          {/* Marketing description hidden as requested */}
          {/* <p className="text-xl text-gray-500 max-w-3xl leading-relaxed">
            {description || `Comprehensive technical documentation, implementation guides, and API references for ${title}.`}
          </p> */}
          
          {tiles && (
            <div className="relative max-w-xl pt-4">
              <Search className="absolute left-4 top-[calc(1rem+1.125rem)] -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input 
                type="text"
                placeholder={`Search ${title} docs`}
                className="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-2xl text-sm focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all shadow-sm"
              />
            </div>
          )}
        </div>
        
        {marketingUrl && (
          <div className="flex flex-row lg:flex-col gap-3 shrink-0">
            {viewId && onNavigate ? (
              <button 
                onClick={() => onNavigate(viewId)}
                className="flex items-center gap-2 px-6 py-3 bg-white border border-gray-200 text-gray-700 rounded-2xl text-sm font-bold hover:bg-gray-50 transition-all shadow-sm"
              >
                <Eye className="w-4 h-4" /> Product Overview
              </button>
            ) : (
              <a 
                href={marketingUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-6 py-3 bg-white border border-gray-200 text-gray-700 rounded-2xl text-sm font-bold hover:bg-gray-50 transition-all shadow-sm"
              >
                <ExternalLink className="w-4 h-4" /> Product Overview
              </a>
            )}
          </div>
        )}
      </div>

    </div>

    <div className="space-y-16">
      {tiles && (
        <div className="space-y-8">
          <div className="flex items-center justify-between border-b border-gray-100 pb-6">
            <h2 className="text-3xl font-bold text-gray-900">Get Started</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {tiles.map((tile, i) => (
              <button 
                key={i} 
                className="p-8 bg-white border border-gray-200 rounded-[32px] hover:shadow-2xl hover:border-blue-200 transition-all group text-left flex flex-col items-start"
              >
                <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 mb-8 group-hover:scale-110 transition-transform shadow-sm">
                  {tile.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors">{tile.title}</h3>
                <p className="text-gray-500 leading-relaxed text-sm">{tile.description}</p>
              </button>
            ))}
          </div>
        </div>
      )}

      {content && (
        <div className="bg-white p-12 border border-gray-200 rounded-[40px] shadow-sm">
          <div className="prose prose-slate prose-lg max-w-none 
            prose-headings:text-gray-900 prose-headings:font-bold prose-headings:tracking-tight
            prose-h1:text-4xl prose-h1:mb-10
            prose-h2:text-2xl prose-h2:mt-12 prose-h2:mb-6 prose-h2:pb-3 prose-h2:border-b prose-h2:border-gray-100
            prose-p:text-gray-600 prose-p:leading-relaxed prose-p:mb-6
            prose-ul:my-8 prose-li:text-gray-600 prose-li:mb-3
            prose-code:bg-gray-50 prose-code:text-blue-600 prose-code:px-2 prose-code:py-1 prose-code:rounded-lg prose-code:text-[0.9em] prose-code:font-mono
            prose-pre:bg-gray-900 prose-pre:text-gray-100 prose-pre:p-8 prose-pre:rounded-3xl prose-pre:shadow-2xl prose-pre:my-10
            prose-strong:text-gray-900 prose-strong:font-bold">
            <Markdown>{content}</Markdown>
          </div>
        </div>
      )}

      {!content && !tiles && (
        <div className="p-12 bg-gray-50 border border-gray-200 rounded-[40px] border-dashed flex flex-col items-center justify-center text-center">
          <div className="w-20 h-20 bg-white rounded-full shadow-sm flex items-center justify-center mb-8">
            <FileText className="w-10 h-10 text-gray-400" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-3">Detailed Content Coming Soon</h3>
          <p className="text-lg text-gray-500 max-w-lg mb-10 leading-relaxed">
            We are currently crafting a rich, interactive documentation experience for {title}. In the meantime, you can access the full technical reference on our developer portal.
          </p>
          <button 
            onClick={() => onNavigate?.('docs')}
            className="px-8 py-4 bg-gray-900 text-white rounded-2xl text-lg font-bold hover:bg-black transition-all shadow-lg"
          >
            Go to Developer Portal
          </button>
        </div>
      )}
    </div>
  </section>
);

const docToViewStateMap: Record<string, ViewState> = {
  'maps-js': 'dynamic-maps',
  'maps-static': 'static-maps',
  'maps-sv-static': 'street-view',
  'maps-datasets': 'level2-datasets',
  'routes-api': 'level2-routes',
  'routes-roads': 'roads',
  'places-api': 'level2-places-api',
  'places-uikit': 'level2-places-uikit',
  'places-library': 'level2-places-uikit',
  'places-geocoding': 'level2-geocoding',
  'places-geolocation': 'level2-geocoding',
  'places-address': 'level2-address',
  'env-air': 'level2-environment',
  'env-pollen': 'level2-environment',
  'env-solar': 'level2-environment',
  'gs-reporting': 'usage-reports',
  'sol-builder': 'level2-ai',
  'maps': 'level2-maps',
  'routes': 'level2-routes',
  'places': 'level2-places',
  'environment': 'level2-environment',
  'analytics': 'level2-analytics',
  'solutions': 'level2-ai'
};

const isItemOrChildActive = (item: any, activeTab: string): boolean => {
  if (item.id === activeTab) return true;
  if (item.children) {
    return item.children.some((child: any) => isItemOrChildActive(child, activeTab));
  }
  return false;
};

const NavTreeNode = ({ item, activeTab, setActiveTab, expandedSubItems, toggleSubItem, level }: { item: any, activeTab: string, setActiveTab: (id: string) => void, expandedSubItems: string[], toggleSubItem: (id: string) => void, level: number }) => {
  if (item.isSeparator) {
    return <div className="h-px bg-gray-100 my-2 -ml-9 mr-4" />;
  }
  if (item.isHeader) {
    return (
      <p className="text-[11px] font-bold text-gray-900 mt-4 mb-1 -ml-4">
        {item.title}
      </p>
    );
  }

  const hasChildren = item.children && item.children.length > 0;
  const isExpanded = expandedSubItems.includes(item.id);
  const isActive = isItemOrChildActive(item, activeTab);

  return (
    <div className="space-y-1">
      <button
        onClick={() => {
          if (hasChildren) {
            toggleSubItem(item.id);
          } else {
            setActiveTab(item.id);
          }
        }}
        className={`w-full text-left px-3 py-1.5 rounded-lg transition-all flex items-center justify-between group ${
          level === 0 ? 'text-xs' : 'text-[11px]'
        } ${
          isActive 
            ? 'text-blue-600 font-bold bg-blue-50/50' 
            : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'
        }`}
        data-active-doc={isActive ? "true" : undefined}
      >
        <span className="flex items-center gap-1.5">
          {item.title}
          {item.isAi && <Sparkles className="w-3 h-3 text-purple-500" />}
        </span>
        {hasChildren && (
          <ChevronRight className={`w-2.5 h-2.5 transition-transform ${isExpanded ? 'rotate-90' : ''}`} />
        )}
      </button>
      
      {hasChildren && isExpanded && (
        <div className={`pl-4 space-y-1 border-l border-gray-100 ${level === 0 ? 'ml-2' : 'ml-1'}`}>
          {item.children.map((child: any) => (
            <NavTreeNode 
              key={child.id} 
              item={child} 
              activeTab={activeTab} 
              setActiveTab={setActiveTab} 
              expandedSubItems={expandedSubItems} 
              toggleSubItem={toggleSubItem} 
              level={level + 1} 
            />
          ))}
        </div>
      )}
    </div>
  );
};

const Docs = ({ setView, activeTab, setActiveTab, onProjectClick, onRemixClick, chatMessages, onSendMessage, originView }: { setView: (v: ViewState, t?: string) => void, activeTab: string, setActiveTab: (t: string) => void, onProjectClick: (project: any) => void, onRemixClick: (project: any) => void, chatMessages: {role: 'user' | 'assistant', content: string}[], onSendMessage: (msg: string) => void, originView?: ViewState | null }) => {
  const [searchQuery, setSearchQuery] = useState('');
  
  const currentViewState = docToViewStateMap[activeTab] || originView || 'level1';
  const path = getBreadcrumbPath(currentViewState, true);
  
  const getDocsUrl = (tab: string) => {
    const base = "https://developers.google.com/maps/documentation";
    if (tab.startsWith('gs-')) return `${base}/overview`;
    if (tab.startsWith('maps-')) return `${base}/javascript/overview`;
    if (tab === 'routes-roads') return `${base}/roads/overview`;
    if (tab.startsWith('routes-')) return `${base}/routes`;
    if (tab === 'places-library') return `${base}/javascript/places`;
    if (tab.startsWith('places-')) return `${base}/places/web-service/overview`;
    if (tab.startsWith('env-')) return `${base}/environment`;
    if (tab.startsWith('sol-')) return `${base}/industry-solutions`;
    if (tab.startsWith('res-')) return `${base}/overview`;
    
    switch (tab) {
      case 'overview': return base;
      case 'pricing': return "https://developers.google.com/maps/billing/gmp-billing";
      default: return base;
    }
  };

  const getMarketingUrl = (tab: string) => {
    const base = "https://mapsplatform.google.com/maps-products";
    if (tab.startsWith('gs-')) return base;
    if (tab.startsWith('maps-')) return `${base}/maps/`;
    if (tab.startsWith('routes-')) return `${base}/routes/`;
    if (tab.startsWith('places-')) return `${base}/places/`;
    if (tab.startsWith('env-')) return `${base}/environment/`;
    if (tab.startsWith('sol-')) return base;
    if (tab.startsWith('res-')) return base;

    switch (tab) {
      case 'overview': return base;
      case 'pricing': return "https://mapsplatform.google.com/pricing/";
      default: return base;
    }
  };

  const [expandedSections, setExpandedSections] = useState<string[]>(() => {
    if (activeTab.startsWith('gs-')) return ['get-started'];
    if (activeTab.startsWith('maps-')) return ['maps'];
    if (activeTab.startsWith('routes-')) return ['routes'];
    if (activeTab.startsWith('analytics-')) return ['analytics'];
    if (activeTab.startsWith('places-')) return ['places'];
    if (activeTab.startsWith('env-')) return ['environment'];
    if (activeTab.startsWith('sol-')) return ['solutions'];
    if (activeTab.startsWith('res-')) return ['additional'];
    return ['get-started'];
  });

  const [expandedSubItems, setExpandedSubItems] = useState<string[]>([]);

  useEffect(() => {
    const section = DOCS_SECTIONS.find(s => 
      s.id === activeTab || (s.items && s.items.some(i => i.id === activeTab))
    );
    if (section && !expandedSections.includes(section.id)) {
      setExpandedSections(prev => [...prev, section.id]);
    }
    
    // Auto-expand sub-items if active tab is a child
    DOCS_SECTIONS.forEach(s => {
      if (s.items) {
        s.items.forEach(i => {
          if ((i as any).children && (i as any).children.some((c: any) => c.id === activeTab)) {
            if (!expandedSubItems.includes(i.id)) {
              setExpandedSubItems(prev => [...prev, i.id]);
            }
          }
        });
      }
    });

    // Scroll active item into view
    const timeoutId = setTimeout(() => {
      const activeElement = document.querySelector('[data-active-doc="true"]');
      if (activeElement) {
        activeElement.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
    }, 100);
    
    return () => clearTimeout(timeoutId);
  }, [activeTab]);

  const toggleSection = (id: string) => {
    setExpandedSections(prev => 
      prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]
    );
  };

  const toggleSubItem = (id: string) => {
    setExpandedSubItems(prev => 
      prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]
    );
  };

  const filteredSections = DOCS_SECTIONS.map(section => {
    if (!searchQuery) return section;
    const filteredItems = section.items?.filter(item => {
      const matchItem = item.title?.toLowerCase().includes(searchQuery.toLowerCase());
      const matchChild = (item as any).children?.some((c: any) => c.title.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchItem || matchChild;
    });
    if (section.title.toLowerCase().includes(searchQuery.toLowerCase()) || (filteredItems && filteredItems.length > 0)) {
      return { ...section, items: filteredItems };
    }
    return null;
  }).filter(Boolean) as typeof DOCS_SECTIONS;

  const isSectionActive = (section: any) => {
    if (activeTab === section.id) return true;
    if (section.items) {
      return section.items.some((item: any) => {
        if (item.id === activeTab) return true;
        if (item.children && item.children.some((child: any) => child.id === activeTab)) return true;
        return false;
      });
    }
    return false;
  };

  const getActiveItemTitle = () => {
    for (const section of DOCS_SECTIONS) {
      if (section.id === activeTab) return section.title;
      if (section.items) {
        for (const item of section.items) {
          if (item.id === activeTab) return item.title;
          if ((item as any).children) {
            const child = (item as any).children.find((c: any) => c.id === activeTab);
            if (child) return child.title;
          }
        }
      }
    }
    return 'Documentation';
  };

  const getActiveIcon = () => {
    for (const section of DOCS_SECTIONS) {
      if (section.id === activeTab) return section.icon;
      if (section.items) {
        const isActive = section.items.some((item: any) => {
          if (item.id === activeTab) return true;
          if (item.children && item.children.some((child: any) => child.id === activeTab)) return true;
          return false;
        });
        if (isActive) return section.icon;
      }
    }
    return <FileText className="w-4 h-4" />;
  };

  const getActiveItemDescription = () => {
    for (const section of DOCS_SECTIONS) {
      if (section.id === activeTab) return (section as any).description;
      if (section.items) {
        for (const item of section.items) {
          if (item.id === activeTab) return (item as any).description;
          if ((item as any).children) {
            const child = (item as any).children.find((c: any) => c.id === activeTab);
            if (child) return (child as any).description;
          }
        }
      }
    }
    return undefined;
  };

  return (
    <div className="space-y-8">
      <ServiceBreadcrumb 
        path={path} 
        currentTitle="Resources" 
        setView={setView} 
      />
      <div className="flex flex-col lg:flex-row gap-8 h-[calc(100vh-8rem)]">
      {/* Docs Sidebar */}
      <aside className="w-full lg:w-72 shrink-0 flex flex-col gap-6 border-r border-gray-100 pr-8 overflow-y-auto custom-scrollbar">
        <div className="space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input 
              type="text"
              placeholder="Search documentation..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
            />
          </div>

          <div className="space-y-1">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-3 mb-2">Documentation</p>
            {filteredSections.map((section) => (
              <div key={section.id} className="space-y-1">
                <button
                  onClick={() => {
                    if (section.items) {
                      toggleSection(section.id);
                      if (!expandedSections.includes(section.id)) {
                        setActiveTab(section.items[0].id);
                      }
                    } else {
                      setActiveTab(section.id);
                    }
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                    isSectionActive(section)
                      ? 'bg-blue-50 text-blue-600' 
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                  data-active-doc={activeTab === section.id ? "true" : undefined}
                >
                  <div className="flex items-center gap-3">
                    {section.icon}
                    {section.title}
                  </div>
                  {section.items && (
                    <ChevronDown className={`w-3 h-3 transition-transform ${expandedSections.includes(section.id) ? '' : '-rotate-90'}`} />
                  )}
                </button>
                
                {section.items && (expandedSections.includes(section.id) || searchQuery) && (
                  <div className="pl-9 space-y-1 border-l border-blue-100 ml-5">
                    {section.items.map(item => <NavTreeNode key={item.id} item={item} activeTab={activeTab} setActiveTab={setActiveTab} expandedSubItems={expandedSubItems} toggleSubItem={toggleSubItem} level={0} />)}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="mt-auto pt-6 border-t border-gray-100">
        </div>
      </aside>

      {/* Docs Content */}
      <main className="flex-1 overflow-y-auto custom-scrollbar pr-4">
        <div className="max-w-4xl mx-auto py-4">
          {activeTab === 'overview' && (
            <section className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="space-y-8">
                <div className="space-y-4">
                  <h1 className="text-5xl font-bold text-gray-900 tracking-tight">Google Maps Platform Documentation</h1>
                  <p className="text-xl text-gray-500 max-w-2xl leading-relaxed">
                    Build location-aware applications with the world's most accurate and comprehensive map data.
                  </p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                {CAPABILITIES.map((cap) => (
                  <button 
                    key={cap.id}
                    onClick={() => {
                      const section = DOCS_SECTIONS.find(s => s.id === cap.id || (cap.id === 'datasets' && s.id === 'analytics'));
                      if (section) {
                        if (section.items && section.items.length > 0) {
                          setActiveTab(section.items[0].id);
                          if (!expandedSections.includes(section.id)) {
                            setExpandedSections(prev => [...prev, section.id]);
                          }
                        } else {
                          setActiveTab(section.id);
                        }
                      }
                    }}
                    className="bg-white border border-gray-100 rounded-2xl p-6 flex flex-col items-center text-center cursor-pointer hover:shadow-xl transition-all group"
                  >
                    <div className="mb-4 p-3 rounded-xl group-hover:bg-blue-50 transition-colors">
                      {cap.icon}
                    </div>
                    <span className="font-medium text-sm text-gray-900 mb-1">{cap.title}</span>
                    <span className="text-[11px] text-google-blue font-medium opacity-0 group-hover:opacity-100 transition-opacity">See docs</span>
                  </button>
                ))}
              </div>

              {/* Marketing banner hidden as requested */}
              {/* <div className="p-8 bg-gray-900 rounded-3xl text-white relative overflow-hidden">
                <div className="relative z-10 max-w-lg">
                  <h3 className="text-2xl font-bold mb-4">New: Advanced Markers</h3>
                  <p className="text-gray-400 mb-6 leading-relaxed">Create highly customizable, performant markers with HTML and CSS. Now available in the Maps JavaScript API.</p>
                  <button className="px-6 py-3 bg-blue-600 rounded-xl text-sm font-bold hover:bg-blue-700 transition-colors">
                    Learn More
                  </button>
                </div>
                <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-gradient-to-l from-blue-500/20 to-transparent" />
              </div> */}
            </section>
          )}

          {/* Dynamic Content Rendering */}
          {activeTab !== 'overview' && activeTab !== 'pricing' && (
            <GenericDocContent 
              title={getActiveItemTitle()} 
              description={getActiveItemDescription()}
              icon={getActiveIcon()}
              docsUrl={getDocsUrl(activeTab)}
              marketingUrl={getMarketingUrl(activeTab)}
              content={PRODUCT_DOCS[activeTab]}
              tiles={PRODUCT_TILES[activeTab]}
              onNavigate={setView}
              viewId={docToViewStateMap[activeTab]}
            />
          )}
        </div>
      </main>
    </div>
    </div>
  );
};

const Level2Maps = ({ onNavigate, onNavigateToDocs, isLoggedIn, onProjectClick, onRemixClick, onStartChat, onLogin }: { onNavigate: (id: ViewState, title?: string, origin?: ViewState) => void, onNavigateToDocs?: (tab: string) => void, isLoggedIn: boolean, onProjectClick: (project: any) => void, onRemixClick: (project: any) => void, onStartChat: (msg: string) => void, onLogin?: () => void }) => {
  const [mapLoads, setMapLoads] = useState(28000);

  const features = [
    { title: '3D Maps', desc: 'Photorealistic 3D maps and imagery.', id: 'level2-maps' as ViewState, pricing: PRODUCT_ONTOLOGY['3d maps']?.pricing, documentation: PRODUCT_ONTOLOGY['3d maps']?.documentation, docsTabId: 'maps-js' },
    { title: 'Aerial View', desc: 'Cinematic 3D aerial views of points of interest.', id: 'level2-maps' as ViewState, pricing: PRODUCT_ONTOLOGY['aerial view']?.pricing, documentation: PRODUCT_ONTOLOGY['aerial view']?.documentation, docsTabId: 'maps-aerial' },
    { title: 'Maps SDKs', desc: 'Interactive maps for web and mobile.', id: 'dynamic-maps' as ViewState, pricing: PRODUCT_ONTOLOGY['maps sdks']?.pricing, documentation: PRODUCT_ONTOLOGY['maps sdks']?.documentation, docsTabId: 'maps-js' },
    { title: 'Tiles', desc: 'High-resolution map tiles for custom visualizations.', id: 'level2-maps' as ViewState, pricing: PRODUCT_ONTOLOGY['maps tiles']?.pricing, documentation: PRODUCT_ONTOLOGY['maps tiles']?.documentation, docsTabId: 'maps-tiles' },
    { title: 'Google Earth', desc: 'Explore the world in 3D with rich geospatial data.', id: 'level2-maps' as ViewState, pricing: PRODUCT_ONTOLOGY['google earth']?.pricing, documentation: PRODUCT_ONTOLOGY['google earth']?.documentation, docsTabId: 'analytics-earth' },
    { title: 'Contextual View', desc: 'AI-powered map context and insights.', id: 'level2-maps' as ViewState, pricing: PRODUCT_ONTOLOGY['contextual view']?.pricing, documentation: PRODUCT_ONTOLOGY['contextual view']?.documentation, docsTabId: 'overview' },
    { title: 'Maps Datasets API', desc: 'Manage and visualize custom location data.', id: 'level2-datasets' as ViewState, pricing: PRODUCT_ONTOLOGY['maps datasets api']?.pricing, documentation: PRODUCT_ONTOLOGY['maps datasets api']?.documentation, docsTabId: 'maps-datasets' }
  ];

  const usageSliders = [
    { label: 'Monthly Map Loads', value: mapLoads, max: 100000, step: 1000, setter: setMapLoads }
  ];

  return (
    <Level2ServiceEntity 
      view="level2-maps"
      title="Maps" 
      description="Build with static maps and Maps SDK, Street View, and 360° imagery." 
      features={features} 
      usageSliders={usageSliders} 
      onNavigate={onNavigate} 
      onNavigateToDocs={onNavigateToDocs}
      onProjectClick={onProjectClick}
      onRemixClick={onRemixClick}
      docsTabId="maps"
      docsUrl="https://developers.google.com/maps/documentation/javascript/overview"
      marketingUrl="https://mapsplatform.google.com/maps-products/maps/"
      marketingHighlights={[
        { title: "Maps SDK", desc: "Create interactive, customized map experiences for web and mobile." },
        { title: "Static Maps", desc: "Embed simple, non-interactive map images into your site." },
        { title: "Street View", desc: "Provide 360-degree panoramic imagery from around the world." },
        { title: "Advanced Markers", desc: "Use highly customizable markers to highlight points of interest." },
        { title: "Data-driven styling", desc: "Visualize your data on the map with custom styles." }
      ]}
      isLoggedIn={isLoggedIn}
      onStartChat={onStartChat}
      pricing={PRODUCT_ONTOLOGY['maps sdks']?.pricing}
      onLogin={onLogin}
    />
  );
};

const Level2Routes = ({ onNavigate, onNavigateToDocs, isLoggedIn, onProjectClick, onRemixClick, onStartChat, onLogin }: { onNavigate: (id: ViewState, title?: string, origin?: ViewState) => void, onNavigateToDocs?: (tab: string) => void, isLoggedIn: boolean, onProjectClick: (project: any) => void, onRemixClick: (project: any) => void, onStartChat: (msg: string) => void, onLogin?: () => void }) => {
  const [routesUsage, setRoutesUsage] = useState(15000);

  const features = [
    { title: 'Navigation SDKs', desc: 'Turn-by-turn navigation for your apps.', id: 'level2-routes' as ViewState, pricing: PRODUCT_ONTOLOGY['navigation sdks']?.pricing, documentation: PRODUCT_ONTOLOGY['navigation sdks']?.documentation, docsTabId: 'routes-android' },
    { title: 'Roads API', desc: 'Snap coordinates to roads for accurate paths.', id: 'roads' as ViewState, pricing: PRODUCT_ONTOLOGY['roads api']?.pricing, documentation: PRODUCT_ONTOLOGY['roads api']?.documentation, docsTabId: 'routes-roads' },
    { title: 'Routes API', desc: 'Calculate routes and travel times between locations.', id: 'directions' as ViewState, pricing: PRODUCT_ONTOLOGY['routes api']?.pricing, documentation: PRODUCT_ONTOLOGY['routes api']?.documentation, docsTabId: 'routes-api' },
    { title: 'Route Optimization', desc: 'Optimize multi-stop routes for efficiency.', id: 'level2-routes' as ViewState, pricing: PRODUCT_ONTOLOGY['route optimization']?.pricing, documentation: PRODUCT_ONTOLOGY['route optimization']?.documentation, docsTabId: 'routes-optimization' },
    { title: 'Mobility Services', desc: 'Fleet management and on-demand solutions.', id: 'level2-routes' as ViewState, pricing: PRODUCT_ONTOLOGY['mobility services']?.pricing, documentation: PRODUCT_ONTOLOGY['mobility services']?.documentation, docsTabId: 'overview' },
    { title: 'Grounding Lite', desc: 'AI grounding for routes and navigation.', id: 'level2-routes' as ViewState, pricing: PRODUCT_ONTOLOGY['grounding lite']?.pricing, documentation: PRODUCT_ONTOLOGY['grounding lite']?.documentation, docsTabId: 'overview', isAi: true }
  ];

  const usageSliders = [
    { label: 'Monthly Routes', value: routesUsage, max: 50000, step: 500, setter: setRoutesUsage }
  ];

  return (
    <Level2ServiceEntity 
      view="level2-routes"
      title="Routes" 
      description="Provide the best way to get from A to Z with high-quality routes." 
      features={features} 
      usageSliders={usageSliders} 
      onNavigate={onNavigate} 
      onNavigateToDocs={onNavigateToDocs}
      onProjectClick={onProjectClick}
      onRemixClick={onRemixClick}
      docsTabId="routes"
      docsUrl="https://developers.google.com/maps/documentation/routes"
      marketingUrl="https://mapsplatform.google.com/maps-products/routes/"
      marketingHighlights={[
        { title: "Real-time traffic", desc: "Navigate with confidence using real-time traffic data." },
        { title: "Global routing", desc: "Move people and goods from point A to Z with efficient global routing." },
        { title: "Routing at scale", desc: "Handle high volumes of routing requests with ease." },
        { title: "Improved ETA accuracy", desc: "Provide more accurate arrival times to your users." },
        { title: "Sustainable routing", desc: "Offer more eco-friendly routing options." },
        { title: "Optimized route planning", desc: "Plan the most efficient routes for multi-stop journeys." }
      ]}
      isLoggedIn={isLoggedIn}
      onStartChat={onStartChat}
      pricing={PRODUCT_ONTOLOGY['routes api']?.pricing}
      onLogin={onLogin}
    />
  );
};

const Level2Environment = ({ onNavigate, onNavigateToDocs, isLoggedIn, onProjectClick, onRemixClick, onStartChat, onLogin }: { onNavigate: (id: ViewState, title?: string, origin?: ViewState) => void, onNavigateToDocs?: (tab: string) => void, isLoggedIn: boolean, onProjectClick: (project: any) => void, onRemixClick: (project: any) => void, onStartChat: (msg: string) => void, onLogin?: () => void }) => {
  const [envUsage, setEnvUsage] = useState(5000);

  const features = [
    { title: 'Air Quality API', desc: 'Real-time air quality data.', id: 'air-quality' as ViewState, pricing: PRODUCT_ONTOLOGY['air quality api']?.pricing, documentation: PRODUCT_ONTOLOGY['air quality api']?.documentation, docsTabId: 'env-air', isAi: true },
    { title: 'Pollen API', desc: 'Pollen levels and forecasts.', id: 'pollen' as ViewState, pricing: PRODUCT_ONTOLOGY['pollen api']?.pricing, documentation: PRODUCT_ONTOLOGY['pollen api']?.documentation, docsTabId: 'env-pollen', isAi: true },
    { title: 'Solar API', desc: 'Solar potential and rooftop data.', id: 'solar' as ViewState, pricing: PRODUCT_ONTOLOGY['solar api']?.pricing, documentation: PRODUCT_ONTOLOGY['solar api']?.documentation, docsTabId: 'env-solar', isAi: true },
    { title: 'Weather API', desc: 'Real-time weather information.', id: 'level2-environment' as ViewState, pricing: PRODUCT_ONTOLOGY['weather api']?.pricing, documentation: PRODUCT_ONTOLOGY['weather api']?.documentation, docsTabId: 'overview', isAi: true },
    { title: 'Earth Engine', desc: 'Geospatial data analysis platform.', id: 'level2-environment' as ViewState, pricing: PRODUCT_ONTOLOGY['earth engine']?.pricing, documentation: PRODUCT_ONTOLOGY['earth engine']?.documentation, docsTabId: 'overview' },
    { title: 'Grounding Lite', desc: 'AI grounding for environmental data.', id: 'level2-environment' as ViewState, pricing: PRODUCT_ONTOLOGY['grounding lite']?.pricing, documentation: PRODUCT_ONTOLOGY['grounding lite']?.documentation, docsTabId: 'overview', isAi: true }
  ];

  const usageSliders = [
    { label: 'Monthly API Requests', value: envUsage, max: 20000, step: 100, setter: setEnvUsage }
  ];

  return (
    <Level2ServiceEntity 
      view="level2-environment"
      title="Environment" 
      description="Incorporate air quality, pollen, and solar data into your apps." 
      features={features} 
      usageSliders={usageSliders} 
      onNavigate={onNavigate} 
      onNavigateToDocs={onNavigateToDocs}
      onProjectClick={onProjectClick}
      onRemixClick={onRemixClick}
      docsTabId="environment"
      docsUrl="https://developers.google.com/maps/documentation/environment"
      marketingUrl="https://mapsplatform.google.com/maps-products/environment/"
      marketingHighlights={[
        { title: "Air Quality Data", desc: "Access real-time air quality data for locations around the world." },
        { title: "Pollen Forecasts", desc: "Provide pollen levels and forecasts to help users manage allergies." },
        { title: "Solar Potential", desc: "Calculate solar potential and rooftop data for sustainability projects." },
        { title: "Sustainability Insights", desc: "Help users make more eco-friendly decisions with environmental data." },
        { title: "Global Coverage", desc: "Get environmental information for millions of locations globally." }
      ]}
      isLoggedIn={isLoggedIn}
      onStartChat={onStartChat}
      pricing={PRODUCT_ONTOLOGY['air quality api']?.pricing}
      onLogin={onLogin}
    />
  );
};

const Level2Datasets = ({ onNavigate, onNavigateToDocs, isLoggedIn, onProjectClick, onRemixClick, onStartChat, onLogin }: { onNavigate: (id: ViewState, title?: string, origin?: ViewState) => void, onNavigateToDocs?: (tab: string) => void, isLoggedIn: boolean, onProjectClick: (project: any) => void, onRemixClick: (project: any) => void, onStartChat: (msg: string) => void, onLogin?: () => void }) => {
  const features = [
    { title: 'Places Aggregate', desc: 'Area Insights API for aggregated data.', id: 'level2-datasets' as ViewState, pricing: PRODUCT_ONTOLOGY['places aggregate']?.pricing, documentation: PRODUCT_ONTOLOGY['places aggregate']?.documentation, docsTabId: 'places-aggregate' },
    { title: 'Places Insights', desc: 'Detailed insights for places.', id: 'level2-datasets' as ViewState, pricing: PRODUCT_ONTOLOGY['places insights']?.pricing, documentation: PRODUCT_ONTOLOGY['places insights']?.documentation, docsTabId: 'analytics-places' },
    { title: 'Roads Management Insights', desc: 'Insights for road management.', id: 'level2-datasets' as ViewState, pricing: PRODUCT_ONTOLOGY['roads management insights']?.pricing, documentation: PRODUCT_ONTOLOGY['roads management insights']?.documentation, docsTabId: 'routes-roads' },
    { title: 'Streetview Insights', desc: 'Insights from Street View data.', id: 'level2-datasets' as ViewState, pricing: PRODUCT_ONTOLOGY['streetview insights']?.pricing, documentation: PRODUCT_ONTOLOGY['streetview insights']?.documentation, docsTabId: 'maps-sv-insights' },
    { title: 'Grounding with Google Maps in Vertex AI', desc: 'AI grounding in Vertex AI.', id: 'level2-datasets' as ViewState, pricing: PRODUCT_ONTOLOGY['grounding with google maps in vertex ai']?.pricing, documentation: PRODUCT_ONTOLOGY['grounding with google maps in vertex ai']?.documentation, docsTabId: 'ai-grounding', isAi: true }
  ];

  const usageSliders = [
    { label: 'Monthly API Requests', value: 1000, max: 10000, step: 100, setter: () => {} }
  ];

  return (
    <Level2ServiceEntity 
      view="level2-datasets"
      title="Datasets" 
      description="Access aggregated insights and data management tools." 
      features={features} 
      usageSliders={usageSliders} 
      onNavigate={onNavigate} 
      onNavigateToDocs={onNavigateToDocs}
      onProjectClick={onProjectClick}
      onRemixClick={onRemixClick}
      docsTabId="maps-datasets"
      docsUrl="https://developers.google.com/maps/documentation/datasets"
      marketingUrl="https://mapsplatform.google.com/maps-products/datasets/"
      marketingHighlights={[
        { title: "Places Aggregate", desc: "Get aggregated data for specific areas." },
        { title: "Roads Insights", desc: "Understand road usage and management." },
        { title: "Vertex AI Integration", desc: "Ground your AI models with Google Maps data." }
      ]}
      isLoggedIn={isLoggedIn}
      onStartChat={onStartChat}
      onLogin={onLogin}
    />
  );
};

const Level2Analytics = ({ onNavigate, onNavigateToDocs, isLoggedIn, onProjectClick, onRemixClick, onStartChat, onLogin }: { onNavigate: (id: ViewState, title?: string, origin?: ViewState) => void, onNavigateToDocs?: (tab: string) => void, isLoggedIn: boolean, onProjectClick: (project: any) => void, onRemixClick: (project: any) => void, onStartChat: (msg: string) => void, onLogin?: () => void }) => {
  const [activeUsers, setActiveUsers] = useState(1200);

  const features = [
    { title: 'Usage Reports', desc: 'Detailed insights into API usage.', id: 'usage-reports' as ViewState, pricing: PRODUCT_ONTOLOGY['analytics']?.pricing, documentation: PRODUCT_ONTOLOGY['analytics']?.documentation, docsTabId: 'gs-reporting' },
    { title: 'Billing Insights', desc: 'Monitor and optimize your spending.', id: 'billing-insights' as ViewState, pricing: PRODUCT_ONTOLOGY['analytics']?.pricing, documentation: PRODUCT_ONTOLOGY['analytics']?.documentation, docsTabId: 'gs-reporting' }
  ];

  const usageSliders = [
    { label: 'Monthly Active Users', value: activeUsers, max: 10000, step: 100, setter: setActiveUsers }
  ];

  return (
    <Level2ServiceEntity 
      view="level2-analytics"
      title="Analytics" 
      description="Monitor usage, quotas, and billing across your projects." 
      features={features} 
      usageSliders={usageSliders} 
      onNavigate={onNavigate} 
      onNavigateToDocs={onNavigateToDocs}
      onProjectClick={onProjectClick}
      onRemixClick={onRemixClick}
      docsTabId="analytics"
      docsUrl="https://developers.google.com/maps/reporting-and-monitoring/overview"
      marketingUrl="https://mapsplatform.google.com/maps-products/analytics/"
      marketingHighlights={[
        { title: "Usage Reports", desc: "Track your API usage and performance with detailed reports." },
        { title: "Billing Insights", desc: "Understand your costs and optimize your spending with clear billing data." },
        { title: "Custom Dashboards", desc: "Create custom views of your data to monitor what matters most." },
        { title: "Data-driven Decisions", desc: "Use analytics to drive business growth and improve user experiences." }
      ]}
      isLoggedIn={isLoggedIn}
      onStartChat={onStartChat}
      pricing={PRODUCT_ONTOLOGY['analytics']?.pricing}
      onLogin={onLogin}
    />
  );
};

const Level2AI = ({ onNavigate, onNavigateToDocs, isLoggedIn, onProjectClick, onRemixClick, onStartChat, onLogin }: { onNavigate: (id: ViewState, title?: string, origin?: ViewState) => void, onNavigateToDocs?: (tab: string) => void, isLoggedIn: boolean, onProjectClick: (project: any) => void, onRemixClick: (project: any) => void, onStartChat: (msg: string) => void, onLogin?: () => void }) => {
  const [aiTokens, setAiTokens] = useState(50000);

  const features = [
    { title: 'Maker Concierge', desc: 'AI-powered development assistant.', id: 'maker-concierge' as ViewState, pricing: PRODUCT_ONTOLOGY['ai tools']?.pricing, documentation: PRODUCT_ONTOLOGY['ai tools']?.documentation, docsTabId: 'ai-maker-concierge', isAi: true },
    { title: 'Remix Studio', desc: 'Prompt-driven project customization.', id: 'remix-studio' as ViewState, pricing: PRODUCT_ONTOLOGY['ai tools']?.pricing, documentation: PRODUCT_ONTOLOGY['ai tools']?.documentation, docsTabId: 'ai-remix-studio', isAi: true },
    { title: 'Grounding with Google Maps', desc: 'Ground your LLM with real-world location data.', id: 'level2-datasets' as ViewState, pricing: PRODUCT_ONTOLOGY['grounding with google maps in vertex ai']?.pricing, documentation: PRODUCT_ONTOLOGY['grounding with google maps in vertex ai']?.documentation, docsTabId: 'ai-grounding', isAi: true }
  ];

  const usageSliders = [
    { label: 'Monthly AI Tokens', value: aiTokens, max: 200000, step: 5000, setter: setAiTokens }
  ];

  return (
    <Level2ServiceEntity 
      view="level2-ai"
      title="AI & Tools" 
      description="Accelerate development with Maker Concierge and Remix Studio." 
      features={features} 
      usageSliders={usageSliders} 
      onNavigate={onNavigate} 
      onNavigateToDocs={onNavigateToDocs}
      onProjectClick={onProjectClick}
      onRemixClick={onRemixClick}
      docsTabId="ai-overview"
      docsUrl="https://developers.google.com/maps/documentation/ai"
      marketingUrl="https://mapsplatform.google.com/maps-products/ai/"
      marketingHighlights={[
        { title: "Maker Concierge", desc: "Get AI-powered help with your implementation and technical questions." },
        { title: "Remix Studio", desc: "Quickly prototype and iterate on your ideas with an interactive studio." },
        { title: "Intelligent Search", desc: "Use AI to improve search results and find the right places faster." },
        { title: "Automated Insights", desc: "Get automated insights from your geospatial data with AI." }
      ]}
      isLoggedIn={isLoggedIn}
      onStartChat={onStartChat}
      pricing={PRODUCT_ONTOLOGY['ai tools']?.pricing}
      onLogin={onLogin}
    />
  );
};

const Level3TechnicalResources = ({ setView, onNavigateToDocs, onProjectClick, onRemixClick, title, docsTabId = 'overview', docsUrl }: { setView: (v: ViewState, t?: string) => void, onNavigateToDocs?: (tab: string) => void, onProjectClick: (project: any) => void, onRemixClick: (project: any) => void, title?: string, docsTabId?: string, docsUrl?: string }) => {
  return (
    <div className="space-y-12">
      {/* Inspiration Gallery - HIDDEN AS REQUESTED */}
      {false && (
        <InspirationGallery 
          title={title ? `Inspiration: ${title} Projects` : "Inspiration Gallery"}
          filterTag={title}
          onProjectClick={onProjectClick}
          onRemixClick={onRemixClick}
        />
      )}
    </div>
  );
};

const Level3Placeholder = ({ title, setView, view, onNavigateToDocs, isLoggedIn, onProjectClick, onRemixClick, onStartChat, pricing, onLogin }: { title: string, setView: (v: ViewState, t?: string, o?: ViewState) => void, view: ViewState, onNavigateToDocs?: (tab: string) => void, isLoggedIn?: boolean, onProjectClick: (project: any) => void, onRemixClick: (project: any) => void, onStartChat: (msg: string) => void, pricing?: string, onLogin?: () => void }) => {
  const path = getBreadcrumbPath(view);

  const getDocsUrl = (view: ViewState) => {
    const base = "https://developers.google.com/maps/documentation";
    switch (view) {
      case 'dynamic-maps':
      case 'static-maps':
      case 'street-view': return `${base}/javascript/overview`;
      case 'directions': return `${base}/directions/overview`;
      case 'distance-matrix': return `${base}/distance-matrix/overview`;
      case 'roads': return `${base}/roads/overview`;
      case 'air-quality':
      case 'pollen':
      case 'solar': return `${base}/environment`;
      case 'level2-places-uikit': return `${base}/javascript/places`;
      case 'usage-reports':
      case 'billing-insights': return "https://developers.google.com/maps/reporting-and-monitoring/overview";
      case 'maker-concierge':
      case 'remix-studio': return `${base}/ai`;
      default: return base;
    }
  };

  const getDocsTabId = (view: ViewState) => {
    switch (view) {
      case 'dynamic-maps':
      case 'static-maps':
      case 'street-view': return 'maps-js';
      case 'directions': return 'routes-api';
      case 'distance-matrix': return 'routes-api';
      case 'roads': return 'routes-roads';
      case 'air-quality': return 'env-air';
      case 'pollen': return 'env-pollen';
      case 'solar': return 'env-solar';
      case 'level2-geocoding': return 'places-geocoding';
      case 'level2-places-api': return 'places-library';
      case 'level2-places-uikit': return 'places-library';
      case 'usage-reports':
      case 'billing-insights': return 'gs-reporting';
      case 'maker-concierge': return 'ai-maker-concierge';
      case 'remix-studio': return 'ai-remix-studio';
      default: return 'overview';
    }
  };

  const getMarketingUrl = (view: ViewState) => {
    const base = "https://mapsplatform.google.com/maps-products";
    switch (view) {
      case 'dynamic-maps':
      case 'static-maps':
      case 'street-view': return `${base}/maps/`;
      case 'directions':
      case 'distance-matrix':
      case 'roads': return `${base}/routes/`;
      case 'air-quality':
      case 'pollen':
      case 'solar': return `${base}/environment/`;
      case 'level2-places-uikit': return "https://mapsplatform.google.com/maps-products/places/";
      case 'usage-reports':
      case 'billing-insights': return `${base}/analytics/`;
      case 'maker-concierge':
      case 'remix-studio': return `${base}/ai/`;
      default: return base;
    }
  };

  const getMarketingHighlights = (view: ViewState) => {
    switch (view) {
      case 'air-quality':
        return [
          { title: "Global Air Quality Data", desc: "Access real-time, historical, and forecast air quality data for locations worldwide." },
          { title: "Health Recommendations", desc: "Provide actionable health advice based on current air quality conditions." },
          { title: "Pollutant Breakdown", desc: "Get detailed information on specific pollutants like PM2.5, PM10, and Ozone." }
        ];
      case 'pollen':
        return [
          { title: "Pollen Forecasts", desc: "Get detailed pollen forecasts for trees, grass, and weeds to help users manage allergies." },
          { title: "Allergy Risk Levels", desc: "Understand the risk of allergy symptoms with clear, actionable data." },
          { title: "Seasonal Insights", desc: "Plan ahead with insights into pollen seasons and peak periods." }
        ];
      case 'solar':
        return [
          { title: "Estimate solar potential", desc: "Analyze rooftop solar potential for millions of buildings globally." },
          { title: "Optimize system design", desc: "Get detailed data on sunshine, roof shade, and panel placement." },
          { title: "Financial analysis", desc: "Calculate potential savings and environmental impact for homeowners." }
        ];
      case 'directions':
      case 'distance-matrix':
      case 'roads':
        return [
          { title: "Real-time traffic", desc: "Navigate with up-to-the-minute traffic information." },
          { title: "Global routing", desc: "Find the best path between locations worldwide." },
          { title: "Improved ETA accuracy", desc: "Provide accurate arrival times with historical and real-time data." }
        ];
      case 'dynamic-maps':
      case 'static-maps':
      case 'street-view':
        return [
          { title: "Maps SDK", desc: "Create interactive mapping experiences for your users." },
          { title: "Street View", desc: "Provide immersive 360-degree imagery of locations." },
          { title: "Advanced Markers", desc: "Customize markers to match your brand and provide more context." }
        ];
      case 'level2-places-uikit':
        return [
          { title: "Pre-built UI Components", desc: "Embed high-quality, ready-to-use UI components in your apps." },
          { title: "Customizable Design", desc: "Tailor the look and feel of components to match your brand." },
          { title: "Accelerated Development", desc: "Reduce development time with pre-integrated Places features." }
        ];
      case 'usage-reports':
      case 'billing-insights':
        return [
          { title: "Monitor Usage", desc: "Track your API usage and performance in real-time." },
          { title: "Optimize Costs", desc: "Identify opportunities to reduce costs and improve efficiency." },
          { title: "Billing Transparency", desc: "Get clear insights into your billing and spending patterns." }
        ];
      case 'maker-concierge':
      case 'remix-studio':
        return [
          { title: "AI-Powered Development", desc: "Accelerate your development with intelligent AI tools." },
          { title: "Rapid Prototyping", desc: "Build and test your ideas faster than ever before." },
          { title: "Seamless Integration", desc: "Easily integrate AI capabilities into your existing workflows." }
        ];
      default:
        return [];
    }
  };

  const isPlaces = ['level2-places-uikit', 'dynamic-maps', 'static-maps', 'street-view', 'directions', 'distance-matrix', 'roads', 'air-quality', 'pollen', 'solar'].includes(view);
  
  if (!isLoggedIn) {
    return (
      <PlacesMarketingView 
        title={title}
        description={`Explore the capabilities of ${title} and see how it can enhance your application.`}
        marketingUrl={getMarketingUrl(view)}
        marketingHighlights={getMarketingHighlights(view)}
        onNavigate={(id) => setView(id as ViewState)}
        onNavigateToDocs={onNavigateToDocs}
        onStartChat={onStartChat}
        view={view}
        onLogin={onLogin}
      />
    );
  }

  const highlights = getMarketingHighlights(view);

  return (
    <main className="flex-1 space-y-8">
        <ServiceBreadcrumb 
          path={path} 
          currentTitle={title} 
          setView={setView} 
        />
        <section className="bg-white border border-gray-200 rounded-2xl p-8 shadow-sm">
          <div className="flex items-center gap-4 mb-6">
            <div className="p-3 bg-blue-50 rounded-xl text-blue-600">
              <Code className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
                {Object.values(PRODUCT_ONTOLOGY).some(item => item.product.toLowerCase() === title.toLowerCase() && item.isAi) && (
                  <Sparkles className="w-5 h-5 text-purple-500 animate-pulse" />
                )}
              </div>
              {/* Marketing description hidden as requested */}
              {/* <p className="text-gray-500 mb-2">Technical implementation and interactive demo for {title}.</p> */}
              <div className="flex flex-col gap-3">
                {/* PricingTable removed as requested */}
                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => onNavigateToDocs ? onNavigateToDocs(getDocsTabId(view)) : setView('docs')}
                    className="inline-flex items-center gap-2 px-3 py-1.5 bg-blue-50 text-blue-700 text-xs font-bold rounded-full border border-blue-100 hover:bg-blue-100 transition-colors w-fit"
                  >
                    <BookOpen className="w-3.5 h-3.5" />
                    Documentation
                  </button>
                  <button 
                    onClick={() => setView('cost', title, view)}
                    className="inline-flex items-center gap-2 px-3 py-1.5 bg-green-50 text-green-700 text-xs font-bold rounded-full border border-green-100 hover:bg-green-100 transition-colors w-fit"
                  >
                    <DollarSign className="w-3.5 h-3.5" />
                    Pricing
                  </button>
                </div>
              </div>
            </div>
          </div>
          
          {/* Product Highlights from Live Site - HIDDEN AS REQUESTED */}
          {false && highlights.length > 0 && (
            <section className="space-y-6 mb-8 pt-8 border-t border-gray-100">
              <div className="flex items-center gap-2">
                <div className="h-px flex-1 bg-gray-200"></div>
                <h2 className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400 px-4">Product Highlights from Live Site</h2>
                <div className="h-px flex-1 bg-gray-200"></div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {highlights.map((h, i) => (
                  <div key={i} className="space-y-2">
                    <div className="flex items-center gap-2 text-blue-600">
                      <CheckCircle2 className="w-4 h-4" />
                      <h3 className="font-bold text-sm text-gray-900">{h.title}</h3>
                    </div>
                    <p className="text-xs text-gray-500 leading-relaxed pl-6">{h.desc}</p>
                  </div>
                ))}
              </div>
            </section>
          )}

          <div className="aspect-video bg-gray-50 rounded-xl border border-gray-200 flex items-center justify-center text-gray-400 font-mono text-sm mb-12">
            [ Interactive Demo Placeholder for {title} ]
          </div>

          <ImplementationSelector 
            title={title} 
            docsTabId={getDocsTabId(view)} 
            onNavigateToDocs={onNavigateToDocs} 
            onNavigate={setView} 
          />
        </section>

        <Level3TechnicalResources setView={setView} onNavigateToDocs={onNavigateToDocs} onProjectClick={onProjectClick} onRemixClick={onRemixClick} title={title} docsTabId={getDocsTabId(view)} />
      </main>
  );
};

const ProjectBlueprint = ({ usageSliders, onNavigateToDocs, setView, title = "Project Blueprint", description }: { 
  usageSliders: { label: string, value: number, max: number, step: number, setter: (v: number) => void }[],
  onNavigateToDocs?: (tab: string) => void,
  setView?: (v: ViewState) => void,
  title?: string,
  description?: React.ReactNode
}) => {
  const [dataFormat, setDataFormat] = useState('geocoded');
  const [framework, setFramework] = useState('hybrid');

  const defaultDescription = (
    <p className="text-gray-600 leading-relaxed text-lg">
      Mid-sized, cross-platform app with <span className="font-bold text-gray-900">5,000 monthly users</span>, where success is defined by converting "Near Me" searches into "Get Routes" clicks. Technically, we anticipate a standard address-based database that requires <span className="font-bold text-gray-900">geocoding</span> to support a feature <span className="font-bold text-gray-900">engagement rate of roughly 20%</span>.
    </p>
  );

  return (
    <section className="bg-white border border-gray-100 rounded-[40px] overflow-hidden shadow-xl shadow-blue-900/5 p-12">
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto_1.2fr] gap-16 items-center">
        {/* Left Side */}
        <div className="space-y-8">
          <div className="space-y-4">
            <h2 className="text-4xl font-bold text-gray-900 tracking-tight">{title}</h2>
            <div className="text-gray-600 leading-relaxed text-lg">
              {description || defaultDescription}
            </div>
          </div>
          
          <button className="flex items-center gap-2 text-blue-600 font-bold hover:underline text-sm">
            <Info className="w-4 h-4" />
            See how we calculated this
          </button>

          <button className="w-full py-5 bg-blue-400 text-white rounded-full font-bold text-xl hover:bg-blue-500 transition-all shadow-lg shadow-blue-400/30">
            Get detailed estimate
          </button>
        </div>

        {/* Divider */}
        <div className="hidden lg:block w-px h-64 bg-gray-200" />

        {/* Right Side */}
        <div className="space-y-8">
          <div className="flex items-center justify-between">
            <span className="text-sm font-bold text-blue-900">Region</span>
            <span className="px-4 py-1.5 bg-blue-50 text-blue-600 rounded-full text-xs font-bold">New York City, New York</span>
          </div>

          <div className="space-y-6">
            {usageSliders.map((slider, idx) => (
              <div key={idx} className="space-y-3">
                <div className="flex justify-between items-center">
                  <label className="text-sm font-bold text-blue-900 flex items-center gap-1.5">
                    {slider.label}
                  </label>
                  <Info className="w-4 h-4 text-blue-400" />
                </div>
                <div className="relative pt-2">
                  <input 
                    type="range" min="0" max={slider.max} step={slider.step} 
                    value={slider.value} 
                    onChange={(e) => slider.setter(Number(e.target.value))}
                    className="w-full h-2 bg-blue-100 rounded-full appearance-none cursor-pointer accent-blue-600"
                  />
                  <div className="flex justify-between mt-2">
                    {[0, 1, 2, 3].map(i => (
                      <div key={i} className="w-1.5 h-1.5 bg-blue-200 rounded-full" />
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-between gap-4">
            <span className="text-sm font-bold text-blue-900 shrink-0">Data Format</span>
            <div className="flex bg-blue-50 p-1 rounded-full w-full max-w-[240px]">
              <button 
                onClick={() => setDataFormat('geocoded')}
                className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-full text-xs font-bold transition-all ${dataFormat === 'geocoded' ? 'bg-blue-600 text-white shadow-md' : 'text-blue-400 hover:text-blue-600'}`}
              >
                <Sparkles className="w-3 h-3" /> Geocoded
              </button>
              <button 
                onClick={() => setDataFormat('raw')}
                className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-full text-xs font-bold transition-all ${dataFormat === 'raw' ? 'bg-blue-600 text-white shadow-md' : 'text-blue-400 hover:text-blue-600'}`}
              >
                <Code className="w-3 h-3" /> Raw Data
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between gap-4">
            <span className="text-sm font-bold text-blue-900 shrink-0">Framework</span>
            <div className="flex bg-blue-50 p-1 rounded-full w-full max-w-[320px]">
              {[
                { id: 'mobile', name: 'Mobile', icon: <Smartphone className="w-3 h-3" /> },
                { id: 'desktop', name: 'Desktop', icon: <Monitor className="w-3 h-3" /> },
                { id: 'hybrid', name: 'Hybrid', icon: <Layers className="w-3 h-3" /> }
              ].map(f => (
                <button 
                  key={f.id}
                  onClick={() => setFramework(f.id)}
                  className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-full text-xs font-bold transition-all ${framework === f.id ? 'bg-blue-600 text-white shadow-md' : 'text-blue-400 hover:text-blue-600'}`}
                >
                  {f.icon} {f.name}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const SolutionGuide = ({ recommendations, setView, title, originView }: { recommendations: Recommendation[], setView: (v: ViewState, t?: string, o?: ViewState) => void, title: string, originView?: ViewState | null }) => {
  const [users, setUsers] = useState(5000);
  const [engagement, setEngagement] = useState(20);

  const path = getBreadcrumbPath(originView || 'level1', true);

  const usageSliders = [
    { label: 'Projected users', value: users, max: 10000, step: 100, setter: setUsers },
    { label: 'Feature engagement rate', value: engagement, max: 100, step: 1, setter: setEngagement }
  ];

  return (
    <div className="space-y-16 pb-20">
      <ServiceBreadcrumb 
        path={path} 
        currentTitle="Solution Guide" 
        setView={setView} 
      />
      {/* Navigation Bar */}
      <div className="flex items-center justify-between border-b border-gray-200 pb-4 mb-8">
        <div className="flex items-center gap-8">
          <button className="flex items-center gap-2 text-sm font-medium text-gray-400 hover:text-gray-600 transition-colors">
            <MapIcon className="w-4 h-4" /> Preview
          </button>
          <button className="flex items-center gap-2 text-sm font-medium text-gray-400 hover:text-gray-600 transition-colors">
            <Code className="w-4 h-4" /> Code
          </button>
          <button className="flex items-center gap-2 text-sm font-bold text-gray-900 border-b-2 border-gray-900 pb-4 -mb-4">
            <Rocket className="w-4 h-4" /> Solution Guide
          </button>
          <button 
            className="flex items-center gap-2 text-sm font-medium text-gray-400 hover:text-gray-600 transition-colors"
            onClick={() => setView('cost', title, 'solution-guide')}
          >
            <DollarSign className="w-4 h-4" /> Cost
          </button>
        </div>
        <div className="flex items-center gap-6">
          <button className="flex items-center gap-2 text-sm font-medium text-gray-400 hover:text-gray-600 transition-colors">
            <Share2 className="w-4 h-4" /> Share
          </button>
          <div className="flex flex-col items-end">
            <button className="flex items-center gap-2 px-4 py-2 bg-orange-50 text-orange-600 rounded-full border border-orange-200 text-sm font-bold hover:bg-orange-100 transition-all">
              <CloudOff className="w-4 h-4" /> Save your progress
            </button>
            <span className="text-[10px] text-gray-400 mt-1">Currently unsaved</span>
          </div>
        </div>
      </div>

      <section className="space-y-4">
        <h1 className="text-4xl font-bold text-gray-900 tracking-tight">{title}</h1>
        <p className="text-xl text-gray-600 max-w-3xl leading-relaxed">
          Based on your project requirements, the Maker Concierge has put together a tailored solution using Google Maps Platform.
        </p>
      </section>

      {/* Project Blueprint - HIDDEN AS REQUESTED */}
      {/* <ProjectBlueprint usageSliders={usageSliders} setView={setView} /> */}

      <section className="space-y-8">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Suggested starting points</h2>
          <p className="text-blue-600 font-medium">Based on your project blueprint and usage</p>
        </div>

        <div className="grid grid-cols-1 gap-8">
          {recommendations.map((rec, idx) => (
            <div key={idx} className="bg-white border border-gray-100 rounded-[40px] p-12 shadow-xl shadow-blue-900/5 flex flex-col lg:flex-row gap-12 items-center">
              {/* Left Side: Product Info */}
              <div className="flex-1 space-y-8 w-full">
                <div className="space-y-4">
                  <h3 className="text-3xl font-bold text-gray-900">{rec.product}</h3>
                </div>
                
                <button 
                  onClick={() => setView('editor')}
                  className="w-full max-w-[320px] py-4 bg-blue-400 text-white rounded-full font-bold text-xl hover:bg-blue-500 transition-all shadow-lg shadow-blue-400/30"
                >
                  Preview
                </button>
              </div>

              {/* Divider */}
              <div className="hidden lg:block w-px h-48 bg-gray-200" />

              {/* Right Side: Go Deeper */}
              <div className="w-full lg:w-72 space-y-6">
                <h4 className="text-lg font-bold text-gray-900">Go deeper</h4>
                <div className="space-y-4">
                  <button 
                    onClick={() => setView('cost', rec.product, 'solution-guide')}
                    className="flex items-center gap-3 text-blue-600 font-bold hover:underline group"
                  >
                    <div className="p-2 bg-blue-50 rounded-lg group-hover:bg-blue-100 transition-colors">
                      <DollarSign className="w-5 h-5" />
                    </div>
                    Pricing details
                  </button>
                  <button 
                    onClick={() => setView('docs')}
                    className="flex items-center gap-3 text-blue-600 font-bold hover:underline group"
                  >
                    <div className="p-2 bg-blue-50 rounded-lg group-hover:bg-blue-100 transition-colors">
                      <List className="w-5 h-5" />
                    </div>
                    Product details
                  </button>
                  <button 
                    onClick={() => setView('docs')}
                    className="flex items-center gap-3 text-blue-600 font-bold hover:underline group"
                  >
                    <div className="p-2 bg-blue-50 rounded-lg group-hover:bg-blue-100 transition-colors">
                      <FileText className="w-5 h-5" />
                    </div>
                    Documentation
                  </button>
                  <button className="flex items-center gap-3 text-blue-600 font-bold hover:underline group">
                    <div className="p-2 bg-blue-50 rounded-lg group-hover:bg-blue-100 transition-colors">
                      <PlayCircle className="w-5 h-5" />
                    </div>
                    Watch product video
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-slate-900 rounded-3xl p-12 text-white text-center space-y-6">
        <h2 className="text-3xl font-bold">Ready to start building?</h2>
        <p className="text-slate-400 max-w-2xl mx-auto">
          You can remix any of our starter projects to get up and running in minutes with these recommended APIs.
        </p>
        <button 
          onClick={() => setView('level1')} 
          className="px-8 py-4 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/20"
        >
          Browse Starter Projects
        </button>
      </section>
    </div>
  );
};

// --- Main App ---

const PricingCalculatorCard = ({ 
  category, 
  title, 
  description, 
  unit, 
  freeTierLimit, 
  priceTier1, 
  priceTier2, 
  threshold 
}: { 
  category: string, 
  title: string, 
  description: string, 
  unit: string, 
  freeTierLimit: number, 
  priceTier1: number, 
  priceTier2: number, 
  threshold: number 
}) => {
  const [usage, setUsage] = useState(freeTierLimit);
  
  const calculateCost = (val: number) => {
    const billableUsage = Math.max(0, val - freeTierLimit);
    if (billableUsage <= 0) return 0;
    
    if (val <= threshold) {
      return (billableUsage / 1000) * priceTier1;
    } else {
      const tier1Usage = threshold - freeTierLimit;
      const tier2Usage = val - threshold;
      return ((tier1Usage / 1000) * priceTier1) + ((tier2Usage / 1000) * priceTier2);
    }
  };

  const cost = calculateCost(usage);

  return (
    <div className="bg-white border border-gray-100 rounded-[32px] overflow-hidden flex shadow-sm hover:shadow-md transition-shadow">
      {/* Left Map Strip */}
      <div className="w-20 bg-blue-50 relative overflow-hidden shrink-0">
        <img 
          src="https://picsum.photos/seed/map-strip/200/800?blur=2" 
          alt="Map background" 
          className="absolute inset-0 w-full h-full object-cover opacity-40"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-blue-100/20 to-transparent" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
          <div className="w-8 h-8 bg-white rounded-full shadow-lg flex items-center justify-center">
            <MapPin className="w-4 h-4 text-green-600 fill-green-600/20" />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-8 space-y-6">
        <div className="flex justify-between items-start">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-[10px] font-bold text-green-700 uppercase tracking-widest">
              <BookOpen className="w-3 h-3" /> {category}
            </div>
            <h3 className="text-2xl font-bold text-gray-900 tracking-tight">{title}</h3>
          </div>
          <div className="text-right">
            <div className="flex items-center justify-end gap-2">
              <span className="text-4xl font-bold text-green-600">${cost.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}</span>
              <button className="bg-blue-600 text-white px-4 py-2 rounded-full text-sm font-bold flex items-center gap-2 hover:bg-blue-700 transition-colors shadow-lg shadow-blue-600/20">
                <Plus className="w-4 h-4" /> Add
              </button>
            </div>
            <p className="text-[10px] text-green-700 font-medium mt-1">per month (estimate)</p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center gap-6">
            <div className="flex-1 relative pt-6 pb-2">
              <input 
                type="range" 
                min="0" 
                max="10000000" 
                step="1000"
                value={usage}
                onChange={(e) => setUsage(parseInt(e.target.value))}
                className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
              />
              <div className="flex justify-between mt-4 text-[10px] font-bold text-gray-400">
                <div className="flex flex-col items-center gap-1">
                  <span>0</span>
                  <span className="px-2 py-0.5 bg-green-100 text-green-700 rounded-full text-[8px]">Included</span>
                </div>
                <div className="flex flex-col items-center gap-1">
                  <span>{(freeTierLimit / 1000).toFixed(usage >= freeTierLimit ? 1 : 0)}k</span>
                </div>
                <span>10m</span>
              </div>
            </div>
            <div className="w-48 space-y-1">
              <div className="relative">
                <input 
                  type="text" 
                  value={usage.toLocaleString()}
                  onChange={(e) => {
                    const val = parseInt(e.target.value.replace(/,/g, ''));
                    if (!isNaN(val)) setUsage(val);
                  }}
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-right font-bold text-blue-600 focus:outline-none focus:border-blue-500 transition-all"
                />
                <div className="absolute right-2 top-1/2 -translate-y-1/2 flex flex-col">
                  <button onClick={() => setUsage(prev => prev + 1000)} className="p-0.5 hover:bg-gray-100 rounded"><ChevronUp className="w-3 h-3 text-gray-400" /></button>
                  <button onClick={() => setUsage(prev => Math.max(0, prev - 1000))} className="p-0.5 hover:bg-gray-100 rounded"><ChevronDown className="w-3 h-3 text-gray-400" /></button>
                </div>
              </div>
              <p className="text-[10px] font-bold text-gray-400 text-right uppercase tracking-widest">{unit}</p>
            </div>
          </div>
          
          <p className="text-sm text-gray-600 leading-relaxed max-w-2xl">
            {description}
          </p>
        </div>
      </div>
    </div>
  );
};

const CostPage = ({ setView, title, originView }: { setView: (v: ViewState, t?: string) => void, title: string, originView?: ViewState | null }) => {
  const path = getBreadcrumbPath(originView || 'level1', true);
  const [activeTab, setActiveTab] = useState('Pay-as-you-go');

  const chartData = [
    { usage: 0, cost: 0, projected: 0 },
    { usage: 1000, cost: 50, projected: 40 },
    { usage: 2000, cost: 120, projected: 90 },
    { usage: 3000, cost: 180, projected: 140 },
    { usage: 4000, cost: 250, projected: 190 },
    { usage: 5000, cost: 320, projected: 240 },
  ];

  return (
    <div className="space-y-8 pb-20">
      <ServiceBreadcrumb 
        path={path} 
        currentTitle="Pricing" 
        setView={setView} 
      />
      
      <div className="space-y-12">
        {/* Header Section */}
        <section className="space-y-4">
          <h1 className="text-4xl font-bold text-gray-900 tracking-tight">Projected cost for {title}</h1>
          <p className="text-gray-500 text-lg max-w-3xl">
            Estimates based on your project profile and <span className="italic">anticipated</span> usage. Predictions become more accurate as you build.
          </p>
        </section>

        {/* Tabs & Plan Cards */}
        <div className="bg-blue-50/30 border border-blue-100 rounded-[40px] p-8 lg:p-12 space-y-10">
          <div className="flex justify-center">
            <div className="inline-flex bg-blue-100/50 p-1 rounded-full backdrop-blur-sm">
              {['Subscriptions', 'Pay-as-you-go', 'Compare'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-6 py-2 rounded-full text-sm font-bold transition-all flex items-center gap-2 ${activeTab === tab ? 'bg-blue-600 text-white shadow-lg' : 'text-blue-600 hover:bg-blue-200/50'}`}
                >
                  {tab === 'Subscriptions' && <History className="w-4 h-4" />}
                  {tab === 'Pay-as-you-go' && <DollarSign className="w-4 h-4" />}
                  {tab === 'Compare' && <Zap className="w-4 h-4" />}
                  {tab}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-8">
            {activeTab === 'Subscriptions' && (
              <>
                <p className="text-blue-600 font-bold text-sm">Based on your feature engagement rate</p>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Advanced Locator Plus Card */}
                  <div className="bg-white border border-blue-100 rounded-[32px] p-8 shadow-xl shadow-blue-900/5 relative overflow-hidden group">
                    <div className="absolute top-4 right-8">
                      <div className="bg-green-100 text-green-700 text-[10px] font-bold px-3 py-1 rounded-full flex items-center gap-1.5 border border-green-200">
                        <CheckCircle2 className="w-3 h-3" /> Recommended
                      </div>
                    </div>
                    
                    <div className="flex flex-col h-full">
                      <div className="space-y-6 flex-1">
                        <div className="space-y-2">
                          <h2 className="text-3xl font-bold text-gray-900">{title}</h2>
                          <div className="flex gap-2">
                            <div className="h-2 w-20 bg-gray-100 rounded-full" />
                            <div className="h-2 w-12 bg-gray-100 rounded-full" />
                          </div>
                        </div>

                        <div className="flex items-start gap-8">
                          <div className="space-y-4 flex-1">
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">APIs</p>
                            <div className="space-y-3">
                              {[
                                { icon: <MapIcon className="w-4 h-4" />, width: 'w-24' },
                                { icon: <Globe className="w-4 h-4" />, width: 'w-12' },
                                { icon: <Navigation className="w-4 h-4" />, width: 'w-20' },
                                { icon: <MapPin className="w-4 h-4" />, width: 'w-24' },
                              ].map((api, i) => (
                                <div key={i} className="flex items-center gap-3">
                                  <div className="text-blue-200">{api.icon}</div>
                                  <div className={`h-2.5 ${api.width} bg-blue-100 rounded-full`} />
                                </div>
                              ))}
                            </div>
                          </div>

                          <div className="flex-1 bg-blue-50/50 rounded-2xl p-6 border border-blue-100/50 space-y-4">
                            <div>
                              <h3 className="font-bold text-gray-900">Essentials Plan</h3>
                              <p className="text-sm text-gray-500">$275 / month</p>
                            </div>
                            <div className="space-y-3">
                              <div className="flex items-center gap-2 text-xs text-gray-600">
                                <Globe className="w-4 h-4 text-gray-400" /> 100,000 monthly calls
                              </div>
                              <div className="flex items-center gap-2 text-xs text-gray-600">
                                <List className="w-4 h-4 text-gray-400" /> All listed APIs included
                              </div>
                              <div className="flex items-center gap-2">
                                <div className="w-6 h-6 bg-gray-200 rounded" />
                                <div className="h-2 w-24 bg-gray-100 rounded-full" />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="mt-8">
                        <button className="px-8 py-3 bg-blue-600 text-white rounded-full font-bold text-sm hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/20 flex items-center gap-2">
                          <Zap className="w-4 h-4" /> Get Started
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Similar Businesses Card */}
                  <div className="space-y-6">
                    <p className="text-blue-600 font-bold text-sm">Similar businesses looking to scale</p>
                    <div className="bg-white/60 border border-gray-100 rounded-[32px] p-8 shadow-sm backdrop-blur-sm">
                      <div className="flex items-start gap-8 opacity-60 grayscale hover:grayscale-0 hover:opacity-100 transition-all cursor-pointer">
                        <div className="space-y-6 flex-1">
                          <div className="space-y-3">
                            <div className="flex gap-2">
                              <div className="h-4 w-24 bg-gray-200 rounded-lg" />
                              <div className="h-4 w-16 bg-gray-200 rounded-lg" />
                            </div>
                            <div className="space-y-2">
                              <div className="h-2 w-48 bg-gray-100 rounded-full" />
                              <div className="h-2 w-32 bg-gray-100 rounded-full" />
                              <div className="h-2 w-12 bg-blue-100 rounded-full" />
                            </div>
                          </div>
                          <div className="space-y-4">
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">APIs</p>
                            <div className="space-y-3">
                              {[
                                { icon: <MapIcon className="w-4 h-4" />, width: 'w-28' },
                                { icon: <Globe className="w-4 h-4" />, width: 'w-12' },
                                { icon: <Navigation className="w-4 h-4" />, width: 'w-20' },
                                { icon: <MapPin className="w-4 h-4" />, width: 'w-24' },
                              ].map((api, i) => (
                                <div key={i} className="flex items-center gap-3">
                                  <div className="text-gray-300">{api.icon}</div>
                                  <div className={`h-2.5 ${api.width} bg-gray-100 rounded-full`} />
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>

                        <div className="flex-1 bg-gray-50 rounded-2xl p-6 border border-gray-100 space-y-4">
                          <div>
                            <h3 className="font-bold text-gray-900">Pro Plan</h3>
                            <p className="text-sm text-gray-500">$1200 / month</p>
                          </div>
                          <div className="space-y-3">
                            <div className="flex items-center gap-2 text-xs text-gray-600">
                              <Globe className="w-4 h-4 text-gray-400" /> 250,000 monthly calls
                            </div>
                            <div className="flex items-center gap-2 text-xs text-gray-600">
                              <List className="w-4 h-4 text-gray-400" /> All listed APIs included
                            </div>
                            <div className="flex items-center gap-2">
                              <div className="w-6 h-6 bg-gray-200 rounded" />
                              <div className="h-2 w-24 bg-gray-100 rounded-full" />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}

            {activeTab === 'Pay-as-you-go' && (
              <div className="space-y-8">
                <div className="flex justify-between items-end">
                  <div className="space-y-2">
                    <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Interactive Pricing Calculator</h2>
                    <p className="text-sm text-gray-500 max-w-2xl">
                      Estimate your monthly costs for <span className="font-bold text-blue-600">{title}</span> and other services.
                    </p>
                  </div>
                  <div className="flex items-center gap-2 text-[10px] font-bold text-blue-600 bg-blue-50 px-3 py-1.5 rounded-full">
                    <Info className="w-3.5 h-3.5" /> Pricing is per 1,000 requests
                  </div>
                </div>

                <div className="grid gap-6">
                  {/* Only show the slider for the product or service referred to via the pricing button */}
                  {(title === "Place Details" || title === "Places API") && (
                    <PricingCalculatorCard 
                      category="PLACES"
                      title="Place Details"
                      description="Get in-depth information about over 250 million places, including address, phone number, ratings, and reviews."
                      unit="Requests"
                      freeTierLimit={11000}
                      priceTier1={17.00}
                      priceTier2={13.60}
                      threshold={100000}
                    />
                  )}
                  {(title === "Geocoding" || title === "Geocoding API" || title === "Geolocation API") && (
                    <>
                      <PricingCalculatorCard 
                        category="PLACES"
                        title="Geocoding API"
                        description="Convert addresses into geographic coordinates (geocoding) and vice versa (reverse geocoding)."
                        unit="Requests"
                        freeTierLimit={40000}
                        priceTier1={5.00}
                        priceTier2={4.00}
                        threshold={100000}
                      />
                      <PricingCalculatorCard 
                        category="PLACES"
                        title="Geolocation API"
                        description="Find the location of a device based on cell towers and WiFi nodes, even when GPS is unavailable."
                        unit="Requests"
                        freeTierLimit={40000}
                        priceTier1={5.00}
                        priceTier2={4.00}
                        threshold={100000}
                      />
                    </>
                  )}
                  {(title === "Maps SDKs" || title === "Dynamic Maps") && (
                    <PricingCalculatorCard 
                      category="MAPS"
                      title="Dynamic Maps"
                      description="Interactive maps that users can pan, zoom, and interact with. Includes advanced markers and data-driven styling capabilities."
                      unit="Loads"
                      freeTierLimit={28500}
                      priceTier1={7.00}
                      priceTier2={5.60}
                      threshold={100000}
                    />
                  )}
                  {(title === "Routes API") && (
                    <PricingCalculatorCard 
                      category="ROUTES"
                      title="Routes API"
                      description="Get directions for driving, walking, bicycling, and transit. Includes real-time traffic and waypoint optimization."
                      unit="Requests"
                      freeTierLimit={40000}
                      priceTier1={5.00}
                      priceTier2={4.00}
                      threshold={100000}
                    />
                  )}
                  {(title === "Static Maps" || title === "Maps Static API") && (
                    <PricingCalculatorCard 
                      category="MAPS"
                      title="Static Maps"
                      description="Simple, non-interactive map images that can be embedded in web pages or mobile apps. Ideal for displaying a single location."
                      unit="Loads"
                      freeTierLimit={100000}
                      priceTier1={2.00}
                      priceTier2={1.60}
                      threshold={100000}
                    />
                  )}
                  {(title === "Distance Matrix" || title === "Distance Matrix API") && (
                    <PricingCalculatorCard 
                      category="ROUTES"
                      title="Distance Matrix"
                      description="Calculate travel times and distances for multiple origins and destinations. Essential for logistics and delivery planning."
                      unit="Elements"
                      freeTierLimit={40000}
                      priceTier1={5.00}
                      priceTier2={4.00}
                      threshold={100000}
                    />
                  )}
                  {(title === "Places Autocomplete" || title === "Autocomplete") && (
                    <PricingCalculatorCard 
                      category="PRO"
                      title={title}
                      description="Use a single search query and specified location to get critical details like name and address about a set of places."
                      unit="Requests"
                      freeTierLimit={6250}
                      priceTier1={32.00}
                      priceTier2={25.60}
                      threshold={100000}
                    />
                  )}
                  {(title === "Text Search" || title === "Places API Text Search Pro") && (
                    <PricingCalculatorCard 
                      category="PRO"
                      title={title}
                      description="Use a single search query and specified location to get critical details like name and address about a set of places."
                      unit="Requests"
                      freeTierLimit={6250}
                      priceTier1={32.00}
                      priceTier2={25.60}
                      threshold={100000}
                    />
                  )}
                  
                  {/* Fallback if no specific title matches, show Autocomplete as default */}
                  {!["Place Details", "Places API", "Geocoding", "Geocoding API", "Geolocation API", "Maps SDKs", "Dynamic Maps", "Routes API", "Static Maps", "Maps Static API", "Distance Matrix", "Distance Matrix API", "Places Autocomplete", "Autocomplete", "Text Search", "Places API Text Search Pro"].includes(title) && (
                    <PricingCalculatorCard 
                      category="PRO"
                      title={title}
                      description="Use a single search query and specified location to get critical details like name and address about a set of places."
                      unit="Requests"
                      freeTierLimit={6250}
                      priceTier1={32.00}
                      priceTier2={25.60}
                      threshold={100000}
                    />
                  )}
                </div>
              </div>
            )}
          </div>
        </div>



        {/* Monthly Spend Range Section */}
        {activeTab === 'Subscriptions' && (
          <section className="space-y-8">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold text-gray-900">Monthly Spend Range</h2>
              <p className="text-gray-500 max-w-3xl">
                Your median estimate is mapped to your project blueprint. Your actual position depends on real-world engagement. Start building to validate with live data.
              </p>
            </div>

            <div className="bg-blue-50/50 border border-blue-100 rounded-3xl p-4 flex items-center justify-between">
              <div className="flex items-center gap-3 px-4">
                <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-sm">
                  <MapPin className="w-4 h-4 text-blue-600" />
                </div>
                <p className="text-sm font-medium text-gray-700">
                  <span className="font-bold">Validate</span> predictions with real data and save your progress
                </p>
              </div>
              <div className="flex items-center gap-4">
                <div className="bg-blue-600 text-white px-4 py-1.5 rounded-full text-xs font-bold flex items-center gap-2 shadow-lg shadow-blue-600/20">
                  <Rocket className="w-3.5 h-3.5" />
                  <div className="h-2 w-12 bg-white/30 rounded-full" />
                </div>
                <button className="p-2 hover:bg-blue-100 rounded-full transition-colors">
                  <X className="w-4 h-4 text-gray-400" />
                </button>
              </div>
            </div>

            <div className="relative h-[500px] bg-white border border-gray-100 rounded-[40px] p-8 shadow-sm">
              <div className="absolute top-8 right-8 z-10">
                <div className="inline-flex bg-blue-50 p-1 rounded-full">
                  <button className="px-4 py-1.5 rounded-full text-[10px] font-bold text-blue-600 flex items-center gap-1.5">
                    <History className="w-3 h-3" /> Subscriptions
                  </button>
                  <button className="px-4 py-1.5 bg-blue-600 text-white rounded-full text-[10px] font-bold shadow-md flex items-center gap-1.5">
                    <DollarSign className="w-3 h-3" /> Pay-as-you-go
                  </button>
                </div>
                <div className="mt-2 flex justify-end">
                  <div className="bg-green-50 text-green-600 text-[8px] font-bold px-2 py-0.5 rounded-full border border-green-100 flex items-center gap-1">
                    <CheckCircle2 className="w-2 h-2" /> Recommended
                  </div>
                </div>
              </div>

              <div className="absolute left-8 top-1/2 -translate-y-1/2 -rotate-90 origin-left">
                <p className="text-[10px] font-bold text-blue-600 uppercase tracking-widest flex items-center gap-2">
                  <Monitor className="w-3 h-3" /> projected cost
                </p>
              </div>

              <div className="w-full h-full pt-12 pb-8 px-12">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="usage" hide />
                    <YAxis hide />
                    <Tooltip 
                      content={({ active, payload }) => {
                        if (active && payload && payload.length) {
                          return (
                            <div className="bg-white border border-gray-100 p-4 rounded-2xl shadow-2xl space-y-4 min-w-[280px]">
                              <div className="flex items-center gap-2 text-blue-600">
                                <DollarSign className="w-5 h-5" />
                                <h3 className="font-bold text-lg italic tracking-tight">Itemized usage breakdown</h3>
                              </div>
                              <div className="space-y-4">
                                <div className="flex justify-between items-end border-b border-gray-50 pb-2">
                                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">APIs a la carte</p>
                                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-1">usage estimate <Info className="w-2.5 h-2.5" /></p>
                                </div>
                                <div className="space-y-3">
                                  <div className="flex justify-between items-center">
                                    <div className="flex items-center gap-2">
                                      <MapIcon className="w-4 h-4 text-gray-400" />
                                      <span className="text-xs font-medium text-gray-700">Maps Javascript API</span>
                                    </div>
                                    <span className="text-xs font-bold text-gray-900">5,000 loads</span>
                                  </div>
                                  <div className="flex justify-between items-center">
                                    <div className="flex items-center gap-2">
                                      <MapPin className="w-4 h-4 text-gray-400" />
                                      <span className="text-xs font-medium text-gray-700">Places Autocomplete</span>
                                    </div>
                                    <span className="text-xs font-bold text-gray-900">~2,500 requests</span>
                                  </div>
                                  <div className="flex justify-between items-center">
                                    <div className="flex items-center gap-2">
                                      <div className="w-4 h-4 bg-gray-100 rounded" />
                                      <div className="h-2 w-20 bg-gray-50 rounded-full" />
                                    </div>
                                    <div className="h-2 w-16 bg-gray-50 rounded-full" />
                                  </div>
                                </div>
                              </div>
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                    <Line type="monotone" dataKey="cost" stroke="#1e40af" strokeWidth={3} dot={false} />
                    <Line type="monotone" dataKey="projected" stroke="#10b981" strokeWidth={2} dot={false} />
                    <ReferenceLine x={5000} stroke="#cbd5e1" strokeDasharray="3 3" label="$" />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              <div className="absolute bottom-8 left-1/2 -translate-x-1/2">
                <div className="bg-blue-50 px-6 py-1.5 rounded-full flex items-center gap-2">
                  <Compass className="w-4 h-4 text-blue-600" />
                  <p className="text-[10px] font-bold text-blue-600 uppercase tracking-widest">usage</p>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Footer CTA */}
        <section className="bg-slate-900 rounded-[40px] p-12 text-center space-y-8 relative overflow-hidden">
          <div className="relative z-10 space-y-4">
            <h2 className="text-3xl font-bold text-white italic">Need a custom quote?</h2>
            <p className="text-slate-400 max-w-md mx-auto">
              For high-volume users or specific enterprise needs, our sales team can provide tailored pricing and support.
            </p>
            <div className="flex flex-wrap justify-center gap-4 pt-4">
              <button className="px-10 py-4 bg-blue-600 text-white rounded-2xl font-bold hover:bg-blue-700 transition-all shadow-xl shadow-blue-600/20">
                Contact Sales
              </button>
              <button 
                onClick={() => setView(originView || 'level1')}
                className="px-10 py-4 bg-white/10 text-white border border-white/10 rounded-2xl font-bold hover:bg-white/20 transition-all backdrop-blur-sm"
              >
                Return to Previous Page
              </button>
            </div>
          </div>
          <div className="absolute top-0 right-0 -translate-y-1/4 translate-x-1/4 opacity-10">
            <DollarSign className="w-64 h-64 text-white" />
          </div>
        </section>
      </div>
    </div>
  );
};

export default function App() {
  const [view, setView] = useState<ViewState>('mindmap');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [originView, setOriginView] = useState<ViewState | null>(null);
  const [selectedProject, setSelectedProject] = useState<any>(null);
  const [docsTab, setDocsTab] = useState('overview');
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const [chatMessages, setChatMessages] = useState<{role: 'user' | 'assistant', content: string}[]>([]);
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [solutionTitle, setSolutionTitle] = useState('Solution Guide');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleStartChat = (message: string) => {
    const { recommendations: solution, title } = assembleSolution(message);
    const productNames = solution.map(p => p.product).join(', ');
    
    setChatMessages([
      { role: 'user', content: message },
      { role: 'assistant', content: `Based on your request, I recommend: ${productNames}. Your Solution Guide is ready!` }
    ]);
    setRecommendations(solution);
    setSolutionTitle(title);
    setView('solution-guide');
  };

  const handleSendMessage = (message: string) => {
    setChatMessages(prev => [...prev, { role: 'user', content: message }]);
    // Navigate to solution guide immediately when a question is asked
    setView('solution-guide');
    
    // Simulate assistant response
    setTimeout(() => {
      const { recommendations: solution, title } = assembleSolution(message);
      const productNames = solution.map(p => p.product).join(', ');
      
      setChatMessages(prev => [...prev, { role: 'assistant', content: `Recommended: ${productNames}. Solution Guide updated.` }]);
      setRecommendations(solution);
      setSolutionTitle(title);
    }, 1000);
  };

  const handleNavigate = (newView: ViewState, newTitle?: string, customOriginView?: ViewState) => {
    const nestedViews: ViewState[] = ['cost', 'solution-guide', 'docs', 'project-details', 'remixing', 'editor'];
    if (nestedViews.includes(newView)) {
      // Only update originView if we are coming from a non-nested view
      if (customOriginView) {
        setOriginView(customOriginView);
      } else if (!nestedViews.includes(view)) {
        setOriginView(view);
      }
      if (newTitle) setSolutionTitle(newTitle);
    }
    setView(newView);
  };

  const navigateToDocs = (tab: string) => {
    const nestedViews: ViewState[] = ['cost', 'solution-guide', 'docs', 'project-details', 'remixing', 'editor'];
    if (!nestedViews.includes(view)) {
      setOriginView(view);
    }
    setDocsTab(tab);
    setView('docs');
  };

  const handleProjectClick = (project: any) => {
    const nestedViews: ViewState[] = ['cost', 'solution-guide', 'docs', 'project-details', 'remixing', 'editor'];
    if (!nestedViews.includes(view)) {
      setOriginView(view);
    }
    setSelectedProject(project);
    setView('project-details');
  };

  const handleRemixClick = (project: any) => {
    const nestedViews: ViewState[] = ['cost', 'solution-guide', 'docs', 'project-details', 'remixing', 'editor'];
    if (!nestedViews.includes(view)) {
      setOriginView(view);
    }
    setSelectedProject(project);
    setView('remixing');
  };

  return (
    <Layout 
      view={view} 
      setView={handleNavigate} 
      isLoggedIn={isLoggedIn} 
      setIsLoggedIn={setIsLoggedIn} 
      chatMessages={chatMessages} 
      onSendMessage={handleSendMessage} 
      onStartChat={handleStartChat} 
      navigateToDocs={navigateToDocs}
      onSearchClick={() => setIsSearchOpen(true)}
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={view}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
          className={view === 'mindmap' ? "h-full" : ""}
        >
          {view === 'level1' && <Level1ProductArea onNavigate={handleNavigate} onProjectClick={handleProjectClick} onRemixClick={handleRemixClick} isLoggedIn={isLoggedIn} onStartChat={handleStartChat} onSearchClick={() => setIsSearchOpen(true)} setIsLoggedIn={setIsLoggedIn} onLogin={() => setIsLoggedIn(true)} />}
          {view === 'level2-places' && <Level2PlacesOverview onNavigate={handleNavigate} onNavigateToDocs={navigateToDocs} isLoggedIn={isLoggedIn} onProjectClick={handleProjectClick} onRemixClick={handleRemixClick} onStartChat={handleStartChat} onLogin={() => setIsLoggedIn(true)} />}
          {view === 'level2-places-api' && <Level2PlacesAPI onNavigate={handleNavigate} onNavigateToDocs={navigateToDocs} isLoggedIn={isLoggedIn} onProjectClick={handleProjectClick} onRemixClick={handleRemixClick} onStartChat={handleStartChat} onLogin={() => setIsLoggedIn(true)} />}
          {view === 'level2-places-uikit' && <Level3Placeholder title="Places UI Kit" setView={handleNavigate} view={view} onNavigateToDocs={navigateToDocs} isLoggedIn={isLoggedIn} onProjectClick={handleProjectClick} onRemixClick={handleRemixClick} onStartChat={handleStartChat} onLogin={() => setIsLoggedIn(true)} />}
          {view === 'level2-address' && <Level2AddressValidation onNavigate={handleNavigate} onNavigateToDocs={navigateToDocs} isLoggedIn={isLoggedIn} onProjectClick={handleProjectClick} onRemixClick={handleRemixClick} onStartChat={handleStartChat} onLogin={() => setIsLoggedIn(true)} />}
          {view === 'level2-geocoding' && <Level2Geocoding onNavigate={handleNavigate} onNavigateToDocs={navigateToDocs} isLoggedIn={isLoggedIn} onProjectClick={handleProjectClick} onRemixClick={handleRemixClick} onStartChat={handleStartChat} onLogin={() => setIsLoggedIn(true)} />}
          {view === 'level2-maps' && <Level2Maps onNavigate={handleNavigate} onNavigateToDocs={navigateToDocs} isLoggedIn={isLoggedIn} onProjectClick={handleProjectClick} onRemixClick={handleRemixClick} onStartChat={handleStartChat} onLogin={() => setIsLoggedIn(true)} />}
          {view === 'level2-routes' && <Level2Routes onNavigate={handleNavigate} onNavigateToDocs={navigateToDocs} isLoggedIn={isLoggedIn} onProjectClick={handleProjectClick} onRemixClick={handleRemixClick} onStartChat={handleStartChat} onLogin={() => setIsLoggedIn(true)} />}
          {view === 'level2-environment' && <Level2Environment onNavigate={handleNavigate} onNavigateToDocs={navigateToDocs} isLoggedIn={isLoggedIn} onProjectClick={handleProjectClick} onRemixClick={handleRemixClick} onStartChat={handleStartChat} onLogin={() => setIsLoggedIn(true)} />}
          {view === 'level2-datasets' && <Level2Datasets onNavigate={handleNavigate} onNavigateToDocs={navigateToDocs} isLoggedIn={isLoggedIn} onProjectClick={handleProjectClick} onRemixClick={handleRemixClick} onStartChat={handleStartChat} onLogin={() => setIsLoggedIn(true)} />}
          {view === 'level2-analytics' && <Level2Analytics onNavigate={handleNavigate} onNavigateToDocs={navigateToDocs} isLoggedIn={isLoggedIn} onProjectClick={handleProjectClick} onRemixClick={handleRemixClick} onStartChat={handleStartChat} onLogin={() => setIsLoggedIn(true)} />}
          {view === 'level2-ai' && <Level2AI onNavigate={handleNavigate} onNavigateToDocs={navigateToDocs} isLoggedIn={isLoggedIn} onProjectClick={handleProjectClick} onRemixClick={handleRemixClick} onStartChat={handleStartChat} onLogin={() => setIsLoggedIn(true)} />}
          {view === 'autocomplete' && <Level3Autocomplete setView={handleNavigate} onNavigateToDocs={navigateToDocs} isLoggedIn={isLoggedIn} onProjectClick={handleProjectClick} onRemixClick={handleRemixClick} onStartChat={handleStartChat} onLogin={() => setIsLoggedIn(true)} />}
          {view === 'nearby' && <Level3NearbySearch setView={handleNavigate} onNavigateToDocs={navigateToDocs} isLoggedIn={isLoggedIn} onProjectClick={handleProjectClick} onRemixClick={handleRemixClick} onStartChat={handleStartChat} onLogin={() => setIsLoggedIn(true)} />}
          {view === 'details' && <Level3PlaceDetails setView={handleNavigate} onNavigateToDocs={navigateToDocs} isLoggedIn={isLoggedIn} onProjectClick={handleProjectClick} onRemixClick={handleRemixClick} onStartChat={handleStartChat} onLogin={() => setIsLoggedIn(true)} />}
          {view === 'text-search' && <Level3TextSearch setView={handleNavigate} onNavigateToDocs={navigateToDocs} isLoggedIn={isLoggedIn} onProjectClick={handleProjectClick} onRemixClick={handleRemixClick} onStartChat={handleStartChat} onLogin={() => setIsLoggedIn(true)} />}
          {view === 'photos' && <Level3Photos setView={handleNavigate} onNavigateToDocs={navigateToDocs} isLoggedIn={isLoggedIn} onProjectClick={handleProjectClick} onRemixClick={handleRemixClick} onStartChat={handleStartChat} onLogin={() => setIsLoggedIn(true)} />}
          {view === 'validate-address' && <Level3ValidateAddress setView={handleNavigate} onNavigateToDocs={navigateToDocs} isLoggedIn={isLoggedIn} onProjectClick={handleProjectClick} onRemixClick={handleRemixClick} onStartChat={handleStartChat} onLogin={() => setIsLoggedIn(true)} />}
          {view === 'geocode' && <Level3Geocode setView={handleNavigate} onNavigateToDocs={navigateToDocs} isLoggedIn={isLoggedIn} onProjectClick={handleProjectClick} onRemixClick={handleRemixClick} onStartChat={handleStartChat} onLogin={() => setIsLoggedIn(true)} />}
          {view === 'reverse-geocode' && <Level3ReverseGeocode setView={handleNavigate} onNavigateToDocs={navigateToDocs} isLoggedIn={isLoggedIn} onProjectClick={handleProjectClick} onRemixClick={handleRemixClick} onStartChat={handleStartChat} onLogin={() => setIsLoggedIn(true)} />}
          
          {/* Maps Level 3 */}
          {view === 'dynamic-maps' && <Level3Placeholder title="Maps SDK" setView={handleNavigate} view={view} onNavigateToDocs={navigateToDocs} isLoggedIn={isLoggedIn} onProjectClick={handleProjectClick} onRemixClick={handleRemixClick} onStartChat={handleStartChat} pricing={PRODUCT_ONTOLOGY['maps sdks']?.pricing} onLogin={() => setIsLoggedIn(true)} />}
          {view === 'static-maps' && <Level3Placeholder title="Static Maps" setView={handleNavigate} view={view} onNavigateToDocs={navigateToDocs} isLoggedIn={isLoggedIn} onProjectClick={handleProjectClick} onRemixClick={handleRemixClick} onStartChat={handleStartChat} pricing={PRODUCT_ONTOLOGY['static maps']?.pricing} onLogin={() => setIsLoggedIn(true)} />}
          {view === 'street-view' && <Level3Placeholder title="Street View" setView={handleNavigate} view={view} onNavigateToDocs={navigateToDocs} isLoggedIn={isLoggedIn} onProjectClick={handleProjectClick} onRemixClick={handleRemixClick} onStartChat={handleStartChat} pricing={PRODUCT_ONTOLOGY['street view']?.pricing} onLogin={() => setIsLoggedIn(true)} />}
          
          {/* Routes Level 3 */}
          {view === 'directions' && <Level3Placeholder title="Routes API" setView={handleNavigate} view={view} onNavigateToDocs={navigateToDocs} isLoggedIn={isLoggedIn} onProjectClick={handleProjectClick} onRemixClick={handleRemixClick} onStartChat={handleStartChat} pricing={PRODUCT_ONTOLOGY['directions api']?.pricing} onLogin={() => setIsLoggedIn(true)} />}
          {view === 'distance-matrix' && <Level3Placeholder title="Distance Matrix" setView={handleNavigate} view={view} onNavigateToDocs={navigateToDocs} isLoggedIn={isLoggedIn} onProjectClick={handleProjectClick} onRemixClick={handleRemixClick} onStartChat={handleStartChat} pricing={PRODUCT_ONTOLOGY['distance matrix api']?.pricing} onLogin={() => setIsLoggedIn(true)} />}
          {view === 'roads' && <Level3Placeholder title="Roads API" setView={handleNavigate} view={view} onNavigateToDocs={navigateToDocs} isLoggedIn={isLoggedIn} onProjectClick={handleProjectClick} onRemixClick={handleRemixClick} onStartChat={handleStartChat} pricing={PRODUCT_ONTOLOGY['roads api']?.pricing} onLogin={() => setIsLoggedIn(true)} />}
          
          {/* Environment Level 3 */}
          {view === 'air-quality' && <Level3Placeholder title="Air Quality API" setView={handleNavigate} view={view} onNavigateToDocs={navigateToDocs} isLoggedIn={isLoggedIn} onProjectClick={handleProjectClick} onRemixClick={handleRemixClick} onStartChat={handleStartChat} pricing={PRODUCT_ONTOLOGY['air quality api']?.pricing} onLogin={() => setIsLoggedIn(true)} />}
          {view === 'pollen' && <Level3Placeholder title="Pollen" setView={handleNavigate} view={view} onNavigateToDocs={navigateToDocs} isLoggedIn={isLoggedIn} onProjectClick={handleProjectClick} onRemixClick={handleRemixClick} onStartChat={handleStartChat} pricing={PRODUCT_ONTOLOGY['pollen api']?.pricing} onLogin={() => setIsLoggedIn(true)} />}
          {view === 'solar' && <Level3Placeholder title="Solar" setView={handleNavigate} view={view} onNavigateToDocs={navigateToDocs} isLoggedIn={isLoggedIn} onProjectClick={handleProjectClick} onRemixClick={handleRemixClick} onStartChat={handleStartChat} pricing={PRODUCT_ONTOLOGY['solar api']?.pricing} onLogin={() => setIsLoggedIn(true)} />}
          
          {/* Analytics Level 3 */}
          {view === 'usage-reports' && <Level3Placeholder title="Usage Reports" setView={handleNavigate} view={view} onNavigateToDocs={navigateToDocs} isLoggedIn={isLoggedIn} onProjectClick={handleProjectClick} onRemixClick={handleRemixClick} onStartChat={handleStartChat} onLogin={() => setIsLoggedIn(true)} />}
          {view === 'billing-insights' && <Level3Placeholder title="Billing Insights" setView={handleNavigate} view={view} onNavigateToDocs={navigateToDocs} isLoggedIn={isLoggedIn} onProjectClick={handleProjectClick} onRemixClick={handleRemixClick} onStartChat={handleStartChat} onLogin={() => setIsLoggedIn(true)} />}
          
          {/* AI & Tools Level 3 */}
          {view === 'maker-concierge' && <Level3Placeholder title="Maker Concierge" setView={handleNavigate} view={view} onNavigateToDocs={navigateToDocs} isLoggedIn={isLoggedIn} onProjectClick={handleProjectClick} onRemixClick={handleRemixClick} onStartChat={handleStartChat} onLogin={() => setIsLoggedIn(true)} />}
          {view === 'remix-studio' && <Level3Placeholder title="Remix Studio" setView={handleNavigate} view={view} onNavigateToDocs={navigateToDocs} isLoggedIn={isLoggedIn} onProjectClick={handleProjectClick} onRemixClick={handleRemixClick} onStartChat={handleStartChat} onLogin={() => setIsLoggedIn(true)} />}

          {view === 'project-details' && <ProjectDetails project={selectedProject} setView={handleNavigate} onRemixClick={handleRemixClick} originView={originView} />}
          {view === 'remixing' && <RemixProject project={selectedProject} setView={handleNavigate} onOpenEditor={() => setView('editor')} originView={originView} />}
          {view === 'editor' && <Editor project={selectedProject} setView={handleNavigate} originView={originView} />}
          {view === 'docs' && <Docs setView={handleNavigate} activeTab={docsTab} setActiveTab={setDocsTab} onProjectClick={handleProjectClick} onRemixClick={handleRemixClick} chatMessages={chatMessages} onSendMessage={handleSendMessage} originView={originView} />}
          {view === 'solution-guide' && <SolutionGuide recommendations={recommendations} setView={handleNavigate} title={solutionTitle} originView={originView} />}
          {view === 'mindmap' && <Mindmap onNavigate={handleNavigate} onNavigateToDocs={navigateToDocs} />}
          {view === 'cost' && <CostPage setView={handleNavigate} title={solutionTitle} originView={originView} />}
        </motion.div>
      </AnimatePresence>

      <SearchModal 
        isOpen={isSearchOpen} 
        onClose={() => setIsSearchOpen(false)} 
        onNavigate={(v) => {
          handleNavigate(v);
          setIsSearchOpen(false);
        }}
        onNavigateToDocs={(tab) => {
          navigateToDocs(tab);
          setIsSearchOpen(false);
        }}
      />
    </Layout>
  );
}
