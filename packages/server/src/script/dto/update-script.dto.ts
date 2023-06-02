import { PartialType } from '@nestjs/swagger';
import { CreateScriptDto } from './create-script.dto';

export class UpdateScriptDto extends PartialType(CreateScriptDto) {}
