import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { Compass, BookOpen, DollarSign, ExternalLink, ChevronDown, ZoomIn, ZoomOut, Maximize, Search, X } from 'lucide-react';
import { SearchAgent } from './SearchAgent';

interface MindmapNode {
  name: string;
  children?: MindmapNode[];
  value?: number;
  type?: 'root' | 'category' | 'product' | 'info' | 'link' | 'docs' | 'pricing' | 'error' | 'search';
  view?: string;
  docsTab?: string;
}

const platformChildren: MindmapNode[] = [
  { name: "REST API", type: 'info' },
  { name: "JavaScript", type: 'info' },
  { name: "Android SDK", type: 'info' },
  { name: "iOS SDK", type: 'info' }
];

const docPlatformChildren: MindmapNode[] = [
  { name: "REST API", type: 'docs' },
  { name: "JavaScript", type: 'docs' },
  { name: "Android SDK", type: 'docs' },
  { name: "iOS SDK", type: 'docs' }
];

const solutionsFinderActions: MindmapNode[] = [
  { name: "Improve addresses", type: 'info' },
  { name: "Display the ideal location", type: 'info' },
  { name: "Visualize data", type: 'info' },
  { name: "Provide local information", type: 'info' },
  { name: "Track assets", type: 'info' },
  { name: "Offer efficient routes", type: 'info' },
  { name: "Build immersive experiences", type: 'info' },
  { name: "Enrich transactions", type: 'info' },
  { name: "Build a product locator", type: 'info' },
  { name: "Create a store locator", type: 'info' },
  { name: "Improve checkout", type: 'info' },
  { name: "Support rides & deliveries", type: 'info' },
  { name: "Optimize last mile fleet deliveries", type: 'info' },
  { name: "Add a branch & ATM locator", type: 'info' },
  { name: "Build contextual experiences", type: 'info' },
  { name: "Improve sign-up", type: 'info' },
  { name: "Improve fraud detection", type: 'info' },
  { name: "Add property search", type: 'info' },
  { name: "Highlight neighborhoods", type: 'info' },
  { name: "Explore and select sites", type: 'info' },
  { name: "Collaborate and share", type: 'info' },
  { name: "Analyze geospatial data", type: 'info' }
];

const solutionsFinderActionsDocs: MindmapNode[] = solutionsFinderActions.map(action => ({
  ...action,
  type: 'docs',
  children: platformChildren
}));

const solutionsFinderIndustries: MindmapNode[] = [
  { name: "Retail", type: 'info' },
  { name: "Transportation & Logistics", type: 'info' },
  { name: "Financial Services", type: 'info' },
  { name: "Real Estate", type: 'info' },
  { name: "Architecture & Construction", type: 'info' },
  { name: "Something else", type: 'info' }
];

const solutionsFinderIndustriesDocs: MindmapNode[] = solutionsFinderIndustries.map(industry => ({
  ...industry,
  type: 'docs',
  children: platformChildren
}));

const v2MapData: MindmapNode = {
  name: "Google Maps Platform",
  type: 'root',
  children: [
    {
      name: "Search Agent",
      type: 'search'
    },
    {
      name: "Marketing",
      type: 'category',
      children: [
        { name: "Overview", type: 'info' },
        { name: "Campaigns", type: 'info' }
      ]
    },
    {
      name: "Products",
      type: 'category',
      children: [
        {
          name: "Maps",
          type: 'product',
          children: [
            {
              name: "Product Suite",
              type: 'category',
              children: [
                { 
                  name: "3D Maps", 
                  type: 'info',
                  children: [
                    { name: "Documentation", type: 'docs', view: 'level2-maps', docsTab: 'maps-js' },
                    { 
                      name: "Pricing Calculator", 
                      type: 'info', 
                      children: [{ name: "Pricing Details", type: 'pricing', view: 'level2-maps' }] 
                    },
                    { name: "Choose your platform", type: 'info', children: platformChildren }
                  ]
                },
                { 
                  name: "Aerial View", 
                  type: 'info',
                  children: [
                    { name: "Documentation", type: 'docs', view: 'level2-maps', docsTab: 'maps-aerial' },
                    { 
                      name: "Pricing Calculator", 
                      type: 'info', 
                      children: [{ name: "Pricing Details", type: 'pricing', view: 'level2-maps' }] 
                    },
                    { name: "Choose your platform", type: 'info', children: platformChildren }
                  ]
                },
                { 
                  name: "Maps SDKs", 
                  type: 'info',
                  children: [
                    { name: "Documentation", type: 'docs', view: 'level2-maps', docsTab: 'overview' },
                    { 
                      name: "Pricing Calculator", 
                      type: 'info', 
                      children: [{ name: "Pricing Details", type: 'pricing', view: 'level2-maps' }] 
                    },
                    { name: "Choose your platform", type: 'info', children: platformChildren }
                  ]
                },
                { 
                  name: "Tiles", 
                  type: 'info',
                  children: [
                    { name: "Documentation", type: 'docs', view: 'level2-maps', docsTab: 'maps-tiles' },
                    { 
                      name: "Pricing Calculator", 
                      type: 'info', 
                      children: [{ name: "Pricing Details", type: 'pricing', view: 'level2-maps' }] 
                    },
                    { name: "Choose your platform", type: 'info', children: platformChildren }
                  ]
                },
                { 
                  name: "Google Earth", 
                  type: 'info',
                  children: [
                    { name: "Documentation", type: 'docs', view: 'level2-maps', docsTab: 'overview' },
                    { 
                      name: "Pricing Calculator", 
                      type: 'info', 
                      children: [{ name: "Pricing Details", type: 'pricing', view: 'level2-maps' }] 
                    },
                    { name: "Choose your platform", type: 'info', children: platformChildren }
                  ]
                },
                { 
                  name: "Contextual View", 
                  type: 'info',
                  children: [
                    { name: "Documentation", type: 'docs', view: 'level2-maps', docsTab: 'overview' },
                    { 
                      name: "Pricing Calculator", 
                      type: 'info', 
                      children: [{ name: "Pricing Details", type: 'pricing', view: 'level2-maps' }] 
                    },
                    { name: "Choose your platform", type: 'info', children: platformChildren }
                  ]
                },
              ]
            }
          ]
        },
        {
          name: "Routes",
          type: 'product',
          children: [
            {
              name: "Product Suite",
              type: 'category',
              children: [
                { 
                  name: "Navigation SDKs", 
                  type: 'info',
                  children: [
                    { name: "Documentation", type: 'docs', view: 'level2-routes', docsTab: 'routes-android' },
                    { 
                      name: "Pricing Calculator", 
                      type: 'info', 
                      children: [{ name: "Pricing Details", type: 'pricing', view: 'level2-routes' }] 
                    },
                    { name: "Choose your platform", type: 'info', children: platformChildren }
                  ]
                },
                { 
                  name: "Roads API", 
                  type: 'info',
                  children: [
                    { name: "Documentation", type: 'docs', view: 'roads', docsTab: 'routes-roads' },
                    { 
                      name: "Pricing Calculator", 
                      type: 'info', 
                      children: [{ name: "Pricing Details", type: 'pricing', view: 'roads' }] 
                    },
                    { name: "Choose your platform", type: 'info', children: platformChildren }
                  ]
                },
                { 
                  name: "Routes API", 
                  type: 'info',
                  children: [
                    { name: "Documentation", type: 'docs', view: 'directions', docsTab: 'routes-api' },
                    { 
                      name: "Pricing Calculator", 
                      type: 'info', 
                      children: [{ name: "Pricing Details", type: 'pricing', view: 'directions' }] 
                    },
                    { name: "Choose your platform", type: 'info', children: platformChildren }
                  ]
                },
                { 
                  name: "Route Optimization", 
                  type: 'info',
                  children: [
                    { name: "Documentation", type: 'docs', view: 'level2-routes', docsTab: 'routes-optimization' },
                    { 
                      name: "Pricing Calculator", 
                      type: 'info', 
                      children: [{ name: "Pricing Details", type: 'pricing', view: 'level2-routes' }] 
                    },
                    { name: "Choose your platform", type: 'info', children: platformChildren }
                  ]
                },
                { 
                  name: "Mobility Services", 
                  type: 'info',
                  children: [
                    { name: "Documentation", type: 'docs', view: 'level2-routes', docsTab: 'overview' },
                    { 
                      name: "Pricing Calculator", 
                      type: 'info', 
                      children: [{ name: "Pricing Details", type: 'pricing', view: 'level2-routes' }] 
                    },
                    { name: "Choose your platform", type: 'info', children: platformChildren }
                  ]
                },
                { 
                  name: "Grounding Lite", 
                  type: 'info',
                  children: [
                    { name: "Documentation", type: 'docs', view: 'level2-routes', docsTab: 'overview' },
                    { 
                      name: "Pricing Calculator", 
                      type: 'info', 
                      children: [{ name: "Pricing Details", type: 'pricing', view: 'level2-routes' }] 
                    },
                    { name: "Choose your platform", type: 'info', children: platformChildren }
                  ]
                },
              ]
            }
          ]
        },
        {
          name: "Places",
          type: 'product',
          children: [
            { 
              name: "Product Suite",
              type: 'category',
              children: [
                { 
                  name: "Address Validation", 
                  type: 'info',
                  children: [
                    { name: "Documentation", type: 'docs', view: 'level2-address', docsTab: 'places-address' },
                    { 
                      name: "Pricing Calculator", 
                      type: 'info', 
                      children: [{ name: "Pricing Details", type: 'pricing', view: 'level2-address' }] 
                    },
                    { name: "Choose your platform", type: 'info', children: platformChildren }
                  ]
                },
                { 
                  name: "Geocoding", 
                  type: 'info',
                  children: [
                    { name: "Documentation", type: 'docs', view: 'level2-geocoding', docsTab: 'places-geocoding' },
                    { 
                      name: "Pricing Calculator", 
                      type: 'info', 
                      children: [{ name: "Pricing Details", type: 'pricing', view: 'level2-geocoding' }] 
                    },
                    { name: "Choose your platform", type: 'info', children: platformChildren }
                  ]
                },
                { 
                  name: "Places API", 
                  type: 'info',
                  children: [
                    { 
                      name: "Autocomplete", 
                      type: 'info',
                      children: [
                        { name: "Documentation", type: 'docs', view: 'autocomplete', docsTab: 'places-overview' },
                        { 
                          name: "Pricing Calculator", 
                          type: 'info', 
                          children: [{ name: "Pricing Details", type: 'pricing', view: 'autocomplete' }] 
                        },
                        { name: "Choose your platform", type: 'info', children: platformChildren }
                      ]
                    },
                    { 
                      name: "Nearby Search", 
                      type: 'info',
                      children: [
                        { name: "Documentation", type: 'docs', view: 'nearby', docsTab: 'places-overview' },
                        { 
                          name: "Pricing Calculator", 
                          type: 'info', 
                          children: [{ name: "Pricing Details", type: 'pricing', view: 'nearby' }] 
                        },
                        { name: "Choose your platform", type: 'info', children: platformChildren }
                      ]
                    },
                    { 
                      name: "Text Search", 
                      type: 'info',
                      children: [
                        { name: "Documentation", type: 'docs', view: 'text-search', docsTab: 'places-overview' },
                        { 
                          name: "Pricing Calculator", 
                          type: 'info', 
                          children: [{ name: "Pricing Details", type: 'pricing', view: 'text-search' }] 
                        },
                        { name: "Choose your platform", type: 'info', children: platformChildren }
                      ]
                    },
                    { 
                      name: "Place Details", 
                      type: 'info',
                      children: [
                        { name: "Documentation", type: 'docs', view: 'details', docsTab: 'places-overview' },
                        { 
                          name: "Pricing Calculator", 
                          type: 'info', 
                          children: [{ name: "Pricing Details", type: 'pricing', view: 'details' }] 
                        },
                        { name: "Choose your platform", type: 'info', children: platformChildren }
                      ]
                    },
                    { 
                      name: "Photos", 
                      type: 'info',
                      children: [
                        { name: "Documentation", type: 'docs', view: 'photos', docsTab: 'places-overview' },
                        { 
                          name: "Pricing Calculator", 
                          type: 'info', 
                          children: [{ name: "Pricing Details", type: 'pricing', view: 'photos' }] 
                        },
                        { name: "Choose your platform", type: 'info', children: platformChildren }
                      ]
                    },
                  ]
                },
                { 
                  name: "Grounding Lite", 
                  type: 'info',
                  children: [
                    { name: "Documentation", type: 'docs', view: 'level2-places', docsTab: 'overview' },
                    { 
                      name: "Pricing Calculator", 
                      type: 'info', 
                      children: [{ name: "Pricing Details", type: 'pricing', view: 'level2-places' }] 
                    },
                    { name: "Choose your platform", type: 'info', children: platformChildren }
                  ]
                },
                { 
                  name: "Places UI Kit", 
                  type: 'info',
                  children: [
                    { name: "Documentation", type: 'docs', view: 'level2-places-uikit', docsTab: 'places-library' },
                    { 
                      name: "Pricing Calculator", 
                      type: 'info', 
                      children: [{ name: "Pricing Details", type: 'pricing', view: 'level2-places-uikit' }] 
                    },
                    { name: "Choose your platform", type: 'info', children: platformChildren }
                  ]
                },
              ]
            }
          ]
        },
        {
          name: "Environment",
          type: 'product',
          children: [
            {
              name: "Product Suite",
              type: 'category',
              children: [
                { 
                  name: "Air Quality API", 
                  type: 'info',
                  children: [
                    { name: "Documentation", type: 'docs', view: 'air-quality', docsTab: 'env-air' },
                    { 
                      name: "Pricing Calculator", 
                      type: 'info', 
                      children: [{ name: "Pricing Details", type: 'pricing', view: 'air-quality' }] 
                    },
                    { name: "Choose your platform", type: 'info', children: platformChildren }
                  ]
                },
                { 
                  name: "Pollen API", 
                  type: 'info',
                  children: [
                    { name: "Documentation", type: 'docs', view: 'pollen', docsTab: 'env-pollen' },
                    { 
                      name: "Pricing Calculator", 
                      type: 'info', 
                      children: [{ name: "Pricing Details", type: 'pricing', view: 'pollen' }] 
                    },
                    { name: "Choose your platform", type: 'info', children: platformChildren }
                  ]
                },
                { 
                  name: "Solar API", 
                  type: 'info',
                  children: [
                    { name: "Documentation", type: 'docs', view: 'solar', docsTab: 'env-solar' },
                    { 
                      name: "Pricing Calculator", 
                      type: 'info', 
                      children: [{ name: "Pricing Details", type: 'pricing', view: 'solar' }] 
                    },
                    { name: "Choose your platform", type: 'info', children: platformChildren }
                  ]
                },
                { 
                  name: "Weather API", 
                  type: 'info',
                  children: [
                    { name: "Documentation", type: 'docs', view: 'level2-environment', docsTab: 'overview' },
                    { 
                      name: "Pricing Calculator", 
                      type: 'info', 
                      children: [{ name: "Pricing Details", type: 'pricing', view: 'level2-environment' }] 
                    },
                    { name: "Choose your platform", type: 'info', children: platformChildren }
                  ]
                },
                { 
                  name: "Earth Engine", 
                  type: 'info',
                  children: [
                    { name: "Documentation", type: 'docs', view: 'level2-environment', docsTab: 'overview' },
                    { 
                      name: "Pricing Calculator", 
                      type: 'info', 
                      children: [{ name: "Pricing Details", type: 'pricing', view: 'level2-environment' }] 
                    },
                    { name: "Choose your platform", type: 'info', children: platformChildren }
                  ]
                },
                { 
                  name: "Grounding Lite", 
                  type: 'info',
                  children: [
                    { name: "Documentation", type: 'docs', view: 'level2-environment', docsTab: 'overview' },
                    { 
                      name: "Pricing Calculator", 
                      type: 'info', 
                      children: [{ name: "Pricing Details", type: 'pricing', view: 'level2-environment' }] 
                    },
                    { name: "Choose your platform", type: 'info', children: platformChildren }
                  ]
                },
              ]
            }
          ]
        },
        {
          name: "Datasets",
          type: 'product',
          children: [
            {
              name: "Product Suite",
              type: 'category',
              children: [
                { 
                  name: "Places Aggregate", 
                  type: 'info',
                  children: [
                    { name: "Documentation", type: 'docs', view: 'level2-datasets', docsTab: 'places-aggregate' },
                    { 
                      name: "Pricing Calculator", 
                      type: 'info', 
                      children: [{ name: "Pricing Details", type: 'pricing', view: 'level2-datasets' }] 
                    },
                    { name: "Choose your platform", type: 'info', children: platformChildren }
                  ]
                },
                { 
                  name: "Places Insights", 
                  type: 'info',
                  children: [
                    { name: "Documentation", type: 'docs', view: 'level2-datasets', docsTab: 'analytics-places' },
                    { 
                      name: "Pricing Calculator", 
                      type: 'info', 
                      children: [{ name: "Pricing Details", type: 'pricing', view: 'level2-datasets' }] 
                    },
                    { name: "Choose your platform", type: 'info', children: platformChildren }
                  ]
                },
                { 
                  name: "Roads Management Insights", 
                  type: 'info',
                  children: [
                    { name: "Documentation", type: 'docs', view: 'level2-datasets', docsTab: 'routes-roads' },
                    { 
                      name: "Pricing Calculator", 
                      type: 'info', 
                      children: [{ name: "Pricing Details", type: 'pricing', view: 'level2-datasets' }] 
                    },
                    { name: "Choose your platform", type: 'info', children: platformChildren }
                  ]
                },
                { 
                  name: "Streetview Insights", 
                  type: 'info',
                  children: [
                    { name: "Documentation", type: 'docs', view: 'level2-datasets', docsTab: 'maps-sv-insights' },
                    { 
                      name: "Pricing Calculator", 
                      type: 'info', 
                      children: [{ name: "Pricing Details", type: 'pricing', view: 'level2-datasets' }] 
                    },
                    { name: "Choose your platform", type: 'info', children: platformChildren }
                  ]
                },
                { 
                  name: "Grounding with Google Maps", 
                  type: 'info',
                  children: [
                    { name: "Documentation", type: 'docs', view: 'level2-datasets', docsTab: 'ai-grounding' },
                    { 
                      name: "Pricing Calculator", 
                      type: 'info', 
                      children: [{ name: "Pricing Details", type: 'pricing', view: 'level2-datasets' }] 
                    },
                    { name: "Choose your platform", type: 'info', children: platformChildren }
                  ]
                },
              ]
            }
          ]
        },
      ]
    },
    {
      name: "Solutions",
      type: 'category',
      children: [
        { 
          name: "Solutions Finder", 
          type: 'info',
          children: [
            { name: "Action", type: 'category', children: solutionsFinderActions },
            { name: "Industry", type: 'category', children: solutionsFinderIndustries }
          ]
        },
        {
          name: "Use Cases",
          type: 'category',
          children: [
            { name: "Build interactive experiences", type: 'info', children: [{ name: "Documentation", type: 'docs' }, { name: "Pricing", type: 'pricing' }] },
            { name: "Display the ideal location", type: 'info', children: [{ name: "Documentation", type: 'docs' }, { name: "Pricing", type: 'pricing' }] },
            { name: "Enable asset tracking", type: 'info', children: [{ name: "Documentation", type: 'docs' }, { name: "Pricing", type: 'pricing' }] },
            { name: "Enrich transactions", type: 'info', children: [{ name: "Documentation", type: 'docs' }, { name: "Pricing", type: 'pricing' }] },
            { name: "Improve addresses", type: 'info', children: [{ name: "Documentation", type: 'docs' }, { name: "Pricing", type: 'pricing' }] },
            { name: "Offer efficient routes", type: 'info', children: [{ name: "Documentation", type: 'docs' }, { name: "Pricing", type: 'pricing' }] },
            { name: "Provide local information", type: 'info', children: [{ name: "Documentation", type: 'docs' }, { name: "Pricing", type: 'pricing' }] },
            { name: "Visualize geospatial data", type: 'info', children: [{ name: "Documentation", type: 'docs' }, { name: "Pricing", type: 'pricing' }] },
            { name: "Explore & select sites", type: 'info', children: [{ name: "Documentation", type: 'docs' }, { name: "Pricing", type: 'pricing' }] },
            { name: "Analyze geospatial data", type: 'info', children: [{ name: "Documentation", type: 'docs' }, { name: "Pricing", type: 'pricing' }] },
            { name: "Collaborate & share", type: 'info', children: [{ name: "Documentation", type: 'docs' }, { name: "Pricing", type: 'pricing' }] },
            { name: "Ground AI responses", type: 'info', children: [{ name: "Documentation", type: 'docs' }, { name: "Pricing", type: 'pricing' }] }
          ]
        },
        {
          name: "Industries",
          type: 'category',
          children: [
            { name: "Financial Industries", type: 'info', children: [{ name: "Documentation", type: 'docs' }, { name: "Pricing", type: 'pricing' }] },
            { name: "Retail", type: 'info', children: [{ name: "Documentation", type: 'docs' }, { name: "Pricing", type: 'pricing' }] },
            { name: "Real Estate", type: 'info', children: [{ name: "Documentation", type: 'docs' }, { name: "Pricing", type: 'pricing' }] },
            { name: "Transportation & Logistics", type: 'info', children: [{ name: "Documentation", type: 'docs' }, { name: "Pricing", type: 'pricing' }] }
          ]
        }
      ]
    },
    {
      name: "Resources",
      type: 'category',
      children: [
        {
          name: "AI & Tools",
          type: 'category',
          children: [
            { 
              name: "Grounding with Google Maps", 
              type: 'info',
              children: [
                { name: "Documentation", type: 'docs', view: 'level2-datasets', docsTab: 'ai-grounding' },
                { 
                  name: "Pricing Calculator", 
                  type: 'info', 
                  children: [{ name: "Pricing Details", type: 'pricing', view: 'level2-datasets' }] 
                },
                { name: "Choose your platform", type: 'info', children: platformChildren }
              ]
            },
            { 
              name: "Maker Concierge", 
              type: 'info',
              children: [
                { name: "Documentation", type: 'docs', view: 'maker-concierge', docsTab: 'ai-maker-concierge' },
                { 
                  name: "Pricing Calculator", 
                  type: 'info', 
                  children: [{ name: "Pricing Details", type: 'pricing', view: 'maker-concierge' }] 
                },
                { name: "Choose your platform", type: 'info', children: platformChildren }
              ]
            },
            { 
              name: "AI Tools", 
              type: 'info',
              children: [
                { name: "Documentation", type: 'docs', view: 'level2-ai', docsTab: 'overview' },
                { 
                  name: "Pricing Calculator", 
                  type: 'info', 
                  children: [{ name: "Pricing Details", type: 'pricing', view: 'level2-ai' }] 
                },
                { name: "Choose your platform", type: 'info', children: platformChildren }
              ]
            },
            { 
              name: "Grounding Lite", 
              type: 'info',
              children: [
                { name: "Documentation", type: 'docs', view: 'level2-environment', docsTab: 'overview' },
                { 
                  name: "Pricing Calculator", 
                  type: 'info', 
                  children: [{ name: "Pricing Details", type: 'pricing', view: 'level2-environment' }] 
                },
                { name: "Choose your platform", type: 'info', children: platformChildren }
              ]
            },
            { 
              name: "Google Maps AI Kit - Contextual View", 
              type: 'info',
              children: [
                { name: "Documentation", type: 'docs', view: 'level2-ai', docsTab: 'contextual-view' },
                { 
                  name: "Pricing Calculator", 
                  type: 'info', 
                  children: [{ name: "Pricing Details", type: 'pricing', view: 'level2-ai' }] 
                },
                { name: "Choose your platform", type: 'info', children: platformChildren }
              ]
            },
            { 
              name: "Google Earth", 
              type: 'info',
              children: [
                { name: "Documentation", type: 'docs', view: 'level2-maps', docsTab: 'google-earth' },
                { 
                  name: "Pricing Calculator", 
                  type: 'info', 
                  children: [{ name: "Pricing Details", type: 'pricing', view: 'level2-maps' }] 
                },
                { name: "Choose your platform", type: 'info', children: platformChildren }
              ]
            },
            { 
              name: "Geospatial Analytics", 
              type: 'info',
              children: [
                { name: "Documentation", type: 'docs', view: 'level2-datasets', docsTab: 'geospatial-analytics' },
                { 
                  name: "Pricing Calculator", 
                  type: 'info', 
                  children: [{ name: "Pricing Details", type: 'pricing', view: 'level2-datasets' }] 
                },
                { name: "Choose your platform", type: 'info', children: platformChildren }
              ]
            },
            { 
              name: "Grounding with Google Maps in Vertex AI", 
              type: 'info',
              children: [
                { name: "Documentation", type: 'docs', view: 'level2-datasets', docsTab: 'vertex-ai' },
                { 
                  name: "Pricing Calculator", 
                  type: 'info', 
                  children: [{ name: "Pricing Details", type: 'pricing', view: 'level2-datasets' }] 
                },
                { name: "Choose your platform", type: 'info', children: platformChildren }
              ]
            },
            { 
              name: "Place, area, and review summaries", 
              type: 'info',
              children: [
                { name: "Documentation", type: 'docs', view: 'level2-places', docsTab: 'summaries' },
                { 
                  name: "Pricing Calculator", 
                  type: 'info', 
                  children: [{ name: "Pricing Details", type: 'pricing', view: 'level2-places' }] 
                },
                { name: "Choose your platform", type: 'info', children: platformChildren }
              ]
            },
            { name: "Builder agent", type: 'info' },
            { name: "Maps Styling agent", type: 'info' },
            { name: "Code Assist Toolkit", type: 'info' },
            { name: "Route Optimization agent", type: 'info' },
          ]
        },
        {
          name: "Development",
          type: 'category',
          children: [
            { name: "Build with AI", type: 'info' },
            { name: "Architecture Center", type: 'info' },
            {
              name: "Documentation",
              type: 'category',
              children: [
                {
                  name: "Maps",
                  type: 'product',
                  children: [
                    {
                      name: "Product Suite",
                      type: 'category',
                      children: [
                        { name: "3D Maps", type: 'docs', children: platformChildren },
                        { name: "Aerial View", type: 'docs', children: platformChildren },
                        { name: "Maps SDKs", type: 'docs', children: platformChildren },
                        { name: "Tiles", type: 'docs', children: platformChildren },
                        { name: "Google Earth", type: 'docs', children: platformChildren },
                        { name: "Contextual View", type: 'docs', children: platformChildren },
                      ]
                    }
                  ]
                },
                {
                  name: "Routes",
                  type: 'product',
                  children: [
                    {
                      name: "Product Suite",
                      type: 'category',
                      children: [
                        { name: "Navigation SDKs", type: 'docs', children: platformChildren },
                        { name: "Roads API", type: 'docs', children: platformChildren },
                        { name: "Routes API", type: 'docs', children: platformChildren },
                        { name: "Route Optimization", type: 'docs', children: platformChildren },
                        { name: "Mobility Services", type: 'docs', children: platformChildren },
                        { name: "Grounding Lite", type: 'docs', children: platformChildren },
                      ]
                    }
                  ]
                },
                {
                  name: "Places",
                  type: 'product',
                  children: [
                    {
                      name: "Product Suite",
                      type: 'category',
                      children: [
                        { name: "Address Validation", type: 'docs', children: platformChildren },
                        { name: "Geocoding", type: 'docs', children: platformChildren },
                        { 
                          name: "Places API", 
                          type: 'docs', 
                          children: [
                            { name: "Autocomplete", type: 'docs', children: platformChildren },
                            { name: "Nearby Search", type: 'docs', children: platformChildren },
                            { name: "Text Search", type: 'docs', children: platformChildren },
                            { name: "Place Details", type: 'docs', children: platformChildren },
                            { name: "Photos", type: 'docs', children: platformChildren },
                          ]
                        },
                        { name: "Grounding Lite", type: 'docs', children: platformChildren },
                        { name: "Places UI Kit", type: 'docs', children: platformChildren },
                      ]
                    }
                  ]
                },
                {
                  name: "Environment",
                  type: 'product',
                  children: [
                    {
                      name: "Product Suite",
                      type: 'category',
                      children: [
                        { name: "Air Quality API", type: 'docs', children: platformChildren },
                        { name: "Pollen API", type: 'docs', children: platformChildren },
                        { name: "Solar API", type: 'docs', children: platformChildren },
                        { name: "Weather API", type: 'docs', children: platformChildren },
                        { name: "Earth Engine", type: 'docs', children: platformChildren },
                        { name: "Grounding Lite", type: 'docs', children: platformChildren },
                      ]
                    }
                  ]
                },
                {
                  name: "Datasets",
                  type: 'product',
                  children: [
                    {
                      name: "Product Suite",
                      type: 'category',
                      children: [
                        { name: "Places Aggregate", type: 'docs', children: platformChildren },
                        { name: "Places Insights", type: 'docs', children: platformChildren },
                        { name: "Roads Management Insights", type: 'docs', children: platformChildren },
                        { name: "Streetview Insights", type: 'docs', children: platformChildren },
                        { name: "Grounding with Google Maps", type: 'docs', children: platformChildren },
                      ]
                    }
                  ]
                },
                {
                  name: "Solutions",
                  type: 'product',
                  children: [
                    { 
                      name: "Solutions Finder", 
                      type: 'docs', 
                      children: [
                        { name: "Action", type: 'category', children: solutionsFinderActionsDocs },
                        { name: "Industry", type: 'category', children: solutionsFinderIndustriesDocs }
                      ] 
                    },
                    {
                      name: "Use Cases",
                      type: 'category',
                      children: [
                        { name: "Build interactive experiences", type: 'docs', children: platformChildren },
                        { name: "Display the ideal location", type: 'docs', children: platformChildren },
                        { name: "Enable asset tracking", type: 'docs', children: platformChildren },
                        { name: "Enrich transactions", type: 'docs', children: platformChildren },
                        { name: "Improve addresses", type: 'docs', children: platformChildren },
                        { name: "Offer efficient routes", type: 'docs', children: platformChildren },
                        { name: "Provide local information", type: 'docs', children: platformChildren },
                        { name: "Visualize geospatial data", type: 'docs', children: platformChildren },
                        { name: "Explore & select sites", type: 'docs', children: platformChildren },
                        { name: "Analyze geospatial data", type: 'docs', children: platformChildren },
                        { name: "Collaborate & share", type: 'docs', children: platformChildren },
                        { name: "Ground AI responses", type: 'docs', children: platformChildren },
                      ]
                    },
                    {
                      name: "Industries",
                      type: 'category',
                      children: [
                        { name: "Financial Industries", type: 'docs', children: platformChildren },
                        { name: "Retail", type: 'docs', children: platformChildren },
                        { name: "Real Estate", type: 'docs', children: platformChildren },
                        { name: "Transportation & Logistics", type: 'docs', children: platformChildren },
                      ]
                    }
                  ]
                }
              ]
            },
            { name: "Partner directory", type: 'info' },
            { name: "Trust Center", type: 'info' },
            { 
              name: "Solutions Finder", 
              type: 'info',
              children: [
                { name: "Action", type: 'category', children: solutionsFinderActions },
                { name: "Industry", type: 'category', children: solutionsFinderIndustries }
              ]
            },
            { name: "Maps Demo Key", type: 'info' }
          ]
        },
        {
          name: "Learn",
          type: 'category',
          children: [
            { name: "Blog", type: 'info' },
            { name: "Customer stories", type: 'info' },
            { name: "Documentation", type: 'category' },
            { name: "Demo Gallery", type: 'info' },
            { name: "Webinars", type: 'info' },
            { name: "Whitepapers", type: 'info' }
          ]
        },
        {
          name: "Connect",
          type: 'category',
          children: [
            { name: "Discord", type: 'info' },
            { name: "GitHub", type: 'info' },
            { name: "YouTube", type: 'info' },
            { name: "Google Maps Platform Awards", type: 'info' },
            { name: "Google Maps Platform Innovators", type: 'info' },
            { 
              name: "Support resources", 
              type: 'info',
              children: [
                { name: "Open a case", type: 'info' },
                { name: "Support plans", type: 'info' },
                { name: "Status dashboard", type: 'info' }
              ]
            }
          ]
        }
      ]
    }
  ]
};

// Deep clone for Current State to allow independent editing
const currentStateData: MindmapNode = JSON.parse(JSON.stringify(v2MapData));
currentStateData.name = "Current State Map";

// Roll back Resources section to 30 mins ago (AI Products, AI Tools, Development, Learn, Community, Support)
currentStateData.children[3].children = [
  {
    name: "AI Products",
    type: 'category',
    children: [
      { 
        name: "Grounding with Google Maps", 
        type: 'info',
        children: [
          { name: "Documentation", type: 'docs', view: 'level2-datasets', docsTab: 'ai-grounding' },
          { 
            name: "Pricing Calculator", 
            type: 'info', 
            children: [{ name: "Pricing Details", type: 'pricing', view: 'level2-datasets' }] 
          },
          { name: "Choose your platform", type: 'info', children: platformChildren }
        ]
      },
      { 
        name: "Maker Concierge", 
        type: 'info',
        children: [
          { name: "Documentation", type: 'docs', view: 'maker-concierge', docsTab: 'ai-maker-concierge' },
          { 
            name: "Pricing Calculator", 
            type: 'info', 
            children: [{ name: "Pricing Details", type: 'pricing', view: 'maker-concierge' }] 
          },
          { name: "Choose your platform", type: 'info', children: platformChildren }
        ]
      },
      { 
        name: "Grounding Lite", 
        type: 'info',
        children: [
          { name: "Documentation", type: 'docs', view: 'level2-environment', docsTab: 'overview' },
          { 
            name: "Pricing Calculator", 
            type: 'info', 
            children: [{ name: "Pricing Details", type: 'pricing', view: 'level2-environment' }] 
          },
          { name: "Choose your platform", type: 'info', children: platformChildren }
        ]
      },
      { 
        name: "Google Maps AI Kit - Contextual View", 
        type: 'info',
        children: [
          { name: "Documentation", type: 'docs', view: 'level2-ai', docsTab: 'contextual-view' },
          { 
            name: "Pricing Calculator", 
            type: 'info', 
            children: [{ name: "Pricing Details", type: 'pricing', view: 'level2-ai' }] 
          },
          { name: "Choose your platform", type: 'info', children: platformChildren }
        ]
      },
      { 
        name: "Google Earth", 
        type: 'info',
        children: [
          { name: "Documentation", type: 'docs', view: 'level2-maps', docsTab: 'google-earth' },
          { 
            name: "Pricing Calculator", 
            type: 'info', 
            children: [{ name: "Pricing Details", type: 'pricing', view: 'level2-maps' }] 
          },
          { name: "Choose your platform", type: 'info', children: platformChildren }
        ]
      },
      { 
        name: "Geospatial Analytics", 
        type: 'info',
        children: [
          { name: "Documentation", type: 'docs', view: 'level2-datasets', docsTab: 'geospatial-analytics' },
          { 
            name: "Pricing Calculator", 
            type: 'info', 
            children: [{ name: "Pricing Details", type: 'pricing', view: 'level2-datasets' }] 
          },
          { name: "Choose your platform", type: 'info', children: platformChildren }
        ]
      },
      { 
        name: "Grounding with Google Maps in Vertex AI", 
        type: 'info',
        children: [
          { name: "Documentation", type: 'docs', view: 'level2-datasets', docsTab: 'vertex-ai' },
          { 
            name: "Pricing Calculator", 
            type: 'info', 
            children: [{ name: "Pricing Details", type: 'pricing', view: 'level2-datasets' }] 
          },
          { name: "Choose your platform", type: 'info', children: platformChildren }
        ]
      },
      { 
        name: "Place, area, and review summaries", 
        type: 'info',
        children: [
          { name: "Documentation", type: 'docs', view: 'level2-places', docsTab: 'summaries' },
          { 
            name: "Pricing Calculator", 
            type: 'info', 
            children: [{ name: "Pricing Details", type: 'pricing', view: 'level2-places' }] 
          },
          { name: "Choose your platform", type: 'info', children: platformChildren }
        ]
      },
    ]
  },
  {
    name: "AI Tools",
    type: 'category',
    children: [
      { name: "Builder agent", type: 'info' },
      { name: "Maps Styling agent", type: 'info' },
      { name: "Code Assist Toolkit", type: 'info' },
      { name: "Route Optimization agent", type: 'info' },
    ]
  },
  JSON.parse(JSON.stringify(v2MapData.children[3].children[1])), // Development
  JSON.parse(JSON.stringify(v2MapData.children[3].children[2])), // Learn
  {
    name: "Community",
    type: 'category',
    children: [
      { name: "Discord", type: 'info' },
      { name: "GitHub", type: 'info' },
      { name: "YouTube", type: 'info' },
      { name: "Google Maps Platform Awards", type: 'info' },
      { name: "Google Maps Platform Innovators", type: 'info' }
    ]
  },
  {
    name: "Support",
    type: 'category',
    children: [
      { name: "Support resources", type: 'info' },
      { name: "Open a case", type: 'info' },
      { name: "Support plans", type: 'info' },
      { name: "Status dashboard", type: 'info' }
    ]
  }
];

// Apply Current State specific product lists
const currentMaps = [
  { name: "3D Maps", type: 'info', children: [{ name: "Documentation", type: 'info', children: docPlatformChildren }, { name: "Choose your platform", type: 'info', children: platformChildren }] },
  { name: "Aerial View", type: 'info', children: [{ name: "Documentation", type: 'info', children: docPlatformChildren }, { name: "Choose your platform", type: 'info', children: platformChildren }] },
  { name: "Dynamic Maps", type: 'info', children: [{ name: "Documentation", type: 'info', children: docPlatformChildren }, { name: "Choose your platform", type: 'info', children: platformChildren }] },
  { name: "Dynamic Street View", type: 'info', children: [{ name: "Documentation", type: 'info', children: docPlatformChildren }, { name: "Choose your platform", type: 'info', children: platformChildren }] },
  { name: "Elevation", type: 'info', children: [{ name: "Documentation", type: 'info', children: docPlatformChildren }, { name: "Choose your platform", type: 'info', children: platformChildren }] },
  { name: "Map Tiles", type: 'info', children: [{ name: "Documentation", type: 'info', children: docPlatformChildren }, { name: "Choose your platform", type: 'info', children: platformChildren }] },
  { name: "Maps Embed", type: 'info', children: [{ name: "Documentation", type: 'info', children: docPlatformChildren }, { name: "Choose your platform", type: 'info', children: platformChildren }] },
  { name: "Photorealistic 3D Tiles", type: 'info', children: [{ name: "Documentation", type: 'info', children: docPlatformChildren }, { name: "Choose your platform", type: 'info', children: platformChildren }] },
  { name: "Static Maps", type: 'info', children: [{ name: "Documentation", type: 'info', children: docPlatformChildren }, { name: "Choose your platform", type: 'info', children: platformChildren }] },
  { name: "Static Street View", type: 'info', children: [{ name: "Documentation", type: 'info', children: docPlatformChildren }, { name: "Choose your platform", type: 'info', children: platformChildren }] },
  { name: "Street View Tiles", type: 'info', children: [{ name: "Documentation", type: 'info', children: docPlatformChildren }, { name: "Choose your platform", type: 'info', children: platformChildren }] },
];

const currentRoutes = [
  { name: "Compute Routes", type: 'info', children: [{ name: "Documentation", type: 'info', children: docPlatformChildren }, { name: "Choose your platform", type: 'info', children: platformChildren }] },
  { name: "Compute Routes Matrix", type: 'info', children: [{ name: "Documentation", type: 'info', children: docPlatformChildren }, { name: "Choose your platform", type: 'info', children: platformChildren }] },
  { name: "Navigation SDK", type: 'info', children: [{ name: "Documentation", type: 'info', children: docPlatformChildren }, { name: "Choose your platform", type: 'info', children: platformChildren }] },
  { name: "Roads", type: 'info', children: [{ name: "Documentation", type: 'info', children: docPlatformChildren }, { name: "Choose your platform", type: 'info', children: platformChildren }] },
  { name: "Route Optimization", type: 'info', children: [{ name: "Documentation", type: 'info', children: docPlatformChildren }, { name: "Choose your platform", type: 'info', children: platformChildren }] },
];

const currentPlaces = [
  { name: "Address Validation", type: 'info', children: [{ name: "Documentation", type: 'info', children: docPlatformChildren }, { name: "Choose your platform", type: 'info', children: platformChildren }] },
  { name: "Autocomplete", type: 'info', children: [{ name: "Documentation", type: 'info', children: docPlatformChildren }, { name: "Choose your platform", type: 'info', children: platformChildren }] },
  { name: "Geocoding", type: 'info', children: [{ name: "Documentation", type: 'info', children: docPlatformChildren }, { name: "Choose your platform", type: 'info', children: platformChildren }] },
  { name: "Geolocation", type: 'info', children: [{ name: "Documentation", type: 'info', children: docPlatformChildren }, { name: "Choose your platform", type: 'info', children: platformChildren }] },
  { name: "Grounding Lite", type: 'info', children: [{ name: "Documentation", type: 'info', children: docPlatformChildren }, { name: "Choose your platform", type: 'info', children: platformChildren }] },
  { name: "Grounding with Google Maps in Vertex AI", type: 'info', children: [{ name: "Documentation", type: 'info', children: docPlatformChildren }, { name: "Choose your platform", type: 'info', children: platformChildren }] },
  { name: "Nearby Search", type: 'info', children: [{ name: "Documentation", type: 'info', children: docPlatformChildren }, { name: "Choose your platform", type: 'info', children: platformChildren }] },
  { name: "Place Details", type: 'info', children: [{ name: "Documentation", type: 'info', children: docPlatformChildren }, { name: "Choose your platform", type: 'info', children: platformChildren }] },
  { name: "Place Photos", type: 'info', children: [{ name: "Documentation", type: 'info', children: docPlatformChildren }, { name: "Choose your platform", type: 'info', children: platformChildren }] },
  { name: "Places Aggregate", type: 'info', children: [{ name: "Documentation", type: 'info', children: docPlatformChildren }, { name: "Choose your platform", type: 'info', children: platformChildren }] },
  { name: "Places UI Kit", type: 'info', children: [{ name: "Documentation", type: 'info', children: docPlatformChildren }, { name: "Choose your platform", type: 'info', children: platformChildren }] },
  { name: "Text Search", type: 'info', children: [{ name: "Documentation", type: 'info', children: docPlatformChildren }, { name: "Choose your platform", type: 'info', children: platformChildren }] },
  { name: "Time Zone", type: 'info', children: [{ name: "Documentation", type: 'info', children: docPlatformChildren }, { name: "Choose your platform", type: 'info', children: platformChildren }] },
];

const currentEnvironment = [
  { name: "Air Quality", type: 'info', children: [{ name: "Documentation", type: 'info', children: docPlatformChildren }, { name: "Choose your platform", type: 'info', children: platformChildren }] },
  { name: "Pollen", type: 'info', children: [{ name: "Documentation", type: 'info', children: docPlatformChildren }, { name: "Choose your platform", type: 'info', children: platformChildren }] },
  { name: "Solar", type: 'info', children: [{ name: "Documentation", type: 'info', children: docPlatformChildren }, { name: "Choose your platform", type: 'info', children: platformChildren }] },
  { name: "Weather", type: 'info', children: [{ name: "Documentation", type: 'info', children: docPlatformChildren }, { name: "Choose your platform", type: 'info', children: platformChildren }] },
];

const currentDatasets = [
  { name: "Places Insights", type: 'info', children: [{ name: "Documentation", type: 'info', children: docPlatformChildren }, { name: "Choose your platform", type: 'info', children: platformChildren }] },
  { name: "Road Management Insights", type: 'info', children: [{ name: "Documentation", type: 'info', children: docPlatformChildren }, { name: "Choose your platform", type: 'info', children: platformChildren }] },
  { name: "Street View Insights", type: 'info', children: [{ name: "Documentation", type: 'info', children: docPlatformChildren }, { name: "Choose your platform", type: 'info', children: platformChildren }] },
];

const currentTools = [
  {
    name: "Products",
    type: 'category',
    children: [
      { name: "Google Earth", type: 'info', children: [{ name: "Documentation", type: 'info', children: docPlatformChildren }, { name: "Choose your platform", type: 'info', children: platformChildren }] },
      { name: "Earth Engine (Google Cloud)", type: 'info', children: [{ name: "Documentation", type: 'info', children: docPlatformChildren }, { name: "Choose your platform", type: 'info', children: platformChildren }] },
      { name: "Google Maps AI Kit - Contextual View", type: 'info', children: [{ name: "Documentation", type: 'info', children: docPlatformChildren }, { name: "Choose your platform", type: 'info', children: platformChildren }] },
      { name: "Geospatial Analytics", type: 'info', children: [{ name: "Documentation", type: 'info', children: docPlatformChildren }, { name: "Choose your platform", type: 'info', children: platformChildren }] },
      { name: "Grounding Lite", type: 'info', children: [{ name: "Documentation", type: 'info', children: docPlatformChildren }, { name: "Choose your platform", type: 'info', children: platformChildren }] },
      { name: "Grounding with Google Maps in Vertex AI", type: 'info', children: [{ name: "Documentation", type: 'info', children: docPlatformChildren }, { name: "Choose your platform", type: 'info', children: platformChildren }] },
      { name: "Place, area, and review summaries", type: 'info', children: [{ name: "Documentation", type: 'info', children: docPlatformChildren }, { name: "Choose your platform", type: 'info', children: platformChildren }] },
    ]
  },
  {
    name: "Tools",
    type: 'category',
    children: [
      { name: "Builder agent", type: 'info' },
      { name: "Maps Styling agent", type: 'info' },
      { name: "Code Assist Toolkit", type: 'info' },
      { name: "Route Optimization agent", type: 'info' },
    ]
  }
];

const currentSolutions = [
  { 
    name: "Solutions Finder", 
    type: 'info',
    children: [
      { name: "Action", type: 'category', children: solutionsFinderActions },
      { name: "Industry", type: 'category', children: solutionsFinderIndustries }
    ]
  },
  {
    name: "Use Cases",
    type: 'category',
    children: [
      { name: "Build interactive experiences", type: 'info', children: [{ name: "Documentation", type: 'info', children: docPlatformChildren }, { name: "Pricing", type: 'pricing' }, { name: "Choose your platform", type: 'info', children: platformChildren }] },
      { name: "Display the ideal location", type: 'info', children: [{ name: "Documentation", type: 'info', children: docPlatformChildren }, { name: "Pricing", type: 'pricing' }, { name: "Choose your platform", type: 'info', children: platformChildren }] },
      { name: "Enable asset tracking", type: 'info', children: [{ name: "Documentation", type: 'info', children: docPlatformChildren }, { name: "Pricing", type: 'pricing' }, { name: "Choose your platform", type: 'info', children: platformChildren }] },
      { name: "Enrich transactions", type: 'info', children: [{ name: "Documentation", type: 'info', children: docPlatformChildren }, { name: "Pricing", type: 'pricing' }, { name: "Choose your platform", type: 'info', children: platformChildren }] },
      { name: "Improve addresses", type: 'info', children: [{ name: "Documentation", type: 'info', children: docPlatformChildren }, { name: "Pricing", type: 'pricing' }, { name: "Choose your platform", type: 'info', children: platformChildren }] },
      { name: "Offer efficient routes", type: 'info', children: [{ name: "Documentation", type: 'info', children: docPlatformChildren }, { name: "Pricing", type: 'pricing' }, { name: "Choose your platform", type: 'info', children: platformChildren }] },
      { name: "Provide local information", type: 'info', children: [{ name: "Documentation", type: 'info', children: docPlatformChildren }, { name: "Pricing", type: 'pricing' }, { name: "Choose your platform", type: 'info', children: platformChildren }] },
      { name: "Visualize geospatial data", type: 'info', children: [{ name: "Documentation", type: 'info', children: docPlatformChildren }, { name: "Pricing", type: 'pricing' }, { name: "Choose your platform", type: 'info', children: platformChildren }] },
      { name: "Explore & select sites", type: 'info', children: [{ name: "Documentation", type: 'info', children: docPlatformChildren }, { name: "Pricing", type: 'pricing' }, { name: "Choose your platform", type: 'info', children: platformChildren }] },
      { name: "Analyze geospatial data", type: 'info', children: [{ name: "Documentation", type: 'info', children: docPlatformChildren }, { name: "Pricing", type: 'pricing' }, { name: "Choose your platform", type: 'info', children: platformChildren }] },
      { name: "Collaborate & share", type: 'info', children: [{ name: "Documentation", type: 'info', children: docPlatformChildren }, { name: "Pricing", type: 'pricing' }, { name: "Choose your platform", type: 'info', children: platformChildren }] },
      { name: "Ground AI responses", type: 'info', children: [{ name: "Documentation", type: 'info', children: docPlatformChildren }, { name: "Pricing", type: 'pricing' }, { name: "Choose your platform", type: 'info', children: platformChildren }] }
    ]
  },
  {
    name: "Industries",
    type: 'category',
    children: [
      { name: "Financial Industries", type: 'info', children: [{ name: "Documentation", type: 'info', children: docPlatformChildren }, { name: "Pricing", type: 'pricing' }, { name: "Choose your platform", type: 'info', children: platformChildren }] },
      { name: "Retail", type: 'info', children: [{ name: "Documentation", type: 'info', children: docPlatformChildren }, { name: "Pricing", type: 'pricing' }, { name: "Choose your platform", type: 'info', children: platformChildren }] },
      { name: "Real Estate", type: 'info', children: [{ name: "Documentation", type: 'info', children: docPlatformChildren }, { name: "Pricing", type: 'pricing' }, { name: "Choose your platform", type: 'info', children: platformChildren }] },
      { name: "Transportation & Logistics", type: 'info', children: [{ name: "Documentation", type: 'info', children: docPlatformChildren }, { name: "Pricing", type: 'pricing' }, { name: "Choose your platform", type: 'info', children: platformChildren }] }
    ]
  }
];

const currentPricing = [
  { 
    name: "Pay as you go", 
    type: 'pricing', 
    view: 'cost',
    children: [
      { 
        name: "Maps", 
        type: 'pricing',
        children: currentMaps.map(m => ({ name: m.name, type: 'pricing' }))
      },
      { 
        name: "Routes", 
        type: 'pricing',
        children: currentRoutes.map(r => ({ name: r.name, type: 'pricing' }))
      },
      { 
        name: "Places", 
        type: 'pricing',
        children: currentPlaces.map(p => ({ name: p.name, type: 'pricing' }))
      },
      { 
        name: "Environment", 
        type: 'pricing',
        children: currentEnvironment.map(e => ({ name: e.name, type: 'pricing' }))
      },
      { 
        name: "Solutions", 
        type: 'pricing',
        children: currentSolutions.map(s => ({ name: s.name, type: 'pricing' }))
      },
      { name: "↗ Subscribe to save", type: 'pricing' }
    ]
  },
  { 
    name: "Subscribe to save", 
    type: 'pricing', 
    view: 'cost',
    children: [
      { name: "Starter", type: 'pricing' },
      { name: "Essential", type: 'pricing' },
      { name: "Pro", type: 'pricing' },
      { name: "↗ Pay as you go", type: 'pricing' }
    ]
  },
  { 
    name: "Google Earth", 
    type: 'pricing', 
    children: [
      { name: "Standard", type: 'pricing' },
      { name: "Advanced", type: 'pricing' },
      { name: "Professional Advanced", type: 'pricing' }
    ]
  },
  {
    name: "AI & Tools",
    type: 'product',
    children: [
      {
        name: "Products",
        type: 'category',
        children: [
          { name: "Grounding with Google Maps", type: 'pricing', children: platformChildren },
          { name: "Maker Concierge", type: 'pricing', children: platformChildren },
          { name: "AI Tools", type: 'pricing', children: platformChildren },
          { name: "Grounding Lite", type: 'pricing', children: platformChildren },
          { name: "Google Maps AI Kit - Contextual View", type: 'pricing', children: platformChildren },
          { name: "Google Earth", type: 'pricing', children: platformChildren },
          { name: "Geospatial Analytics", type: 'pricing', children: platformChildren },
          { name: "Grounding with Google Maps in Vertex AI", type: 'pricing', children: platformChildren },
          { name: "Place, area, and review summaries", type: 'pricing', children: platformChildren },
        ]
      },
      {
        name: "Tools",
        type: 'category',
        children: [
          { name: "Builder agent", type: 'pricing', children: platformChildren },
          { name: "Maps Styling agent", type: 'pricing', children: platformChildren },
          { name: "Code Assist Toolkit", type: 'pricing', children: platformChildren },
          { name: "Route Optimization agent", type: 'pricing', children: platformChildren },
        ]
      }
    ]
  }
];

const currentDocumentation = [
  {
    name: "Maps",
    type: 'product',
    children: [{ 
      name: "Product Suite", 
      type: 'category', 
      children: [
        { name: "Maps JavaScript API", type: 'docs', children: platformChildren },
        { name: "Maps SDK for Android", type: 'docs', children: platformChildren },
        { name: "Maps SDK for iOS", type: 'docs', children: platformChildren },
        { name: "Google Maps for Flutter", type: 'docs', children: platformChildren },
        { name: "Maps Embed API", type: 'docs', children: platformChildren },
        { name: "Maps Static API", type: 'docs', children: platformChildren },
        { name: "Street View Insights", type: 'docs', children: platformChildren },
        { name: "Street View Static API", type: 'docs', children: platformChildren },
        { name: "Maps URLs", type: 'docs', children: platformChildren },
        { name: "Aerial View API", type: 'docs', children: platformChildren },
        { name: "Elevation API", type: 'docs', children: platformChildren },
        { name: "Map Tiles API", type: 'docs', children: platformChildren },
        { name: "Maps Datasets API", type: 'docs', children: platformChildren },
        { name: "Web Components", type: 'docs', children: platformChildren },
      ] 
    }]
  },
  {
    name: "Routes",
    type: 'product',
    children: [{ 
      name: "Product Suite", 
      type: 'category', 
      children: [
        { name: "Routes API", type: 'docs', children: platformChildren },
        { name: "Navigation SDK for Android", type: 'docs', children: platformChildren },
        { name: "Navigation SDK for iOS", type: 'docs', children: platformChildren },
        { name: "Navigation for Flutter", type: 'docs', children: platformChildren },
        { name: "Navigation for React Native", type: 'docs', children: platformChildren },
        { name: "Roads API", type: 'docs', children: platformChildren },
        { name: "Route Optimization API", type: 'docs', children: platformChildren },
      ] 
    }]
  },
  {
    name: "Analytics",
    type: 'product',
    children: [{ 
      name: "Product Suite", 
      type: 'category', 
      children: [
        { name: "Google Earth", type: 'docs', children: platformChildren },
        { name: "Places Insights", type: 'docs', children: platformChildren },
        { name: "Imagery Insights", type: 'docs', children: platformChildren },
        { name: "Roads Management Insights", type: 'docs', children: platformChildren },
      ] 
    }]
  },
  {
    name: "Places",
    type: 'product',
    children: [{ 
      name: "Product Suite", 
      type: 'category', 
      children: [
        { name: "Places API", type: 'docs', children: platformChildren },
        { name: "Places SDK for Android", type: 'docs', children: platformChildren },
        { name: "Places SDK for iOS", type: 'docs', children: platformChildren },
        { name: "Places Library, Maps JavaScript API", type: 'docs', children: platformChildren },
        { name: "Geocoding API", type: 'docs', children: platformChildren },
        { name: "Geolocation API", type: 'docs', children: platformChildren },
        { name: "Address Validation API", type: 'docs', children: platformChildren },
        { name: "Time Zone API", type: 'docs', children: platformChildren },
        { name: "Places Aggregate API", type: 'docs', children: platformChildren },
      ] 
    }]
  },
  {
    name: "Solutions",
    type: 'product',
    children: [{ 
      name: "Product Suite", 
      type: 'category', 
      children: [
        { name: "Build interactive experiences", type: 'docs', children: platformChildren },
        { name: "Display the ideal location", type: 'docs', children: platformChildren },
        { name: "Enable asset tracking", type: 'docs', children: platformChildren },
        { name: "Enrich transactions", type: 'docs', children: platformChildren },
        { name: "Improve addresses", type: 'docs', children: platformChildren },
        { name: "Offer efficient routes", type: 'docs', children: platformChildren },
        { name: "Provide local information", type: 'docs', children: platformChildren },
        { name: "Visualize geospatial data", type: 'docs', children: platformChildren },
        { name: "Explore & select sites", type: 'docs', children: platformChildren },
        { name: "Analyze geospatial data", type: 'docs', children: platformChildren },
        { name: "Collaborate & share", type: 'docs', children: platformChildren },
        { name: "Ground AI responses", type: 'docs', children: platformChildren },
        { name: "Financial Industries", type: 'docs', children: platformChildren },
        { name: "Retail", type: 'docs', children: platformChildren },
        { name: "Real Estate", type: 'docs', children: platformChildren },
        { name: "Transportation & Logistics", type: 'docs', children: platformChildren },
      ] 
    }]
  },
  {
    name: "Solutions",
    type: 'product',
    children: [{ 
      name: "Product Suite", 
      type: 'category', 
      children: [
        { 
          name: "Solutions Finder", 
          type: 'docs', 
          children: [
            { name: "Action", type: 'category', children: solutionsFinderActionsDocs },
            { name: "Industry", type: 'category', children: solutionsFinderIndustriesDocs }
          ] 
        },
        { name: "Build interactive experiences", type: 'docs', children: platformChildren },
        { name: "Display the ideal location", type: 'docs', children: platformChildren },
        { name: "Enable asset tracking", type: 'docs', children: platformChildren },
        { name: "Enrich transactions", type: 'docs', children: platformChildren },
        { name: "Improve addresses", type: 'docs', children: platformChildren },
        { name: "Offer efficient routes", type: 'docs', children: platformChildren },
        { name: "Provide local information", type: 'docs', children: platformChildren },
        { name: "Visualize geospatial data", type: 'docs', children: platformChildren },
        { name: "Explore & select sites", type: 'docs', children: platformChildren },
        { name: "Analyze geospatial data", type: 'docs', children: platformChildren },
        { name: "Collaborate & share", type: 'docs', children: platformChildren },
        { name: "Ground AI responses", type: 'docs', children: platformChildren },
        { name: "Financial Industries", type: 'docs', children: platformChildren },
        { name: "Retail", type: 'docs', children: platformChildren },
        { name: "Real Estate", type: 'docs', children: platformChildren },
        { name: "Transportation & Logistics", type: 'docs', children: platformChildren },
      ] 
    }]
  },
  {
    name: "Environment",
    type: 'product',
    children: [{ 
      name: "Product Suite", 
      type: 'category', 
      children: [
        { name: "Air Quality API", type: 'docs', children: platformChildren },
        { name: "Pollen API", type: 'docs', children: platformChildren },
        { name: "Solar API", type: 'docs', children: platformChildren },
        { name: "Weather API", type: 'docs', children: platformChildren },
      ] 
    }]
  },
  {
    name: "AI & Tools",
    type: 'product',
    children: [
      {
        name: "Products",
        type: 'category',
        children: [
          { name: "Grounding with Google Maps", type: 'docs', children: platformChildren },
          { name: "Maker Concierge", type: 'docs', children: platformChildren },
          { name: "AI Tools", type: 'docs', children: platformChildren },
          { name: "Grounding Lite", type: 'docs', children: platformChildren },
          { name: "Google Maps AI Kit - Contextual View", type: 'docs', children: platformChildren },
          { name: "Google Earth", type: 'docs', children: platformChildren },
          { name: "Geospatial Analytics", type: 'docs', children: platformChildren },
          { name: "Grounding with Google Maps in Vertex AI", type: 'docs', children: platformChildren },
          { name: "Place, area, and review summaries", type: 'docs', children: platformChildren },
        ]
      },
      {
        name: "Tools",
        type: 'category',
        children: [
          { name: "Builder agent", type: 'docs', children: platformChildren },
          { name: "Maps Styling agent", type: 'docs', children: platformChildren },
          { name: "Code Assist Toolkit", type: 'docs', children: platformChildren },
          { name: "Route Optimization agent", type: 'docs', children: platformChildren },
        ]
      }
    ]
  },
  {
    name: "No Direct Link",
    type: 'error',
    children: []
  }
];

// Helper to find and replace children in Current State
const updateCurrentStateBranch = (root: MindmapNode, branchName: string, newChildren: any[]) => {
  const findAndReplace = (node: MindmapNode) => {
    let found = false;
    if (node.name === branchName && (node.type === 'product' || node.type === 'category')) {
      if (node.children && node.children.length > 0 && node.children[0].name === "Product Suite") {
        node.children[0].children = newChildren;
      } else {
        node.children = newChildren;
      }
      found = true;
      // If it's documentation, we want to find all occurrences
      if (branchName !== "Documentation") return true;
    }
    if (node.children) {
      for (const child of node.children) {
        if (findAndReplace(child)) {
          found = true;
          if (branchName !== "Documentation") return true;
        }
      }
    }
    return found;
  };
  
  if (branchName === "Pricing" || branchName === "AI & Tools") {
    const targetNode = root.children?.find(c => c.name === branchName);
    if (targetNode) targetNode.children = newChildren;
  } else if (branchName === "Documentation") {
    findAndReplace(root);
  } else {
    findAndReplace(root);
  }
};

updateCurrentStateBranch(currentStateData, "Maps", currentMaps);
updateCurrentStateBranch(currentStateData, "Routes", currentRoutes);
updateCurrentStateBranch(currentStateData, "Places", currentPlaces);
updateCurrentStateBranch(currentStateData, "Environment", currentEnvironment);
updateCurrentStateBranch(currentStateData, "Datasets", currentDatasets);
updateCurrentStateBranch(currentStateData, "Solutions", currentSolutions);
updateCurrentStateBranch(currentStateData, "AI & Tools", currentTools);
updateCurrentStateBranch(currentStateData, "Pricing", currentPricing);
updateCurrentStateBranch(v2MapData, "Pricing", currentPricing);
updateCurrentStateBranch(currentStateData, "Documentation", currentDocumentation);

interface MindmapProps {
  onNavigate?: (view: any, title?: string, origin?: any) => void;
  onNavigateToDocs?: (tab: string) => void;
}

const PLATFORM_NAMES = ["REST API", "JavaScript", "Android SDK", "iOS SDK"];

// Helper to inject documentation links into platform nodes
const injectPlatformDocs = (node: MindmapNode, parentView?: string, parentDocsTab?: string) => {
  let currentView = node.view || parentView;
  let currentDocsTab = node.docsTab || parentDocsTab;

  // Find the sibling documentation node to get the correct context
  if (node.children) {
    const siblingDocs = node.children.find(c => c.type === 'docs');
    if (siblingDocs) {
      currentView = siblingDocs.view || currentView;
      currentDocsTab = siblingDocs.docsTab || currentDocsTab;
    }

    // Check if this node has platforms as children or is named "Choose your platform"
    const hasPlatforms = node.children.some(c => PLATFORM_NAMES.includes(c.name));
    
    if (hasPlatforms || node.name === "Choose your platform") {
      node.children = node.children.map(child => {
        if (PLATFORM_NAMES.includes(child.name)) {
          const children: MindmapNode[] = child.children ? [...child.children] : [];
          
          if (!children.some(c => c.name === "Documentation" || c.name === "↗ Documentation")) {
            children.push({
              name: "Documentation",
              type: 'docs',
              view: currentView,
              docsTab: currentDocsTab
            });
          }

          return {
            ...child,
            children
          };
        }
        return child;
      });
    }
  }

  if (node.children) {
    node.children.forEach(child => injectPlatformDocs(child, currentView, currentDocsTab));
  }
};

// Prune Documentation, Pricing, and Platform branches from within the Products branch in Current State
const pruneCurrentState = (node: MindmapNode, isUnderProducts: boolean = false) => {
  const underProducts = isUnderProducts || node.name === "Products";
  
  if (node.children) {
    if (underProducts) {
      // Add launch icon to platform branches instead of Documentation
      node.children.forEach(child => {
        if (PLATFORM_NAMES.includes(child.name)) {
          child.name = `↗ ${child.name}`;
          // Hide local Documentation child under platforms
          if (child.children) {
            child.children = child.children.filter(c => c.name !== "Documentation");
          }
        }
      });

      node.children = node.children.filter(child => 
        child.name !== "Pricing" && 
        child.name !== "Documentation"
      );
    }
    node.children.forEach(child => pruneCurrentState(child, underProducts));
  }
};

// Prune platform children from the documentation branch in Current State
const pruneDocumentationPlatforms = (node: MindmapNode, isUnderDocumentation: boolean = false) => {
  const underDocumentation = isUnderDocumentation || node.name === "Documentation";
  
  if (node.children) {
    if (underDocumentation) {
      // Remove platform children if they exist
      node.children = node.children.filter(child => !PLATFORM_NAMES.includes(child.name));
    }
    node.children.forEach(child => pruneDocumentationPlatforms(child, underDocumentation));
  }
};

// Flatten nodes with a specific name by promoting their children
const flattenNodesGlobal = (node: MindmapNode, results: MindmapNode[] = []) => {
  results.push(node);
  const children = node.children || (node as any)._children;
  if (children) {
    children.forEach((child: any) => flattenNodesGlobal(child, results));
  }
  return results;
};

const flattenNodes = (node: MindmapNode, targetName: string) => {
  if (node.children) {
    let newChildren: MindmapNode[] = [];
    node.children.forEach(child => {
      if (child.name === targetName && child.children) {
        newChildren.push(...child.children);
      } else {
        newChildren.push(child);
      }
    });
    node.children = newChildren;
    node.children.forEach(child => flattenNodes(child, targetName));
  }
};

injectPlatformDocs(v2MapData);
injectPlatformDocs(currentStateData);
flattenNodes(v2MapData, "Product Suite");
flattenNodes(currentStateData, "Product Suite");
flattenNodes(v2MapData, "API Features");
flattenNodes(currentStateData, "API Features");
flattenNodes(currentStateData, "Choose your platform");
pruneCurrentState(currentStateData);
pruneDocumentationPlatforms(currentStateData);

export const Mindmap: React.FC<MindmapProps> = ({ onNavigate, onNavigateToDocs }) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const zoomRef = useRef<any>(null);
  const [selectedVersion, setSelectedVersion] = React.useState<'v2' | 'current'>('current');
  const [resetKey, setResetKey] = React.useState(0);
  const [searchQuery, setSearchQuery] = React.useState('');
  const [searchResults, setSearchResults] = React.useState<MindmapNode[]>([]);
  const [isSearchOpen, setIsSearchOpen] = React.useState(false);
  const [isSearchAgentOpen, setIsSearchAgentOpen] = React.useState(false);
  
  const updateRef = useRef<any>(null);
  const rootRef = useRef<any>(null);
  const highlightedNodeRef = useRef<string | null>(null);

  const allNodes = React.useMemo(() => {
    const activeData = selectedVersion === 'v2' ? v2MapData : currentStateData;
    return flattenNodesGlobal(activeData);
  }, [selectedVersion]);

  // Reset search when version changes to keep instances independent
  useEffect(() => {
    setSearchQuery('');
    setIsSearchOpen(false);
    setIsSearchAgentOpen(false);
    highlightedNodeRef.current = null;
  }, [selectedVersion]);

  useEffect(() => {
    if (searchQuery.trim() === '') {
      setSearchResults([]);
      return;
    }

    const filtered = allNodes.filter(node => 
      node.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
      node.type !== 'root'
    );

    // Remove duplicates by name
    const uniqueResults = filtered.filter((v, i, a) => 
      a.findIndex(t => t.name === v.name) === i
    ).slice(0, 10);

    setSearchResults(uniqueResults);
  }, [searchQuery, allNodes]);

  const handleSearchSelect = (nodeName: string, type?: string, parentName?: string) => {
    setSearchQuery('');
    setIsSearchOpen(false);
    
    if (updateRef.current && rootRef.current) {
      const findAllMatches = (n: any, targetName: string, targetType?: string, pConstraint?: string): any[] => {
        let matches: any[] = [];
        const tName = targetName.toLowerCase().trim().replace('↗ ', '');
        const nName = n.data.name.toLowerCase().trim();
        
        const matchesType = !targetType || n.data.type === targetType;
        const isExact = nName === tName || nName === tName.replace('↗ ', '');
        const isFuzzy = nName.includes(tName) || tName.includes(nName);
        
        if ((isExact || isFuzzy) && matchesType) {
          let matchesParent = true;
          if (pConstraint) {
            matchesParent = false;
            const searchPName = pConstraint.toLowerCase().trim();
            let curr = n.parent;
            while (curr) {
              const currName = curr.data.name.toLowerCase().trim();
              if (currName.includes(searchPName) || searchPName.includes(currName)) {
                matchesParent = true;
                break;
              }
              curr = curr.parent;
            }
          }
          
          if (matchesParent) {
            matches.push({ node: n, exact: isExact });
          }
        }

        const children = n.children || n._children;
        if (children) {
          for (const child of children) {
            matches = [...matches, ...findAllMatches(child, targetName, targetType, pConstraint)];
          }
        }
        return matches;
      };

      const findBestNode = (root: any, targetName: string, targetType?: string, pConstraint?: string): any => {
        // For documentation searches, we first try to find a product node matching the name
        // because product nodes are the anchors in the documentation branch.
        const isDocSearch = targetType === 'docs' || targetName.toLowerCase().includes('documentation');
        
        const useCases = [
          "build interactive experiences", "display the ideal location", "enable asset tracking",
          "enrich transactions", "improve addresses", "offer efficient routes",
          "provide local information", "visualize geospatial data", "explore & select sites",
          "analyze geospatial data", "collaborate & share", "ground ai responses"
        ];
        const industries = [
          "financial industries", "retail", "real estate", "transportation & logistics"
        ];
        const tNameLower = targetName.toLowerCase().trim().replace('↗ ', '');
        const isSolutionSearch = useCases.includes(tNameLower) || industries.includes(tNameLower);

        let matches = findAllMatches(root, targetName, isDocSearch ? undefined : targetType, pConstraint);
        if (matches.length === 0) return null;
        
        // CRITICAL: Branch enforcement for documentation
        // Skip enforcement if we have a specific parent constraint (e.g. from Search Agent)
        // or if it's a solution-related search (which lives in its own branch)
        if (isDocSearch && !pConstraint && !isSolutionSearch) {
          const targetBranchName = selectedVersion === 'v2' ? 'Products' : 'Resources';
          const forbiddenBranches = selectedVersion === 'v2' ? ['Resources', 'Learn'] : ['Learn', 'Products'];
          
          matches = matches.filter(m => {
            let curr = m.node;
            let underTarget = false;
            while (curr) {
              if (curr.data.name === targetBranchName) {
                underTarget = true;
                break;
              }
              // Explicitly reject if we hit forbidden branches first or at all
              if (forbiddenBranches.includes(curr.data.name)) return false;
              curr = curr.parent;
            }
            return underTarget;
          });
          if (matches.length === 0) return null;
        }

        // Prioritize Solutions branch for Use Cases and Industries
        if (isSolutionSearch) {
          const solutionMatch = matches.find(m => {
            let curr = m.node;
            while (curr) {
              if (curr.data.name === 'Solutions') return true;
              curr = curr.parent;
            }
            return false;
          });
          if (solutionMatch) return solutionMatch.node;
        }
        
        // 1. Exact match (prioritize product type for doc searches)
        let bestMatch = matches.find(m => m.exact && (isDocSearch ? m.node.data.type === 'product' : true));
        if (!bestMatch) bestMatch = matches.find(m => m.exact);
        if (bestMatch) return bestMatch.node;
        
        // 2. Fuzzy match (only if not generic)
        const isGeneric = tNameLower === "documentation" || tNameLower === "pricing details" || tNameLower === "pricing calculator";
        if (!isGeneric) {
          // Prioritize product type for fuzzy doc searches too
          const fuzzyProduct = matches.find(m => m.node.data.type === 'product');
          if (isDocSearch && fuzzyProduct) return fuzzyProduct.node;
          return matches[0].node;
        }
        
        return matches[0].node;
      };

      let targetNode = null;

      // Robust path-based branch finder
      const findNodeByPath = (path: string[]) => {
        let current = rootRef.current;
        for (const segment of path) {
          if (!current) return null;
          const children = current.children || current._children || [];
          current = children.find((c: any) => c.data.name === segment);
        }
        return current;
      };

      const level1ProductsBranch = findNodeByPath(['Products']);
      const aiProductsBranch = findNodeByPath(['AI & Tools', 'Products']);
      const pricingBranch = findNodeByPath(['Pricing']);
      const resourcesBranch = findNodeByPath(['Resources']);
      const finalDocumentationBranch = findNodeByPath(['Resources', 'Development', 'Documentation']);

      const cleanNodeName = nodeName.toLowerCase().trim().replace('↗ ', '');
      const isGenericName = cleanNodeName === "documentation" || cleanNodeName === "pricing details" || cleanNodeName === "pricing calculator";

      // 1. Documentation specific logic
      if (type === 'docs' || cleanNodeName === 'documentation') {
        const useCases = [
          "build interactive experiences", "display the ideal location", "enable asset tracking",
          "enrich transactions", "improve addresses", "offer efficient routes",
          "provide local information", "visualize geospatial data", "explore & select sites",
          "analyze geospatial data", "collaborate & share", "ground ai responses"
        ];
        const industries = [
          "financial industries", "retail", "real estate", "transportation & logistics"
        ];
        const isSolutionDoc = useCases.includes((parentName || nodeName).toLowerCase().trim()) || 
                             industries.includes((parentName || nodeName).toLowerCase().trim()) ||
                             (parentName || nodeName).toLowerCase().trim() === "solutions finder";

        let docRoot = selectedVersion === 'v2' ? (isSolutionDoc ? finalDocumentationBranch : level1ProductsBranch) : finalDocumentationBranch;
        
        if (docRoot) {
          const isGenericDoc = cleanNodeName === "documentation";
          
          // Try to find the product node within the Documentation branch
          if (parentName) {
            targetNode = findBestNode(docRoot, parentName);
          }
          
          // 2. If no parent match or no parentName, try the nodeName itself (if not generic)
          if (!targetNode && !isGenericDoc) {
            targetNode = findBestNode(docRoot, nodeName);
          }

          // Fallback for V2: Try AI Products branch if not found in Level 1 Products
          if (!targetNode && selectedVersion === 'v2' && aiProductsBranch) {
            if (parentName) {
              targetNode = findBestNode(aiProductsBranch, parentName);
            }
            if (!targetNode && !isGenericDoc) {
              targetNode = findBestNode(aiProductsBranch, nodeName);
            }
          }

          // 3. If we found a product node and the search was for a specific sub-node (not just "Documentation")
          if (targetNode && parentName && !isGenericDoc) {
            const subNode = findBestNode(targetNode, nodeName, type);
            if (subNode) targetNode = subNode;
          }

          // 1b. If documentation search failed to find a target, or if it's a generic search without parent
          if (!targetNode) {
            if (isGenericDoc && !parentName) {
              targetNode = docRoot;
            } else {
              const targetRoot = docRoot;
              
              // Ensure target root itself is expanded
              if (targetRoot._children && !targetRoot.children) {
                targetRoot.children = targetRoot._children;
              }

              // Check if "No Direct Link" already exists
              let nonNavigable = targetRoot.children?.find((c: any) => c.data.name === "No Direct Link");
              if (!nonNavigable) {
                const newNodeData: MindmapNode = { name: "No Direct Link", type: 'error' };
                const newNode = d3.hierarchy(newNodeData);
                // @ts-ignore
                newNode.depth = targetRoot.depth + 1;
                newNode.parent = targetRoot;
                // @ts-ignore
                if (!targetRoot.children) targetRoot.children = [];
                // @ts-ignore
                targetRoot.children.push(newNode);
                // @ts-ignore
                if (!targetRoot._children) targetRoot._children = [];
                // @ts-ignore
                targetRoot._children.push(newNode);
                nonNavigable = newNode;
              }

              // Add the product name as a branch of "No Direct Link"
              const productName = parentName || (isGenericDoc ? null : nodeName);
              if (productName) {
                // @ts-ignore
                if (!nonNavigable.children) nonNavigable.children = nonNavigable._children || [];
                
                // @ts-ignore
                let productBranch = nonNavigable.children?.find((c: any) => c.data.name === productName);
                if (!productBranch) {
                  const branchData: MindmapNode = { name: productName, type: 'error' };
                  const branch = d3.hierarchy(branchData);
                  // @ts-ignore
                  branch.depth = nonNavigable.depth + 1;
                  branch.parent = nonNavigable;
                  
                  // @ts-ignore
                  if (!nonNavigable.children) nonNavigable.children = [];
                  // @ts-ignore
                  nonNavigable.children.push(branch);
                  // @ts-ignore
                  if (!nonNavigable._children) nonNavigable._children = [];
                  // @ts-ignore
                  nonNavigable._children.push(branch);
                  productBranch = branch;
                }
                targetNode = productBranch;
              } else {
                targetNode = nonNavigable;
              }
            }
          }
        }
      }

      // 2. General logic for non-documentation links (or if doc search somehow failed to find even a fallback)
      if (!targetNode) {
        if (parentName) {
          // General case: Find the parent node first, then search for the target within its subtree
          const parentNode = findBestNode(rootRef.current, parentName);
          if (parentNode) {
            targetNode = findBestNode(parentNode, nodeName, type);
          }

          // Fallback: Global search with ancestor constraint
          if (!targetNode) {
            targetNode = findBestNode(rootRef.current, nodeName, type, parentName);
          }
        }

        // 3. Pricing prioritization
        if (!targetNode && type === 'pricing' && pricingBranch) {
          targetNode = findBestNode(pricingBranch, nodeName, type);
        }

        // 4. Products prioritization
        if (!targetNode && level1ProductsBranch && (!isGenericName || !parentName)) {
          targetNode = findBestNode(level1ProductsBranch, nodeName, type);
        }

        // 4b. AI Products fallback for V2
        if (!targetNode && selectedVersion === 'v2' && aiProductsBranch && (!isGenericName || !parentName)) {
          targetNode = findBestNode(aiProductsBranch, nodeName, type);
        }

        // 5. Global fallback
        if (!targetNode && (!isGenericName || !parentName)) {
          targetNode = findBestNode(rootRef.current, nodeName, type);
        }

        // 6. Final fallback to parent
        if (!targetNode && parentName) {
          targetNode = findBestNode(rootRef.current, parentName);
        }
      }

      if (targetNode) {
        highlightedNodeRef.current = targetNode.data.name;

        // Global Accordion: Collapse all nodes except ancestors of targetNode
        const ancestors = targetNode.ancestors();
        rootRef.current.descendants().forEach((n: any) => {
          if (!ancestors.includes(n) && n.children) {
            if (!n._children) n._children = n.children;
            n.children = null;
          }
        });

        // Expand all ancestors
        let curr = targetNode;
        while (curr.parent) {
          const parent = curr.parent;
          // Ensure parent is expanded
          if (!parent.children) {
            parent.children = parent._children || null;
          }
          curr = parent;
        }
        
        // Also expand the target node itself if it has children
        // BUT: Stop auto-expanding product nodes to prevent 'unprovoked' display of sub-products like 3D Maps
        const isProductNode = targetNode.data.type === 'product';
        if (!targetNode.children && targetNode._children && !isProductNode) {
          targetNode.children = targetNode._children;
        }

        if (updateRef.current) {
          updateRef.current(rootRef.current);
        }
      }
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (isSearchOpen && !(event.target as HTMLElement).closest('.relative.w-72')) {
        setIsSearchOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isSearchOpen]);

  useEffect(() => {
    if (!svgRef.current) return;

    const activeData = selectedVersion === 'v2' ? v2MapData : currentStateData;

    const width = 1200;
    const height = 800;
    const margin = { top: 20, right: 150, bottom: 20, left: 150 };

    const svg = d3.select(svgRef.current)
      .attr("viewBox", [0, 0, width, height])
      .style("font", "14px Inter, sans-serif")
      .style("user-select", "none");

    svg.selectAll("*").remove();

    const container = svg.append("g");

    const zoom = d3.zoom()
      .scaleExtent([0.1, 3])
      .on("zoom", (event) => {
        container.attr("transform", event.transform);
      });

    zoomRef.current = zoom;
    svg.call(zoom as any);

    const gLink = container.append("g")
      .attr("fill", "none")
      .attr("stroke", "#e2e8f0")
      .attr("stroke-opacity", 0.6)
      .attr("stroke-width", 2);

    const gNode = container.append("g")
      .attr("cursor", "pointer")
      .attr("pointer-events", "all");

    const tree = d3.tree<MindmapNode>()
      .nodeSize([50, 250])
      .separation((a, b) => (a.parent === b.parent ? 1.2 : 2));
    const root = d3.hierarchy(activeData);

    // @ts-ignore
    root.x0 = height / 2;
    // @ts-ignore
    root.y0 = 0;

    const colors = {
      root: "#1a73e8",
      category: "#000000",
      product: "#34a853",
      info: "#4285f4",
      docs: "#4285f4",
      pricing: "#34a853",
      error: "#ea4335",
      search: "#1a73e8",
      default: "#718096"
    };

    let i = 0;

    // @ts-ignore
    function update(source) {
      updateRef.current = update;
      rootRef.current = root;
      const duration = 750;
      const nodes = root.descendants().reverse();
      const links = root.links();

      tree(root);

      // Adjust horizontal spacing for specific nodes to make them closer to their parents
      root.descendants().forEach((d: any) => {
        if (d.parent) {
          let distance = 250;
          // Make utility nodes closer as they often have short labels and create long empty lines
          if (d.data.name === "Choose your platform" ||
              PLATFORM_NAMES.includes(d.data.name.replace('↗ ', ''))) {
            distance = 150;
          }
          
          // Shorten Documentation links only if it's the only child to avoid misalignment with siblings
          if ((d.data.name === "Documentation" || d.data.name === "↗ Documentation") && 
              d.parent.children && d.parent.children.length === 1) {
            distance = 150;
          }
          d.y = d.parent.y + distance;
        }
      });

      let left = root;
      let right = root;
      root.eachBefore(node => {
        if (node.x < left.x) left = node;
        if (node.x > right.x) right = node;
      });

      const transition = svg.transition()
        .duration(duration);
      
      // Auto-center/zoom to fit the expanded content
      const xRange = right.x - left.x + margin.top + margin.bottom;
      const scale = Math.min(0.9, height / xRange);
      const translateY = (height - xRange * scale) / 2 - left.x * scale + margin.top * scale;
      const translateX = margin.left * scale;

      svg.transition().duration(duration).call(
        zoom.transform as any,
        d3.zoomIdentity.translate(translateX, translateY).scale(scale)
      );

      const node = gNode.selectAll("g")
        .data(nodes, (d: any) => d.id || (d.id = ++i));

      const nodeEnter = node.enter().append("g")
        .attr("transform", d => `translate(${source.y0},${source.x0})`)
        .attr("fill-opacity", 0)
        .attr("stroke-opacity", 0)
        .on("click", (event, d: any) => {
          // Clear search highlight when manually interacting with nodes
          highlightedNodeRef.current = null;
          
          if (d.data.type === 'search') {
            setIsSearchAgentOpen(true);
            return;
          }
          const isJumpLink = d.data.name.startsWith("↗");
          if (d.data.type === 'docs' || d.data.type === 'pricing' || isJumpLink) {
            const typeLabel = d.data.type === 'pricing' ? "Pricing" : "Documentation";
            const rootName = typeLabel;
            
            // Check if we are already inside the target branch
            let isInsideTargetBranch = false;
            let temp = d;
            while (temp) {
              if (temp.data.name === rootName) {
                isInsideTargetBranch = true;
                break;
              }
              temp = temp.parent;
            }

            if (isInsideTargetBranch) {
              // Check if it's a jump link within the same branch (e.g., cross-links in Pricing)
              if (d.data.name.startsWith("↗")) {
                const targetName = d.data.name.replace("↗ ", "");
                let targetNode: any = null;
                
                // Find the root of the current branch (Documentation or Pricing)
                let branchRoot = d;
                while (branchRoot.parent && branchRoot.parent.data.name !== "Google Maps Platform") {
                  branchRoot = branchRoot.parent;
                }

                branchRoot.eachBefore((node: any) => {
                  if (!targetNode && node.data.name === targetName) {
                    targetNode = node;
                  }
                });

                if (targetNode) {
                  // Global Accordion: Collapse all nodes except ancestors of targetNode
                  const ancestors = targetNode.ancestors();
                  root.descendants().forEach((n: any) => {
                    if (!ancestors.includes(n) && n.children) {
                      if (!n._children) n._children = n.children;
                      n.children = null;
                    }
                  });

                  // Expand ancestors
                  let curr = targetNode;
                  while (curr) {
                    // @ts-ignore
                    if (curr._children && !curr.children) curr.children = curr._children;
                    curr = curr.parent;
                  }
                  
                  highlightedNodeRef.current = targetNode.data.name;
                  update(root);
                  return;
                }
              }

              // Standard toggle behavior for nodes already in the target branch
              if (d.children) {
                d.children = null;
              } else {
                // Global Accordion: Collapse all nodes except ancestors of d
                const ancestors = d.ancestors();
                root.descendants().forEach((n: any) => {
                  if (!ancestors.includes(n) && n.children) {
                    if (!n._children) n._children = n.children;
                    n.children = null;
                  }
                });
                d.children = d._children;
              }
              update(d.parent || d);
              return;
            }

            // If not inside, try to jump to the target branch
            const findNodeByName = (startNode: any, name: string, fuzzy: boolean = false): any => {
              const tName = name.toLowerCase().trim().replace('↗ ', '');
              const sName = startNode.data.name.toLowerCase().trim();
              
              if (sName === tName) return startNode;
              if (fuzzy && (sName === tName + " api" || tName === sName + " api" || sName.includes(tName))) return startNode;
              
              const children = startNode.children || startNode._children;
              if (children) {
                for (const child of children) {
                  const found = findNodeByName(child, name, fuzzy);
                  if (found) return found;
                }
              }
              return null;
            };

            const targetRoot = findNodeByName(root, rootName);
            
            if (targetRoot) {
              // Expand all ancestors of targetRoot and collapse their siblings
              let ancestor = targetRoot;
              while (ancestor.parent) {
                const parent = ancestor.parent;
                if (parent.children || parent._children) {
                  const children = parent.children || parent._children;
                  parent.children = children; // Expand
                  children.forEach((sibling: any) => {
                    if (sibling !== ancestor) {
                      // Safety: preserve children in _children before collapsing
                      if (sibling.children && !sibling._children) {
                        sibling._children = sibling.children;
                      }
                      sibling.children = null; // Collapse siblings
                    }
                  });
                }
                ancestor = parent;
              }

              // Ensure target root itself is expanded
              if (targetRoot._children && !targetRoot.children) {
                targetRoot.children = targetRoot._children;
              }

              // Find the best search root by looking for ancestors in the target branch
              // This ensures we narrow down the search to the correct product/API subtree
              let searchRoot = targetRoot;
              const ancestors = d.ancestors();
              const genericNames = ["Product", "Products", "Product Suite", "Choose your platform", "Documentation", "Pricing Calculator", "Pricing Details", "Overview", "Current State", "Resources", "Google Maps Platform"];
              
              // Search from the parent of the clicked node upwards to find the most specific matching ancestor
              for (let i = 1; i < ancestors.length; i++) {
                const ancestorName = ancestors[i].data.name;
                if (genericNames.includes(ancestorName)) continue;
                
                const match = findNodeByName(targetRoot, ancestorName, true);
                if (match) {
                  searchRoot = match;
                  break;
                }
              }
              
              let targetNode: any = null;
              let currSearch = d;
              
              while (currSearch && !targetNode) {
                const searchName = currSearch.data.name.replace("↗ ", "");
                targetNode = findNodeByName(searchRoot, searchName);
                if (!targetNode) currSearch = currSearch.parent;
              }

              if (targetNode) {
                // Global Accordion: Collapse all nodes except ancestors of targetNode
                const ancestors = targetNode.ancestors();
                root.descendants().forEach((n: any) => {
                  if (!ancestors.includes(n) && n.children) {
                    if (!n._children) n._children = n.children;
                    n.children = null;
                  }
                });

                // Expand all ancestors to make targetNode visible
                let curr = targetNode;
                while (curr) {
                  // @ts-ignore
                  if (curr._children && !curr.children) {
                    // @ts-ignore
                    curr.children = curr._children;
                  }
                  curr = curr.parent;
                }
                // Also expand the targetNode itself if it has children (Associated branch)
                // @ts-ignore
                if (targetNode._children && !targetNode.children) {
                  // @ts-ignore
                  targetNode.children = targetNode._children;
                }

                highlightedNodeRef.current = targetNode.data.name;
                update(targetRoot);
                return;
              }

              if (!targetNode) {
                // Handle non-navigable case: open targetRoot (Documentation) and focus on "No Direct Link"
                // @ts-ignore
                if (targetRoot._children && !targetRoot.children) {
                  // @ts-ignore
                  targetRoot.children = targetRoot._children;
                }
                
                // Collapse all other children of targetRoot to focus on the error
                if (targetRoot.children) {
                  targetRoot.children.forEach((c: any) => {
                    if (c.data.name !== "No Direct Link") {
                      c.children = null;
                    }
                  });
                }
                
                // Check if "No Direct Link" already exists
                let nonNavigable = targetRoot.children?.find((c: any) => c.data.name === "No Direct Link");
                if (!nonNavigable) {
                  const newNodeData: MindmapNode = { name: "No Direct Link", type: 'error' };
                  const newNode = d3.hierarchy(newNodeData);
                  // @ts-ignore
                  newNode.depth = targetRoot.depth + 1;
                  newNode.parent = targetRoot;
                  // @ts-ignore
                  if (!targetRoot.children) targetRoot.children = [];
                  // @ts-ignore
                  targetRoot.children.push(newNode);
                  // @ts-ignore
                  if (!targetRoot._children) targetRoot._children = [];
                  // @ts-ignore
                  targetRoot._children.push(newNode);
                  nonNavigable = newNode;
                }
                
                // If targetNode match failed, add the product name as a branch of "No Direct Link"
                const productName = d.parent?.data.name;
                if (productName) {
                  // @ts-ignore
                  if (!nonNavigable.children) nonNavigable.children = nonNavigable._children || [];
                  
                  // @ts-ignore
                  let productBranch = nonNavigable.children?.find((c: any) => c.data.name === productName);
                  if (!productBranch) {
                    const branchData: MindmapNode = { name: productName, type: 'error' };
                    const branch = d3.hierarchy(branchData);
                    // @ts-ignore
                    branch.depth = nonNavigable.depth + 1;
                    branch.parent = nonNavigable;
                    
                    // @ts-ignore
                    if (!nonNavigable.children) nonNavigable.children = [];
                    // @ts-ignore
                    nonNavigable.children.push(branch);
                    // @ts-ignore
                    if (!nonNavigable._children) nonNavigable._children = [];
                    // @ts-ignore
                    nonNavigable._children.push(branch);
                  }
                  
                  // Expand "No Direct Link" to show the new branch
                  // @ts-ignore
                  nonNavigable.children = nonNavigable._children;
                }

                update(root);
                return;
              }
            }
            // Even if jump fails, do not navigate to visual site
            return;
          }

          if (d.data.view && onNavigate) {
            onNavigate(d.data.view, d.data.name);
          } else {
            if (d.children) {
              d.children = null;
            } else {
              // Global Accordion: Collapse all nodes except ancestors of d
              const ancestors = d.ancestors();
              root.descendants().forEach((n: any) => {
                if (!ancestors.includes(n) && n.children) {
                  if (!n._children) n._children = n.children;
                  n.children = null;
                }
              });

              d.children = d._children;
            }
            update(d.parent || d);
          }
        });

      nodeEnter.append("circle")
        .attr("r", (d: any) => 6 - d.depth)
        .attr("fill", (d: any) => {
          const type = d.data.type || 'default';
          // @ts-ignore
          return d._children && !d.children ? colors[type] : "#fff";
        })
        .attr("stroke", (d: any) => {
          const type = d.data.type || 'default';
          // @ts-ignore
          return colors[type];
        })
        .attr("stroke-width", 2);

      nodeEnter.append("text")
        .attr("class", "node-text")
        .attr("dy", "0.31em")
        .attr("x", (d: any) => {
          // Force Documentation labels to the right to align with siblings like "Build with AI"
          if (d.data.name === "Documentation" || d.data.name === "↗ Documentation") return 12;
          return (d.children || d._children) ? -12 : 12;
        })
        .attr("text-anchor", (d: any) => {
          if (d.data.name === "Documentation" || d.data.name === "↗ Documentation") return "start";
          return (d.children || d._children) ? "end" : "start";
        })
        .text((d: any) => d.data.name)
        .clone(true).lower()
        .attr("class", "node-halo")
        .attr("stroke-linejoin", "round")
        .attr("stroke-width", 4)
        .attr("stroke", "white");

      const nodeUpdate = node.merge(nodeEnter as any).transition(transition as any)
        .attr("transform", (d: any) => `translate(${d.y},${d.x})`)
        .attr("fill-opacity", 1)
        .attr("stroke-opacity", 1);

      nodeUpdate.select("text.node-text")
        .attr("x", (d: any) => {
          if (d.data.name === "Documentation" || d.data.name === "↗ Documentation") return 12;
          return (d.children || d._children) ? -12 : 12;
        })
        .attr("text-anchor", (d: any) => {
          if (d.data.name === "Documentation" || d.data.name === "↗ Documentation") return "start";
          return (d.children || d._children) ? "end" : "start";
        })
        .style("font-weight", (d: any) => {
          if (highlightedNodeRef.current === d.data.name) return "bold";
          return (d.depth <= 1 || d.data.type === 'error') ? "bold" : "normal";
        })
        .style("fill", (d: any) => {
          if (highlightedNodeRef.current === d.data.name) return "#0f9d58"; // Google Green
          if (d.data.type === 'error') return colors.error;
          if (d.data.type === 'docs') return colors.docs;
          if (d.data.type === 'pricing') return colors.pricing;
          return d.depth === 0 ? colors.root : "#1a202c";
        });

      nodeUpdate.select("text.node-halo")
        .attr("x", (d: any) => {
          if (d.data.name === "Documentation" || d.data.name === "↗ Documentation") return 12;
          return (d.children || d._children) ? -12 : 12;
        })
        .attr("text-anchor", (d: any) => {
          if (d.data.name === "Documentation" || d.data.name === "↗ Documentation") return "start";
          return (d.children || d._children) ? "end" : "start";
        })
        .style("font-weight", (d: any) => {
          if (highlightedNodeRef.current === d.data.name) return "bold";
          return (d.depth <= 1 || d.data.type === 'error') ? "bold" : "normal";
        });

      const nodeExit = node.exit().transition(transition as any).remove()
        .attr("transform", d => `translate(${source.y},${source.x})`)
        .attr("fill-opacity", 0)
        .attr("stroke-opacity", 0);

      const link = gLink.selectAll("path")
        .data(links, (d: any) => d.target.id);

      const linkEnter = link.enter().append("path")
        .attr("d", d => {
          const o = { x: source.x0, y: source.y0 };
          return diagonal({ source: o, target: o });
        });

      link.merge(linkEnter as any).transition(transition as any)
        .attr("d", diagonal as any);

      link.exit().transition(transition as any).remove()
        .attr("d", d => {
          const o = { x: source.x, y: source.y };
          return diagonal({ source: o, target: o });
        });

      nodes.forEach((d: any) => {
        d.x0 = d.x;
        d.y0 = d.y;
      });
    }

    function diagonal({ source, target }: any) {
      return `M${source.y},${source.x}
              C${(source.y + target.y) / 2},${source.x}
               ${(source.y + target.y) / 2},${target.x}
               ${target.y},${target.x}`;
    }

    // Initialize and collapse all nodes except root
    root.descendants().forEach((d: any, i) => {
      d.id = i;
      d._children = d.children;
      if (d.depth > 0) {
        d.children = null;
      }
    });

    update(root);

  }, [onNavigate, onNavigateToDocs, selectedVersion, resetKey]);

  return (
    <div className="w-full h-full bg-white flex flex-col">
      <div className="p-8 pb-4 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-6">
          <div>
            <h3 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <Compass className="w-6 h-6 text-google-blue" />
              Platform Mindmap
            </h3>
            <p className="text-gray-500 mt-1">Interactive overview of products, documentation, and pricing.</p>
          </div>
          
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Map Version</label>
            <div className="relative inline-block">
              <select 
                value={selectedVersion}
                onChange={(e) => setSelectedVersion(e.target.value as 'v2' | 'current')}
                className="appearance-none bg-gray-50 border border-gray-200 text-gray-700 py-2 px-4 pr-10 rounded-lg text-sm font-medium focus:outline-none focus:ring-2 focus:ring-google-blue/20 focus:border-google-blue cursor-pointer hover:bg-gray-100 transition-colors"
              >
                <option value="v2">V2 Map</option>
                <option value="current">Current State</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-400">
                <ChevronDown className="w-4 h-4" />
              </div>
            </div>
          </div>
        </div>

        <div className="relative w-72">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search products, resources..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setIsSearchOpen(true);
              }}
              onFocus={() => setIsSearchOpen(true)}
              className="w-full pl-10 pr-10 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-google-blue/20 focus:border-google-blue transition-all"
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {isSearchOpen && searchResults.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden z-50">
              <div className="py-2">
                {searchResults.map((result, idx) => (
                  <button
                    key={`${result.name}-${idx}`}
                    onClick={() => handleSearchSelect(result.name, result.type)}
                    className="w-full px-4 py-2.5 text-left hover:bg-gray-50 flex items-center gap-3 transition-colors group"
                  >
                    <div className={`w-2 h-2 rounded-full ${
                      result.type === 'product' ? 'bg-google-green' :
                      result.type === 'category' ? 'bg-black' :
                      result.type === 'pricing' ? 'bg-google-green' :
                      'bg-google-blue'
                    }`} />
                    <div className="flex flex-col">
                      <span className="text-sm font-medium text-gray-700 group-hover:text-google-blue">{result.name}</span>
                      <span className="text-[10px] text-gray-400 uppercase tracking-wider">
                        {
                          [
                            "build interactive experiences", "display the ideal location", "enable asset tracking",
                            "enrich transactions", "improve addresses", "offer efficient routes",
                            "provide local information", "visualize geospatial data", "explore & select sites",
                            "analyze geospatial data", "collaborate & share", "ground ai responses"
                          ].includes(result.name.toLowerCase()) ? 'Use Case' :
                          [
                            "financial industries", "retail", "real estate", "transportation & logistics"
                          ].includes(result.name.toLowerCase()) ? 'Industry' :
                          result.type === 'info' ? 'Product' : result.type
                        }
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
          
          {isSearchOpen && searchQuery && searchResults.length === 0 && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-xl border border-gray-100 p-4 text-center z-50">
              <p className="text-sm text-gray-500">No results found for "{searchQuery}"</p>
            </div>
          )}
        </div>
      </div>
      <div className="flex-1 bg-gray-50/50 relative overflow-hidden">
        <svg ref={svgRef} width="100%" height="100%" className="min-w-[1000px]"></svg>
        
        {/* Zoom Controls */}
        <div className="absolute top-4 right-4 flex flex-col gap-2">
          <button 
            onClick={() => {
              if (svgRef.current && zoomRef.current) {
                d3.select(svgRef.current).transition().duration(300).call(zoomRef.current.scaleBy, 1.3);
              }
            }}
            className="p-2 bg-white rounded-lg shadow-sm border border-gray-200 text-gray-600 hover:text-google-blue hover:border-google-blue transition-all"
            title="Zoom In"
          >
            <ZoomIn className="w-5 h-5" />
          </button>
          <button 
            onClick={() => {
              if (svgRef.current && zoomRef.current) {
                d3.select(svgRef.current).transition().duration(300).call(zoomRef.current.scaleBy, 0.7);
              }
            }}
            className="p-2 bg-white rounded-lg shadow-sm border border-gray-200 text-gray-600 hover:text-google-blue hover:border-google-blue transition-all"
            title="Zoom Out"
          >
            <ZoomOut className="w-5 h-5" />
          </button>
          <button 
            onClick={() => {
              setResetKey(prev => prev + 1);
            }}
            className="p-2 bg-white rounded-lg shadow-sm border border-gray-200 text-gray-600 hover:text-google-blue hover:border-google-blue transition-all"
            title="Reset View"
          >
            <Maximize className="w-5 h-5" />
          </button>
        </div>

        <div className="absolute bottom-4 right-4 bg-white/80 backdrop-blur-md px-3 py-1.5 rounded-full text-[10px] font-bold text-gray-400 uppercase tracking-widest shadow-sm border border-gray-100">
          Click nodes to expand or navigate • Scroll to zoom • Drag to pan
        </div>
      </div>

      <SearchAgent 
        key={selectedVersion}
        isOpen={isSearchAgentOpen}
        onClose={() => setIsSearchAgentOpen(false)}
        allNodes={allNodes}
        onSelectResult={(nodeName, type) => {
          setIsSearchAgentOpen(false);
          handleSearchSelect(nodeName, type);
        }}
      />
    </div>
  );
};
