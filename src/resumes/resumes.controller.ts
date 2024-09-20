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
import { ResumesService } from './resumes.service';
import { CreateResumeDto, CreateUserResumeDto } from './dto/create-resume.dto';
import {
  UpdateResumeDto,
  UpdateStatusResumeDto,
} from './dto/update-resume.dto';
import { ResponseMessage, User } from 'src/decorator/customize';
import { IUser } from 'src/users/users.interface';

@Controller('resumes')
export class ResumesController {
  constructor(private readonly resumesService: ResumesService) {}

  @ResponseMessage('Create a new resume')
  @Post()
  handleCreateResume(
    @Body() createUserResumeDto: CreateUserResumeDto,
    @User() user: IUser,
  ) {
    return this.resumesService.createResume(createUserResumeDto, user);
  }

  @ResponseMessage('Fetch all resumes with paginate')
  @Get()
  handleGetAllResumes(
    @Query('current') current: string,
    @Query('pageSize') pageSize: string,
    @Query() queryString: string,
  ) {
    return this.resumesService.getAllResumes(+current, +pageSize, queryString);
  }

  @ResponseMessage('Fetch a resume by id')
  @Get(':id')
  handleGetResumeById(@Param('id') id: string) {
    return this.resumesService.getResumeById(id);
  }

  @ResponseMessage('Update status resume')
  @Patch(':id')
  handleUpdateStatusResume(
    @User() user: IUser,
    @Param('id') id: string,
    @Body() updateStatusResumeDto: UpdateStatusResumeDto,
  ) {
    return this.resumesService.updateStatusResume(
      id,
      updateStatusResumeDto,
      user,
    );
  }

  @ResponseMessage('Delete a resume by id')
  @Delete(':id')
  handleDeleteResume(@Param('id') id: string, @User() user: IUser) {
    return this.resumesService.deleteResume(id, user);
  }

  @ResponseMessage('Get Resume by User')
  @Post('/by-user')
  handleGetResumeByUser(@User() user: IUser) {
    return this.resumesService.getResumeByUser(user);
  }
}
