

export interface KOLInfo {
  name: string;
  twitter?: string;
  image?: string; // Path to profile image in /public/kols/
}

export const KNOWN_KOLS: Record<string, KOLInfo> = {
  "CyaE1VxvBrahnPWkqm5VsdCvyS2QmNht2UFrKJHga54o": {
    name: "Cented",
    twitter: "https://x.com/Cented7",
    image: "/kols/cented.jpg",
  },
  "4BdKaxN8G6ka4GYtQQWk4G4dZRUTX2vQH9GcXdBREFUk": {
    name: "Jijo",
    twitter: "https://x.com/jijo_exe",
    image: "/kols/jijo.jpg",
  },
  "3kebnKw7cPdSkLRfiMEALyZJGZ4wdiSRvmoN4rD1yPzV": {
    name: "Bastille",
    twitter: "https://x.com/BastilleBtc",
    image: "/kols/Bastille.jpg",
  },
  "2fg5QD1eD7rzNNCsvnhmXFm5hqNgwTTG8p7kQ6f3rx6f": {
    name: "Cupsey",
    twitter: "https://x.com/Cupseyy",
    image: "/kols/Cupsey.jpg",
  },
  "Bi4rd5FH5bYEN8scZ7wevxNZyNmKHdaBcvewdPFxYdLt": {
    name: "Theo",
    twitter: "https://x.com/theonomix",
    image: "/kols/Theo.jpg",
  },
  "Ez2jp3rwXUbaTx7XwiHGaWVgTPFdzJoSg8TopqbxfaJN": {
    name: "Keano",
    twitter: "https://x.com/nftkeano",
    image: "/kols/Keano.jpg",
  },
  "Be24Gbf5KisDk1LcWWZsBn8dvB816By7YzYF5zWZnRR6": {
    name: "Chairman",
    twitter: "https://x.com/Chairman_DN",
    image: "/kols/Chairman.jpg",
  },
  "GNrmKZCxYyNiSUsjduwwPJzhed3LATjciiKVuSGrsHEC": {
    name: "Giann",
    twitter: "https://x.com/Giann2K",
    image: "/kols/Giann.jpg",
  },
  "57rXqaQsvgyBKwebP2StfqQeCBjBS4jsrZFJN5aU2V9b": {
    name: "ram",
    twitter: "https://x.com/0xRamonos",
    image: "/kols/ram.png",
  },
  "5dzH7gh5FjtrxUwtfBufJyTBA4fyCUGheZsdYQsE9vag": {
    name: "Hermes",
    twitter: "https://x.com/coinsolmaxi",
    image: "/kols/Hermes.jpg",
  },
  "DYAn4XpAkN5mhiXkRB7dGq4Jadnx6XYgu8L5b3WGhbrt": {
    name: "The Doc",
    twitter: "https://x.com/KayTheDoc",
    image: "/kols/Doc.jpg",
  },
  "8oQoMhfBQnRspn7QtNAq2aPThRE4q94kLSTwaaFQvRgs": {
    name: "big bags Bobby",
    twitter: "https://x.com/bigbagsbobby",
    image: "/kols/bobby.jpg",
  },
  "3BLjRcxWGtR7WRshJ3hL25U3RjWr5Ud98wMcczQqk4Ei": {
    name: "Sebastian",
    twitter: "https://x.com/Saint_pablo123",
    image: "/kols/Sebastian.jpg",
  },
  "4ZdCpHJrSn4E9GmfP8jjfsAExHGja2TEn4JmXfEeNtyT": {
    name: "Robo",
    twitter: "https://x.com/roboPBOC",
    image: "/kols/Robo.jpg",
  },
  "JDd3hy3gQn2V982mi1zqhNqUw1GfV2UL6g76STojCJPN": {
    name: "West",
    twitter: "https://x.com/ratwizardx",
    image: "/kols/West.jpg",
  },
  "GJA1HEbxGnqBhBifH9uQauzXSB53to5rhDrzmKxhSU65": {
    name: "Latuche",
    twitter: "https://x.com/Latuche95",
    image: "/kols/Latuche.jpg",
  },
  "DNfuF1L62WWyW3pNakVkyGGFzVVhj4Yr52jSmdTyeBHm": {
    name: "Gake",
    twitter: "https://x.com/Ga__ke",
    image: "/kols/Gake.jpg",
  },
};

/** Get KOL info by wallet address */
export function getKOLInfo(address: string): KOLInfo | undefined {
  return KNOWN_KOLS[address];
}

/** Get all KOL wallet addresses */
export function getAllKOLAddresses(): string[] {
  return Object.keys(KNOWN_KOLS);
}

