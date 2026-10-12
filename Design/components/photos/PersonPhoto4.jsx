// figma node: Person Photo 4 — 320×320 square photo symbol, clipped
export function PersonPhoto4({ src = '../../assets/images/avatar-1.png', size = 320, radius = 0, alt = 'Person Photo 4', className, style }) {
  return (
    <div className={className} style={{ width: size, height: size, borderRadius: radius, overflow: 'hidden', position: 'relative', flexShrink: 0, ...style }}>
      <img src={src} alt={alt} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
    </div>
  );
}
export default PersonPhoto4;
