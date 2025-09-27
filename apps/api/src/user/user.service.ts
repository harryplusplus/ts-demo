import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Transactional } from "typeorm-transactional";
import z from "zod";
import { User, UserInsert, UserInserter, UserSchema } from "./user.entity";

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserSchema)
    private readonly userRepository: Repository<User>
  ) {}

  @Transactional()
  async createUser(input: z.input<typeof UserInsert>) {
    return await UserInserter.insert(this.userRepository, input);
  }

  @Transactional()
  async findByEmail(input: { email: string }) {
    const { email } = input;
    return await this.userRepository.findOne({ where: { email } });
  }

  @Transactional()
  async findByUuid(input: { uuid: string }) {
    const { uuid } = input;
    return await this.userRepository.findOne({ where: { uuid } });
  }
}
