import { DataSource } from "typeorm";
import { getAppConfig } from "./config";

export default new DataSource(getAppConfig());
