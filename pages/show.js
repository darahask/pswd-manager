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

  let togglePassword = (e, i) => {
    const password = document.querySelector(`#pass-${i}`);

    if (password.type === "password") {
      e.target.innerHTML = "hide";
      password.type = "text";
    } else {
      e.target.innerHTML = "show";
      password.type = "password";
    }
  };

  let copyValue = (val) => {
    navigator.clipboard.writeText(val);
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
                Domains
              </h1>
              <input
                type="text"
                onChange={(e) => setDomain(e.target.value)}
                className="bg-gray-50 focus:border mb-2 text-sm rounded-lg focus:outline-none w-full p-2 bg-gray-700 placeholder-gray-400 text-white focus:border-blue-500"
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
                               mb-2 rounded text-sm px-5 py-2.5 text-center bg-black"
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
                className="bg-gray-50 focus:border mb-2 text-sm rounded-lg focus:outline-none w-full p-2 bg-gray-700 placeholder-gray-400 text-white focus:border-blue-500"
                placeholder="username/password"
              ></input>
              {data && data[key] ? (
                data[key]
                  .filter((val) => {
                    let total = val.username + val.password;
                    return total.includes(cred);
                  })
                  .map((val, i) => (
                    <div key={i}>
                      <div className="relative w-full mb-1">
                        <div className="absolute inset-y-0 right-0 flex items-center px-2">
                          <label
                            onClick={(e) => copyValue(val.username)}
                            className="bg-gray-300 hover:bg-gray-400 rounded px-2 py-1 text-sm text-gray-600 cursor-pointer font-mono"
                          >
                            copy
                          </label>
                        </div>
                        <input
                          className="text-sm appearance-none w-full rounded w-full py-3 px-3 leading-tight bg-gray-700 focus:outline-none text-white pr-16"
                          value={val.username}
                          readOnly
                        ></input>
                      </div>
                      <div className="relative w-full mb-2">
                        <div className="absolute inset-y-0 right-14 flex items-center px-2">
                          <label
                            onClick={(e) => copyValue(val.password)}
                            className="bg-gray-300 hover:bg-gray-400 rounded px-2 py-1 text-sm text-gray-600 cursor-pointer font-mono"
                          >
                            copy
                          </label>
                        </div>
                        <div className="absolute inset-y-0 right-0 flex items-center px-2">
                          <label
                            onClick={(e) => togglePassword(e, i)}
                            className="bg-gray-300 hover:bg-gray-400 rounded px-2 py-1 text-sm text-gray-600 cursor-pointer font-mono"
                          >
                            show
                          </label>
                        </div>
                        <input
                          className="text-sm appearance-none rounded w-full py-3 px-3 leading-tight bg-gray-700 focus:outline-none text-white pr-16"
                          id={`pass-${i}`}
                          type="password"
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
