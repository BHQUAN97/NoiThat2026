import { IsString, IsNotEmpty, IsOptional, IsEmail, Matches, MaxLength } from 'class-validator'

export class CreateQuoteFormDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  name!: string

  @IsString()
  @IsNotEmpty()
  @Matches(/^[0-9]{9,11}$/, { message: 'Số điện thoại không hợp lệ' })
  phone!: string

  @IsOptional()
  @IsEmail()
  email?: string

  @IsOptional()
  content?: {
    type?: string
    area?: string
    note?: string
  }
}

export class CreateContactFormDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  name!: string

  @IsString()
  @IsNotEmpty()
  @Matches(/^[0-9]{9,11}$/, { message: 'Số điện thoại không hợp lệ' })
  phone!: string

  @IsOptional()
  @IsEmail()
  email?: string

  @IsString()
  @IsNotEmpty()
  @MaxLength(2000)
  content!: { message: string }
}
