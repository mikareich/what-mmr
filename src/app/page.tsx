"use client";

import { ReloadIcon, RocketIcon } from "@radix-ui/react-icons";
import {
  type SyntheticEvent,
  useActionState,
  useEffect,
  useState,
} from "react";
import { fetchPlayerData } from "./actions";

export default function Home() {
  const [state, action, pending] = useActionState(fetchPlayerData, null);

  const [ssidCookie, setSsidCookie] = useState("");
  const [username, setUsername] = useState("");

  const updateSsidCookie = (e: SyntheticEvent) => {
    const { value } = e.target as HTMLInputElement;
    setSsidCookie(value);
    localStorage.setItem("ssidCookie", value);
  };

  useEffect(() => {
    const storedSsidCookie = localStorage.getItem("ssidCookie");
    setSsidCookie(storedSsidCookie || "");
  }, []);

  return (
    <main className="mx-auto max-w-prose pt-10 space-y-10 p-2">
      <header className="space-y-3 border-b">
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">
          What MMR?
        </h1>

        <p className="text-lg font-light">
          Anxious if your friends play better then you? Check out their MMR and
          wonder no more!
        </p>
      </header>

      <article className="space-y-4">
        <p>
          <i>What MMR?</i> allows you to fetch player data of different valorant
          accounts. See their performance stats like rank, level, xp etc... Just
          enter your ssid cookie as well as the username and we will retrive the
          latest data directly from riot servers. No data is stored!
        </p>

        <details>
          <summary className="font-bold">How to get the SSID Cookie</summary>

          <p>
            To make a request to riot servers and fetch the necessary player
            data, we need you to provide a <i>"ssid cookie"</i>. You can see
            this cookie if you visit{" "}
            <a
              className="text-blue-500 underline"
              href="https://auth.riotgames.com/authorize?redirect_uri=https%3A%2F%2Fplayvalorant.com%2Fopt_in&client_id=play-valorant-web-prod&response_type=token%20id_token&nonce=1&scope=account%20openid"
            >
              auth.riotgames.com
            </a>
            , successfully sign in with any account, open the{" "}
            <i>Developer Settings</i>, navigate to{" "}
            <i>Application &gt; Cookies &gt; auth.riotgames.com</i> and then
            copy the <i>ssid cookie value</i> ("ey..."). Note that you don't
            have to sign in with the account you want the data from but with{" "}
            <i>any valid valorant account</i>. We won't see any private
            information.
          </p>
        </details>

        <form action={action} className="space-y-2 border p-2 rounded">
          <label htmlFor="ssid-cookie" className="block">
            <span className="block mb-1 text-sm font-medium">
              <span className="text-sm text-red-500">*</span> SSID Cookie Value:
            </span>

            <input
              required
              className="px-4 py-2 border w-full rounded"
              id="ssid-cookie"
              name="ssid-cookie"
              value={ssidCookie}
              onChange={updateSsidCookie}
            />
          </label>

          <label htmlFor="username" className="block">
            <span className="block mb-1 text-sm font-medium">
              <span className="text-sm text-red-500">*</span> Username
              (name#tag):{" "}
            </span>

            <input
              required
              className="px-4 py-2 border w-full rounded"
              id="username"
              name="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </label>

          <button
            disabled={pending}
            type="submit"
            className="px-4 py-2 bg-blue-500 text-white flex items-center gap-2 rounded text-sm disabled:opacity-80"
          >
            {pending ? <ReloadIcon className="animate-spin" /> : <RocketIcon />}{" "}
            Get Data
          </button>
        </form>

        <section>
          {state === null && (
            <p className="text-center italic">...data shows here...</p>
          )}

          {state?.error && <p className="text-red-500">Error: {state.error}</p>}

          {state?.data && <pre>{JSON.stringify(state.data, null, 2)}</pre>}
        </section>
      </article>
    </main>
  );
}
