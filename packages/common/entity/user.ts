import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, OneToOne } from 'typeorm'
import { ROLES } from '../enums/roles'
import { BaseEntity } from './baseEntity'
import { Role } from './role'
import { UserMeta } from './userMeta'

@Entity()
export class User extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  ID!: string

  @Column({ unique: true })
  userName!: string

  @Column({ default: true })
  active!: boolean

  @Column({ default: false })
  isFirstLogin!: boolean

  @Column({ nullable: true })
  name!: string

  @Column({ nullable: true })
  email?: string

  @Column()
  password!: string

  // @Column({ nullable: true })
  // decryptedPassword!: string
  // token used at the time refreshing token
  @Column({ nullable: true })
  refreshToken?: string

  @ManyToOne(() => Role, { cascade: true })
  @JoinColumn()
  role: Role // This will hold the current role of the user

  @Column()
  roleID!: String

  @OneToOne(() => UserMeta, { cascade: true }) // Assuming you want to cascade operations on the User_Meta entity
  @JoinColumn()
  userMeta: UserMeta
}
