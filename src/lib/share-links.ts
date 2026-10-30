// Links an ambassador shares, built from their existing referral code.

/** Public links that carry the ambassador's code, so visitors are attributed to them. */
export const investorLinks = (code: string) => ({
  cevitas: `https://www.cevitas.ae/?ref=${encodeURIComponent(code)}`,
  offplan: `https://www.offplansimulator.com/?ref=${encodeURIComponent(code)}`,
});

/** Sign-up link that makes the new ambassador a referral of this one. */
export const ambassadorInviteLink = (code: string, isFr: boolean) => {
  const origin = typeof window !== "undefined" ? window.location.origin : "https://sofara.io";
  return `${origin}/auth?mode=signup${isFr ? "&lang=fr" : ""}&ref=${encodeURIComponent(code)}`;
};
