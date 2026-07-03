import { faker } from '@faker-js/faker';
import { User, Post, Comment } from '../types/api.types.js';
import logger from './logger.js';

export class TestDataGenerator {
  /**
   * Generate a fake user
   */
  public generateUser(overrides?: Partial<User>): User {
    return {
      id: faker.number.int({ min: 1, max: 1000 }),
      name: faker.person.fullName(),
      email: faker.internet.email(),
      username: faker.internet.username(),
      ...overrides,
    };
  }

  /**
   * Generate multiple fake users
   */
  public generateUsers(count: number, overrides?: Partial<User>): User[] {
    return Array.from({ length: count }, () => this.generateUser(overrides));
  }

  /**
   * Generate a fake post
   */
  public generatePost(overrides?: Partial<Post>): Post {
    return {
      userId: faker.number.int({ min: 1, max: 100 }),
      id: faker.number.int({ min: 1, max: 10000 }),
      title: faker.lorem.sentence(),
      body: faker.lorem.paragraphs(3),
      ...overrides,
    };
  }

  /**
   * Generate multiple fake posts
   */
  public generatePosts(count: number, overrides?: Partial<Post>): Post[] {
    return Array.from({ length: count }, () => this.generatePost(overrides));
  }

  /**
   * Generate a fake comment
   */
  public generateComment(overrides?: Partial<Comment>): Comment {
    return {
      postId: faker.number.int({ min: 1, max: 100 }),
      id: faker.number.int({ min: 1, max: 10000 }),
      name: faker.person.fullName(),
      email: faker.internet.email(),
      body: faker.lorem.paragraph(),
      ...overrides,
    };
  }

  /**
   * Generate multiple fake comments
   */
  public generateComments(count: number, overrides?: Partial<Comment>): Comment[] {
    return Array.from({ length: count }, () => this.generateComment(overrides));
  }

  /**
   * Generate random email
   */
  public generateEmail(): string {
    return faker.internet.email();
  }

  /**
   * Generate random string
   */
  public generateString(length: number = 10): string {
    return faker.string.alphanumeric(length);
  }

  /**
   * Generate random number in range
   */
  public generateNumber(min: number = 1, max: number = 1000): number {
    return faker.number.int({ min, max });
  }

  /**
   * Generate random phone number
   */
  public generatePhoneNumber(): string {
    return faker.phone.number();
  }

  /**
   * Generate random address
   */
  public generateAddress(): string {
    return faker.location.streetAddress();
  }

  /**
   * Log generated data
   */
  public logGeneratedData(label: string, data: unknown): void {
    logger.info(`Generated ${label}:`, JSON.stringify(data, null, 2));
  }
}

export const testDataGenerator = new TestDataGenerator();
