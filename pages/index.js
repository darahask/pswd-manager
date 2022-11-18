import { useEffect, useRef } from "react";
import { useAccount, useContract, useSigner } from "wagmi";
import { abi } from "../artifacts/contracts/Pswd.sol/Pswd.json";
import { PSWD_CONTRACT_ADDRESS, SPINNER } from "../constants";
import { authenticateCeramic } from "../scripts/ceramic";
import {
  createData,
  getAccessControlConditions,
  loadData,
  updateData,
} from "../scripts/data";
import { getStoredDocID, setStoredDocID } from "../scripts/storage";

export default function Home() {
  let domainRef = useRef();
  let usernameRef = useRef();
  let passwordRef = useRef();
  let { address } = useAccount();
  let { data } = useSigner();
  let pswdContract = useContract({
    abi: abi,
    address: PSWD_CONTRACT_ADDRESS,
    signerOrProvider: data,
  });

  let reset = () => {
    domainRef.current.value = "";
    usernameRef.current.value = "";
    passwordRef.current.value = "";
  };

  let saveCredentials = async (e) => {
    e.target.innerHTML = SPINNER;
    let domainname = domainRef.current.value.trim();
    let username = usernameRef.current.value.trim();
    let password = passwordRef.current.value.trim();
    if (!(domainname && username && password)) {
      alert("Please enter all the details");
      return;
    }

    let token = (await pswdContract.ownerToToken(address)).toString();
    let docId = getStoredDocID(address);
    try {
      if (token !== "0") {
        if (docId === null) {
          docId = prompt(
            "Doc ID is not found on local storage please enter the doc id otherwise a new docid will be created and the old data is lost encrypted"
          );
          if (docId) {
            setStoredDocID(address, docId);
          } else {
            let data = {};
            data[domainname] = [{ username, password }];
            docId = await createData(data, getAccessControlConditions(token));
            setStoredDocID(address, docId);
            alert(
              `Doc ID is saved in the local storage of this browser, please save this doc id to retrieve in case cookies are cleared ${docId}`
            );
          }
        } else {
          let data = await loadData(address);
          let list = data[domainname];
          if (list) {
            list.push({
              username,
              password,
            });
          } else {
            data[domainname] = [];
            data[domainname].push({
              username,
              password,
            });
          }
          await updateData(data, getAccessControlConditions(token), address);
          alert("Encrypted and saved the credentials");
        }
      } else {
        let mintTxn = await pswdContract.singleMint();
        await mintTxn.wait();
        token = (await pswdContract.ownerToToken(address)).toString();
        let data = {};
        data[domainname] = [{ username, password }];
        docId = await createData(data, getAccessControlConditions(token));
        setStoredDocID(address, docId);
        alert(
          `Doc ID is saved in the local storage of this browser, please save this doc id to retrieve in case cookies are cleared ${docId}`
        );
      }
    } catch (err) {
      reset();
      e.target.innerHTML = "Save";
      if (err.errorCode === "not_authorized") {
        alert("Not authorised to access the doc please change the account");
      } else {
        alert(
          "There has been some error please try again and also check the internet connectivity"
        );
      }
      return;
    }
    reset();
    e.target.innerHTML = "Save";
  };

  useEffect(() => {
    authenticateCeramic(address);
  }, [address]);

  return (
    <section className="dark:bg-gray-900">
      <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto h-screen lg:py-0">
        <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
          <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
            <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
              Save your Credentials
            </h1>
            <form
              className="space-y-4 md:space-y-6"
              action="#"
              onSubmit={(e) => e.preventDefault()}
            >
              <div>
                <label
                  htmlFor="domain"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Domain name
                </label>
                <input
                  ref={domainRef}
                  type="text"
                  name="domain"
                  id="domain"
                  className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  placeholder="company.com"
                  required=""
                ></input>
              </div>
              <div>
                <label
                  htmlFor="username"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Your username or email
                </label>
                <input
                  ref={usernameRef}
                  type="text"
                  name="username"
                  id="username"
                  className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  placeholder="name@company.com"
                  required=""
                ></input>
              </div>
              <div>
                <label
                  htmlFor="password"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Password
                </label>
                <input
                  ref={passwordRef}
                  type="password"
                  name="password"
                  id="password"
                  placeholder="••••••••"
                  className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  required=""
                ></input>
              </div>
              <button
                onClick={saveCredentials}
                style={{ backgoundColor: "#2563EB" }}
                className="w-full text-white focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center bg-black"
              >
                Save
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
