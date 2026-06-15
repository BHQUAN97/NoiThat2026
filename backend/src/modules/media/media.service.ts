import {
  Injectable,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In, IsNull } from 'typeorm';
import { BaseService } from '../../common/base/base.service';
import { Media, MediaProcessingStatus } from './entities/media.entity';
import { LocalStorageService } from '../../common/services/local-storage.service';
import { sanitizeFilename } from '../../common/helpers/file-validator';
import { generateUlid } from '../../common/helpers/ulid.helper';

@Injectable()
export class MediaService extends BaseService<Media> {
  constructor(
    @InjectRepository(Media)
    private readonly mediaRepo: Repository<Media>,
    private readonly localStorage: LocalStorageService,
  ) {
    super(mediaRepo, 'Media');
  }

  async upload(
    file: Express.Multer.File,
    uploadedBy: string,
  ): Promise<Media> {
    this.validateForeignKeys({ uploaded_by: uploadedBy } as any, [
      'uploaded_by',
    ]);

    const safeName = sanitizeFilename(file.originalname);
    const tempId = generateUlid();
    const key = `media/${tempId}/${safeName}`;

    let originalUrl: string;
    try {
      originalUrl = await this.localStorage.upload(
        'public',
        key,
        file.buffer,
        file.mimetype,
      );
    } catch (err: any) {
      this.actionLogger.error(`Upload failed: ${err?.message}`);
      throw new BadRequestException('File upload failed. Please try again.');
    }

    const media = this.mediaRepo.create({
      original_filename: file.originalname,
      mime_type: file.mimetype,
      file_size: file.size,
      original_url: originalUrl,
      processing_status: MediaProcessingStatus.COMPLETED,
      uploaded_by: uploadedBy,
    });
    media.id = tempId;
    const saved = await this.mediaRepo.save(media);

    this.actionLogger.log(`Media ${saved.id} uploaded`);
    return saved;
  }

  async findByIds(ids: string[]): Promise<Media[]> {
    if (!ids.length) return [];

    const fakeData: Record<string, string> = {};
    ids.forEach((id, i) => (fakeData[`media_id_${i}`] = id));
    this.validateForeignKeys(fakeData as any, Object.keys(fakeData));

    return this.mediaRepo.find({
      where: { id: In(ids), deleted_at: IsNull() },
    });
  }
}
