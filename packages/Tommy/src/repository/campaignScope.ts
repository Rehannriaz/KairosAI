import { Area, CampaignScope, TscMetaData } from '@erase/common/entity'
import {
  DISTRICT_TYPE_UUID,
  PROVINCE_TYPE_UUID,
  TEHSIL_TYPE_UUID,
  UC_TYPE_UUID,
} from '@erase/common/preloaded/AreaType'
import { APIError, ERROR_SUB_TYPES, ERROR_TYPES, STATUS_CODES, throwError } from '@erase/common/utils/appErrors'
import { moment } from '@erase/common/utils/moment'
import { Any, FindOptionsSelect, FindOptionsWhere, In, IsNull, LessThanOrEqual, MoreThanOrEqual, Repository } from 'typeorm'
import { AppDataSource } from '../data-source'
import { BaseRepository } from './baseRepository'
export class CampaignScopeRepository extends BaseRepository {
  repo: Repository<CampaignScope>
  tscMetaRepo: Repository<TscMetaData>
  areaRepo: Repository<Area>

  constructor() {
    super()
    this.repo = AppDataSource.getRepository(CampaignScope)
    this.areaRepo = AppDataSource.getRepository(Area)
    this.tscMetaRepo = AppDataSource.getRepository(TscMetaData)
  }


  //#######################################################################
  async GetCampaignScope(campaignID?: number, areaID?: string): Promise<CampaignScope> {
    try {
      const res = await this.repo.findOne({ where: { areaID, campaignID }, relations: { Area: true } })
      if (!res) {
        throw new Error('')
      }

      return res
    } catch (err) {
      throw new APIError('DBLevelError', STATUS_CODES.BAD_REQUEST, 'Cannot find campaign scope of given area')
    }
  }

  async GetScopeDateRange(campaignID: number, areaIDs?: string[]): Promise<CampaignScope[]> {
    try {
      // select where areaID matches areaIDs, or if areaIDs not provided, then select all
      const res = await this.repo.query(`
        SELECT "cs"."campaignStartDate" AS "campaignStartDate", "cs"."catchupEndDate" AS "catchupEndDate" 
        FROM "campaign_scope" "cs" 
        WHERE "cs"."campaignID" = ${campaignID}
        AND ${areaIDs?.length ? `"cs"."areaID" IN (${areaIDs.map((id) => `'${id}'`).join(',')})` : 'true'}
      `)
        ;


      if (!res) {
        throw new Error('')
      }
      return res
    } catch (err) {
      console.log(err)
      throw new APIError('DBLevelError', STATUS_CODES.BAD_REQUEST, 'Cannot find campaign scope of given area')
    }
  }


  async getAreasInHierarchy(id: string, campaignID) {
    try {

      const res = await this.repo.query(
        `
        SELECT uc."ID" as uid, tehsil."ID" as tid, dist."ID" as did
    FROM area uc
    LEFT JOIN area tehsil ON tehsil."ID" = uc."parentID"
    LEFT JOIN area dist ON dist."ID" = tehsil."parentID"
    join campaign_scope cs on cs."areaID" = uc."ID" and cs."campaignID" = '${campaignID}'
    where uc."ID" = '${id}' or tehsil."ID" = '${id}' or dist."ID" = '${id}' and (dist."ID" is not null)
;
        `
      )
      return res
    } catch (error) {
      throw error
    }
  }

  //#######################################################################
  async GetCampaignScopeArea(
    campaignID?: number,
    parentID?: string,
    activeScope?: boolean,
    date?: string
  ): Promise<Area[]> {
    const AREA_SELECTION = { ID: true, name: true, areaTypeID: true, parentID: true }
    const SCOPE_SELECTION: FindOptionsSelect<CampaignScope> = {
      catchupStartDate: true,
      campaignEndDate: true,
      campaignStartDate: true,
      catchupEndDate: true,
      campaignID: true,
    }

    const Area = await this.areaRepo.findOne({ where: { ID: parentID } })
    const ACTIVE_SCOPE_FILTER: FindOptionsWhere<CampaignScope>[] = [
      {
        campaignStartDate: LessThanOrEqual(date ? new Date(date) : new Date()),
        campaignEndDate: MoreThanOrEqual(date ? new Date(date) : new Date()),
      },
      {
        catchupStartDate: LessThanOrEqual(date ? new Date(date) : new Date()),
        catchupEndDate: MoreThanOrEqual(date ? new Date(date) : new Date()),
      },
    ]

    const CAMPAIGN_ID_SCOPE_FILTER: FindOptionsWhere<CampaignScope> = {
      campaignID: campaignID,
    }

    const PROVINCE_FILTER: FindOptionsWhere<Area> = {
      Child: {
        CampaignScope: {
          campaignID: campaignID,
          ...(activeScope && {
            campaignStartDate: LessThanOrEqual(date ? new Date(date) : new Date()),
            campaignEndDate: MoreThanOrEqual(date ? new Date(date) : new Date()),
          }),
        },
        Child: {
          CampaignScope: {
            campaignID: campaignID,
            ...(activeScope && {
              campaignStartDate: LessThanOrEqual(date ? new Date(date) : new Date()),
              campaignEndDate: MoreThanOrEqual(date ? new Date(date) : new Date()),
            }),
          },
          Child: {
            CampaignScope: {
              campaignID: campaignID,
              ...(activeScope && {
                campaignStartDate: LessThanOrEqual(date ? new Date(date) : new Date()),
                campaignEndDate: MoreThanOrEqual(date ? new Date(date) : new Date()),
              }),
            },
          },
        },
      },
    }

    const DISTRICT_FILTER: FindOptionsWhere<Area> = {
      Child: {
        CampaignScope: {
          campaignID: campaignID,
          ...(activeScope && {
            campaignStartDate: LessThanOrEqual(date ? new Date(date) : new Date()),
            campaignEndDate: MoreThanOrEqual(date ? new Date(date) : new Date()),
          }),
        },
        Child: {
          CampaignScope: {
            campaignID: campaignID,
            ...(activeScope && {
              campaignStartDate: LessThanOrEqual(date ? new Date(date) : new Date()),
              campaignEndDate: MoreThanOrEqual(date ? new Date(date) : new Date()),
            }),
          },
        },
      },
    }

    const TEHSIL_FILTER: FindOptionsWhere<Area> = {
      Child: {
        CampaignScope: {
          campaignID: campaignID,
          ...(activeScope && {
            campaignStartDate: LessThanOrEqual(date ? new Date(date) : new Date()),
            campaignEndDate: MoreThanOrEqual(date ? new Date(date) : new Date()),
          }),
        },
      },
    }

    let AREA_FILTER: FindOptionsWhere<Area> = {}

    switch (Area.areaTypeID) {
      case PROVINCE_TYPE_UUID:
        AREA_FILTER = PROVINCE_FILTER
        break
      case TEHSIL_TYPE_UUID:
        AREA_FILTER = TEHSIL_FILTER
        break
      case DISTRICT_TYPE_UUID:
        AREA_FILTER = DISTRICT_FILTER
        break
    }

    try {
      const res = await this.areaRepo
        .createQueryBuilder('a')
        .setFindOptions({
          where: {
            ...AREA_FILTER,
            ID: parentID,
            CampaignScope: !IsNull(),
            areaTypeID: parentID ? undefined : PROVINCE_TYPE_UUID,
          },
          select: {
            ...AREA_SELECTION,
            CampaignScope: SCOPE_SELECTION,
            Child: {
              ...AREA_SELECTION,
              CampaignScope: SCOPE_SELECTION,
              Child: {
                ...AREA_SELECTION,
                CampaignScope: SCOPE_SELECTION,
                Child: { CampaignScope: SCOPE_SELECTION, ...AREA_SELECTION },
              },
            },
          },
          relations: {
            CampaignScope: true,
            Child: {
              CampaignScope: true,
              Child: { CampaignScope: true, Child: { CampaignScope: true } },
            },
          },
        })
        .getMany()

      console.log(res)

      return res
    } catch (err) {
      console.log(err)
      throw new APIError('DBLevelError', STATUS_CODES.BAD_REQUEST, 'Internal Error')
    }
  }

  async GetCampaignScopeChildrenWithDetails(
    campaignID: number,
    parentID?: string | null,
    date?: string,
    active?: boolean,
    filter?: string
  ) {
    try {
      const res = await this.GetCampaignScopeArea(campaignID, parentID, active, date)
      const areaDetails = parentID
        ? (
          await this.areaRepo.find({
            select: { areaTypeID: true, name: true, parentID: true },
            where: { ID: parentID, CampaignScope: { campaignID: campaignID } },
            relations: {
              Parent: { Parent: { Parent: { Parent: true } } }, CampaignScope: true, 
            }
          })
          [0])
        : null
      const children = []
      switch (areaDetails ? areaDetails.areaTypeID : null) {
        case PROVINCE_TYPE_UUID:
          res.map((area) => {
            filter != UC_TYPE_UUID &&
              area.ID === parentID &&
              children.push({ ID: area.ID, name: area.name, areaTypeID: area.areaTypeID, parentID: area.parentID })
            area.ID === parentID &&
              area.Child.map((a) => {
                filter != UC_TYPE_UUID &&
                  children.push({ ID: a.ID, name: a.name, areaTypeID: a.areaTypeID, parentID: a.parentID })
                a.Child.map((a) => {
                  filter != UC_TYPE_UUID &&
                    children.push({ ID: a.ID, name: a.name, areaTypeID: a.areaTypeID, parentID: a.parentID })
                  a.Child.map((a) => {
                    children.push({ ID: a.ID, name: a.name, areaTypeID: a.areaTypeID, parentID: a.parentID })
                  })
                })
              })
          })
          break
        case DISTRICT_TYPE_UUID:
          res.map((area) => {
            filter != UC_TYPE_UUID &&
              areaDetails.Parent.ID === area.ID &&
              children.push({ ID: area.ID, name: area.name, areaTypeID: area.areaTypeID, parentID: area.parentID })
            area.Child.map((a) => {
              a.ID === parentID &&
                filter != UC_TYPE_UUID &&
                children.push({ ID: a.ID, name: a.name, areaTypeID: a.areaTypeID, parentID: a.parentID })
              a.ID === parentID &&
                filter != UC_TYPE_UUID &&
                a.Child.map((a) => {
                  filter != UC_TYPE_UUID
                  children.push({ ID: a.ID, name: a.name, areaTypeID: a.areaTypeID, parentID: a.parentID })
                  a.Child.map((a) => {
                    children.push({ ID: a.ID, name: a.name, areaTypeID: a.areaTypeID, parentID: a.parentID })
                  })
                })
            })
          })
          break
        case TEHSIL_TYPE_UUID:
          res.map((area) => {
            area.ID === areaDetails.Parent.Parent.ID &&
              filter != UC_TYPE_UUID &&
              children.push({ ID: area.ID, name: area.name, areaTypeID: area.areaTypeID, parentID: area.parentID })
            area.Child.map((a) => {
              a.ID === areaDetails.Parent.ID &&
                filter != UC_TYPE_UUID &&
                children.push({ ID: a.ID, name: a.name, areaTypeID: a.areaTypeID, parentID: a.parentID })
              a.Child.map((a) => {
                a.ID === parentID &&
                  filter != UC_TYPE_UUID &&
                  children.push({ ID: a.ID, name: a.name, areaTypeID: a.areaTypeID, parentID: a.parentID })
                a.ID === parentID &&
                  filter != UC_TYPE_UUID &&
                  a.Child.map((a) => {
                    children.push({ ID: a.ID, name: a.name, areaTypeID: a.areaTypeID, parentID: a.parentID })
                  })
              })
            })
          })
          break

        case UC_TYPE_UUID:
          const uc = (
            await this.areaRepo.find({
              select: { areaTypeID: true, name: true, parentID: true, ID: true },
              where: { ID: parentID },
              relations: { Parent: { Parent: { Parent: { Parent: true } } } },
            })
          )[0]
          filter != UC_TYPE_UUID &&
            children.push({ ID: uc.ID, name: uc.name, areaTypeID: uc.areaTypeID, parentID: uc.parentID })
          children.push({
            ID: uc.Parent.ID,
            name: uc.Parent.name,
            areaTypeID: uc.Parent.areaTypeID,
            parentID: uc.Parent.parentID,
          })
          filter != UC_TYPE_UUID &&
            children.push({
              ID: uc.Parent.Parent.ID,
              name: uc.Parent.Parent.name,
              areaTypeID: uc.Parent.Parent.areaTypeID,
              parentID: uc.Parent.Parent.parentID,
            })
          filter != UC_TYPE_UUID &&
            children.push({
              ID: uc.Parent.Parent.Parent.ID,
              name: uc.Parent.Parent.Parent.name,
              areaTypeID: uc.Parent.Parent.Parent.areaTypeID,
              parentID: uc.Parent.Parent.Parent.parentID,
            })
          return children

        case null:
          res.map((area) => {
            filter != UC_TYPE_UUID &&
              children.push({ ID: area.ID, name: area.name, areaTypeID: area.areaTypeID, parentID: area.parentID })
            area.Child.map((a) => {
              filter != UC_TYPE_UUID &&
                children.push({ ID: a.ID, name: a.name, areaTypeID: a.areaTypeID, parentID: a.parentID })
              a.Child.map((a) => {
                filter != UC_TYPE_UUID &&
                  children.push({ ID: a.ID, name: a.name, areaTypeID: a.areaTypeID, parentID: a.parentID })
                a.Child.map((a) => {
                  children.push({ ID: a.ID, name: a.name, areaTypeID: a.areaTypeID, parentID: a.parentID })
                })
              })
            })
          })
          break
        default:
          break
      }
      return children
    }
    catch (err) {
      console.log(err)
      throw new APIError('DBLevelError', STATUS_CODES.BAD_REQUEST, 'Internal Error')
    }
  }

  async determineDatabaseHealth(): Promise<any> {
    try {
      const result = await this.repo.query(`
        select *
        from campaign_scope cs
        limit 1;
      `)
      return 90000
    } catch (error) {
      throwSpecificError(error)
    }
  }

  // async GetCampaignScopeIDs() {
  //   try {
  //     const distinctCampaignScopeIds = await this.repo
  //       .createQueryBuilder('chc')
  //       .select('DISTINCT chc.areaID', 'areaID')
  //       .getRawMany()
  //     const campaignScopeIds = distinctCampaignScopeIds.map((item) => item.areaID)
  //     return campaignScopeIds
  //   } catch (err) {
  //     console.log(err)
  //     throw new APIError('API Error', STATUS_CODES.INTERNAL_ERROR, 'Internal Server Error')
  //   }
  // }
}

const throwSpecificError = (err: any) => {
  console.log(err)
  if (err.code === '23502' && err.column === 'number')
    throw new APIError('DBLevelError', STATUS_CODES.NOT_ALLOWED, 'Invalid Staff Detail: Staff number is required')

  if (err.code === '22P02' && err.column === 'number')
    throw new APIError('DBLevelError', STATUS_CODES.NOT_ALLOWED, 'Invalid Staff Detail: Invalid staff number type')

  switch (err.constraint) {
    default:
      throw new APIError('DBLevelError', STATUS_CODES.INTERNAL_ERROR, 'Internal Server Error')
  }
}
