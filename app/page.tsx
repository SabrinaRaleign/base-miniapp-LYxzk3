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
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

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
    const cooldown = 86400;
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
    if (streak >= 30) return { level: 5, name: "Diamond", color: "from-cyan-400 via-blue-500 to-purple-600", glow: "shadow-cyan-500/50" };
    if (streak >= 14) return { level: 4, name: "Gold", color: "from-yellow-400 via-orange-500 to-red-500", glow: "shadow-orange-500/50" };
    if (streak >= 7) return { level: 3, name: "Silver", color: "from-gray-300 via-gray-400 to-gray-500", glow: "shadow-gray-400/50" };
    if (streak >= 3) return { level: 2, name: "Bronze", color: "from-orange-600 via-amber-700 to-orange-800", glow: "shadow-amber-600/50" };
    if (streak >= 1) return { level: 1, name: "Starter", color: "from-green-400 via-emerald-500 to-teal-600", glow: "shadow-green-500/50" };
    return { level: 0, name: "None", color: "from-gray-600 to-gray-700", glow: "" };
  };

  const currentBadge = getBadgeLevel(userStreak);

  if (!mounted) return null;

  return (
    <main className="min-h-screen bg-black text-white relative overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-950 via-black to-purple-950">
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-0 -left-4 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl animate-blob"></div>
          <div className="absolute top-0 -right-4 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000"></div>
          <div className="absolute -bottom-8 left-20 w-96 h-96 bg-cyan-500 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-4000"></div>
        </div>
      </div>

      {/* Grid overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:64px_64px]"></div>

      <div className="relative z-10 container mx-auto px-4 py-8 min-h-screen flex flex-col items-center justify-center max-w-2xl">
        
        {/* Header */}
        <div className="text-center mb-12 space-y-4">
          <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-white/5 backdrop-blur-xl border border-white/10">
            <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></div>
            <span className="text-sm font-medium text-gray-300">Base Network</span>
          </div>
          
          <h1 className="text-6xl font-black tracking-tight">
            <span className="bg-gradient-to-r from-blue-400 via-cyan-400 to-purple-400 bg-clip-text text-transparent">
              Daily Check-in
            </span>
          </h1>
          
          <p className="text-lg text-gray-400 max-w-md mx-auto">
            Build your streak, earn exclusive NFT badges on Base
          </p>
        </div>

        {/* Main Card */}
        <div className="w-full max-w-xl">
          <div className="bg-gradient-to-b from-white/10 to-white/5 backdrop-blur-2xl rounded-3xl border border-white/20 shadow-2xl overflow-hidden">
            
            {!isConnected ? (
              <div className="p-8 space-y-6">
                <div className="text-center space-y-2">
                  <div className="text-6xl mb-4">🎯</div>
                  <h2 className="text-2xl font-bold">Connect to Start</h2>
                  <p className="text-gray-400">Choose your wallet to begin your journey</p>
                </div>

                <div className="space-y-3">
                  {connectors.map((connector) => (
                    <button
                      key={connector.uid}
                      onClick={() => connect({ connector })}
                      className="w-full group relative overflow-hidden bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-bold py-4 px-6 rounded-xl transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98]"
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000"></div>
                      <span className="relative flex items-center justify-center gap-2">
                        {connector.name === "Coinbase Wallet" && "🔵"}
                        {connector.name === "Injected" && "🦊"}
                        Connect with {connector.name}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <div className="p-8 space-y-6">
                
                {/* Wallet Badge */}
                <div className="flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/10">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center font-mono font-bold">
                      {address?.slice(0, 2)}
                    </div>
                    <div>
                      <p className="text-xs text-gray-400">Connected</p>
                      <p className="font-mono text-sm">
                        {address?.slice(0, 6)}...{address?.slice(-4)}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => disconnect()}
                    className="text-xs text-gray-400 hover:text-white transition-colors px-3 py-1.5 rounded-lg hover:bg-white/5"
                  >
                    Disconnect
                  </button>
                </div>

                {/* Streak Display */}
                <div className={`relative p-8 rounded-2xl bg-gradient-to-br ${currentBadge.color} ${currentBadge.glow} shadow-2xl`}>
                  <div className="absolute inset-0 bg-black/20 rounded-2xl"></div>
                  <div className="relative z-10 text-center space-y-4">
                    <div className="text-8xl font-black drop-shadow-2xl">
                      {userStreak}
                    </div>
                    <div className="space-y-1">
                      <p className="text-2xl font-bold">Days Streak</p>
                      <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-black/30 backdrop-blur-sm">
                        <div className="w-2 h-2 rounded-full bg-white animate-pulse"></div>
                        <span className="text-sm font-semibold">{currentBadge.name} Badge</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Check-in Action */}
                <div className="space-y-3">
                  {canCheckIn() ? (
                    <>
                      <button
                        onClick={handleCheckIn}
                        disabled={isPending || isConfirming}
                        className="w-full group relative overflow-hidden bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-400 hover:to-emerald-500 disabled:from-gray-600 disabled:to-gray-700 text-white font-bold py-6 px-6 rounded-xl transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] disabled:transform-none disabled:cursor-not-allowed shadow-lg disabled:shadow-none"
                      >
                        <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/30 to-white/0 translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000"></div>
                        <span className="relative text-xl">
                          {isPending && "⏳ Confirming..."}
                          {isConfirming && "🔄 Processing..."}
                          {!isPending && !isConfirming && "✨ Check In Now"}
                        </span>
                      </button>
                      
                      {isSuccess && (
                        <div className="p-4 rounded-xl bg-green-500/10 border border-green-500/20 backdrop-blur-sm">
                          <p className="text-center text-green-400 font-semibold flex items-center justify-center gap-2">
                            <span className="text-xl">🎉</span>
                            Check-in successful! Streak updated!
                          </p>
                        </div>
                      )}
                    </>
                  ) : (
                    <div className="p-6 rounded-xl bg-white/5 border border-white/10 text-center space-y-2">
                      <p className="text-gray-400 text-sm">Next check-in available in</p>
                      <p className="text-3xl font-black bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                        {getNextCheckInTime()}
                      </p>
                    </div>
                  )}
                </div>

                {/* Milestones */}
                <div className="p-6 rounded-2xl bg-white/5 border border-white/10 space-y-4">
                  <h3 className="font-bold text-lg">Badge Milestones</h3>
                  <div className="space-y-3">
                    {[
                      { days: 1, name: "Starter", emoji: "🌱", color: "text-green-400" },
                      { days: 3, name: "Bronze", emoji: "🥉", color: "text-orange-400" },
                      { days: 7, name: "Silver", emoji: "🥈", color: "text-gray-300" },
                      { days: 14, name: "Gold", emoji: "🏆", color: "text-yellow-400" },
                      { days: 30, name: "Diamond", emoji: "💎", color: "text-cyan-400" },
                    ].map((milestone) => (
                      <div
                        key={milestone.days}
                        className={`flex items-center justify-between p-3 rounded-xl transition-all ${
                          userStreak >= milestone.days
                            ? "bg-white/10 border border-white/20"
                            : "bg-white/5 border border-white/5 opacity-40"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-2xl">{milestone.emoji}</span>
                          <span className={`font-semibold ${userStreak >= milestone.days ? milestone.color : "text-gray-500"}`}>
                            {milestone.name}
                          </span>
                        </div>
                        <span className="text-sm font-mono text-gray-400">{milestone.days} days</span>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            )}

          </div>
        </div>

        {/* Footer */}
        <div className="mt-12 text-center space-y-2 text-sm text-gray-500">
          <p>Built on Base • CheckInBadge NFT</p>
          <p className="font-mono text-xs">{CONTRACT_ADDRESS.slice(0, 6)}...{CONTRACT_ADDRESS.slice(-4)}</p>
        </div>

      </div>
    </main>
  );
}
