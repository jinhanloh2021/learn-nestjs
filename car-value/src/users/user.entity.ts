import {
  AfterInsert,
  Entity,
  Column,
  PrimaryGeneratedColumn,
  AfterUpdate,
  AfterRemove,
} from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  email: string; //varchar

  @Column()
  password: string;

  // TypeORM hooks, similar to triggers. Run only whe entities are saved.
  @AfterInsert()
  logInsert() {
    console.log(`Inserted user: ${this.id}`);
  }

  @AfterUpdate()
  logUpdate() {
    console.log(`Updated user: ${this.id}`);
  }

  @AfterRemove()
  logRemove() {
    console.log(`Removed user: ${this.id}`);
  }
}
