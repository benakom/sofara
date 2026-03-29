import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, spring, Sequence } from "remotion";
import { loadFont } from "@remotion/google-fonts/Poppins";
import { loadFont as loadDisplay } from "@remotion/google-fonts/Sora";

const { fontFamily: bodyFont } = loadFont("normal", { weights: ["400", "600", "700"], subsets: ["latin"] });
const { fontFamily: displayFont } = loadDisplay("normal", { weights: ["700", "800"], subsets: ["latin"] });

// Sofara brand colors
const FOREST = "#134830";
const FOREST_DARK = "#0c3220";
const LIME = "#CCFF00";
const LIME_DIM = "#99cc00";
const WHITE = "#FFFFFF";
const CREAM = "#F5F5E8";

const categoryColors: Record<string, string> = {
  DUBAI: "#FFB800",
  SALES: "#00D4AA",
  COMPLIANCE: "#FF6B6B",
};

export type CourseVideoProps = {
  title: string;
  subtitle: string;
  category: string;
  duration: string;
  icon: string;
  points: string[];
  courseNumber: number;
};

export const CourseVideo: React.FC<CourseVideoProps> = ({
  title, subtitle, category, duration, icon, points, courseNumber,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const catColor = categoryColors[category] || LIME;

  // === SCENE 1: Intro (0-150) — Brand + Category ===
  // === SCENE 2: Title (120-330) — Course title reveal ===
  // === SCENE 3: Points (300-500) — Key topics ===
  // === SCENE 4: Outro (470-600) — CTA ===

  return (
    <AbsoluteFill style={{ backgroundColor: FOREST_DARK }}>
      {/* Animated background grid */}
      <BackgroundGrid frame={frame} />

      {/* Scene 1: Brand Intro */}
      <Sequence from={0} durationInFrames={180}>
        <IntroScene fps={fps} icon={icon} category={category} catColor={catColor} courseNumber={courseNumber} />
      </Sequence>

      {/* Scene 2: Title Reveal */}
      <Sequence from={140} durationInFrames={220}>
        <TitleScene fps={fps} title={title} subtitle={subtitle} duration={duration} catColor={catColor} />
      </Sequence>

      {/* Scene 3: Key Points */}
      <Sequence from={320} durationInFrames={200}>
        <PointsScene fps={fps} points={points} catColor={catColor} />
      </Sequence>

      {/* Scene 4: Outro */}
      <Sequence from={490} durationInFrames={110}>
        <OutroScene fps={fps} category={category} />
      </Sequence>

      {/* Persistent Sofara watermark */}
      <SofaraWatermark frame={frame} fps={fps} />
    </AbsoluteFill>
  );
};

// ===================== COMPONENTS =====================

const BackgroundGrid: React.FC<{ frame: number }> = ({ frame }) => {
  const drift = interpolate(frame, [0, 600], [0, -120]);
  return (
    <AbsoluteFill style={{ opacity: 0.06 }}>
      <div style={{
        position: "absolute", inset: 0,
        backgroundImage: `linear-gradient(${LIME} 1px, transparent 1px), linear-gradient(90deg, ${LIME} 1px, transparent 1px)`,
        backgroundSize: "80px 80px",
        transform: `translateY(${drift}px)`,
      }} />
    </AbsoluteFill>
  );
};

const IntroScene: React.FC<{ fps: number; icon: string; category: string; catColor: string; courseNumber: number }> = ({ fps, icon, category, catColor, courseNumber }) => {
  const frame = useCurrentFrame();

  const logoScale = spring({ frame, fps, config: { damping: 15, stiffness: 100 } });
  const badgeX = spring({ frame: frame - 20, fps, config: { damping: 20, stiffness: 150 } });
  const iconScale = spring({ frame: frame - 35, fps, config: { damping: 12 } });
  const numOpacity = interpolate(frame, [50, 70], [0, 1], { extrapolateRight: "clamp" });
  const exitOpacity = interpolate(frame, [140, 170], [1, 0], { extrapolateRight: "clamp" });
  const exitY = interpolate(frame, [140, 170], [0, -60], { extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ opacity: exitOpacity, transform: `translateY(${exitY}px)` }}>
      {/* Radial glow */}
      <div style={{
        position: "absolute", top: "50%", left: "50%", width: 800, height: 800,
        borderRadius: "50%", transform: "translate(-50%, -50%)",
        background: `radial-gradient(circle, ${LIME}15 0%, transparent 70%)`,
      }} />

      {/* Sofara text */}
      <div style={{
        position: "absolute", top: "32%", left: "50%",
        transform: `translate(-50%, -50%) scale(${logoScale})`,
        fontFamily: displayFont, fontSize: 120, fontWeight: 800,
        color: LIME, letterSpacing: -2,
      }}>
        sofara
      </div>

      {/* Category badge */}
      <div style={{
        position: "absolute", top: "48%", left: "50%",
        transform: `translate(-50%, -50%) scale(${badgeX})`,
        background: catColor, color: FOREST_DARK,
        fontFamily: bodyFont, fontSize: 22, fontWeight: 700,
        padding: "8px 28px", borderRadius: 50,
        letterSpacing: 3, textTransform: "uppercase",
      }}>
        {category}
      </div>

      {/* Icon */}
      <div style={{
        position: "absolute", top: "62%", left: "50%",
        transform: `translate(-50%, -50%) scale(${iconScale})`,
        fontSize: 90,
      }}>
        {icon}
      </div>

      {/* Course number */}
      <div style={{
        position: "absolute", top: "78%", left: "50%",
        transform: "translate(-50%, -50%)", opacity: numOpacity,
        fontFamily: displayFont, fontSize: 28, fontWeight: 700,
        color: `${LIME}90`, letterSpacing: 4,
      }}>
        COURS {String(courseNumber).padStart(2, "0")}
      </div>
    </AbsoluteFill>
  );
};

const TitleScene: React.FC<{ fps: number; title: string; subtitle: string; duration: string; catColor: string }> = ({ fps, title, subtitle, duration, catColor }) => {
  const frame = useCurrentFrame();

  const lineWidth = interpolate(frame, [0, 30], [0, 600], { extrapolateRight: "clamp" });
  const titleY = spring({ frame: frame - 10, fps, config: { damping: 20, stiffness: 100 } });
  const subY = spring({ frame: frame - 25, fps, config: { damping: 20, stiffness: 100 } });
  const durOpacity = interpolate(frame, [40, 55], [0, 1], { extrapolateRight: "clamp" });
  const exitOpacity = interpolate(frame, [180, 210], [1, 0], { extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ opacity: exitOpacity }}>
      {/* Decorative line */}
      <div style={{
        position: "absolute", top: "38%", left: "50%",
        transform: "translateX(-50%)", width: lineWidth, height: 3,
        background: `linear-gradient(90deg, transparent, ${LIME}, transparent)`,
      }} />

      {/* Title */}
      <div style={{
        position: "absolute", top: "44%", left: "50%", width: "80%",
        transform: `translate(-50%, -50%) translateY(${interpolate(titleY, [0, 1], [80, 0])}px)`,
        opacity: titleY,
        fontFamily: displayFont, fontSize: 72, fontWeight: 800,
        color: WHITE, textAlign: "center", lineHeight: 1.1,
      }}>
        {title}
      </div>

      {/* Subtitle */}
      <div style={{
        position: "absolute", top: "62%", left: "50%", width: "70%",
        transform: `translate(-50%, -50%) translateY(${interpolate(subY, [0, 1], [60, 0])}px)`,
        opacity: subY,
        fontFamily: bodyFont, fontSize: 32, fontWeight: 400,
        color: `${CREAM}99`, textAlign: "center",
      }}>
        {subtitle}
      </div>

      {/* Duration pill */}
      <div style={{
        position: "absolute", top: "74%", left: "50%",
        transform: "translate(-50%, -50%)", opacity: durOpacity,
        background: `${LIME}18`, border: `1px solid ${LIME}40`,
        borderRadius: 50, padding: "10px 30px",
        fontFamily: bodyFont, fontSize: 20, fontWeight: 600, color: LIME,
      }}>
        ⏱ {duration}
      </div>
    </AbsoluteFill>
  );
};

const PointsScene: React.FC<{ fps: number; points: string[]; catColor: string }> = ({ fps, points, catColor }) => {
  const frame = useCurrentFrame();
  const exitOpacity = interpolate(frame, [160, 190], [1, 0], { extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ opacity: exitOpacity }}>
      {/* Header */}
      <div style={{
        position: "absolute", top: "18%", left: "50%",
        transform: "translate(-50%, -50%)",
        fontFamily: displayFont, fontSize: 38, fontWeight: 700,
        color: LIME, letterSpacing: 3, textTransform: "uppercase",
      }}>
        Ce que vous apprendrez
      </div>

      {/* Points grid */}
      <div style={{
        position: "absolute", top: "35%", left: "50%",
        transform: "translateX(-50%)", width: "75%",
        display: "flex", flexWrap: "wrap", gap: 24, justifyContent: "center",
      }}>
        {points.map((point, i) => {
          const delay = i * 12;
          const s = spring({ frame: frame - delay - 15, fps, config: { damping: 18, stiffness: 120 } });
          return (
            <div key={i} style={{
              width: "46%",
              transform: `translateY(${interpolate(s, [0, 1], [50, 0])}px)`,
              opacity: s,
              background: `linear-gradient(135deg, ${FOREST}ee, ${FOREST_DARK}ee)`,
              border: `1px solid ${LIME}30`,
              borderRadius: 20, padding: "32px 36px",
              display: "flex", alignItems: "center", gap: 20,
            }}>
              <div style={{
                width: 48, height: 48, borderRadius: 12,
                background: `${catColor}20`, border: `2px solid ${catColor}60`,
                display: "flex", alignItems: "center", justifyContent: "center",
                fontFamily: displayFont, fontSize: 22, fontWeight: 800, color: catColor,
              }}>
                {String(i + 1).padStart(2, "0")}
              </div>
              <div style={{
                fontFamily: bodyFont, fontSize: 26, fontWeight: 600, color: WHITE,
                flex: 1,
              }}>
                {point}
              </div>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

const OutroScene: React.FC<{ fps: number; category: string }> = ({ fps, category }) => {
  const frame = useCurrentFrame();
  const logoScale = spring({ frame, fps, config: { damping: 15 } });
  const textOp = interpolate(frame, [20, 40], [0, 1], { extrapolateRight: "clamp" });
  const pulse = Math.sin(frame * 0.08) * 0.03 + 1;

  return (
    <AbsoluteFill>
      <div style={{
        position: "absolute", top: "50%", left: "50%", width: 600, height: 600,
        borderRadius: "50%", transform: "translate(-50%, -50%)",
        background: `radial-gradient(circle, ${LIME}12 0%, transparent 60%)`,
      }} />

      <div style={{
        position: "absolute", top: "38%", left: "50%",
        transform: `translate(-50%, -50%) scale(${logoScale * pulse})`,
        fontFamily: displayFont, fontSize: 100, fontWeight: 800,
        color: LIME,
      }}>
        sofara
      </div>

      <div style={{
        position: "absolute", top: "55%", left: "50%",
        transform: "translate(-50%, -50%)", opacity: textOp,
        fontFamily: displayFont, fontSize: 28, fontWeight: 700,
        color: `${CREAM}aa`, letterSpacing: 6, textTransform: "uppercase",
      }}>
        Academy
      </div>

      <div style={{
        position: "absolute", top: "68%", left: "50%",
        transform: "translate(-50%, -50%)", opacity: textOp,
        fontFamily: bodyFont, fontSize: 22, fontWeight: 400,
        color: `${CREAM}60`,
      }}>
        Commencez votre formation maintenant
      </div>
    </AbsoluteFill>
  );
};

const SofaraWatermark: React.FC<{ frame: number; fps: number }> = ({ frame, fps }) => {
  const opacity = interpolate(frame, [30, 60], [0, 0.3], { extrapolateRight: "clamp" });
  return (
    <div style={{
      position: "absolute", bottom: 30, right: 40,
      fontFamily: displayFont, fontSize: 16, fontWeight: 700,
      color: LIME, opacity, letterSpacing: 4,
    }}>
      SOFARA ACADEMY
    </div>
  );
};
