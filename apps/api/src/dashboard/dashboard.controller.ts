import { Controller, Get, Query, Req } from '@nestjs/common';
import { Request } from 'express';
import { DashboardService } from './dashboard.service';

interface AuthRequest extends Request {
  user?: { id: string; email: string; role: string };
}

@Controller('dashboard')
export class DashboardController {
  constructor(private dashboardService: DashboardService) {}
  
  @Get('overview')
  getOverview(
    @Req() req: AuthRequest,
    @Query('month') month?: string,
    @Query('year') year?: string,
  ) {
    const m = month ? parseInt(month, 10) : undefined;
    const y = year ? parseInt(year, 10) : undefined;
    const userId = req?.user?.id;
    return this.dashboardService.getOverview(m, y, userId);
  }

  @Get('absent-members')
  getAbsentMembers(@Query('threshold') threshold = '2') {
    return this.dashboardService.getAbsentMembers(parseInt(threshold, 10) || 2);
  }
}
