"use client";

import { useEffect, useState } from "react";

interface LocationOption {
  id: number;
  name: string;
}

interface Props {
  province: string;
  city: string;
  onProvinceChange: (value: string) => void;
  onCityChange: (value: string) => void;
  className?: string;
}

export default function LocationSelects({
  province,
  city,
  onProvinceChange,
  onCityChange,
  className = "",
}: Props) {
  const [provinces, setProvinces] = useState<LocationOption[]>([]);
  const [cities, setCities] = useState<LocationOption[]>([]);
  const [loadingProvinces, setLoadingProvinces] = useState(true);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    let active = true;
    fetch("/api/locations")
      .then((response) => {
        if (!response.ok) throw new Error("locations");
        return response.json() as Promise<{ provinces: LocationOption[] }>;
      })
      .then((data) => {
        if (active) setProvinces(data.provinces);
      })
      .catch(() => active && setFailed(true))
      .finally(() => active && setLoadingProvinces(false));

    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    if (!province) return;

    let active = true;
    fetch(`/api/locations?province=${encodeURIComponent(province)}`)
      .then((response) => {
        if (!response.ok) throw new Error("locations");
        return response.json() as Promise<{ cities: LocationOption[] }>;
      })
      .then((data) => {
        if (active) setCities(data.cities);
      })
      .catch(() => active && setFailed(true));

    return () => {
      active = false;
    };
  }, [province]);

  if (failed) {
    return (
      <>
        <input
          name="province"
          value={province}
          onChange={(event) => onProvinceChange(event.target.value)}
          placeholder="استان"
          required
          className={className}
        />
        <input
          name="city"
          value={city}
          onChange={(event) => onCityChange(event.target.value)}
          placeholder="شهر"
          required
          className={className}
        />
      </>
    );
  }

  return (
    <>
      <select
        name="province"
        value={province}
        onChange={(event) => {
          onProvinceChange(event.target.value);
          onCityChange("");
        }}
        required
        disabled={loadingProvinces}
        className={className}
      >
        <option value="">{loadingProvinces ? "در حال دریافت استان‌ها..." : "انتخاب استان"}</option>
        {provinces.map((item) => (
          <option key={item.id} value={item.name}>
            {item.name}
          </option>
        ))}
      </select>
      <select
        name="city"
        value={city}
        onChange={(event) => onCityChange(event.target.value)}
        required
        disabled={!province}
        className={className}
      >
        <option value="">{province ? "انتخاب شهر" : "ابتدا استان را انتخاب کنید"}</option>
        {cities.map((item) => (
          <option key={item.id} value={item.name}>
            {item.name}
          </option>
        ))}
      </select>
    </>
  );
}
