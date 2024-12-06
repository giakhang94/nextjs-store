// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Separator } from "../ui/separator";
interface Props {
  text: string;
}

function SectionTitle({ text }: Props) {
  return (
    <div>
      <h2 className="text-3xl font-medium tracking-wider capitalize mb-8">
        {text}
      </h2>
      <Separator />
    </div>
  );
}

export default SectionTitle;
