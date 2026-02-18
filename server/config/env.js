import fs from 'node:fs';
import path from 'node:path';
import dotenv from 'dotenv';

const rootEnvPath = path.resolve('.env');
const serverEnvPath = path.resolve('server/.env');

if (fs.existsSync(rootEnvPath)) {
  dotenv.config({ path: rootEnvPath });
} else if (fs.existsSync(serverEnvPath)) {
  dotenv.config({ path: serverEnvPath });
} else {
  dotenv.config();
}
