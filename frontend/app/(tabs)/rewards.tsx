import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { Image, Pressable, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";

//reward struct from rewards db
type Reward = {
  reward_id: number;
  reward_name: string;
  reward_price: number;
  pts_required: number;
};

//business item struct form business item db
type EcoItem = {
  id: number;
  image: string;
  points: number;
};

//leaderbaord struc
type LeaderboardUser = {
  id: number;
  name: string;
  score: number;
  rank: number;
  pfp: string;
};

export default function RewardsScreen() {
  const [activeTab, setActiveTab] = useState("browse");
  const [redeemedItems, setRedeemedItems] = useState<number[]>([]);
  const [favorites, setFavorites] = useState<EcoItem[]>([]);
  const [previouslyClaimed, setPreviouslyClaimed] = useState<EcoItem[]>([]);
  const [userPoints, setUserPoints] = useState(0);
  const [rewards, setRewards] = useState<Reward[]>([]);
  const { userId } = useLocalSearchParams();
  const [leaderboardUsers, setLeaderboardUsers] = useState<LeaderboardUser[]>([]);

  const BASE_URL = "http://192.168.1.157:8000";

  useEffect(() => {
    const fetchData = async () => {
      try {
        //grabs user's eco pts
        const ptsRes = await fetch(`${BASE_URL}/get_user_pts.php`);
        const ptsText = await ptsRes.text();
        const ptsData = JSON.parse(ptsText);

        if (ptsData.status === "success") {
          setUserPoints(ptsData.points);
        }

        //grabs fab items
        const favRes = await fetch(`${BASE_URL}/get_b_items.php?b_id=1`);
        const favText = await favRes.text();
        const favData = JSON.parse(favText);

        if (favData.status === "success") {
          setFavorites(favData.items);
        }

        //grabs previously claimed items
        const prevRes = await fetch(`${BASE_URL}/get_b_items.php?b_id=2`);
        const prevText = await prevRes.text();
        const prevData = JSON.parse(prevText);

        if (prevData.status === "success") {
          setPreviouslyClaimed(prevData.items);
        }

        //grabs redeem rewards
        const rewardsRes = await fetch(`${BASE_URL}/get_rewards.php`);
        const rewardsText = await rewardsRes.text();
        const rewardsData = JSON.parse(rewardsText);

        if (rewardsData.status === "success") {
          setRewards(rewardsData.rewards);
        }

        //grabs leaderboard data
        const leaderboardRes = await fetch(`${BASE_URL}/get_leaderboard.php`);
        const leaderboardText = await leaderboardRes.text();
        const leaderboardData = JSON.parse(leaderboardText);

        if (leaderboardData.status === "success") {
          setLeaderboardUsers(leaderboardData.leaderboard);
        }
      } catch (error) {
        console.log("FETCH ERROR:", error);
      }
    };

    fetchData();
  }, []);

  //unable to redeem rewards due to insufficent eco pts pop up
  const redeemReward = async (reward: { reward_id: any; reward_name?: string; reward_price?: number; pts_required: any; }) => {
    if (userPoints < reward.pts_required) {
      alert("Unable to Redeem. Not Enough Eco Points.");
      return;
    }

    try {
      const response = await fetch(`${BASE_URL}/redeem_reward.php`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          user_id: 1,
          reward_id: reward.reward_id
        })
      });

      const data = await response.json();

      if (data.status === "success") {
        setUserPoints(data.new_points);
        setRedeemedItems([...redeemedItems, reward.reward_id]);
        alert("Reward redeemed successfully!");
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const sortedUsers = [...leaderboardUsers].sort((a, b) => b.score - a.score);

  const topThree = sortedUsers.slice(0, 3);

  const restUsers = sortedUsers.slice(3);

  // Helper to get local avatar asset for leaderboard users by name
  const getAvatarSource = (name: string) => {
    const avatarMap: { [key: string]: ReturnType<typeof require> } = {
      'James Smith': require('../../assets/pfp/js_pfp.jpg'),
      'Robert Williams': require('../../assets/pfp/rw_pfp.jpg'),
      'Crystal Park': require('../../assets/pfp/cp_pfp.webp'),
      'Sam Stevenson': require('../../assets/pfp/ss_pfp.webp'),
      'Jennifer Patterson': require('../../assets/pfp/jp_pfp.jpg'),
      'Chris Robinson': require('../../assets/pfp/cr_pfp.jpg'),
    };
    return avatarMap[name] ?? require('../../assets/pfp/js_pfp.jpg');
  };

  return (
    <View style={styles.container}>
      {/* header */}
      <View style={styles.header}>
        {/* logo and search setup */}
        <Image source={require('../../assets/images/ecomax_icon_dark.png')}
          style={styles.image}
        />
        <Pressable onPress={() => router.push("/search")}>
          <Ionicons name="search" size={24} color="#F5F0E6" />
        </Pressable>
      </View>

      {/* tab navigation */}
      <View style={styles.tabRow}>
        <TouchableOpacity onPress={() => setActiveTab("browse")}>
          <Text style={[styles.tabTxt, activeTab === "browse" && styles.activeTab]}>
            Browse Rewards
          </Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => setActiveTab("redeem")}>
          <Text style={[styles.tabTxt, activeTab === "redeem" && styles.activeTab]}>
            Redeem
          </Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => setActiveTab("leaderboard")}>
          <Text style={[styles.tabTxt, activeTab === "leaderboard" && styles.activeTab]}>
            Leaderboard
          </Text>
        </TouchableOpacity>
      </View>

      {/* Browse Tab */}
      <ScrollView contentContainerStyle={styles.content}>

        {activeTab === "browse" && (
          <>
            {/* Points Banner */}
            <View style={styles.pointsBar}>
              <Text style={styles.pointsTxt}>Eco Points</Text>
              <Text style={styles.pointsValue}>{userPoints}</Text>
            </View>

            {/* Favorites */}
            <Text style={styles.categoryLabel}>Favorites</Text>

            <View style={styles.cardGrid}>
              {favorites.map((item, index) => (
                <View key={index} style={styles.cardWrapper}>
                  <TouchableOpacity
                    style={styles.card}
                    onPress={() => router.push(`/eco-items/${item.id}`)}
                  >
                    <View style={styles.logoBox}>
                      <Image
                        source={{ uri: `${BASE_URL}/items/${item.image}` }}
                        style={styles.logoImage}
                        resizeMode="contain"
                      />
                    </View>

                    <View style={styles.ptsRow}>
                      <Ionicons name="leaf" size={14} color="#1c4964" />
                      <Text style={styles.ptsTxt}>{item.points}</Text>
                    </View>
                  </TouchableOpacity>
                </View>
              ))}
            </View>

            {/* Previously Claimed */}
            <Text style={styles.categoryLabel}>Previously Claimed</Text>

            <View style={styles.cardGrid}>
              {previouslyClaimed.map((item, index) => (
                <View key={index} style={styles.cardWrapper}>
                  <TouchableOpacity
                    style={styles.card}
                    onPress={() => router.push(`/eco-items/${item.id}`)}
                  >
                    <View style={styles.logoBox}>
                      <Image
                        source={{ uri: `${BASE_URL}/items/${item.image}` }}
                        style={styles.logoImage}
                        resizeMode="contain"
                      />
                    </View>

                    <View style={styles.ptsRow}>
                      <Ionicons name="leaf" size={14} color="#1c4964" />
                      <Text style={styles.ptsTxt}>{item.points}</Text>
                    </View>
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          </>
        )}

        {/* Redeem Tab */}
        {activeTab === "redeem" && (
          <>
            <View style={styles.currentPointsDisplay}>
              <Ionicons name="leaf" size={20} color="#264e36" />
              <Text style={styles.currentPointsText}>{userPoints}</Text>
            </View>

            <View style={styles.redeemList}>
              {rewards.map((reward) => (
                <View key={reward.reward_id} style={styles.redeemCard}>

                  <View style={styles.redeemIconContainer}>
                    <View style={styles.redeemIconBox}>
                      <Ionicons name="gift" size={40} color="white" />
                    </View>
                  </View>

                  <View style={styles.redeemRightContainer}>

                    <View style={styles.redeemDetailsBox}>
                      <Text style={styles.redeemName}>{reward.reward_name}</Text>
                      <View style={styles.redeemPointsPriceRow}>
                        <View style={styles.redeemPointsRow}>
                          <Ionicons name="leaf" size={14} color="#F5F0E6" />
                          <Text style={styles.redeemPoints}>{reward.pts_required}</Text>
                        </View>

                        <View style={styles.priceTag}>
                          <Text style={styles.priceText}>${reward.reward_price}</Text>
                        </View>
                      </View>
                    </View>

                    <TouchableOpacity
                      style={[
                        styles.redeemButton,
                        redeemedItems.includes(reward.reward_id) && { backgroundColor: "#999" }
                      ]}
                      disabled={redeemedItems.includes(reward.reward_id)}
                      onPress={() => redeemReward(reward)}
                    >
                      <Text style={styles.redeemButtonText}>
                        {redeemedItems.includes(reward.reward_id) ? "REDEEMED" : "REDEEM"}
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              ))}
            </View>
          </>
        )}

        {/* leaderboard tab */}
        {activeTab === "leaderboard" && (
          <View>

            {/* top 3 */}
            <View style={styles.topRankingContainer}>
              {topThree.map((user, index) => {
                const isSecond = index === 0;
                const isFirst = index === 1;
                const isThird = index === 2;

                return (
                  <View key={user.id} style={styles.rankCardWrapper}>

                    {/* profile */}
                    <Image
                      source={getAvatarSource(user.name)}
                      style={[
                        styles.rankAvatar,
                        index === 1 && { width: 70, height: 70, borderRadius: 35 }
                      ]}
                    />

                    <Text style={styles.rankName}>{user.name}</Text>

                    <View style={styles.rankScoreBadge}>
                      <Ionicons name="leaf" size={14} color="#F5F0E6" />
                      <Text style={styles.rankScoreText}>{user.score}</Text>
                    </View>

                    {/* podium */}
                    <View
                      style={[
                        styles.podium,
                        isFirst && styles.firstPodium,
                        isSecond && styles.secondPodium,
                        isThird && styles.thirdPodium,
                      ]}
                    />
                  </View>
                );
              })}
            </View>

            {/* rest of leaderboard */}
            <View style={styles.restRankingList}>
              {restUsers.map((user) => (
                <View key={user.id} style={styles.listRankCard}>

                  <View style={styles.listRankNumber}>
                    <Text style={styles.listRankNumberText}>{user.rank}</Text>
                  </View>

                  <View style={styles.listUserProfile}>
                    <Image
                      source={getAvatarSource(user.name)}
                      style={styles.listAvatar}
                    />
                  </View>

                  <View style={styles.listUserInfo}>
                    <Text style={styles.listUserName}>{user.name}</Text>
                  </View>

                  <View style={styles.listUserScore}>
                    <Ionicons name="leaf" size={12} color="#264e36" />
                    <Text style={styles.listScoreText}>{user.score}</Text>
                  </View>
                </View>
              ))}
            </View>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  //body
  container: {
    flex: 1,
    backgroundColor: "#f5f0e6",
  },

  //header
  header: {
    backgroundColor: "#264e36",
    paddingTop: 70,
    paddingBottom: 20,
    paddingLeft: 25,
    paddingRight: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  headerIcon: {
    fontSize: 28,
  },

  searchIcon: {
    padding: 8,
  },

  image: {
    height: 49,
    width: 37,
  },

  //tabs
  tabRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: 12,
    backgroundColor: "#F5F0E6",
  },

  tabTxt: {
    fontSize: 15,
    color: "#264e36",
    fontFamily: 'Quicksand_400Regular',
  },

  activeTab: {
    fontFamily: 'Quicksand_700Bold',
    borderBottomWidth: 2,
    borderBottomColor: "#264e36",
    paddingBottom: 4,
  },

  //content
  content: {
    padding: 16,
  },

  pointsBar: {
    backgroundColor: "#5ca377",
    borderRadius: 10,
    padding: 40,
    marginBottom: 16,
  },

  pointsTxt: {
    color: "#F5F0E6",
    fontSize: 17,
    textAlign: "center",
    fontFamily: 'Quicksand_700Bold',
  },

  pointsValue: {
    color: "#F5F0E6",
    fontSize: 38,
    fontFamily: 'Quicksand_700Bold',
    textAlign: "center",
  },

  //card group labels
  categoryLabel: {
    backgroundColor: "#A47148",
    color: "#F5F0E6",
    alignSelf: "flex-start",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
    marginBottom: 12,
    fontSize: 17,
    fontFamily: 'Quicksand_700Bold',
  },

  //card grid
  cardGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginBottom: 24,
  },

  cardWrapper: {
    width: "31%",
    marginBottom: 16,
  },

  //eco business
  card: {
    backgroundColor: "#264e36",
    borderRadius: 10,
    padding: 8,
  },

  logoBox: {
    height: 60,
    backgroundColor: "#F5F0E6",
    borderRadius: 6,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },

  logoImage: {
    width: "90%",
    height: "90%"
  },

  ptsRow: {
    backgroundColor: "#F5F0E6",
    borderRadius: 6,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 4,
  },

  ptsTxt: {
    color: "#1c4964",
    fontSize: 14,
    fontFamily: 'Quicksand_700Bold',
  },

  //redeem tab
  currentPointsDisplay: {
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
    marginBottom: 20,
    paddingRight: 4,
  },

  currentPointsText: {
    fontSize: 25,
    marginLeft: 6,
    fontFamily: 'Quicksand_700Bold',
    color: "#264e36",
  },

  redeemList: {
    gap: 16,
  },

  redeemCard: {
    backgroundColor: "#5ca377",
    borderRadius: 12,
    overflow: "hidden",
    paddingVertical: 16,
    paddingHorizontal: 16,
    flexDirection: "row",
    gap: 12,
    position: "relative",
  },

  redeemIconContainer: {
    justifyContent: "center",
    alignItems: "center",
  },

  redeemIconBox: {
    width: 80,
    height: 80,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#264E36",
  },

  redeemRightContainer: {
    flex: 1,
    justifyContent: "space-between",
  },

  redeemDetailsBox: {
    backgroundColor: "#264e36",
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 12,
    flex: 1,
  },

  redeemName: {
    color: "#F5F0E6",
    fontFamily: "Quicksand_700Bold",
  },

  redeemNameSection: {
    flex: 1,
  },

  redeemPointsPriceRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  redeemPointsRow: {
    flexDirection: "row",
    alignItems: "center",
  },

  redeemPoints: {
    fontSize: 17,
    marginLeft: 4,
    fontFamily: 'Quicksand_700Bold',
    color: "#f5f0e6",
  },

  priceTag: {
    backgroundColor: "#f5f0e6",
    borderRadius: 12,
    paddingVertical: 6,
    paddingHorizontal: 12,
  },

  priceText: {
    fontSize: 13,
    fontFamily: 'Quicksand_700Bold',
    color: "#264e36",
  },

  redeemButton: {
    backgroundColor: "#264e36",
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 8,
  },

  redeemButtonText: {
    color: "#f5f0e6",
    fontSize: 12,
    fontFamily: 'Quicksand_700Bold',
    letterSpacing: 0.5,
  },

  // Leaderboard Styles
  topRankingContainer: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    alignItems: "flex-end",
    marginTop: 40,
    marginBottom: 20,
    height: 220,
  },

  rankCardWrapper: {
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-end",
  },

  rankCard1: {
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },


  rankProfileArea: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: "#ffffff",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
    borderWidth: 2,
    borderColor: "#264e36",
  },

  rankName: {
    fontSize: 11,
    fontFamily: 'Quicksand_700Bold',
    color: "#264e36",
    textAlign: "center",
    marginBottom: 4,
  },

  rankScoreBadge: {
    backgroundColor: "#5ca377",
    borderRadius: 18,
    paddingVertical: 4,
    paddingHorizontal: 12,
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },

  rankScoreText: {
    fontSize: 15,
    fontFamily: 'Quicksand_700Bold',
    color: "#f5f0e6",
  },

  // Rest of Ranking List (4-6)
  restRankingList: {
    gap: 12,
    marginTop: 12,
  },

  listRankCard: {
    backgroundColor: "#5ca377",
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },

  listRankNumber: {
    width: 44,
    height: 44,
    borderRadius: 8,
    backgroundColor: "#264e36",
    justifyContent: "center",
    alignItems: "center",
  },

  listRankNumberText: {
    fontSize: 17,
    fontFamily: 'Poppins_700Bold',
    color: "#f5f0e6",
  },

  listUserProfile: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#ffffff",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#264e36",
  },

  listProfileImage: {
    fontSize: 24,
  },

  listUserInfo: {
    flex: 1,
  },

  listUserName: {
    fontSize: 17,
    fontFamily: 'Quicksand_700Bold',
    color: "#f5f0e6",
  },

  listUserScore: {
    backgroundColor: "#ffffff",
    borderRadius: 8,
    paddingVertical: 6,
    paddingHorizontal: 12,
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },

  listScoreText: {
    fontSize: 12,
    fontFamily: 'Poppins_400Regular',
    color: "#264e36",
  },

  podium: {
    width: 70,
    borderRadius: 10,
    marginTop: 10,
  },

  firstPodium: {
    height: 120,
    backgroundColor: "#C4A484",
  },

  secondPodium: {
    height: 90,
    backgroundColor: "#9FB89F",
  },

  thirdPodium: {
    height: 70,
    backgroundColor: "#7E939C",
  },

  //pfp
  rankAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30
  },

  listAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18
  },
});