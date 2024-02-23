import { Options } from 'swagger-jsdoc';

const swaggerOptions: Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: '24G Backend Project',
      version: '1.0.0',
      description: 'Take-home project focusing on CRUD operations',
    },
  },
  // Path to API routes
  apis: ['./src/**/*.ts'],
};

export default swaggerOptions;
