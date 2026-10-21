/**
 * Page title in the approved style (fluo highlighter): the part before ":" is highlighted; without a colon,
 * the highlight starts at the city name (Dubai / Dubaï / Dubái / Дуба…) and runs to the end.
 */
export const Headline = ({ text }: { text: string }) => {
  const colon = text.indexOf(":");
  if (colon > 0) {
    return (
      <>
        <span className="marker">{text.slice(0, colon).trimEnd()}</span>
        {text.slice(colon)}
      </>
    );
  }
  const city = text.search(/(Dub[aá]i|Dubaï|Дуба)/);
  if (city < 0) return <>{text}</>;
  return (
    <>
      {text.slice(0, city)}
      <span className="marker">{text.slice(city)}</span>
    </>
  );
};
