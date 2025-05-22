import { getCreditTokens, getTSEsForToken } from "@/utils/lib";
import TokenTable from "./Token-Table";
import { Token , TSE , EnrichedToken} from "@/types/types";

const CreditTokenDashboard = async () => {
  const tokens: Token[] = await getCreditTokens();

  const enrichedTokens : EnrichedToken[] = await Promise.all(
    tokens.map(async (token) => {
      let tses: TSE[] = [];
      if (token.creditClientId) {
        tses = await getTSEsForToken(token.creditClientId);
      }
      const tseSerialNumbers = tses.map((tse) => tse.tseSerialNumber);
      const productTypes = tses.map((tse) => tse.productType);
      return {
        ...token,
        tseCount: tses.length,
        tseSerialNumbers,
        productTypes, 
      };
    })
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-indigo-700">Credit Tokens</h1>
      </div>

      <TokenTable tokens={enrichedTokens} />
    </div>
  );
};

export default CreditTokenDashboard;
