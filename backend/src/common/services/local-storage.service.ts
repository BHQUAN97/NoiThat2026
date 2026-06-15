import { Injectable, Logger } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class LocalStorageService {
  private readonly logger = new Logger(LocalStorageService.name);
  private readonly localDir = path.resolve(process.cwd(), 'uploads');

  constructor() {
    fs.mkdirSync(this.localDir, { recursive: true });
  }

  async upload(
    _bucket: 'private' | 'public',
    key: string,
    body: Buffer,
    _contentType: string,
  ): Promise<string> {
    const filePath = path.resolve(this.localDir, key);
    if (!filePath.startsWith(this.localDir)) {
      throw new Error('Invalid storage key');
    }
    fs.mkdirSync(path.dirname(filePath), { recursive: true });
    fs.writeFileSync(filePath, body);
    this.logger.log(`Saved ${key} (${body.length} bytes)`);
    return `/uploads/${key}`;
  }

  getPublicUrl(key: string): string {
    return `/uploads/${key}`;
  }

  async delete(_bucket: 'private' | 'public', key: string): Promise<void> {
    const filePath = path.resolve(this.localDir, key);
    if (!filePath.startsWith(this.localDir)) {
      throw new Error('Invalid storage key');
    }
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      this.logger.log(`Deleted ${key}`);
    }
  }
}
