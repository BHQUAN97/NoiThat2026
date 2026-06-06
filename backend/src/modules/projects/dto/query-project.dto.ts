import { IsOptional, IsString } from 'class-validator';
import { PublishableFilterDto } from '../../../common/dto/base-filter.dto';

/**
 * Query DTO cho GET /projects (public).
 * Ke thua PublishableFilterDto: status, search, category_id, is_featured, page, limit, sort, order.
 * Them category (slug) cho public filter.
 */
export class QueryProjectDto extends PublishableFilterDto {
  /** Category slug cho public filter (khac category_id la ULID cho admin) */
  @IsOptional()
  @IsString()
  category?: string;
}

/** Query DTO cho GET /projects/admin/list — dung chung PublishableFilterDto */
export class QueryProjectAdminDto extends PublishableFilterDto {}
