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
    /* Force light mode colors */
    :root {
      --color-border: #e0e0e0 !important;
      --color-text: #333333 !important;
      --color-bg: #ffffff !important;
      --color-bg-secondary: #f5f5f5 !important;
    }
    
    /* Main background and text */
    body {
      background-color: #ffffff !important;
      color: #333333 !important;
    }

    .swagger-ui {
      --color-border: #e0e0e0 !important;
      --color-text: #333333 !important;
      --color-bg: #ffffff !important;
      --color-bg-secondary: #f5f5f5 !important;
      background-color: #ffffff !important;
      color: #333333 !important;
    }
    
    .swagger-ui .topbar {
      background-color: #f5f5f5 !important;
      border-bottom: 1px solid #e0e0e0 !important;
    }

    .swagger-ui .info {
      color: #333333 !important;
    }

    .swagger-ui .scheme-container {
      background: #f5f5f5 !important;
      border: 1px solid #e0e0e0 !important;
    }

    .swagger-ui .btn {
      border-radius: 4px;
    }

    .swagger-ui .btn.authorization__btn {
      background-color: #007bff !important;
      border-color: #007bff !important;
    }

    .swagger-ui .btn.authorize {
      background-color: #28a745 !important;
      border-color: #28a745 !important;
    }

    .swagger-ui .model-container {
      background: #f5f5f5 !important;
      border: 1px solid #e0e0e0 !important;
    }

    .swagger-ui .topbar-main {
      background: #ffffff !important;
    }

    .swagger-ui select {
      background-color: #ffffff !important;
      border: 1px solid #e0e0e0 !important;
      color: #333333 !important;
    }

    /* Additional light mode overrides */
    .swagger-ui .parameter__name {
      color: #333333 !important;
    }

    .swagger-ui .opblock {
      border: 1px solid #e0e0e0 !important;
    }

    .swagger-ui .opblock.opblock-post {
      background: rgba(51, 230, 102, 0.1) !important;
    }

    .swagger-ui .opblock.opblock-get {
      background: rgba(102, 192, 244, 0.1) !important;
    }

    .swagger-ui .opblock.opblock-put {
      background: rgba(252, 211, 77, 0.1) !important;
    }

    .swagger-ui .opblock.opblock-delete {
      background: rgba(239, 83, 80, 0.1) !important;
    }

    .swagger-ui .opblock.opblock-patch {
      background: rgba(156, 39, 176, 0.1) !important;
    }

    .swagger-ui table {
      background-color: #ffffff !important;
      color: #333333 !important;
    }

    .swagger-ui table tbody tr:hover {
      background-color: #f5f5f5 !important;
    }

    .swagger-ui input, 
    .swagger-ui textarea {
      background-color: #ffffff !important;
      color: #333333 !important;
      border: 1px solid #e0e0e0 !important;
    }

    .swagger-ui .tab {
      background-color: #f5f5f5 !important;
      color: #333333 !important;
    }

    .swagger-ui .tab.active {
      background-color: #ffffff !important;
      border-bottom: 2px solid #007bff !important;
    }
  `,
};
