const { spawn } = require('child_process');

const startDev = (port, mode) => {
  const env = { ...process.env, NEXT_PUBLIC_APP_MODE: mode };
  const child = spawn('npx', ['next', 'dev', '-p', port.toString()], {
    stdio: 'inherit',
    shell: true,
    env
  });
  
  child.on('error', (err) => {
    console.error(`Failed to start Next.js dev server on port ${port}:`, err);
  });
};

console.log('🚀 Starting Admin Dashboard on http://localhost:3000...');
startDev(3000, 'admin');

console.log('👤 Starting User Chat Portal on http://localhost:3001...');
startDev(3001, 'user');
