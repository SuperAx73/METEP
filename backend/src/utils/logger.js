class Logger {
  static info(message, data = null) {
    const timestamp = new Date().toISOString();
    console.log(`[INFO] ${timestamp}: ${message}`, data ? data : '');
  }

  static error(message, error = null) {
    const timestamp = new Date().toISOString();
    console.error(`[ERROR] ${timestamp}: ${message}`, error ? error : '');
  }

  static warn(message, data = null) {
    const timestamp = new Date().toISOString();
    console.warn(`[WARN] ${timestamp}: ${message}`, data ? data : '');
  }

  static debug(message, data = null) {
    if (process.env.NODE_ENV === 'development') {
      const timestamp = new Date().toISOString();
      console.log(`[DEBUG] ${timestamp}: ${message}`, data ? data : '');
    }
  }
}

export default Logger;