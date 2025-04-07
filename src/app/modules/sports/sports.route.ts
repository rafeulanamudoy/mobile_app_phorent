import express from "express";

import { sportController } from "./sports.controller";

const router = express.Router();

router.get(
  "/get-sports-list",

  sportController.getSportsList
);

router.get("/get-team-list",sportController.getTeamListUnderSport)

router.get("/live-score",sportController.getLiveScore)
export const sportsRoute = router;
