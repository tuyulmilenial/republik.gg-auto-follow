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
  const token = "";
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
