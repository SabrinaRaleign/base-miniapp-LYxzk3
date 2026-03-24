"use client";

import { useAccount, useConnect, useDisconnect, useReadContract, useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { CONTRACT_ADDRESS, CONTRACT_ABI } from "@/lib/contract";
import { useEffect, useState } from "react";

export default function Home() {
  const { address, isConnected } = useAccount();
  const { connect, connectors } = useConnect();
  const { disconnect } = useDisconnect();
  const { writeContract, data: hash, isPending } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash });

  const [userStreak, setUserStreak] = useState<number>(0);
  const [lastCheckIn, setLastCheckIn] = useState<number>(0);

  // 读取用户数据
  const { data: userData, refetch } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: CONTRACT_ABI,
    functionName: "getUser",
    args: address ? [address] : undefined,
  });

  useEffect(() => {
    if (userData) {
      setLastCheckIn(Number(userData[0]));
      setUserStreak(Number(userData[1]));
    }
  }, [userData]);

  useEffect(() => {
    if (isSuccess) {
      refetch();
    }
  }, [isSuccess, refetch]);

  const handleCheckIn = async () => {
    writeContract({
      address: CONTRACT_ADDRESS,
      abi: CONTRACT_ABI,
      functionName: "checkIn",
    });
  };

  const canCheckIn = () => {
    if (!lastCheckIn) return true;
    const now = Math.floor(Date.now() / 1000);
    const cooldown = 86400; // 1 day
    return now >= lastCheckIn + cooldown;
  };

  const getNextCheckInTime = () => {
    if (!lastCheckIn) return null;
    const cooldown = 86400;
    const nextTime = lastCheckIn + cooldown;
    const now = Math.floor(Date.now() / 1000);
    if (now >= nextTime) return null;
    
    const remaining = nextTime - now;
    const hours = Math.floor(remaining / 3600);
    const minutes = Math.floor((remaining % 3600) / 60);
    return `${hours}h ${minutes}m`;
  };

  const getBadgeLevel = (streak: number) => {
    if (streak >= 30) return { level: 5, name: "Diamond", emoji: "💎" };
    if (streak >= 14) return { level: 4, name: "Gold", emoji: "🏆" };
    if (streak >= 7) return { level: 3, name: "Silver", emoji: "🥈" };
    if (streak >= 3) return { level: 2, name: "Bronze", emoji: "🥉" };
    if (streak >= 1) return { level: 1, name: "Starter", emoji: "⭐" };
    return { level: 0, name: "None", emoji: "❓" };
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-2xl p-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            📅 Daily Check-in
          </h1>
          <p className="text-gray-600">
            Build your streak, earn NFT badges!
          </p>
        </div>

        {!isConnected ? (
          <div className="space-y-3">
            <p className="text-center text-gray-600 mb-4">
              Connect your wallet to start checking in
            </p>
            {connectors.map((connector) => (
              <button
                key={connector.uid}
                onClick={() => connect({ connector })}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition duration-200 transform hover:scale-105"
              >
                Connect with {connector.name}
              </button>
            ))}
          </div>
        ) : (
          <div className="space-y-6">
            {/* User Info */}
            <div className="bg-gradient-to-r from-purple-100 to-pink-100 rounded-lg p-4">
              <p className="text-sm text-gray-600 mb-1">Connected</p>
              <p className="text-xs font-mono text-gray-800 break-all">
                {address}
              </p>
            </div>

            {/* Streak Display */}
            <div className="text-center bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl p-6">
              <div className="text-6xl mb-3">
                {getBadgeLevel(userStreak).emoji}
              </div>
              <div className="text-3xl font-bold text-gray-800 mb-1">
                {userStreak} Days
              </div>
              <div className="text-sm text-gray-600">
                Current Streak - {getBadgeLevel(userStreak).name} Badge
              </div>
            </div>

            {/* Check-in Button */}
            <div className="space-y-3">
              {canCheckIn() ? (
                <button
                  onClick={handleCheckIn}
                  disabled={isPending || isConfirming}
                  className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white font-bold py-4 px-6 rounded-lg transition duration-200 transform hover:scale-105 disabled:transform-none text-lg"
                >
                  {isPending && "Waiting for approval..."}
                  {isConfirming && "Confirming..."}
                  {!isPending && !isConfirming && "✅ Check In Now"}
                </button>
              ) : (
                <div className="text-center p-4 bg-gray-100 rounded-lg">
                  <p className="text-gray-600 font-semibold">
                    Next check-in available in:
                  </p>
                  <p className="text-2xl font-bold text-gray-800 mt-2">
                    {getNextCheckInTime()}
                  </p>
                </div>
              )}

              {isSuccess && (
                <div className="text-center p-4 bg-green-100 border-2 border-green-500 rounded-lg">
                  <p className="text-green-800 font-semibold">
                    ✨ Check-in successful! Streak updated!
                  </p>
                </div>
              )}
            </div>

            {/* Badge Progress */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="font-semibold text-gray-800 mb-3">Badge Milestones</h3>
              <div className="space-y-2 text-sm">
                <div className={`flex justify-between ${userStreak >= 1 ? 'text-green-600 font-semibold' : 'text-gray-400'}`}>
                  <span>⭐ Starter</span>
                  <span>1 day</span>
                </div>
                <div className={`flex justify-between ${userStreak >= 3 ? 'text-green-600 font-semibold' : 'text-gray-400'}`}>
                  <span>🥉 Bronze</span>
                  <span>3 days</span>
                </div>
                <div className={`flex justify-between ${userStreak >= 7 ? 'text-green-600 font-semibold' : 'text-gray-400'}`}>
                  <span>🥈 Silver</span>
                  <span>7 days</span>
                </div>
                <div className={`flex justify-between ${userStreak >= 14 ? 'text-green-600 font-semibold' : 'text-gray-400'}`}>
                  <span>🏆 Gold</span>
                  <span>14 days</span>
                </div>
                <div className={`flex justify-between ${userStreak >= 30 ? 'text-green-600 font-semibold' : 'text-gray-400'}`}>
                  <span>💎 Diamond</span>
                  <span>30 days</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => disconnect()}
              className="w-full bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-lg transition duration-200"
            >
              Disconnect
            </button>
          </div>
        )}

        <div className="mt-8 text-center text-xs text-gray-500">
          <p>Built on Base • CheckInBadge NFT</p>
          <p className="mt-1 font-mono text-[10px] break-all">{CONTRACT_ADDRESS}</p>
        </div>
      </div>
    </main>
  );
}
