import express from 'express';
import cors from 'cors';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import routes from './routes.js';

const app = express();
const currentFile = fileURLToPath(import.meta.url);
const currentDirectory = path.dirname(currentFile);

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(currentDirectory, '../frontend')));
app.use(routes);

export default app;