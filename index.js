const fetch = require("node-fetch");
const _ = require("lodash");

const listFollowing = async (token, id, startAt = "") => {
  try {
    const send = await fetch(
      `https://657a5yyhsb.execute-api.ap-southeast-1.amazonaws.com/production/profile/${id}/relations?q=&startAt=${startAt}&lastKey=&followers=false`,
      {
        method: "GET",
        headers: {
          accept: "application/json, text/plain, */*",
          "accept-language": "en-US,en;q=0.9",
          authorization: "Bearer " + token,
          "x-custom-app-version-tag": "6.0.2",
        },
        referrer: "https://app.republik.gg/",
      }
    );
    const res = await send.json();
    return res;
  } catch (err) {
    return err;
  }
};

const follow = async (token, id) => {
  try {
    const send = await fetch(
      `https://657a5yyhsb.execute-api.ap-southeast-1.amazonaws.com/production/profile/${id}/followers`,
      {
        headers: {
          accept: "application/json, text/plain, */*",
          "accept-language": "en-US,en;q=0.9",
          authorization: "Bearer " + token,
          "content-type": "application/json; charset=UTF-8",
          "x-custom-app-version-tag": "6.0.2",
        },
        referrer: "https://app.republik.gg/",
        body: "{}",
        method: "POST",
      }
    );
    const res = await send.json();
    return res;
  } catch (err) {
    return err;
  }
};

const main = async () => {
  const token =
    "eyJraWQiOiI5bWc0WGsrajl6OXRxVXFWb3ZSUUR5d1lLdkZcL0ZWaHVXaTUrRXI1WDFuVT0iLCJhbGciOiJSUzI1NiJ9.eyJzdWIiOiJiYjIzMDE0My1kZWI0LTRmZDktYmIwZi0xYmQyOTA4NmM2ZWQiLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwiaXNzIjoiaHR0cHM6XC9cL2NvZ25pdG8taWRwLmFwLXNvdXRoZWFzdC0xLmFtYXpvbmF3cy5jb21cL2FwLXNvdXRoZWFzdC0xX2FjRTlUNHVCayIsImNvZ25pdG86dXNlcm5hbWUiOiI5MDlhNGU3Yy00ODYyLTRmNmEtYTEzMC1kMGE4MWMzYmY3YmEiLCJvcmlnaW5fanRpIjoiYmJhOTBkYzktYWI0Ny00YzcyLTk5ZDUtN2E1ZWI0NjZjODI1IiwiYXVkIjoiM3U0ZGc1NzMyc3FyZ2dlbnUxNWI5NGpyYmkiLCJldmVudF9pZCI6Ijk3Yjk5OGFhLTQxYjktNGNhYS1iMWEzLTBhZWZlYjljMTM2ZiIsInRva2VuX3VzZSI6ImlkIiwiYXV0aF90aW1lIjoxNjk1MzY4MTQwLCJleHAiOjE2OTUzNzE3NDAsImlhdCI6MTY5NTM2ODE0MCwianRpIjoiMWQxODc4ZWYtYmQ0NS00ZTQ4LWE5ZGEtNDhlY2U2MWEwOGNiIiwiZW1haWwiOiJ3ZmFqcmlhbnN5YWhoQGdtYWlsLmNvbSJ9.EjDFnoXmQ2-SP7edl341QT70SB_IEj_9v4www86NquDDpKKmGDUVOyk56AeNlukBlO36o-BZMlR48_XV9AqziBjbhLphoxrEdaEWPXPe65WyocGb6vcJrEi5JL1hEuZ3lSNQHMMo1Qqly81WCeJHJnA25rJfG6jIirlE5WOAGm5ybI_FqoCybe8VpQVdRX0MrUL5eLVeuqtpieVvCH6zs7atZrDHHf0R9N93_IhEaD3sox3VQBVCl6Yw0Sn40M1Bb0mGuJNyXHMsy24bg8aLaCbi917sWiJXz-GR_SPXahW1tD5QDrOalVuFJ9JQuy_xySJORUVk-4wbanIFsTF0sQ";
  const userId = "50336e22-bd73-48f6-bd53-5850fa60f1c4";
  const delay = (ms) => new Promise((res) => setTimeout(res, ms));
  console.log(`Grabbing following...`);

  const listUser = [];
  let lastKey = "";

  do {
    const getFollowing = await listFollowing(token, userId, lastKey);
    if (!getFollowing.users) return console.log(getFollowing);
    if (getFollowing.users.length === 0) {
      break;
    }
    if (getFollowing.lastKey) {
      lastKey = getFollowing.lastKey;
    } else {
      break;
    }

    getFollowing.users.map((user) => {
      if (user.followStatus != "NONE") return;
      listUser.push(user);
    });
  } while (lastKey !== "");

  console.log(`Total Following : ${listUser.length}`);
  console.log(`Do follow...`);

  const following = _.chunk(listUser, 10);
  for (let i = 0; i < following.length; i++) {
    await Promise.all(
      following[i].map(async (user) => {
        const doFollow = await follow(token, user.id);
        if (doFollow.followStatus) {
          console.log(
            `[${user.id}] ${user.displayName} (@${user.username}) | Status : ${doFollow.followStatus}`
          );
        } else {
          console.log(
            `[${user.id}] ${user.displayName} (@${
              user.username
            }) | Status : ${JSON.stringify(doFollow)}`
          );
        }
      })
    );
    await delay(1500);
  }
};

main();
