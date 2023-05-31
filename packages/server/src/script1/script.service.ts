import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { Script } from './script.entity';
import * as fs from 'fs';
import * as path from 'path';
import { Repository } from 'typeorm';
import { InjectRepository } from "@nestjs/typeorm";

@Injectable()
export class ScriptService {
  constructor(
    private httpService: HttpService,
    @InjectRepository(Script)
    private scriptRepository: Repository<Script>,
  ) {}

  async analysis(body) {
    try {
      const { data } = await firstValueFrom(this.httpService.get(body.url));
      const regex = /\/\/\s*@(\w+)\s+(.*)/g;
      const matches = data.matchAll(regex);
      const metadata: any = {};
      for (const match of matches) {
        const [, key, value] = match;
        metadata[key] = value;
      }
      return {
        data: {
          ...metadata,
          code: data,
        },
      };
    } catch (error) {
      return {
        success: false,
      };
    }
  }

  async upsert(body) {
    const script = new Script();
    script.id = body.id;
    script.fileName = body.fileName;
    script.updateURL = body.updateURL;
    const filesDir = path.join(__dirname, 'files');
    if (!fs.existsSync(filesDir)) {
      fs.mkdirSync(filesDir, { recursive: true });
    }
    const filePath = path.join(filesDir, body.fileName);
    script.filePath = filePath;
    const writeStream = fs.createWriteStream(filePath);
    writeStream.write(body.code);
    writeStream.end();
    await this.scriptRepository.save(script);
  }
  async list(){
    const {current = 1, pageSize = 10} = params || {};
    const [data, total] = await this.taskRepository.findAndCount({
      where: {
        user: {id: user.id},
        // name: params.name,
        // status: params.status
      },
      take: pageSize,
      skip: (current - 1) * pageSize,
    });
    return {
      data,
      total,
    };
  }
}
