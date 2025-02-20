"use server";

import { AUTH, PVP } from "vallib";

export type PlayerData = {
  gameName: string;
  tagLine: string;
  stats: {
    level?: number;
    playerCard?: string;
    tier: number;
    mmr: number;
  };
};

export async function fetchPlayerData(_: any, form: FormData) {
  const ssidCookie = form.get("ssid-cookie") as string;
  const username = form.get("username") as string;
  const [gameName, tagLine] = username.split("#");

  try {
    const cookies = [`ssid=${ssidCookie};clid=uw1`];
    const authTokens = await AUTH.COOKIE_REAUTH({ cookies });
    const authToken = authTokens.data.access_token;

    const entitlement = await AUTH.ENTITLEMENT({ authToken });
    const entitlementsToken = entitlement.data.entitlements_token;

    const accountAlias = await AUTH.ACCOUNT_ALIAS({
      authToken,
      gameName,
      tagLine,
    });
    const puuid =
      "puuid" in accountAlias.data[0] ? accountAlias.data[0].puuid : "";

    const data: PlayerData = {
      gameName,
      tagLine,
      stats: {
        tier: 0,
        mmr: 0,
      },
    } satisfies PlayerData;

    const playerMMR = await PVP.PLAYER_MMR({
      puuid,
      entitlementsToken,
      authToken,
      shard: "eu",
    });

    data.stats.tier = playerMMR.data.LatestCompetitiveUpdate.TierAfterUpdate;
    data.stats.mmr =
      playerMMR.data.LatestCompetitiveUpdate.RankedRatingAfterUpdate;

    const matchDetails = await PVP.MATCH_DETAILS({
      matchId: playerMMR.data.LatestCompetitiveUpdate.MatchID,
      entitlementsToken,
      authToken,
      shard: "eu",
    });

    const player = matchDetails.data.players.find((p) => p.subject === puuid);

    data.stats.level = player?.accountLevel;
    data.stats.playerCard = player?.playerCard;

    return { data };
  } catch (error) {
    if (error instanceof Error) return { error: error.message };
  }

  return { error: "Could not fetch player data" };
}
