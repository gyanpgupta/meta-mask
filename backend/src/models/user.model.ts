import { Model } from 'sequelize';

export class User extends Model {
  public id!: number; // the `null assertion` `!` is required in strict mode.
  public nonce!: number; // a random number
  public publicAddress!: string;
  public username?: string; // for nullable fields
}
