/**
 * UniqueIdGenerator - Creates guaranteed unique IDs for store instances
 * 
 * Features:
 * - Multiple generation strategies (UUID, sequential, prefixed)
 * - Collision detection and prevention
 * - Configurable via options
 */

export type IdGeneratorOptions = {
    /** Prefix to add to generated IDs */
    prefix?: string;
    /** Strategy to use for ID generation */
    strategy?: 'uuid' | 'sequential' | 'timestamp';
    /** Custom function to generate ID */
    customGenerator?: () => string;
    /** Initial counter value for sequential IDs */
    initialCounter?: number;
  };
  
  export class UniqueIdGenerator {
    private static usedIds = new Set<string>();
    private prefix: string;
    private strategy: 'uuid' | 'sequential' | 'timestamp';
    private customGenerator?: () => string;
    private counter: number;
  
    constructor(options: IdGeneratorOptions = {}) {
      this.prefix = options.prefix || 'store';
      this.strategy = options.strategy || 'uuid';
      this.customGenerator = options.customGenerator;
      this.counter = options.initialCounter || 0;
    }
  
    /**
     * Generate a new unique ID
     * 
     * @returns A guaranteed unique string ID
     */
    generate(): string {
      let id: string;
      
      if (this.customGenerator) {
        id = this.customGenerator();
      } else {
        id = this.generateById(this.strategy);
      }
  
      // Add prefix if needed
      if (this.prefix) {
        id = `${this.prefix}-${id}`;
      }
  
      // Ensure uniqueness
      if (UniqueIdGenerator.usedIds.has(id)) {
        // Try again with a counter suffix in case of collision
        return this.generateWithSuffix(id, 0);
      }
  
      UniqueIdGenerator.usedIds.add(id);
      return id;
    }
  
    /**
     * Reset all used IDs (use with caution)
     */
    static resetUsedIds(): void {
      UniqueIdGenerator.usedIds.clear();
    }
  
    /**
     * Check if an ID has been used
     */
    static isIdUsed(id: string): boolean {
      return UniqueIdGenerator.usedIds.has(id);
    }
  
    private generateById(strategy: 'uuid' | 'sequential' | 'timestamp'): string {
      switch (strategy) {
        case 'uuid':
          return this.generateUUID();
        case 'sequential':
          return (++this.counter).toString();
        case 'timestamp':
          return Date.now().toString(36) + Math.random().toString(36).substring(2, 5);
        default:
          return this.generateUUID();
      }
    }
  
    private generateUUID(): string {
      // RFC4122 compliant UUID v4
      return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
        const r = (Math.random() * 16) | 0;
        const v = c === 'x' ? r : (r & 0x3) | 0x8;
        return v.toString(16);
      });
    }
  
    private generateWithSuffix(baseId: string, attempt: number): string {
      const newId = `${baseId}-${attempt}`;
      if (UniqueIdGenerator.usedIds.has(newId)) {
        return this.generateWithSuffix(baseId, attempt + 1);
      }
      UniqueIdGenerator.usedIds.add(newId);
      return newId;
    }
  }
  
  /**
   * Singleton instance for quick access
   */
  export const idGenerator = new UniqueIdGenerator();
  
  /**
   * Convenience function to generate a unique ID
   */
  export function generateUniqueId(options?: IdGeneratorOptions): string {
    const generator = options ? new UniqueIdGenerator(options) : idGenerator;
    return generator.generate();
  }