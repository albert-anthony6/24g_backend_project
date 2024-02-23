import express from 'express';
import swaggerJsDoc from 'swagger-jsdoc';
import swaggerUI from 'swagger-ui-express';
import swaggerOptions from './swaggerOptions';
import userRouter from './routes/userRoutes';

const app = express();
app.use(express.json());

const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use('/swagger', swaggerUI.serve, swaggerUI.setup(swaggerDocs));

// Mounting this users related router
app.use('/users', userRouter);

export default app;
