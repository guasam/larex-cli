import { cac } from 'cac';
import { loadConfigFromFile, createServer, build, ConfigEnv, createLogger } from 'vite';
import { LAREX_MODE_PROCESSENV, LAREX_APP_PROCESSENV } from './lib';

/**
 * Create larex cli
 */
const cli = cac('larex');

/**
 * Make Vite Configuration
 */
async function makeViteConfig(app: string, configEnv: ConfigEnv) {
  const appConfigFile = `app/${app}/vite.config.ts`;
  const rootConfig = (await loadConfigFromFile(configEnv, 'vite.config.ts'))?.config;
  const appConfig = (await loadConfigFromFile(configEnv, appConfigFile))?.config;

  if (rootConfig && appConfig) {
    return Object.assign(rootConfig, appConfig);
  } else {
    throw new Error('Failed to make vite configuration.');
  }
}

/**
 * Dev Command
 */
cli.command('dev <app>', 'Start dev server').action(async (app: string) => {
  // Define mode
  const mode = 'development';

  // Expose larex app process.
  process.env[LAREX_APP_PROCESSENV] = app;
  process.env[LAREX_MODE_PROCESSENV] = mode;

  // Make vite configuration.
  const config = await makeViteConfig(app, { mode, command: 'serve' });

  // Create dev server using vite config
  try {
    const server = await createServer(config);

    if (!server.httpServer) {
      throw new Error('HTTP server not available');
    }

    await server.listen();
    server.printUrls();

    //
  } catch (e) {
    console.error('Error when starting dev server', e);
    process.exit(1);
  }
});

/**
 * Build Command
 */
cli.command('build <app>', 'Build for production').action(async (app: string) => {
  // Define mode
  const mode = 'production';

  // Expose larex app process.
  process.env[LAREX_APP_PROCESSENV] = app;
  process.env[LAREX_MODE_PROCESSENV] = mode;

  // Make vite configuration.
  const config = await makeViteConfig(app, { mode, command: 'build' });

  // Build using vite
  try {
    await build(config);
  } catch (e) {
    console.error('Error during build', e);
    process.exit(1);
  }
});

/**
 * Parse CLI
 */
cli.help();
cli.parse();
