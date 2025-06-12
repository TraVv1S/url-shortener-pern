import {
  Controller,
  Post,
  Get,
  Body,
  Param,
  Req,
  Res,
  HttpCode,
  HttpStatus,
  Delete,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { UrlService } from './url.service';
import {
  CreateUrlDto,
  UrlAnalyticsDto,
  UrlInfoDto,
  UrlResponseDto,
} from './url.dto';
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
    const ip = req.ip || 'unknown';
    const originalUrl = await this.urlService.getOriginalUrl(shortCode);

    this.urlService.recordClick(shortCode, ip).catch(console.error);

    res.redirect(originalUrl);
  }

  @Get('info/:shortCode')
  @ApiOperation({
    summary: 'Get URL info',
    description: 'Returns information about the short URL',
  })
  @ApiParam({
    name: 'shortCode',
    description: 'Short code or alias of the URL',
    example: 'abc123',
  })
  @ApiResponse({
    status: 200,
    description: 'Information about the URL',
    type: UrlInfoDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Short URL not found',
  })
  async getUrlInfo(@Param('shortCode') shortCode: string): Promise<UrlInfoDto> {
    return this.urlService.getUrlInfo(shortCode);
  }

  @Delete('delete/:shortCode')
  @ApiOperation({
    summary: 'Delete short URL',
    description: 'Deletes the short URL and all associated statistics',
  })
  @ApiParam({
    name: 'shortCode',
    description: 'Short code or alias of the URL',
    example: 'abc123',
  })
  @ApiResponse({
    status: 204,
    description: 'URL successfully deleted',
  })
  @ApiResponse({
    status: 404,
    description: 'Short URL not found',
  })
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteUrl(@Param('shortCode') shortCode: string): Promise<void> {
    return this.urlService.deleteUrl(shortCode);
  }

  @Get('analytics/:shortCode')
  @ApiOperation({
    summary: 'Get URL analytics',
    description: 'Returns statistics for the short URL',
  })
  @ApiParam({
    name: 'shortCode',
    description: 'Short code or alias of the URL',
    example: 'abc123',
  })
  @ApiResponse({
    status: 200,
    description: 'Analytics for the short URL',
    type: UrlAnalyticsDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Short URL not found',
  })
  async getAnalytics(
    @Param('shortCode') shortCode: string,
  ): Promise<UrlAnalyticsDto> {
    return this.urlService.getAnalytics(shortCode);
  }
}
