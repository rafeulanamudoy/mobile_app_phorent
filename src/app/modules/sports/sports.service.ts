import admin from "../../../helpers/firebaseAdmin";

const db = admin.firestore();
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

// const getTeamListUnderSport= async (uuid:string) => {
//  const userData=await getUserDataByUuid(uuid)
//  console.log(userData)
  
//     const result = await fetch(
//       "https://www.thesportsdb.com/api/v1/json/3/search_all_teams.php?s=Soccer&c=Spain",
//       {
//         headers: {
//           "Content-Type": "application/json",
//           "x-api-key": "472735",
//         },
//       }
//     )
//       .then((response) => response.json())
//       .then((data ) => data.teams);
  
   
//     return result;
//   };
  const getTeamListUnderSport= async (uuid:string) => {
    const userData=await getUserDataByUuid(uuid)
    // console.log(userData)
     
       const result = await fetch(
         "https://www.thesportsdb.com/https://www.thesportsdb.com/api/v2/json/livescore/all",
         {
           headers: {
             "Content-Type": "application/json",
             "x-api-key": "472735",
           },
         }
       )
         .then((response) => response.json())
         .then((data ) => data);
     
      
       return result;
     };
  // const getLiveScore = async (uuid: string) => {
  //   const userData:any = await getUserDataByUuid(uuid);
  //   // console.log(userData, "check user data");
  
  //   const result = await fetch(
  //     "https://www.thesportsdb.com/api/v2/json/livescore/all",
  //     {
  //       headers: {
  //         "Content-Type": "application/json",
  //         "x-api-key": "472735",
  //       },
  //     }
  //   )
  //     .then((response) => response.json())
  //     .then((data) => {
  //       const teams = data.livescore;
    
  //        if(teams && Array.isArray(teams)){
  //         return teams.filter((team: any) => 
  //           userData.selectedTeam.some((selected: any) => 
  //             selected.id === team.idHomeTeam || selected.id ===  team.idHomeTeam
  //           )
  //         );
          
  //        }
  //        else{
  //         return []
  //        }
       
        
  //     });

  //   return result;
  // };
  
  
    const getLiveScore = async (uuid: string) => {
      const userData: any = await getUserDataByUuid(uuid);
      const selectedTeamIds = userData?.selectedTeam?.map((team: any) => team.id) || [];
    
      const response = await fetch("https://www.thesportsdb.com/api/v2/json/livescore/all", {
        headers: {
          "Content-Type": "application/json",
          "x-api-key": "472735",
        },
      });

   


    
      const data = await response.json();
      const allMatches = data?.livescore || [];
    

      const isLiveMatch = (match: any) => {
        const status = (match.strStatus || "").toLowerCase();
        const progress = (match.strProgress || "").toLowerCase();
    
        return status === "live" ||
          progress.includes("quarter") ||
          progress.includes("half") ||
          progress.includes("period") ||
          progress.includes("in progress");
      };
    
    
      const filteredMatches = allMatches.filter((match: any) =>
        isLiveMatch(match) &&
        (selectedTeamIds.includes(match.idHomeTeam) || selectedTeamIds.includes(match.idAwayTeam))
      );
    
      return filteredMatches;
    };
    

const getUserDataByUuid = async (uuid:string) => {
  const userRef = db.collection('user').doc(uuid); 
  const doc = await userRef.get();

  if (!doc.exists) {
    console.log('No such document!');
    return null;
  } else {
    // console.log('Document data:', doc.data());
    return doc.data();
  }
};
export const sportService = {
  getSportsList,
  getTeamListUnderSport,
  getLiveScore
};

