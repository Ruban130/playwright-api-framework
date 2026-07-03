import logger from '../src/utils/logger.js';

async function globalTeardown(): Promise<void> {
  logger.info('='.repeat(60));
  logger.info('GLOBAL TEARDOWN: Test execution completed');
  logger.info(`Test execution ended at: ${new Date().toISOString()}`);
  logger.info('='.repeat(60));
}

export default globalTeardown;
