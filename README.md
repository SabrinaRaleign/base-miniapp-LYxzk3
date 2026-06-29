# base-miniapp-LYxzk3

## Daily Check-in Badge

Daily Check-in Badge is a Base MiniApp that lets users check in once per day and earn on-chain badge rewards as they build a streak.

The app is designed around a simple habit loop: visit the app, check in, maintain your streak, and unlock higher badge tiers over time.

## Repository

https://github.com/SabrinaRaleign/base-miniapp-LYxzk3.git

## Overview

This project provides a daily check-in experience for Base Sepolia.

Users can check in every 24 hours.

The app tracks streak progress and awards badges at defined milestones.

Badge progression follows a tiered path from Starter to Diamond.

## Features

- Daily check-in flow
- 24-hour cooldown between check-ins
- Streak tracking
- Progressive badge tiers
- Badge levels: Starter, Bronze, Silver, Gold, and Diamond
- Milestone-based badge minting
- Base Sepolia support
- ERC-721 contract integration
- Modern Next.js application structure
- Wallet interaction through Wagmi and Viem

## Tech Stack

- Next.js 15
- Wagmi v2
- Viem v2.45+
- Base Sepolia

## Contract

- Address: `0xe17d104d62208128217b5ce10031b1b5682fcc64`
- Type: ERC-721
- Network: Base Sepolia

## Getting Started

Clone the repository:

```bash
git clone https://github.com/SabrinaRaleign/base-miniapp-LYxzk3.git
cd base-miniapp-LYxzk3
```

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

Open the app in your browser:

```text
http://localhost:3000
```

## Usage

1. Open the application.
2. Connect a supported wallet.
3. Use the check-in action when available.
4. Wait for the 24-hour cooldown before checking in again.
5. Continue checking in daily to grow your streak.
6. Unlock higher badge tiers as milestones are reached.

## Badge Progression

The badge system uses five tiers:

- Starter
- Bronze
- Silver
- Gold
- Diamond

Each tier represents continued check-in progress.

## Development Notes

This app is configured for Base Sepolia.

Make sure your connected wallet is using the correct network before interacting with the contract.
