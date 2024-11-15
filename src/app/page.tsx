/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import axios from "axios";
import Image from "next/image";
import { FormEvent, useEffect, useState } from "react";

export default function Home() {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [data, setData] = useState<[] | null>([]);

  useEffect(() => {
    getPhotosHandle();
  }, []);

  const handleUpload = async (e: FormEvent) => {
    e.preventDefault();

    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    try {
      setLoading(true);
      const request = await fetch(
        "https://api.pinata.cloud/pinning/pinFileToIPFS",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${process.env.NEXT_PUBLIC_PINATA_JWT}`,
          },
          body: formData,
        }
      );

      await request.json();

      getPhotosHandle();
      setLoading(false);
    } catch (error) {
      alert(error);
    }
  };

  const getPhotosHandle = async () => {
    try {
      const response = await axios("https://api.pinata.cloud/data/pinList", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_PINATA_JWT}`,
        },
      });

      if (response.data && response.data.rows) {
        setData(response.data.rows);
      }
    } catch (error) {
      alert(error);
    }
  };

  return (
    <>
      <div className="w-full flex flex-col gap-6 items-center justify-center">
        <h2 className="text-3xl font-bold"> IPFS Tutorials</h2>

        <form onSubmit={handleUpload}>
          <div className="flex flex-col gap-2 justify-center items-center">
            <input
              type="file"
              onChange={(e) => {
                if (e.target.files && e.target.files[0]) {
                  setFile(e.target.files[0]);
                }
              }}
            />

            <button
              className="bg-slate-800 px-5 py-2 justify-center w-1/2 flex items-center rounded-2xl "
              type="submit"
              onClick={() => {
                setLoading(true);
              }}
            >
              {loading && file ? "Uploading..." : "Upload"}
            </button>
          </div>
        </form>

        <div>
          <button
            onClick={() => getPhotosHandle()}
            className="bg-slate-800 px-5 py-2 justify-center flex items-center rounded-2xl "
          >
            Get Photos
          </button>
        </div>
      </div>
      <div className="w-full flex gap-6 mt-10 items-center justify-center">
        {data &&
          Object.values(data)
            .reverse()
            .map(
              (item: { id: string; ipfs_pin_hash: string; name: string }) => (
                <div key={item.id} className="flex gap-7">
                  <Image
                    src={`https://peach-hollow-dove-544.mypinata.cloud/ipfs/${item.ipfs_pin_hash}`}
                    alt={"item.name"}
                    width={200}
                    height={200}
                    className="rounded-2xl cursor-pointer w-full h-full object-cover"
                    onClick={() =>
                      window.open(
                        `https://peach-hollow-dove-544.mypinata.cloud/ipfs/Qmb3WaC616Gw2MCVzRDw8oSC4FLe6B17dgrTxonJk1Q2rL`
                      )
                    }
                  />
                </div>
              )
            )}
      </div>
    </>
  );
}
