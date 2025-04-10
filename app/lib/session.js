import { createCookieSessionStorage } from '@shopify/remix-oxygen';

export class AppSession {
  #sessionStorage;
  #session;
  #isPending;

  /**
   * @param {SessionStorage} sessionStorage
   * @param {Session} session
   */
  constructor(sessionStorage, session) {
    this.#sessionStorage = sessionStorage;
    this.#session = session;
    this.#isPending = false;
  }

  /**
   * @static
   * @param {Request} request
   * @param {string[]} secrets
   */
  static async init(request, secrets) {
    const storage = createCookieSessionStorage({
      cookie: {
        name: 'session',
        httpOnly: true,
        path: '/',
        sameSite: 'lax',
        secrets,
        secure: process.env.NODE_ENV === 'production', // Only secure in production
        maxAge: 60 * 60 * 24 * 30, // 30 days
      },
    });

    const session = await storage
      .getSession(request.headers.get('Cookie'))
      .catch(() => storage.getSession());

    return new this(storage, session);
  }

  get isPending() {
    return this.#isPending;
  }

  get has() {
    return this.#session.has;
  }

  get get() {
    return this.#session.get;
  }

  get flash() {
    this.#isPending = true;
    return this.#session.flash;
  }

  get unset() {
    this.#isPending = true;
    return this.#session.unset;
  }

  get set() {
    this.#isPending = true;
    return this.#session.set;
  }

  destroy() {
    this.#isPending = false;
    return this.#sessionStorage.destroySession(this.#session);
  }

  commit() {
    this.#isPending = false;
    return this.#sessionStorage.commitSession(this.#session);
  }
}