import { InjectRepository } from "@mikro-orm/nestjs";
import { EntityRepository, Transactional } from "@mikro-orm/postgresql";
import { Injectable } from "@nestjs/common";
import { User } from "./user.entity";

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: EntityRepository<User>
  ) {}

  @Transactional()
  createUser(input: { email: string; passwordHashed: string }) {
    const user = new User();
    user.email = input.email;
    user.passwordHashed = input.passwordHashed;
    this.userRepository.getEntityManager().persist(user);
  }

  @Transactional()
  async findByEmail(input: { email: string }) {
    const { email } = input;
    return await this.userRepository.findOne({ email });
  }

  @Transactional()
  async findByUuid(input: { uuid: string }) {
    const { uuid } = input;
    return await this.userRepository.findOne({ uuid });
  }
}
