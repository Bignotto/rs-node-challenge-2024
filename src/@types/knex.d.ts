import "knex";

declare module "knex/types/tables" {
  export interface Tables {
    users: {
      id: string;
      name: string;
      email: string;
      password: string;
    };

    meals: {
      id: number;
      description: string;
      user_id: string;
      title: string;
      on_diet: boolean;
      date_time: Date; // unix timestamp
    };
  }
}
