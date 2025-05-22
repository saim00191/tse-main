import AuthWrapper from "@/app/admin-login/Auth-Wrapper";
import Home from "./MainPage";

interface Props {
  params: Promise<{ id: string }>;
}

async function getTSEDetails(tseSerialNumber: string) {
  const res = await fetch(
    `https://dev.web-tse.de/api/v1/manage/tse/${tseSerialNumber}`,
    {
      headers: {
        Authorization: `Basic ${Buffer.from(
          "76db02891845f79745218b7fee8ffb4a:a6995e1d6f46bec734cf41ff1f27eb65"
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
  const tseData = await getTSEDetails(id); // 👈 Fetch data using the slug

  return (
    <AuthWrapper>
      <div className="p-6">
        <Home data={tseData} />
      </div>
    </AuthWrapper>
  );
};

export default TSEPage;
