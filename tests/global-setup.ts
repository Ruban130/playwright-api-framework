import logger from '../src/utils/logger.js';

async function globalSetup(): Promise<void> {
  logger.info('='.repeat(60));
  logger.info('GLOBAL SETUP: Initializing test environment');
  logger.info(`Test execution started at: ${new Date().toISOString()}`);
  logger.info(`API Base URL: ${process.env.API_BASE_URL}`);
  logger.info('='.repeat(60));
}

export default globalSetup;
