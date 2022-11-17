import { useEffect, useState } from "react";
import { loadData } from "../scripts/data";

export default function Show() {
  let [data, setData] = useState({});
  let [key, setKey] = useState("");

  let load = async () => {
    let data = await loadData();
    setData(data);
  };

  useEffect(() => {
    load();
  }, []);

  return (
    <div className="dark:bg-gray-900">
      <div className="flex flex-col items-center justify-center px-6 py-8 md:h-screen lg:py-0">
        <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
          <div className="flex flex-row">
            <div className="flex flex-col">
              {data ? (
                Object.keys(data).map((val, i) => <div key={i}>{val}</div>)
              ) : (
                <></>
              )}
            </div>
            <div className="flex flex-col">
              {data[key].map((val, i) => (
                <div key={i}>{val.username}</div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
