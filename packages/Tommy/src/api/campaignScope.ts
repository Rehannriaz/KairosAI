import { Router } from 'express'
import { throwError, updateApiResultWithError } from '@erase/common/utils/appErrors'
import { CampaignScopeService } from '../../../../../Erase/Erase/packages/mr_burns/src/services/campaignScope'

export const campaignScopeRouter = Router()
const campaignScopeService = new CampaignScopeService()

// Get campaign scope
campaignScopeRouter.get('/', async (req, res, next) => {
	try {
		const { campaignID } = req.query
		const result = await campaignScopeService.GetCampaignScope(campaignID.toString())
		res.send(result)
	} catch (error) {
		updateApiResultWithError(res, error)
		next()
	}
})

