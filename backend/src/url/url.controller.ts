import { Controller, Post, Get, Body, Param, Req, Res } from '@nestjs/common';
import { Request, Response } from 'express';
import { UrlService } from './url.service';
import { CreateUrlDto, UrlResponseDto } from './url.dto';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody,
} from '@nestjs/swagger';

@ApiTags('url')
@Controller()
export class UrlController {
  constructor(private readonly urlService: UrlService) {}

  @Post('shorten')
  @ApiOperation({
    summary: 'Create a short URL',
    description: 'Create a short URL for a given original URL',
  })
  @ApiBody({ type: CreateUrlDto })
  @ApiResponse({
    status: 201,
    description: 'The short URL has been successfully created',
    type: UrlResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Invalid input data' })
  @ApiResponse({ status: 409, description: 'Alias already exists' })
  async createShortUrl(
    @Body() createUrlDto: CreateUrlDto,
    @Req() request: Request,
  ): Promise<UrlResponseDto> {
    const baseUrl = `${request.protocol}://${request.get('host')}`;
    return this.urlService.createShortUrl(createUrlDto, baseUrl);
  }

  @Get(':shortCode')
  @ApiOperation({
    summary: 'Redirect to the original URL',
    description: 'Redirect to the original URL for a given short code',
  })
  @ApiParam({
    name: 'shortCode',
    description: 'The short code or alias of the URL',
    example: 'abc123',
  })
  @ApiResponse({ status: 302, description: 'Redirect to the original URL' })
  @ApiResponse({ status: 404, description: 'URL not found or expired' })
  async redirectToOriginalUrl(
    @Param('shortCode') shortCode: string,
    @Req() req: Request,
    @Res() res: Response,
  ): Promise<void> {
    const originalUrl = await this.urlService.getOriginalUrl(shortCode);

    // тут регистрируем клик

    res.redirect(originalUrl);
  }
}

// @Get('info/:shortCode')

// @Delete('delete/:shortCode')

// @Get('analytics/:shortCode')
