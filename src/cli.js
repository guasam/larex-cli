#!/usr/bin/env node
const { Command } = require('commander');
const { loadConfigFromFile, createServer, build } = require('vite');
const { LAREX_APP_PROCESS_KEY } = require('@larex/cli');
const cli = new Command();

async function getViteConfig(app, configEnv) {
  process.env[LAREX_APP_PROCESS_KEY] = app;

  const appConfigFile = `app/${app}/vite.config.ts`;
  const viteRootConfig = (await loadConfigFromFile(configEnv, 'vite.config.ts')).config;
  const viteAppConfig = (await loadConfigFromFile(configEnv, appConfigFile)).config;

  return Object.assign(viteRootConfig, viteAppConfig);
}

/**
 * Development Mode
 */
cli
  .command('dev')
  .argument('app', 'Larex app name, to build resources for development')
  .action(async (app) => {
    // Merge root & app vite configurations
    const viteConfig = await getViteConfig(app, {
      mode: 'dev',
      command: 'serve',
    });

    // Create dev server using vite config
    const server = await createServer(viteConfig);
    await server.listen();
    server.printUrls();
  });

/**
 * Build Mode
 */
cli
  .command('build')
  .argument('app', 'Larex app name, to build resources for production')
  .action(async (app) => {
    const viteConfig = await getViteConfig(app, {
      mode: 'build',
      command: 'build',
    });

    // Build using vite
    await build(viteConfig);
  });

/**
 * Parse CLI prompt output
 */
cli.parse();
