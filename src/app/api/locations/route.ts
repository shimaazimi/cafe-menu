import { getCities, getProvincesList } from "@code-plate/iran-cities";

export async function GET(request: Request) {
  const province = new URL(request.url).searchParams.get("province")?.trim();

  if (!province) {
    return Response.json({
      provinces: getProvincesList().map((item) => ({ id: item.id, name: item.fa })),
    });
  }

  return Response.json({
    cities: getCities(province).map((item) => ({ id: item.id, name: item.fa })),
  });
}
