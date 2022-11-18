import { base64StringToBlob, blobToBase64String } from "lit-js-sdk";
import { DOC_ID_KEY, PSWD_CONTRACT_ADDRESS, CHAIN } from "../constants";
import {
  createDocument,
  loadDocument,
  updateDocument
} from "./ceramic";
import client from "./lit";
import { getStoredDocID } from "./storage";

function getAccessControlConditions(tokenId) {
  return [
    {
      contractAddress: PSWD_CONTRACT_ADDRESS,
      standardContractType: "ERC721",
      chain: CHAIN,
      method: "ownerOf",
      parameters: [tokenId],
      returnValueTest: {
        comparator: "=",
        value: ":userAddress",
      },
    },
  ];
}

async function loadData(address) {
  let docId = getStoredDocID(address)
  if (!docId) return;
  let doc = await loadDocument(docId);
  const decryptedDoc = await client.decryptString(
    base64StringToBlob(doc.content.encryptedFile),
    doc.content.encryptedSymmetricKey,
    doc.content.conditions
  );
  return JSON.parse(decryptedDoc);
}

async function updateData(content, conditions, address) {
  let docId = getStoredDocID(address);
  let str = JSON.stringify(content);
  const { encryptedFile, encryptedSymmetricKey } = await client.encryptString(
    str,
    conditions
  );
  await updateDocument(docId, {
    encryptedFile: await blobToBase64String(encryptedFile),
    encryptedSymmetricKey,
    conditions,
  });
}

async function createData(content, conditions) {
  let str = JSON.stringify(content);
  const { encryptedFile, encryptedSymmetricKey } = await client.encryptString(
    str,
    conditions
  );
  let docId = await createDocument({
    encryptedFile: await blobToBase64String(encryptedFile),
    encryptedSymmetricKey,
    conditions,
  });
  localStorage.setItem(DOC_ID_KEY, docId);
  return docId;
}

export {getAccessControlConditions, loadData, createData, updateData}