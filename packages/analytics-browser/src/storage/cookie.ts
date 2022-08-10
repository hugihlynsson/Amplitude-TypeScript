import { Storage, CookieStorageOptions } from '@amplitude/analytics-types';

export class CookieStorage<T> implements Storage<T> {
  options: CookieStorageOptions;

  constructor(options?: CookieStorageOptions) {
    console.log('Constructing Cookie Storage', window.document.cookie);
    this.options = { ...options };
  }

  async isEnabled(): Promise<boolean> {
    /* istanbul ignore if */
    console.log('Beginning of Enabled', window.document.cookie);
    if (typeof window === 'undefined') {
      console.log('cookies are not enabled');
      return false;
    }

    const random = String(Date.now());
    const testStrorage = new CookieStorage<string>();
    const testKey = 'AMP_TEST';
    try {
      await testStrorage.set(testKey, random);
      const value = await testStrorage.get(testKey);
      console.log('After enabled', window.document.cookie);
      console.log('cookies are enabled', value === random);
      return value === random;
    } catch {
      console.log('cookies are not enabled');
      /* istanbul ignore next */
      return false;
    } finally {
      console.log('Before setting Key to null', window.document.cookie);
      await testStrorage.remove(testKey);
      console.log('After setting Key to null', window.document.cookie);
    }
  }

  async get(key: string): Promise<T | undefined> {
    console.log('Cookie storage get called', window.document.cookie);
    let value = await this.getRaw(key);
    console.log('After getRaw', window.document.cookie);
    if (!value) {
      return undefined;
    }
    try {
      try {
        value = decodeURIComponent(atob(value));
      } catch {
        // value not encoded
      }
      // eslint-disable-next-line @typescript-eslint/no-unsafe-return
      return JSON.parse(value);
    } catch {
      /* istanbul ignore next */
      return undefined;
    }
  }

  async getRaw(key: string): Promise<string | undefined> {
    console.log('Before split', window.document.cookie);
    const cookie = window.document.cookie.split('; ');
    console.log('After split', window.document.cookie);
    console.log('Trying to read key ', key, 'in', cookie);
    const match = cookie.find((c) => c.indexOf(key + '=') === 0);
    if (!match) {
      console.log('Did not find key in cookie', window.document.cookie);
      return undefined;
    }
    const value = match.substring(key.length + 1);
    console.log('reading cookie of key:', key, decodeURIComponent(atob(value)), window.document.cookie);
    return match.substring(key.length + 1);
  }

  async set(key: string, value: T | null): Promise<void> {
    try {
      const expirationDays = this.options.expirationDays ?? 0;
      const expires = value !== null ? expirationDays : -1;
      let expireDate: Date | undefined = undefined;
      if (expires) {
        const date = new Date();
        date.setTime(date.getTime() + expires * 24 * 60 * 60 * 1000);
        expireDate = date;
      }
      let str = `${key}=${btoa(encodeURIComponent(JSON.stringify(value)))}`;
      if (expireDate) {
        str += `; expires=${expireDate.toUTCString()}`;
      }
      str += '; path=/';
      if (this.options.domain) {
        str += `; domain=${this.options.domain}`;
      }
      if (this.options.secure) {
        str += '; Secure';
      }
      if (this.options.sameSite) {
        str += `; SameSite=${this.options.sameSite}`;
      }
      console.log('setting cookie:', key, JSON.stringify(value));
      window.document.cookie = str;
    } catch {
      //
    }
  }

  async remove(key: string): Promise<void> {
    await this.set(key, null);
  }

  async reset(): Promise<void> {
    return;
  }
}
