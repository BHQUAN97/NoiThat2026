import { Injectable, ExecutionContext } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'

// Cho phép request không có token vẫn đi qua, nhưng gán req.user nếu token hợp lệ
@Injectable()
export class OptionalJwtAuthGuard extends AuthGuard('jwt') {
  canActivate(context: ExecutionContext) {
    return super.canActivate(context)
  }

  // Không throw lỗi khi không có token — chỉ để req.user = undefined
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  handleRequest(_err: unknown, user: any): any {
    return user || null
  }
}
