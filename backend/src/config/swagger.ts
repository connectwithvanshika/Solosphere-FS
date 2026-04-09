import swaggerJsdoc from 'swagger-jsdoc';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Solosphere API Documentation',
      version: '1.0.0',
      description: 'API documentation for Solosphere - Solo travel companion platform',
      contact: {
        name: 'Solosphere Team',
        email: 'support@solosphere.com',
      },
    },
    servers: [
      {
        url: 'http://localhost:5000',
        description: 'Development server',
      },
      {
        url: 'https://solosphere-backend.onrender.com',
        description: 'Production server',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'JWT Authorization header using the Bearer scheme',
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: ['./src/routes/*.ts'], // Path to your route files
};

export const swaggerSpec = swaggerJsdoc(options);

export const swaggerOptions = {
  customCss: `
    .swagger-ui {
      --color-border: #e0e0e0;
      --color-text: #333333;
      --color-bg: #ffffff;
      --color-bg-secondary: #f5f5f5;
    }
    
    .swagger-ui .topbar {
      background-color: #f5f5f5;
      border-bottom: 1px solid #e0e0e0;
    }

    .swagger-ui .info {
      color: #333333;
    }

    .swagger-ui .scheme-container {
      background: #f5f5f5;
      border: 1px solid #e0e0e0;
    }

    .swagger-ui .btn {
      border-radius: 4px;
    }

    .swagger-ui .btn.authorization__btn {
      background-color: #007bff;
      border-color: #007bff;
    }

    .swagger-ui .btn.authorize {
      background-color: #28a745;
      border-color: #28a745;
    }

    .swagger-ui .model-container {
      background: #f5f5f5;
      border: 1px solid #e0e0e0;
    }

    .swagger-ui .topbar-main {
      background: #ffffff;
    }

    body {
      background-color: #ffffff;
    }

    .swagger-ui select {
      background-color: #ffffff;
      border: 1px solid #e0e0e0;
      color: #333333;
    }

    .swagger-ui textarea, .swagger-ui input[type="text"], .swagger-ui input[type="password"], .swagger-ui input[type="search"], .swagger-ui input[type="email"], .swagger-ui input[type="url"] {
      background-color: #ffffff;
      border: 1px solid #e0e0e0;
      color: #333333;
    }

    .swagger-ui .response-col_description__inner {
      background: #f5f5f5;
    }
  `,
  swaggerOptions: {
    displayOperationId: false,
    filter: true,
    showExtensions: false,
    deepLinking: true,
    presets: [
      require('swagger-ui-dist/swagger-ui'),
      require('swagger-ui-dist/swagger-ui-standalone-preset'),
    ],
    plugins: [
      require('swagger-ui-dist/swagger-ui-bundle').plugins.DownloadUrl,
    ],
    layout: 'StandalonePresetLayout',
    defaultModelsExpandDepth: 1,
    defaultModelExpandDepth: 1,
    docExpansion: 'list',
  },
};
