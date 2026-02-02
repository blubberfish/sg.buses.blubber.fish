import api from "@/contexts/datamall/api";
import Link from "next/link";
import { FavoriteButton } from "./_components/favorite-button";
import { StopDescription } from "./_components/stop-description";
import { StopLabel } from "./_components/stop-label";

export default function Loading() {
  return (
    <>
      <section className="container mx-auto px-9 my-6 flex flex-row items-center-safe bg-gray-400 animate-pulse">
        <div className="flex flex-col flex-1">
          <p className="text-lg">&nbsp;</p>
          <p className="text-sm text-gray-400">&nbsp;</p>
        </div>
      </section>
      {new Array(1).fill(0).map((_, index) => (
        <section
          className="container mx-auto my-6 bg-gray-800 animate-pulse"
          key={index}
        >
          <h1 className="text-lg px-9 py-6 border-b border-b-gray-500">
            &nbsp;
          </h1>
          <div className="grid grid-cols-1 auto-row-min gap-3 py-6">
            {new Array(3).fill(0).map((_, index) => {
              return (
                <div
                  className="px-9 flex flex-row items-center-safe gap-3"
                  key={index}
                >
                  <p className="px-2 text-sm font-light rounded">&nbsp;</p>
                  <p className="font-mono text-sm">&nbsp;</p>
                </div>
              );
            })}
          </div>
        </section>
      ))}
    </>
  );
}
