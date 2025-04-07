import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import { sportService } from "./sports.service";

const getSportsList=catchAsync(async(req,res)=>{

    const result=await sportService.getSportsList()
    sendResponse(res, {
        success: true,
        statusCode: 201,
        message: "sports  list get successfully",
        data: result,
      });
})
const getTeamListUnderSport=catchAsync(async(req,res)=>{

    const result=await sportService.getTeamListUnderSport(req.query.uuid as string)
    sendResponse(res, {
        success: true,
        statusCode: 201,
        message: "getTeamListUnderSport  get successfully",
        data: result,
      });
})
const getLiveScore=catchAsync(async(req,res)=>{
    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");

    const userId=req.query.uuid
    const result=await sportService.getLiveScore(userId as string)
    sendResponse(res, {
        success: true,
        statusCode: 201,
        message: "getTeamListUnderSport  get successfully",
        data: result,
      });
})
export const sportController={
    getSportsList,
    getTeamListUnderSport,
    getLiveScore
}