import app from './app';
import * as dotenv from 'dotenv';
import path from 'path';
dotenv.config({ path: path.resolve(__dirname, '../.env') });
const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`API gateway is running at http://localhost:${port}`);
});
