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

const getTeamListUnderSport= async (uuid:string) => {
 const userData=await getUserDataByUuid(uuid)
 console.log(userData)
  
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
  const getLiveScore=async (uuid:string) => {
    const userData=await getUserDataByUuid(uuid)
    const result = await fetch(
      "https://www.thesportsdb.com/api/v2/json/livescore/all",
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


const getUserDataByUuid = async (uuid:string) => {
  const userRef = db.collection('user').doc(uuid); // Assuming 'users' is the collection and 'uuid' is the document ID.
  const doc = await userRef.get();

  if (!doc.exists) {
    console.log('No such document!');
    return null;
  } else {
    console.log('Document data:', doc.data());
    return doc.data();
  }
};
export const sportService = {
  getSportsList,
  getTeamListUnderSport,
  getLiveScore
};

