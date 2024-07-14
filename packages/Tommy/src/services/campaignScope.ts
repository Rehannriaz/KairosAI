// All Business logic will be here

import { CampaignScope } from "@erase/common/entity"
import { APIError, STATUS_CODES } from "@erase/common/utils/appErrors"
import { CampaignScopeRepository } from '../repository/campaignScope'
import moment from "moment"




export class CampaignScopeService {
  private campaignScopeRepository: CampaignScopeRepository

  constructor() {
    this.campaignScopeRepository = new CampaignScopeRepository()
  }

  //#######################################################################
  async GetCampaignScope(campaignID?: string) {
    return await this.campaignScopeRepository.GetCampaignScopeArea(parseInt(campaignID))
  }

  async GetCampaignScopeByID(campaignScopeID?: string): Promise<CampaignScope> {
    if (!campaignScopeID) {
      throw new APIError('ServiceLevelError', STATUS_CODES.BAD_REQUEST, 'CampaignScope: areaID is required')
    }

    const campaignScope = await this.campaignScopeRepository.GetCampaignScope(undefined, campaignScopeID)

    if (!campaignScope)
      throw new APIError(
        'ServiceLevelError',
        STATUS_CODES.BAD_REQUEST,
        'CampaignScope: Cannot Find Campaign Scope of Selected Area'
      )

    return campaignScope
  }

  async GetCampaignScopeDateRangeByCampaignID(campaignID: number, areaIDs?: string[], getDatesBetween: boolean = false): Promise<string[]> {

    const campaignScope = await this.campaignScopeRepository.GetScopeDateRange(campaignID, areaIDs)

    if (!campaignScope || !campaignScope.length)
      throw new APIError(
        'ServiceLevelError',
        STATUS_CODES.BAD_REQUEST,
        'CampaignScope: Cannot Find Campaign Scope of Selected Campaign'
      )

    let dateRange = [campaignScope[0].campaignStartDate, campaignScope[0].catchupEndDate]
    campaignScope.forEach((scope) => {
      if (scope.campaignStartDate < dateRange[0]) dateRange[0] = scope.campaignStartDate
      if (scope.catchupEndDate > dateRange[1]) dateRange[1] = scope.catchupEndDate
    })

    if (getDatesBetween) {
      for (let start = moment(dateRange[0]).add(1, 'day').toDate(); start < dateRange[1]; start = moment(start).add(1, 'day').toDate()) {
        dateRange.push(start)
      }
    }

    // mapped to string array
    return dateRange.map(date => moment(date).format('YYYY-MM-DD'))
  }

}

