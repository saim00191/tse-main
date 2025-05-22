import { getCreditTokens, getTSEsForToken } from "@/utils/lib";
// import TokenTable from "./Token-Table";
import type { Token, TSE, EnrichedToken } from "@/types/types";
import ModalButton from "./Modal-Button";
import TokenTableMain from '../components/Token-Table-Main/Token-Table-Main'
const CreditTokenDashboard = async () => {
  const tokens: Token[] = await getCreditTokens();

  // Enrich all tokens
  const enrichedTokens: EnrichedToken[] = await Promise.all(
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

  // Extract first 10 tokens
  const first10Tokens = enrichedTokens.slice(0, 10);

  // Skip 11–20 and get tokens from 21 onward
  const after20Tokens = enrichedTokens.slice(48);

  // Combine first 10 and tokens after 20
  const displayedTokens = [...first10Tokens, ...after20Tokens];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-indigo-700">Credit Tokens</h1>
        <ModalButton />
      </div>

      <TokenTableMain tokens={displayedTokens} />
    </div>
  );
};

export default CreditTokenDashboard;
