import { DatabaseConfig } from './database.config';

describe('DatabaseConfig', () => {
  it('should be defined', () => {
    expect(new DatabaseConfig()).toBeDefined();
  });
});
