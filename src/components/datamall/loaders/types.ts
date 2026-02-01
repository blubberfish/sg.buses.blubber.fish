import { DatamallDB } from "@/contexts/datamall/db";

export interface ILoading {
  (params: { client: DatamallDB }): Promise<void>;
}
