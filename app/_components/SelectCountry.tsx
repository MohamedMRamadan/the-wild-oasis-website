import { getCountries } from "@/app/_lib/data-service";
import React from "react";
import { Country } from "../_types/data-service.type";

// Let's imagine your colleague already built this component 😃

type Props = {
  defaultCountry: string;
  name: string;
  id: string;
  className: string;
};

const SelectCountry: React.FC<Props> = async ({
  defaultCountry,
  name,
  id,
  className,
}) => {
  const countries = await getCountries();
  const flag =
    countries.find((country) => country.name === defaultCountry)?.flag ?? "";

  return (
    <select
      name={name}
      id={id}
      // Here we use a trick to encode BOTH the country name and the flag into the value. Then we split them up again later in the server action
      defaultValue={`${defaultCountry}%${flag}`}
      className={className}
    >
      <option value="">Select country...</option>
      {countries.map((c: Country) => (
        <option key={c.name} value={`${c.name}%${c.flag}`}>
          {c.name}
        </option>
      ))}
    </select>
  );
};

export default SelectCountry;
