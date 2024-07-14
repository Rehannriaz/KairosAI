import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm'
import { BaseEntity } from './baseEntity'

@Entity()
export class UserMeta extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  ID!: string

  @Column({ nullable: true })
  cnic!: string

  @Column({nullable: true })
  phoneNumber!: string

  @Column({ nullable: true })
  alternatePhoneNumber!: string

  @Column({ nullable: true })
  network!: string

  @Column({ nullable: true })
  alternateNetwork!: string

}
