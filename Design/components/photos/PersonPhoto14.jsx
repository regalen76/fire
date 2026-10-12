// figma node: Person Photo 14 — 320×320 square photo symbol, clipped
export function PersonPhoto14({ src = '../../assets/images/avatar-2.png', size = 320, radius = 0, alt = 'Person Photo 14', className, style }) {
  return (
    <div className={className} style={{ width: size, height: size, borderRadius: radius, overflow: 'hidden', position: 'relative', flexShrink: 0, ...style }}>
      <img src={src} alt={alt} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
    </div>
  );
}
export default PersonPhoto14;
