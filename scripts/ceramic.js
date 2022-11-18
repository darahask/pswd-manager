import { CeramicClient } from "@ceramicnetwork/http-client";
import { DID } from "dids";
import { getResolver as getKeyResolver } from "key-did-resolver";
import { getResolver as get3IDResolver } from "@ceramicnetwork/3id-did-resolver";
import { EthereumAuthProvider, ThreeIdConnect } from "@3id/connect";
import { TileDocument } from "@ceramicnetwork/stream-tile";
import { CERAMIC_URL } from "../constants";

const ceramic = new CeramicClient(CERAMIC_URL);

async function authenticateWithEthereum(ethereumProvider, address) {
  if(!address) return;
  const threeID = new ThreeIdConnect();
  const authProvider = new EthereumAuthProvider(ethereumProvider, address);
  await threeID.connect(authProvider);

  const did = new DID({
    provider: threeID.getDidProvider(),
    resolver: {
      ...get3IDResolver(ceramic),
      ...getKeyResolver(),
    },
  });
  await did.authenticate();
  ceramic.did = did;
}

async function authenticateCeramic(address) {
  if (window.ethereum == null) {
    throw new Error("No injected Ethereum provider");
  }
  await authenticateWithEthereum(window.ethereum, address);
}

async function loadDocument(id) {
  return await TileDocument.load(ceramic, id);
}

async function createDocument(content) {
  console.log(ceramic.did);
  const doc = await TileDocument.create(ceramic, content, {
    family: "password-manager",
    controllers: [ceramic.did.id],
  });
  return doc.id;
}

async function updateDocument(id, content) {
  const doc = await TileDocument.load(ceramic, id);
  await doc.update(content);
}

export { loadDocument, authenticateCeramic, createDocument, updateDocument };
