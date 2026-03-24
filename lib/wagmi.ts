import { createConfig, http } from "wagmi";
import { base } from "wagmi/chains";
import { coinbaseWallet, injected } from "wagmi/connectors";

// TODO: 验证完 meta 标签后，将此处替换为实际的 BUILDER_CODE
// import { Attribution } from "@ox-org/ox/erc8021";
// const DATA_SUFFIX = Attribution.toDataSuffix({
//   codes: ["bc_XXXXXX"],  // 替换为实际的 Builder Code
// });

export const config = createConfig({
  chains: [base],
  connectors: [
    coinbaseWallet({
      appName: "Daily Check-in Badge",
      preference: "smartWalletOnly",
    }),
    injected(),
  ],
  transports: {
    [base.id]: http(),
  },
  // dataSuffix: DATA_SUFFIX,  // 有 BUILDER_CODE 后取消注释
});
