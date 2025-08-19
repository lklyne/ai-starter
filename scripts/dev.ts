import {concurrently} from 'concurrently';
import '../env.js';
import {must} from '../src/shared/util/must.js';

const pgAddress = must(process.env.PG_ADDRESS, 'PG_ADDRESS is required');

concurrently([
  {
    command: 'pnpm run dev:docker',
    // name: "🐳",
    name: 'DOCKER',
    prefixColor: '#32648c',
  },
  {
    command: 'pnpm run dev:web',
    // name: "🕸️",
    name: 'WEB',
    prefixColor: '#7ce645',
  },
  {
    command: 'pnpm run dev:proxy',
    // name: '🫣',
    name: 'PROXY',
    prefixColor: '#ff00cc',
  },
  {
    command: `wait-on tcp:${pgAddress} && sleep 1 && pnpm run dev:zero`,
    // name: '🚰',
    name: 'ZERO',
    prefixColor: '#ff11cc',
  },
  {
    command: "chokidar './src/db/schema.ts' -c 'pnpm run gen-schema'",
    // name: '👨‍💻',
    name: 'GEN-SCHEMA',
    prefixColor: '#11ffcc',
  },
]);
