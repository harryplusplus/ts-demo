import { DB } from "@/types/db";
import { TransactionalAdapterKysely } from "@nestjs-cls/transactional-adapter-kysely";

export type KyselyTransactionalAdapter = TransactionalAdapterKysely<DB>;
