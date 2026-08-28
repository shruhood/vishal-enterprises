import { trustIndicators } from "../../content/site";
import "./TrustStrip.css";

export function TrustStrip() {
  return (
    <section className="ve-trust" aria-label="Built for demanding industries">
      <div className="ve-trust__inner">
        <p className="ve-trust__label">Built for demanding industries</p>
        <ul className="ve-trust__list">
          {trustIndicators.map((t) => (
            <li key={t}>{t}</li>
          ))}
        </ul>
      </div>
    </section>
  );
}
