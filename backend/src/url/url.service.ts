import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import {
  CreateUrlDto,
  UrlAnalyticsDto,
  UrlInfoDto,
  UrlResponseDto,
} from './url.dto';
import { Url } from '../../generated/prisma';

@Injectable()
export class UrlService {
  constructor(private prisma: PrismaService) {}

  private generateShortCode(): string {
    const chars =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < 6; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }

  async createShortUrl(
    createUrlDto: CreateUrlDto,
    baseUrl: string,
  ): Promise<UrlResponseDto> {
    const { originalUrl, expiresAt, alias } = createUrlDto;
    let shortCode = alias;

    if (alias) {
      const existingUrl: Url | null = await this.prisma.url.findUnique({
        where: { alias },
      });

      if (existingUrl) {
        throw new ConflictException('Alias already exists');
      }
    } else {
      do {
        shortCode = this.generateShortCode();
      } while (
        await this.prisma.url.findUnique({ where: { alias: shortCode } })
      );
    }

    const url: Url = await this.prisma.url.create({
      data: {
        original: originalUrl,
        alias: shortCode,
        expiresAt: expiresAt ? new Date(expiresAt) : null,
      },
    });

    return {
      id: url.id,
      alias: url.alias,
      shortUrl: `${baseUrl}/${shortCode}`,
      originalUrl: url.original,
      createdAt: url.createdAt,
      expiresAt: url.expiresAt,
      clickCount: url.clickCount,
    };
  }

  async getOriginalUrl(shortCode: string): Promise<string> {
    const url = await this.prisma.url.findUnique({
      where: { alias: shortCode },
    });

    if (!url) {
      throw new NotFoundException('Short URL not found');
    }

    if (url.expiresAt && url.expiresAt < new Date()) {
      throw new NotFoundException('Short URL has expired');
    }

    return url.original;
  }

  async recordClick(shortCode: string, ip: string): Promise<void> {
    const url = await this.prisma.url.findUnique({
      where: { alias: shortCode },
    });

    if (!url) {
      throw new NotFoundException('Short URL not found');
    }

    await this.prisma.$transaction([
      this.prisma.url.update({
        where: { alias: shortCode },
        data: { clickCount: { increment: 1 } },
      }),
      this.prisma.click.create({
        data: {
          urlId: url.id,
          ip,
        },
      }),
    ]);
  }

  async getUrlInfo(shortCode: string): Promise<UrlInfoDto> {
    const url = await this.prisma.url.findUnique({
      where: { alias: shortCode },
    });

    if (!url) {
      throw new NotFoundException('Short URL not found');
    }

    return {
      originalUrl: url.original,
      createdAt: url.createdAt,
      clickCount: url.clickCount,
    };
  }

  async deleteUrl(shortCode: string): Promise<void> {
    const url = await this.prisma.url.findUnique({
      where: { alias: shortCode },
    });

    if (!url) {
      throw new NotFoundException('Short URL not found');
    }

    await this.prisma.$transaction([
      this.prisma.click.deleteMany({
        where: { urlId: url.id },
      }),
      this.prisma.url.delete({
        where: { alias: shortCode },
      }),
    ]);
  }

  async getAnalytics(shortCode: string): Promise<UrlAnalyticsDto> {
    const url = await this.prisma.url.findUnique({
      where: { alias: shortCode },
      include: {
        clicks: {
          orderBy: { date: 'desc' },
          take: 5,
        },
      },
    });

    if (!url) {
      throw new NotFoundException('Short URL not found');
    }

    return {
      clickCount: url.clickCount,
      recentIps: url.clicks.map((click) => click.ip),
    };
  }
}
