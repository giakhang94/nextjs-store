import { Skeleton } from "../ui/skeleton";

interface Props {
  rows: number;
}
function LoadingTable(props: Props) {
  const { rows } = props;
  const tableRows = Array.from({ length: rows }, (_, index) => {
    return (
      <div className="mb-4" key={index + "row"}>
        <Skeleton className="w=full h-8 rouned" />
      </div>
    );
  });

  return <>{tableRows}</>;
}

export default LoadingTable;
