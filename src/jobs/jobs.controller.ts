import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { JobsService } from './jobs.service';
import { CreateJobDto } from './dto/create-job.dto';
import { UpdateJobDto } from './dto/update-job.dto';
import { Public, ResponseMessage, User } from 'src/decorator/customize';
import { IUser } from 'src/users/users.interface';

@Controller('jobs')
export class JobsController {
  constructor(private readonly jobsService: JobsService) {}

  @ResponseMessage('Create a new job')
  @Post()
  handleCreateNewJob(@Body() createJobDto: CreateJobDto, @User() user: IUser) {
    return this.jobsService.createNewJob(createJobDto, user);
  }

  @Public()
  @ResponseMessage('Fetch a jobs with pagination')
  @Get()
  handleGetAllJobs(
    @Query('current') current: string,
    @Query('pageSize') pageSize: string,
    @Query() queryString: string,
  ) {
    return this.jobsService.getALlJobs(+current, +pageSize, queryString);
  }

  @Public()
  @ResponseMessage('Fetch a job by id')
  @Get(':id')
  handleGetJobById(@Param('id') id: string) {
    return this.jobsService.getJobById(id);
  }

  @ResponseMessage('Update a job')
  @Patch(':id')
  handleUpdateJob(
    @Param('id') id: string,
    @Body() updateJobDto: UpdateJobDto,
    @User() user: IUser,
  ) {
    return this.jobsService.updateJob(id, updateJobDto, user);
  }

  @ResponseMessage('Delete a job')
  @Delete(':id')
  handleDeleteJob(@Param('id') id: string, @User() user: IUser) {
    return this.jobsService.deleteJob(id, user);
  }
}
