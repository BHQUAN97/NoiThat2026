import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards, Request } from '@nestjs/common'
import { ProductsService } from './products.service'
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard'
import { OptionalJwtAuthGuard } from '../../common/guards/optional-jwt-auth.guard'
import { Public } from '../../common/decorators/public.decorator'
import { Roles } from '../../common/decorators/roles.decorator'
import { UserRole } from '../users/entities/user.entity'

@Controller('products')
export class ProductsController {
  constructor(private readonly service: ProductsService) {}

  // Public route — active only; admin với token có thể lấy tất cả
  @Public()
  @Get()
  @UseGuards(OptionalJwtAuthGuard)
  findAll(
    @Request() req: { user?: { role: string } },
    @Query('category') categoryId?: string,
    @Query('featured') featured?: string,
  ) {
    const isAdmin = req.user?.role === UserRole.ADMIN || req.user?.role === UserRole.SUPER_ADMIN
    return this.service.findAll({
      categoryId,
      featured: featured === 'true',
      active: isAdmin ? undefined : true,
    })
  }

  @Get('admin/all')
  @UseGuards(JwtAuthGuard)
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
  findAllAdmin(
    @Query('category') categoryId?: string,
    @Query('featured') featured?: string,
  ) {
    return this.service.findAll({ categoryId, featured: featured === 'true' })
  }

  @Public()
  @Get(':slug')
  findBySlug(@Param('slug') slug: string) {
    return this.service.findBySlug(slug)
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
  create(@Body() body: any) {
    return this.service.create(body)
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
  update(@Param('id') id: string, @Body() body: any) {
    return this.service.update(id, body)
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
  remove(@Param('id') id: string) {
    return this.service.remove(id)
  }
}
