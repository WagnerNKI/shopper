import express from 'express';
import router from './app/routes/routes'
import dotenv from 'dotenv'

const app = express();
const PORT = 8080;

dotenv.config();

app.use(express.json())

app.use(router)

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});