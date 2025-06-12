import {
  IsString,
  IsOptional,
  IsUrl,
  IsDateString,
  MaxLength,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateUrlDto {
  @ApiProperty({
    description: 'The original URL to be shortened',
    example: 'https://www.example.com',
  })
  @IsUrl()
  originalUrl: string;

  @ApiPropertyOptional({
    description: 'Expiration date for the short URL',
    example: '2025-06-11T12:00:00.000Z',
  })
  @IsOptional()
  @IsDateString()
  expiresAt?: string;

  @ApiPropertyOptional({
    description: 'Custom alias for the short URL',
    example: 'custom-alias',
    maxLength: 20,
  })
  @IsOptional()
  @IsString()
  @MaxLength(20)
  alias?: string;
}

export class UrlResponseDto {
  @ApiProperty({ description: 'Url ID' })
  id: string;

  @ApiProperty({ description: 'Short URL alias', nullable: true })
  alias: string | null;

  @ApiProperty({
    description: 'Full short URL',
    example: 'http://localhost:4000/abc123',
  })
  shortUrl: string;

  @ApiProperty({ description: 'Original URL' })
  originalUrl: string;

  @ApiProperty({ description: 'Date of link creation' })
  createdAt: Date;

  @ApiProperty({ description: 'Link expiration date', nullable: true })
  expiresAt: Date | null;

  @ApiProperty({ description: 'Number of clicks on the link' })
  clickCount: number;
}
