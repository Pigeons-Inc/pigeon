import app from './app';
import path from 'path';
import * as dotenv from 'dotenv';
dotenv.config({ path: path.resolve(__dirname, '../.env') });
const port = process.env.PORT || 3002;

app.listen(port, () => {
  console.log(`Email service is running at http://localhost:${port}`);
});
