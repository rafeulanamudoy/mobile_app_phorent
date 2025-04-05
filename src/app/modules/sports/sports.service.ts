const getSportsList = async () => {
  const result =  fetch(
    "https://www.thesportsdb.com/api/v2/json/all/sports",
    {
      headers: {
        "Content-Type": "application/json",
        "x-api-key": "472735",
      },
    }
  )
  .then((response) => response.json())
  .then((data) =>
    data.all?.map((sport: any) => ({
      idSport: sport.idSport,
      strSport: sport.strSport,
      strSportThumb: sport.strSportThumb,
    }))
  );


return result;
};

const getTeamListUnderSport= async () => {
    const result = await fetch(
      "https://www.thesportsdb.com/api/v1/json/3/search_all_teams.php?s=Soccer&c=Spain",
      {
        headers: {
          "Content-Type": "application/json",
          "x-api-key": "472735",
        },
      }
    )
      .then((response) => response.json())
      .then((data ) => data.teams);
  
   
    return result;
  };
export const sportService = {
  getSportsList,
  getTeamListUnderSport
};

