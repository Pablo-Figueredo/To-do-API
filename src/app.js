import express from 'express';
import cors from 'cors';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import routes from './routes.js';
import db from './config/dbConnect.js';
import manipulador404 from './middleware/Manipulador404.js';
import manipuladorDeErros from './middleware/manipuladorDeErros.js';

db.on("error", console.log.bind(console, 'Erro de conexão'))
db.once("open", () => {
  console.log('conexão com o banco feita com sucesso')
})

const app = express();
const currentFile = fileURLToPath(import.meta.url);
const currentDirectory = path.dirname(currentFile);

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(currentDirectory, '../frontend')));
app.use(routes);

app.use(manipulador404);
 
app.use(manipuladorDeErros);


export default app;