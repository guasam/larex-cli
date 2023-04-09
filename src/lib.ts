import { loadEnv } from 'vite';

export const LAREX_APP_PROCESSENV = 'LAREX_APP';
export const LAREX_MODE_PROCESSENV = 'LAREX_MODE';

export class LarexAppProvider {
  /**
   * App name for current process.
   */
  public name;

  /**
   * Current mode.
   */
  public mode;

  /**
   * App host
   */
  public host;

  /**
   * App project's current env vars
   */
  private env;

  /**
   * Provides current Larex Framework app from process.
   *
   * @param name Current app name
   */
  constructor() {
    this.name = process.env[LAREX_APP_PROCESSENV] as string;
    this.mode = process.env[LAREX_MODE_PROCESSENV] as string;
    this.env = loadEnv(this.mode, process.cwd());
    this.host = new URL(this.env['VITE_APP_URL']).hostname;
  }

  /**
   * Larex Framework app path for current process.
   *
   * @param file App file path
   * @returns
   */
  path(file: string): string {
    return `app/${this.name}/${file}`;
  }

  /**
   * Resource path of app in current process.
   *
   * @param file  App resource file path
   * @returns
   */
  resources(file: string | string[]): string | string[] {
    if (Array.isArray(file)) {
      return file.map((f) => this.path(`resources/${f}`));
    }
    return this.path(`resources/${file}`);
  }

  /**
   * Default refresh paths of app in current process.
   * For eg: (routes, views)
   */
  refreshPaths(paths?: string[]): string[] {
    if (Array.isArray(paths)) {
      return paths.map((p) => this.path(p));
    }
    return [this.path('routes/**/*'), this.path('views/**/*')];
  }
}
