import { DOC_ID_KEY } from "../constants";

function getStoredDocID(address) {
    return localStorage.getItem(DOC_ID_KEY + address);
}

function setStoredDocID(address, docId) {
    localStorage.setItem(DOC_ID_KEY + address, docId);
}

export {getStoredDocID, setStoredDocID};