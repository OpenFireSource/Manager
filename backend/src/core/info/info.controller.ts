import { Controller } from '@nestjs/common';
import { InfoService } from './info.service';
import {
  Endpoint,
  EndpointType,
} from '../../shared/decorator/endpoint.decorator';
import { InfoDto } from './dto/info.dto';

@Controller('info')
export class InfoController {
  constructor(private readonly infoService: InfoService) {}

  @Endpoint(EndpointType.GET, {
    path: '',
    description: '',
    public: true,
    notFound: false,
    responseType: InfoDto,
  })
  public get(): InfoDto {
    return this.infoService.get();
  }
}
