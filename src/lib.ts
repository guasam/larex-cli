export const LAREX_APP_PROCESS_KEY = 'LAREX_APP';

/**
 * Larex Framework app name for current process.
 */
export function currentApp(): string {
  return process.env[LAREX_APP_PROCESS_KEY] as string;
}

export class LarexAppProvider {
  /**
   * App name for current process.
   */
  public name = '';

  /**
   * Provides current Larex Framework app from process.
   *
   * @param name Current app name
   */
  constructor() {
    this.name = currentApp();
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
