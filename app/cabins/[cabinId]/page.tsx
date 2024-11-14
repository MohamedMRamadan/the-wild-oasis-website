import Cabin from "@/app/_components/Cabin";
import Reservation from "@/app/_components/Reservation";
import Spinner from "@/app/_components/Spinner";
import { getCabin, getCabins } from "@/app/_lib/data-service";
import { GenerateMetadataType } from "@/app/_types/components.type";
import { FC, Suspense } from "react";

type Props = {
  params: { cabinId: string };
};

export const generateMetadata: GenerateMetadataType<Props> = async ({
  params,
}) => {
  const { name } = await getCabin(params.cabinId);
  return {
    title: `Cabin ${name}`,
  };
};

export const generateStaticParams = async () => {
  const cabins = await getCabins();
  return cabins.map((cabin) => ({ cabinId: String(cabin.id) }));
};

const page: FC<Props> = async ({ params }) => {
  const { cabinId } = params;
  const cabin = await getCabin(cabinId);

  return (
    <div className="mx-auto mt-8 max-w-6xl">
      <Cabin cabin={cabin} />
      <div>
        <h2 className="mb-10 text-center text-5xl font-semibold text-accent-400">
          Reserve {cabin.name} Pay on arrival.
        </h2>
        <Suspense fallback={<Spinner />}>
          <Reservation cabin={cabin} />
        </Suspense>
      </div>
    </div>
  );
};

export default page;
