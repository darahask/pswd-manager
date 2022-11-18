import { useEffect, useRef, useState } from "react";
import { useAccount } from "wagmi";
import { SPINNER } from "../constants";
import { loadData } from "../scripts/data";

export default function Show() {
  let { address } = useAccount();
  let [key, setKey] = useState("");
  let [data, setData] = useState();
  let [cred, setCred] = useState("");
  let [domain, setDomain] = useState("");

  let spinner = useRef();

  let load = async () => {
    let spin = spinner.current;
    if (spin) spin.innerHTML = SPINNER;
    let data;
    try {
      data = await loadData(address);
    } catch {
      if (spin) spin.innerHTML = "";
    }
    if (spin) spin.innerHTML = "";
    setData(data);
  };

  useEffect(() => {
    load();
  }, [address]);

  return (
    <div className="dark:bg-gray-900">
      <div className="flex flex-col items-center justify-center px-6 py-8 h-screen lg:py-0">
        <div className="py-2 px-4 bg-white rounded-lg shadow dark:border lg:w-1/2 h-2/3 dark:bg-gray-800 dark:border-gray-700">
          <div className="flex flex-row">
            <div className="flex flex-col basis-1/3 overscroll-contain mr-2">
              <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 dark:text-white py-2 pl-1">
                Domain
              </h1>
              <input
                type="text"
                onChange={(e) => setDomain(e.target.value)}
                className="bg-gray-50 mb-2 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder="company.com"
              ></input>
              {data ? (
                Object.keys(data)
                  .filter((val) => val.includes(domain))
                  .map((val, i) => (
                    <button
                      key={i}
                      onClick={() => setKey(val)}
                      style={{ backgoundColor: "#2563EB" }}
                      className="w-full text-white focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium 
                               mb-2 rounded-lg text-sm px-5 py-2.5 text-center bg-black"
                    >
                      {val}
                    </button>
                  ))
              ) : (
                <div className="w-full" ref={spinner}></div>
              )}
            </div>
            <div className="flex flex-col basis-2/3 overscroll-contain">
              <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 dark:text-white py-2">
                Credentials
              </h1>
              <input
                type="text"
                onChange={(e) => setCred(e.target.value)}
                className="bg-gray-50 mb-2 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder="credentials"
              ></input>
              {data && data[key] ? (
                data[key]
                  .filter((val) => {
                    let total = val.username + val.password;
                    return total.includes(cred);
                  })
                  .map((val, i) => (
                    <div key={i}>
                      <div className="mb-1">
                        <input
                          className="text-sm rounded-lg block w-full p-2.5 dark:bg-gray-700 dark:placeholder-gray-400 dark:text-white hover:cursor-pointer"
                          value={val.username}
                          readOnly
                        ></input>
                      </div>
                      <div className="mb-1">
                        <input
                          type="password"
                          onClick={(e) => {
                            if (e.target.type === "password") {
                              e.target.type = "text";
                            } else e.target.type = "password";
                          }}
                          className="text-sm rounded-lg block w-full p-2.5 dark:bg-gray-700 dark:placeholder-gray-400 dark:text-white hover:cursor-pointer"
                          value={val.password}
                          readOnly
                        ></input>
                      </div>
                    </div>
                  ))
              ) : (
                <></>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
