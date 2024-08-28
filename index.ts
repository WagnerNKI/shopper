import express from 'express';
import router from './app/routes/routes'
const app = express();
const PORT = 8080;

app.get('/', (req, res) => {
  res.send('hello world')
});

app.use(router)

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});