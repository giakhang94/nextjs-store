import { Separator } from "@radix-ui/react-dropdown-menu";
import Sidebar from "./Sidebar";
interface Props {
  children: React.ReactNode;
}
function layout({ children }: Props) {
  return (
    <>
      <h2 className="text-2xl pl-4">Dashboard</h2>
      <Separator className="mt-2 bg-gray-300 opacity-80 h-[1px]" />
      <section className="grid lg:grid-cols-12 gap-12 mt-12">
        <div className="lg:col-span-2">
          <Sidebar />
        </div>
        <div className="lg:col-span-10">{children}</div>
      </section>
    </>
  );
}

export default layout;
