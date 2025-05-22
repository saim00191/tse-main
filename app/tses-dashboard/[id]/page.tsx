import AuthWrapper from "@/app/admin-login/Auth-Wrapper";
import Home from "./MainPage";

interface Props {
  params: Promise<{ id: string }>;
}

async function getTSEDetails(tseSerialNumber: string) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/v1/manage/tse/${tseSerialNumber}`,
    {
      headers: {
        Authorization: `Basic ${Buffer.from(
          `${process.env.NEXT_PUBLIC_API_USERNAME}:${process.env.NEXT_PUBLIC_API_PASSWORD}`
        ).toString("base64")}`,
      },
      cache: "no-store",
    }
  );

  if (!res.ok) throw new Error("Failed to fetch TSE details");
  return res.json();
}

const TSEPage = async ({ params }: Props) => {
  const { id } = await params;
  const tseData = await getTSEDetails(id); 

  return (
    <AuthWrapper>
      <div className="p-6">
        <Home data={tseData} />
      </div>
    </AuthWrapper>
  );
};

export default TSEPage;