"use client";

import LoadingTable from "@/components/global/LoadingTable";

function loading() {
  return (
    <div>
      <LoadingTable rows={5} />
    </div>
  );
}

export default loading;
