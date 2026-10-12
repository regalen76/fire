/* @ds-bundle: {"format":4,"namespace":"VisionFinanceDesignSystem_6fe7b7","components":[{"name":"BarChart","sourcePath":"components/charts/BarChart.jsx"},{"name":"Gauge","sourcePath":"components/charts/Gauge.jsx"},{"name":"LineChart","sourcePath":"components/charts/LineChart.jsx"},{"name":"Badge","sourcePath":"components/core/Badge.jsx"},{"name":"Button","sourcePath":"components/core/Button.jsx"},{"name":"Card","sourcePath":"components/core/Card.jsx"},{"name":"IconTile","sourcePath":"components/core/IconTile.jsx"},{"name":"Input","sourcePath":"components/core/Input.jsx"},{"name":"ProgressBar","sourcePath":"components/core/ProgressBar.jsx"},{"name":"Switch","sourcePath":"components/core/Switch.jsx"},{"name":"AvatarsGroup","sourcePath":"components/data/AvatarsGroup.jsx"},{"name":"Balance","sourcePath":"components/data/Balance.jsx"},{"name":"CreditCard","sourcePath":"components/data/CreditCard.jsx"},{"name":"InvoiceItem","sourcePath":"components/data/InvoiceItem.jsx"},{"name":"MiniStat","sourcePath":"components/data/MiniStat.jsx"},{"name":"StatCard","sourcePath":"components/data/StatCard.jsx"},{"name":"TransactionItem","sourcePath":"components/data/TransactionItem.jsx"},{"name":"Icon","sourcePath":"components/icons/Icon.jsx"},{"name":"Avatar","sourcePath":"components/navigation/Avatar.jsx"},{"name":"Breadcrumb","sourcePath":"components/navigation/Breadcrumb.jsx"},{"name":"HelpCard","sourcePath":"components/navigation/HelpCard.jsx"},{"name":"Logo","sourcePath":"components/navigation/Logo.jsx"},{"name":"NavItem","sourcePath":"components/navigation/NavItem.jsx"},{"name":"PageHeader","sourcePath":"components/navigation/PageHeader.jsx"},{"name":"Sidebar","sourcePath":"components/navigation/Sidebar.jsx"},{"name":"SidebarToggle","sourcePath":"components/navigation/SidebarToggle.jsx"},{"name":"PersonPhoto14","sourcePath":"components/photos/PersonPhoto14.jsx"},{"name":"PersonPhoto16","sourcePath":"components/photos/PersonPhoto16.jsx"},{"name":"PersonPhoto23","sourcePath":"components/photos/PersonPhoto23.jsx"},{"name":"PersonPhoto4","sourcePath":"components/photos/PersonPhoto4.jsx"}],"sourceHashes":{"components/charts/BarChart.jsx":"5b3d72099092","components/charts/Gauge.jsx":"6592c6c268d1","components/charts/LineChart.jsx":"66b39a209a6b","components/core/Badge.jsx":"ff88a692b5c0","components/core/Button.jsx":"022d93d954cf","components/core/Card.jsx":"d0b2ec2a8cd8","components/core/IconTile.jsx":"e3b64d6b2a85","components/core/Input.jsx":"9c3dc560e7ae","components/core/ProgressBar.jsx":"756f8dc29415","components/core/Switch.jsx":"2b4c1e380dff","components/data/AvatarsGroup.jsx":"6e02e4663102","components/data/Balance.jsx":"b19882e0a38f","components/data/CreditCard.jsx":"5d3835485c4d","components/data/InvoiceItem.jsx":"8802ed445a8a","components/data/MiniStat.jsx":"d68f61749ebf","components/data/StatCard.jsx":"924d27a312ce","components/data/TransactionItem.jsx":"37067a1e48bc","components/icons/Icon.jsx":"b81dfc2559d3","components/icons/icon-data.js":"56d0fbc6ccbb","components/navigation/Avatar.jsx":"952d8f80aa1b","components/navigation/Breadcrumb.jsx":"5c184515d5ac","components/navigation/HelpCard.jsx":"27069378e129","components/navigation/Logo.jsx":"ff2007f01bd7","components/navigation/NavItem.jsx":"fd06788858ba","components/navigation/PageHeader.jsx":"4b4c32ee4531","components/navigation/Sidebar.jsx":"2f52fb8c8c4f","components/navigation/SidebarToggle.jsx":"108ed59cc787","components/photos/PersonPhoto14.jsx":"670c5e4ed3e6","components/photos/PersonPhoto16.jsx":"174b37391c6b","components/photos/PersonPhoto23.jsx":"815e8525022b","components/photos/PersonPhoto4.jsx":"b492925b653d","ui_kits/finance-web/AccountsScreen.jsx":"e588e59f8e84","ui_kits/finance-web/DashboardScreen.jsx":"84be812afaa6","ui_kits/finance-web/ReceiptsScreen.jsx":"effa71fcb43d","ui_kits/finance-web/Shell.jsx":"eba3162f8dfd","ui_kits/finance-web/SignInScreen.jsx":"d466c285884a","ui_kits/finance-web/TransactionDrawer.jsx":"c4a6e86b88fa","ui_kits/finance-web/TransactionsScreen.jsx":"0b6879b216d5","ui_kits/finance-web/data.js":"9f5aa415fe1f"},"inlinedExternals":[],"unexposedExports":[]} */

(() => {

const __ds_ns = (window.VisionFinanceDesignSystem_6fe7b7 = window.VisionFinanceDesignSystem_6fe7b7 || {});

const __ds_scope = {};

(__ds_ns.__errors = __ds_ns.__errors || []);

// components/charts/BarChart.jsx
try { (() => {
function BarChart({
  data = [],
  labels,
  max,
  ticks = 5,
  height = 222,
  barColor = 'var(--white)',
  style
}) {
  const m = max ?? Math.ceil(Math.max(1, ...data) / 100) * 100;
  const tickVals = Array.from({
    length: ticks + 1
  }, (_, i) => Math.round(m / ticks * (ticks - i)));
  return /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative',
      height,
      borderRadius: 20,
      background: 'var(--gradient-inset)',
      padding: '31.5px 35px 31px 30px',
      boxSizing: 'border-box',
      display: 'flex',
      gap: 47,
      fontFamily: 'var(--font-sans)',
      ...style
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      flexShrink: 0
    }
  }, tickVals.map((v, i) => /*#__PURE__*/React.createElement("span", {
    key: i,
    style: {
      fontWeight: 700,
      fontSize: 10,
      lineHeight: 1.5,
      color: 'var(--white)'
    }
  }, v))), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      display: 'flex',
      alignItems: 'flex-end',
      justifyContent: 'space-between',
      paddingBottom: 6,
      paddingTop: 2
    }
  }, data.map((v, i) => /*#__PURE__*/React.createElement("div", {
    key: i,
    title: labels ? labels[i] + ': ' + v : String(v),
    style: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      height: '100%',
      justifyContent: 'flex-end'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 6,
      height: v / m * 100 + '%',
      borderRadius: 3,
      background: barColor,
      transition: 'height var(--dur-slow) var(--ease-out)'
    }
  })))));
}
Object.assign(__ds_scope, { BarChart, __ds_default_components_charts_BarChart_1qmp8ad: BarChart });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/charts/BarChart.jsx", error: String((e && e.message) || e) }); }

// components/charts/LineChart.jsx
try { (() => {
function smooth(pts) {
  if (pts.length < 2) return '';
  let d = 'M ' + pts[0][0] + ' ' + pts[0][1];
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[i - 1] || pts[i],
      p1 = pts[i],
      p2 = pts[i + 1],
      p3 = pts[i + 2] || p2;
    const c1 = [p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6],
      c2 = [p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6];
    d += ' C ' + c1.join(' ') + ' ' + c2.join(' ') + ' ' + p2.join(' ');
  }
  return d;
}
const COLORS = {
  blue: ['rgb(0,117,255)', 'rgb(0,117,255)', 1],
  cyan: ['rgb(44,217,255)', 'rgba(44,217,255,0.36)', 1],
  green: ['rgb(1,181,116)', 'rgba(1,181,116,0.14)', 1]
};
function LineChart({
  series = [],
  labels = [],
  max,
  ticks = 5,
  height = 296,
  style
}) {
  const id = React.useId ? React.useId().replace(/:/g, '') : 'lc';
  const W = 840,
    H = 250,
    top = 7.5;
  const all = series.flatMap(s => s.data);
  const m = max ?? Math.ceil(Math.max(1, ...all) / 100) * 100;
  const n = Math.max(...series.map(s => s.data.length), labels.length, 2);
  const x = i => i * (W / (n - 1)),
    y = v => top + H - v / m * H;
  const tickVals = Array.from({
    length: ticks + 1
  }, (_, i) => Math.round(m / ticks * (ticks - i)));
  return /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative',
      width: '100%',
      height,
      fontFamily: 'var(--font-sans)',
      ...style
    }
  }, /*#__PURE__*/React.createElement("svg", {
    viewBox: `-41 0 ${W + 43} ${H + top + 40}`,
    preserveAspectRatio: "none",
    style: {
      width: '100%',
      height: '100%',
      overflow: 'visible'
    }
  }, /*#__PURE__*/React.createElement("defs", null, series.map((s, i) => {
    const c = COLORS[s.color || 'blue'];
    return /*#__PURE__*/React.createElement("linearGradient", {
      key: i,
      id: id + 'g' + i,
      x1: "0",
      y1: "0",
      x2: "0",
      y2: "1"
    }, /*#__PURE__*/React.createElement("stop", {
      offset: "0",
      stopColor: c[1],
      stopOpacity: s.color === 'blue' || !s.color ? 0.9 : 1
    }), /*#__PURE__*/React.createElement("stop", {
      offset: "1",
      stopColor: c[0],
      stopOpacity: "0"
    }));
  })), tickVals.map((v, i) => /*#__PURE__*/React.createElement("g", {
    key: i
  }, /*#__PURE__*/React.createElement("line", {
    x1: "0",
    x2: W,
    y1: y(v),
    y2: y(v),
    stroke: "rgb(86,87,122)",
    strokeWidth: "1",
    strokeDasharray: "5 5",
    vectorEffect: "non-scaling-stroke"
  }))), series.map((s, i) => {
    const pts = s.data.map((v, j) => [x(j), y(v)]);
    const d = smooth(pts);
    const c = COLORS[s.color || 'blue'];
    return /*#__PURE__*/React.createElement("g", {
      key: i
    }, /*#__PURE__*/React.createElement("path", {
      d: d + ` L ${x(s.data.length - 1)} ${top + H} L 0 ${top + H} Z`,
      fill: `url(#${id}g${i})`
    }), /*#__PURE__*/React.createElement("path", {
      d: d,
      fill: "none",
      stroke: c[0],
      strokeWidth: "3",
      vectorEffect: "non-scaling-stroke"
    }));
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      left: 0,
      top: 0,
      bottom: 40,
      width: 30,
      pointerEvents: 'none'
    }
  }, tickVals.map((v, i) => /*#__PURE__*/React.createElement("span", {
    key: i,
    style: {
      position: 'absolute',
      left: 0,
      top: `calc(${y(v) / (H + top + 40) * 100}% - 7px)`,
      fontWeight: 700,
      fontSize: 10,
      lineHeight: 1.5,
      color: 'var(--gray-400)'
    }
  }, v))), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      left: '4.6%',
      right: 0,
      bottom: 0,
      display: 'flex',
      justifyContent: 'space-between'
    }
  }, labels.map((l, i) => /*#__PURE__*/React.createElement("span", {
    key: i,
    style: {
      fontWeight: 700,
      fontSize: 10,
      lineHeight: 1.5,
      color: 'var(--gray-400)'
    }
  }, l))));
}
Object.assign(__ds_scope, { LineChart, __ds_default_components_charts_LineChart_91xyjs: LineChart });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/charts/LineChart.jsx", error: String((e && e.message) || e) }); }

// components/core/Badge.jsx
try { (() => {
const TONE = {
  green: 'var(--green-500)',
  blue: 'var(--blue-500)',
  red: 'var(--red-500)',
  orange: 'var(--orange-400)',
  gray: 'var(--navy-500)'
};
function Badge({
  variant = 'count',
  tone = 'blue',
  children,
  style
}) {
  if (variant === 'dot') return /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'inline-block',
      width: 8,
      height: 8,
      borderRadius: '50%',
      background: TONE[tone],
      boxShadow: '0 0 0 2px var(--navy-900)',
      ...style
    }
  });
  if (variant === 'count') return /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      minWidth: 20,
      height: 20,
      padding: '0 6px',
      boxSizing: 'border-box',
      borderRadius: 'var(--radius-pill)',
      background: TONE[tone],
      color: 'var(--white)',
      font: 'var(--fw-bold) 10px/1 var(--font-sans)',
      ...style
    }
  }, children);
  const filled = variant === 'solid';
  return /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      height: 25,
      padding: '0 10.5px',
      boxSizing: 'border-box',
      borderRadius: 'var(--radius-sm)',
      background: filled ? TONE[tone] : 'transparent',
      boxShadow: filled ? 'none' : 'inset 0 0 0 1px var(--white)',
      color: 'var(--white)',
      font: 'var(--fw-regular) 14px/1.4 var(--font-sans)',
      whiteSpace: 'nowrap',
      ...style
    }
  }, children);
}
Object.assign(__ds_scope, { Badge, __ds_default_components_core_Badge_2ajn45: Badge });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Badge.jsx", error: String((e && e.message) || e) }); }

// components/core/Card.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const BG = {
  default: 'var(--gradient-card)',
  soft: 'var(--gradient-card-soft)',
  inset: 'var(--gradient-inset)',
  row: 'var(--gradient-row)'
};
function Card({
  variant = 'default',
  title,
  subtitle,
  action,
  padding,
  children,
  style,
  ...rest
}) {
  const pad = padding ?? (variant === 'row' ? '26px 27px' : '28px 22px 22px');
  return /*#__PURE__*/React.createElement("div", _extends({
    style: {
      position: 'relative',
      borderRadius: 'var(--radius-card)',
      background: BG[variant],
      backdropFilter: 'var(--blur-card)',
      WebkitBackdropFilter: 'var(--blur-card)',
      padding: pad,
      boxSizing: 'border-box',
      color: 'var(--white)',
      fontFamily: 'var(--font-sans)',
      minWidth: 0,
      ...style
    }
  }, rest), title || action ? /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'flex-start',
      justifyContent: 'space-between',
      gap: 16,
      marginBottom: children ? 24 : 0
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 6,
      minWidth: 0
    }
  }, title ? /*#__PURE__*/React.createElement("div", {
    style: {
      font: 'var(--text-card-title)',
      color: 'var(--white)'
    }
  }, title) : null, subtitle ? /*#__PURE__*/React.createElement("div", {
    style: {
      font: 'var(--fw-regular) var(--fs-body)/1.4 var(--font-sans)',
      color: 'var(--gray-400)'
    }
  }, subtitle) : null), action || null) : null, children);
}
Object.assign(__ds_scope, { Card, __ds_default_components_core_Card_pwdrbg: Card });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Card.jsx", error: String((e && e.message) || e) }); }

// components/core/ProgressBar.jsx
try { (() => {
function ProgressBar({
  value = 0,
  label,
  width = 125,
  color = 'var(--blue-500)',
  style
}) {
  const v = Math.max(0, Math.min(100, value));
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 4,
      width,
      fontFamily: 'var(--font-sans)',
      ...style
    }
  }, label !== undefined ? /*#__PURE__*/React.createElement("span", {
    style: {
      fontWeight: 700,
      fontSize: 14,
      lineHeight: 1.4,
      color: 'var(--white)'
    }
  }, label) : null, /*#__PURE__*/React.createElement("span", {
    style: {
      position: 'relative',
      height: 3,
      borderRadius: 1.5,
      background: 'var(--track)'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      position: 'absolute',
      left: 0,
      top: 0,
      bottom: 0,
      width: v + '%',
      borderRadius: 1.5,
      background: color,
      transition: 'width var(--dur-slow) var(--ease-out)'
    }
  })));
}
Object.assign(__ds_scope, { ProgressBar, __ds_default_components_core_ProgressBar_u27gm4: ProgressBar });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/ProgressBar.jsx", error: String((e && e.message) || e) }); }

// components/core/Switch.jsx
try { (() => {
function Switch({
  checked,
  defaultChecked = false,
  onChange,
  label,
  style
}) {
  const [inner, setInner] = React.useState(defaultChecked);
  const on = checked ?? inner;
  const toggle = () => {
    const v = !on;
    if (checked === undefined) setInner(v);
    onChange && onChange(v);
  };
  return /*#__PURE__*/React.createElement("label", {
    onClick: toggle,
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 10,
      cursor: 'pointer',
      fontFamily: 'var(--font-sans)',
      fontSize: 12,
      lineHeight: 1.5,
      color: 'var(--white)',
      userSelect: 'none',
      ...style
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      position: 'relative',
      width: 36,
      height: 18.484,
      borderRadius: 97.74,
      background: on ? 'var(--blue-500)' : 'var(--navy-500)',
      transition: 'background var(--dur-base) var(--ease-out)',
      flexShrink: 0
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      position: 'absolute',
      top: 2.49,
      left: on ? 20 : 2.5,
      width: 13.5,
      height: 13.5,
      borderRadius: '50%',
      background: 'var(--white)',
      transition: 'left var(--dur-base) var(--ease-out)'
    }
  })), label);
}
Object.assign(__ds_scope, { Switch, __ds_default_components_core_Switch_g2n7us: Switch });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Switch.jsx", error: String((e && e.message) || e) }); }

// components/data/AvatarsGroup.jsx
try { (() => {
function AvatarsGroup({
  srcs = [],
  size = 46,
  overlap,
  max,
  style
}) {
  const ring = Math.max(1.5, size / 11.5);
  const step = size - (overlap ?? size * 0.33);
  const list = max ? srcs.slice(0, max) : srcs;
  return /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative',
      display: 'inline-flex',
      height: size,
      width: size + step * (list.length - 1),
      ...style
    }
  }, list.map((s, i) => /*#__PURE__*/React.createElement("span", {
    key: i,
    style: {
      position: 'absolute',
      left: i * step,
      top: 0,
      width: size,
      height: size,
      borderRadius: '50%',
      background: `url(${s}) center/cover no-repeat, var(--violet-600)`,
      boxShadow: `0 0 0 ${ring}px var(--navy-800)`
    }
  })));
}
Object.assign(__ds_scope, { AvatarsGroup, __ds_default_components_data_AvatarsGroup_o5rpia: AvatarsGroup });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/data/AvatarsGroup.jsx", error: String((e && e.message) || e) }); }

// components/data/CreditCard.jsx
try { (() => {
function CreditCard({
  brand = 'Vision UI',
  number = '7812 2139 0823 XXXX',
  validThru = '05/24',
  cvv = '09X',
  image,
  style
}) {
  const lbl = {
    fontSize: 10,
    lineHeight: 1.5,
    color: 'var(--white)'
  };
  const val = {
    fontWeight: 700,
    fontSize: 14,
    lineHeight: 1.4,
    color: 'var(--white)'
  };
  return /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative',
      overflow: 'hidden',
      minHeight: 240,
      borderRadius: 20,
      background: image ? `url(${image}) center/cover no-repeat, var(--gradient-card-violet)` : 'var(--gradient-card-violet)',
      padding: '22px 31px 37px',
      boxSizing: 'border-box',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      fontFamily: 'var(--font-sans)',
      ...style
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontWeight: 700,
      fontSize: 18,
      lineHeight: 1.4,
      color: 'var(--white)',
      marginTop: 4
    }
  }, brand), /*#__PURE__*/React.createElement("span", {
    style: {
      position: 'relative',
      width: 49.2,
      height: 32.8
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      position: 'absolute',
      left: 0,
      width: 32.8,
      height: 32.8,
      borderRadius: '50%',
      background: 'var(--white)',
      opacity: 0.4
    }
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      position: 'absolute',
      left: 16.4,
      width: 32.8,
      height: 32.8,
      borderRadius: '50%',
      background: 'var(--white)',
      opacity: 0.4
    }
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 12
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontWeight: 700,
      fontSize: 24,
      lineHeight: 1.4,
      color: 'var(--white)',
      whiteSpace: 'nowrap'
    }
  }, number), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 34.5
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'flex',
      flexDirection: 'column'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: lbl
  }, "VALID THRU"), /*#__PURE__*/React.createElement("span", {
    style: val
  }, validThru)), /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'flex',
      flexDirection: 'column'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: lbl
  }, "CVV"), /*#__PURE__*/React.createElement("span", {
    style: val
  }, cvv)))));
}
Object.assign(__ds_scope, { CreditCard, __ds_default_components_data_CreditCard_whb7lk: CreditCard });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/data/CreditCard.jsx", error: String((e && e.message) || e) }); }

// components/icons/icon-data.js
try { (() => {
// Generated by fig_materialize (moduleFormat: 'icon-data') — 36 icon(s)
// as { viewBox, body } SVG-markup entries. Render via the sibling Icon.jsx
// (<Icon name="Delete" />), or consume the path data directly.
let __ds_default_components_icons_icon_data_12stud1;
try {
  __ds_default_components_icons_icon_data_12stud1 = {
    "Delete": {
      viewBox: "0 0 24 24",
      body: "<path d=\"M 0 0 L 24 0 L 24 24 L 0 24 L 0 0 Z\" fill=\"currentColor\" fill-rule=\"evenodd\"/><path d=\"M 1 16 C 1 17.1 1.9 18 3 18 L 11 18 C 12.1 18 13 17.1 13 16 L 13 6 C 13 4.9 12.1 4 11 4 L 3 4 C 1.9 4 1 4.9 1 6 L 1 16 Z M 13 1 L 10.5 1 L 9.79 0.29 C 9.61 0.11 9.35 0 9.09 0 L 4.91 0 C 4.65 0 4.39 0.11 4.21 0.29 L 3.5 1 L 1 1 C 0.45 1 0 1.45 0 2 C 0 2.55 0.45 3 1 3 L 13 3 C 13.55 3 14 2.55 14 2 C 14 1.45 13.55 1 13 1 Z\" fill=\"currentColor\" fill-rule=\"nonzero\" transform=\"matrix(1 0 0 1 5 3)\"/>"
    },
    "Domain": {
      viewBox: "0 0 24 24",
      body: "<path d=\"M 0 0 L 24 0 L 24 24 L 0 24 L 0 0 Z\" fill=\"currentColor\" fill-rule=\"evenodd\"/><path d=\"M 10 4 L 10 0 L 0 0 L 0 18 L 20 18 L 20 4 L 10 4 Z M 4 16 L 2 16 L 2 14 L 4 14 L 4 16 Z M 4 12 L 2 12 L 2 10 L 4 10 L 4 12 Z M 4 8 L 2 8 L 2 6 L 4 6 L 4 8 Z M 4 4 L 2 4 L 2 2 L 4 2 L 4 4 Z M 8 16 L 6 16 L 6 14 L 8 14 L 8 16 Z M 8 12 L 6 12 L 6 10 L 8 10 L 8 12 Z M 8 8 L 6 8 L 6 6 L 8 6 L 8 8 Z M 8 4 L 6 4 L 6 2 L 8 2 L 8 4 Z M 18 16 L 10 16 L 10 14 L 12 14 L 12 12 L 10 12 L 10 10 L 12 10 L 12 8 L 10 8 L 10 6 L 18 6 L 18 16 Z M 16 8 L 14 8 L 14 10 L 16 10 L 16 8 Z M 16 12 L 14 12 L 14 14 L 16 14 L 16 12 Z\" fill=\"currentColor\" fill-rule=\"nonzero\" transform=\"matrix(1 0 0 1 2 3)\"/>"
    },
    "Edit": {
      viewBox: "0 0 24 24",
      body: "<path d=\"M 0 0 L 24 0 L 24 24 L 0 24 L 0 0 Z\" fill=\"currentColor\" fill-rule=\"evenodd\"/><path d=\"M 0 14.462 L 0 17.503 C 0 17.783 0.22 18.003 0.5 18.003 L 3.54 18.003 C 3.67 18.003 3.8 17.953 3.89 17.853 L 14.81 6.942 L 11.06 3.193 L 0.15 14.102 C 0.05 14.203 0 14.322 0 14.462 Z M 17.71 4.043 C 18.1 3.653 18.1 3.023 17.71 2.633 L 15.37 0.292 C 14.98 -0.097 14.35 -0.097 13.96 0.292 L 12.13 2.122 L 15.88 5.872 L 17.71 4.043 L 17.71 4.043 Z\" fill=\"currentColor\" fill-rule=\"nonzero\" transform=\"matrix(1 0 0 1 3 2.997)\"/>"
    },
    "IONIconAArrowForward": {
      viewBox: "0 0 24 24",
      body: "<path d=\"M 0.795 -0.795 C 0.356 -1.235 -0.356 -1.235 -0.795 -0.795 C -1.235 -0.356 -1.235 0.356 -0.795 0.795 L 0.795 -0.795 Z M 6.75 6.75 L 7.545 7.545 C 7.985 7.106 7.985 6.394 7.545 5.955 L 6.75 6.75 Z M -0.795 12.704 C -1.235 13.144 -1.235 13.856 -0.795 14.295 C -0.356 14.735 0.356 14.735 0.795 14.295 L -0.795 12.704 Z M -0.795 0.795 L 5.955 7.545 L 7.545 5.955 L 0.795 -0.795 L -0.795 0.795 Z M 5.955 5.955 L -0.795 12.704 L 0.795 14.295 L 7.545 7.545 L 5.955 5.955 Z\" fill=\"currentColor\" fill-rule=\"nonzero\" transform=\"matrix(1 0 0 1 12.563 5.250)\"/><path d=\"M 13.687 1.125 C 14.309 1.125 14.812 0.621 14.812 0 C 14.812 -0.621 14.309 -1.125 13.687 -1.125 L 13.687 1.125 Z M 0 -1.125 C -0.621 -1.125 -1.125 -0.621 -1.125 0 C -1.125 0.621 -0.621 1.125 0 1.125 L 0 -1.125 Z M 13.687 -1.125 L 0 -1.125 L 0 1.125 L 13.687 1.125 L 13.687 -1.125 Z\" fill=\"currentColor\" fill-rule=\"nonzero\" transform=\"matrix(1 0 0 1 4.687 12.000)\"/>"
    },
    "IONIconBBuildDefault": {
      viewBox: "0 0 24 24",
      body: "<path d=\"M 20.51 4.185 C 20.456 4.08 20.378 3.989 20.282 3.92 C 20.187 3.85 20.076 3.805 19.959 3.787 C 19.842 3.768 19.723 3.778 19.611 3.814 C 19.499 3.851 19.396 3.914 19.313 3.997 L 16.433 6.879 C 16.292 7.018 16.101 7.096 15.903 7.096 C 15.704 7.096 15.514 7.018 15.372 6.879 L 14.127 5.632 C 14.057 5.562 14.002 5.48 13.965 5.389 C 13.927 5.298 13.907 5.2 13.907 5.102 C 13.907 5.003 13.927 4.906 13.965 4.815 C 14.002 4.724 14.057 4.641 14.127 4.571 L 16.995 1.703 C 17.081 1.617 17.145 1.511 17.181 1.395 C 17.217 1.279 17.224 1.156 17.202 1.037 C 17.18 0.917 17.129 0.805 17.054 0.709 C 16.979 0.613 16.882 0.538 16.771 0.488 L 16.771 0.488 C 14.605 -0.48 11.901 0.025 10.196 1.717 C 8.748 3.155 8.316 5.402 9.013 7.883 C 9.05 8.015 9.05 8.155 9.013 8.287 C 8.976 8.42 8.903 8.539 8.802 8.633 L 0.998 15.76 C 0.694 16.033 0.449 16.365 0.278 16.736 C 0.106 17.107 0.012 17.508 0.001 17.917 C -0.01 18.325 0.062 18.732 0.214 19.111 C 0.365 19.491 0.592 19.836 0.881 20.125 C 1.169 20.413 1.514 20.641 1.894 20.792 C 2.273 20.943 2.679 21.016 3.088 21.005 C 3.496 20.994 3.898 20.9 4.269 20.729 C 4.64 20.558 4.972 20.312 5.245 20.009 L 12.449 12.188 C 12.541 12.088 12.659 12.015 12.789 11.978 C 12.919 11.94 13.057 11.938 13.188 11.973 C 13.894 12.167 14.623 12.267 15.355 12.272 C 16.92 12.272 18.294 11.765 19.285 10.789 C 21.12 8.981 21.4 5.914 20.51 4.185 Z M 3.164 19.495 C 2.855 19.529 2.543 19.466 2.272 19.315 C 2 19.164 1.783 18.933 1.648 18.653 C 1.514 18.373 1.47 18.058 1.522 17.752 C 1.574 17.446 1.72 17.163 1.94 16.944 C 2.159 16.724 2.442 16.578 2.748 16.526 C 3.054 16.473 3.369 16.517 3.649 16.651 C 3.929 16.786 4.16 17.003 4.312 17.275 C 4.463 17.546 4.526 17.858 4.492 18.166 C 4.455 18.506 4.303 18.823 4.062 19.065 C 3.82 19.306 3.503 19.458 3.164 19.495 L 3.164 19.495 Z\" fill=\"currentColor\" fill-rule=\"nonzero\" transform=\"matrix(1 0 0 1 1.501 1.466)\"/>"
    },
    "IONIconCCalendarOutline": {
      viewBox: "0 0 24 24",
      body: "<path d=\"M 2.25 0.75 L 17.25 0.75 L 17.25 -0.75 L 2.25 -0.75 L 2.25 0.75 Z M 17.25 0.75 C 18.078 0.75 18.75 1.422 18.75 2.25 L 20.25 2.25 C 20.25 0.593 18.907 -0.75 17.25 -0.75 L 17.25 0.75 Z M 18.75 2.25 L 18.75 15.75 L 20.25 15.75 L 20.25 2.25 L 18.75 2.25 Z M 18.75 15.75 C 18.75 16.578 18.078 17.25 17.25 17.25 L 17.25 18.75 C 18.907 18.75 20.25 17.407 20.25 15.75 L 18.75 15.75 Z M 17.25 17.25 L 2.25 17.25 L 2.25 18.75 L 17.25 18.75 L 17.25 17.25 Z M 2.25 17.25 C 1.422 17.25 0.75 16.578 0.75 15.75 L -0.75 15.75 C -0.75 17.407 0.593 18.75 2.25 18.75 L 2.25 17.25 Z M 0.75 15.75 L 0.75 2.25 L -0.75 2.25 L -0.75 15.75 L 0.75 15.75 Z M 0.75 2.25 C 0.75 1.422 1.422 0.75 2.25 0.75 L 2.25 -0.75 C 0.593 -0.75 -0.75 0.593 -0.75 2.25 L 0.75 2.25 Z\" fill=\"currentColor\" fill-rule=\"nonzero\" transform=\"matrix(1 0 0 1 2.250 3.749)\"/><path d=\"M 16.398 0 L 3.102 0 C 1.392 0 0 1.413 0 3.15 L 0 6 L 0.75 6 C 0.75 5.25 1.5 4.5 2.25 4.5 L 17.25 4.5 C 18 4.5 18.75 5.25 18.75 6 L 19.5 6 L 19.5 3.15 C 19.5 1.413 18.108 0 16.398 0 Z\" fill=\"currentColor\" fill-rule=\"nonzero\" transform=\"matrix(1 0 0 1 2.250 3.749)\"/><path d=\"M 1.125 2.25 C 1.746 2.25 2.25 1.746 2.25 1.125 C 2.25 0.504 1.746 0 1.125 0 C 0.504 0 0 0.504 0 1.125 C 0 1.746 0.504 2.25 1.125 2.25 Z\" fill=\"currentColor\" fill-rule=\"nonzero\" transform=\"matrix(1 0 0 1 12.750 9.749)\"/><path d=\"M 1.125 2.25 C 1.746 2.25 2.25 1.746 2.25 1.125 C 2.25 0.504 1.746 0 1.125 0 C 0.504 0 0 0.504 0 1.125 C 0 1.746 0.504 2.25 1.125 2.25 Z\" fill=\"currentColor\" fill-rule=\"nonzero\" transform=\"matrix(1 0 0 1 16.500 9.749)\"/><path d=\"M 1.125 2.25 C 1.746 2.25 2.25 1.746 2.25 1.125 C 2.25 0.504 1.746 0 1.125 0 C 0.504 0 0 0.504 0 1.125 C 0 1.746 0.504 2.25 1.125 2.25 Z\" fill=\"currentColor\" fill-rule=\"nonzero\" transform=\"matrix(1 0 0 1 12.750 13.498)\"/><path d=\"M 1.125 2.25 C 1.746 2.25 2.25 1.746 2.25 1.125 C 2.25 0.504 1.746 0 1.125 0 C 0.504 0 0 0.504 0 1.125 C 0 1.746 0.504 2.25 1.125 2.25 Z\" fill=\"currentColor\" fill-rule=\"nonzero\" transform=\"matrix(1 0 0 1 16.500 13.498)\"/><path d=\"M 1.125 2.25 C 1.746 2.25 2.25 1.746 2.25 1.125 C 2.25 0.504 1.746 0 1.125 0 C 0.504 0 0 0.504 0 1.125 C 0 1.746 0.504 2.25 1.125 2.25 Z\" fill=\"currentColor\" fill-rule=\"nonzero\" transform=\"matrix(1 0 0 1 5.250 13.498)\"/><path d=\"M 1.125 2.25 C 1.746 2.25 2.25 1.746 2.25 1.125 C 2.25 0.504 1.746 0 1.125 0 C 0.504 0 0 0.504 0 1.125 C 0 1.746 0.504 2.25 1.125 2.25 Z\" fill=\"currentColor\" fill-rule=\"nonzero\" transform=\"matrix(1 0 0 1 9 13.498)\"/><path d=\"M 1.125 2.25 C 1.746 2.25 2.25 1.746 2.25 1.125 C 2.25 0.504 1.746 0 1.125 0 C 0.504 0 0 0.504 0 1.125 C 0 1.746 0.504 2.25 1.125 2.25 Z\" fill=\"currentColor\" fill-rule=\"nonzero\" transform=\"matrix(1 0 0 1 5.250 17.249)\"/><path d=\"M 1.125 2.25 C 1.746 2.25 2.25 1.746 2.25 1.125 C 2.25 0.504 1.746 0 1.125 0 C 0.504 0 0 0.504 0 1.125 C 0 1.746 0.504 2.25 1.125 2.25 Z\" fill=\"currentColor\" fill-rule=\"nonzero\" transform=\"matrix(1 0 0 1 9 17.249)\"/><path d=\"M 1.125 2.25 C 1.746 2.25 2.25 1.746 2.25 1.125 C 2.25 0.504 1.746 0 1.125 0 C 0.504 0 0 0.504 0 1.125 C 0 1.746 0.504 2.25 1.125 2.25 Z\" fill=\"currentColor\" fill-rule=\"nonzero\" transform=\"matrix(1 0 0 1 12.750 17.249)\"/><path d=\"M 0.75 0 C 0.75 -0.414 0.414 -0.75 0 -0.75 C -0.414 -0.75 -0.75 -0.414 -0.75 0 L 0.75 0 Z M -0.75 1.5 C -0.75 1.914 -0.414 2.25 0 2.25 C 0.414 2.25 0.75 1.914 0.75 1.5 L -0.75 1.5 Z M -0.75 0 L -0.75 1.5 L 0.75 1.5 L 0.75 0 L -0.75 0 Z\" fill=\"currentColor\" fill-rule=\"nonzero\" transform=\"matrix(1 0 0 1 6.000 2.249)\"/><path d=\"M 0.75 0 C 0.75 -0.414 0.414 -0.75 0 -0.75 C -0.414 -0.75 -0.75 -0.414 -0.75 0 L 0.75 0 Z M -0.75 1.5 C -0.75 1.914 -0.414 2.25 0 2.25 C 0.414 2.25 0.75 1.914 0.75 1.5 L -0.75 1.5 Z M -0.75 0 L -0.75 1.5 L 0.75 1.5 L 0.75 0 L -0.75 0 Z\" fill=\"currentColor\" fill-rule=\"nonzero\" transform=\"matrix(1 0 0 1 18 2.249)\"/>"
    },
    "IONIconCCardDefault": {
      viewBox: "0 0 24 24",
      body: "<path d=\"M 0 7.219 C 0 7.915 0.277 8.583 0.769 9.075 C 1.261 9.567 1.929 9.844 2.625 9.844 L 18.375 9.844 C 19.071 9.844 19.739 9.567 20.231 9.075 C 20.723 8.583 21 7.915 21 7.219 L 21 0 L 0 0 L 0 7.219 Z M 3.094 3.656 C 3.094 3.283 3.242 2.926 3.506 2.662 C 3.769 2.398 4.127 2.25 4.5 2.25 L 6.75 2.25 C 7.123 2.25 7.481 2.398 7.744 2.662 C 8.008 2.926 8.156 3.283 8.156 3.656 L 8.156 4.594 C 8.156 4.967 8.008 5.324 7.744 5.588 C 7.481 5.852 7.123 6 6.75 6 L 4.5 6 C 4.127 6 3.769 5.852 3.506 5.588 C 3.242 5.324 3.094 4.967 3.094 4.594 L 3.094 3.656 Z\" fill=\"currentColor\" fill-rule=\"nonzero\" transform=\"matrix(1 0 0 1 1.500 10.406)\"/><path d=\"M 18.375 0 L 2.625 0 C 1.929 0 1.261 0.277 0.769 0.769 C 0.277 1.261 0 1.929 0 2.625 L 0 3.844 L 21 3.844 L 21 2.625 C 21 1.929 20.723 1.261 20.231 0.769 C 19.739 0.277 19.071 0 18.375 0 L 18.375 0 Z\" fill=\"currentColor\" fill-rule=\"nonzero\" transform=\"matrix(1 0 0 1 1.500 3.749)\"/>"
    },
    "IONIconCCartDefault": {
      viewBox: "0 0 24 24",
      body: "<path d=\"M 1.5 3 C 2.328 3 3 2.328 3 1.5 C 3 0.672 2.328 0 1.5 0 C 0.672 0 0 0.672 0 1.5 C 0 2.328 0.672 3 1.5 3 Z\" fill=\"currentColor\" fill-rule=\"nonzero\" transform=\"matrix(1 0 0 1 6.750 18)\"/><path d=\"M 1.5 3 C 2.328 3 3 2.328 3 1.5 C 3 0.672 2.328 0 1.5 0 C 0.672 0 0 0.672 0 1.5 C 0 2.328 0.672 3 1.5 3 Z\" fill=\"currentColor\" fill-rule=\"nonzero\" transform=\"matrix(1 0 0 1 17.250 18)\"/><path d=\"M 19.912 2.662 C 19.807 2.533 19.674 2.429 19.524 2.358 C 19.373 2.286 19.209 2.25 19.042 2.25 L 4.776 2.25 L 4.489 0.62 C 4.458 0.446 4.367 0.289 4.232 0.175 C 4.097 0.062 3.926 0 3.75 0 L 0.75 0 C 0.551 0 0.36 0.079 0.22 0.22 C 0.079 0.36 0 0.551 0 0.75 C 0 0.949 0.079 1.14 0.22 1.28 C 0.36 1.421 0.551 1.5 0.75 1.5 L 3.121 1.5 L 5.261 13.63 C 5.292 13.804 5.383 13.961 5.518 14.075 C 5.653 14.188 5.824 14.25 6 14.25 L 18 14.25 C 18.199 14.25 18.39 14.171 18.53 14.03 C 18.671 13.89 18.75 13.699 18.75 13.5 C 18.75 13.301 18.671 13.11 18.53 12.97 C 18.39 12.829 18.199 12.75 18 12.75 L 6.629 12.75 L 6.365 11.25 L 17.692 11.25 C 17.953 11.25 18.205 11.159 18.406 10.995 C 18.607 10.83 18.745 10.601 18.797 10.346 L 20.147 3.596 C 20.179 3.432 20.175 3.264 20.135 3.102 C 20.094 2.941 20.018 2.79 19.912 2.662 L 19.912 2.662 Z\" fill=\"currentColor\" fill-rule=\"nonzero\" transform=\"matrix(1 0 0 1 1.500 3.000)\"/>"
    },
    "IONIconCCheckmarkCCircle": {
      viewBox: "0 0 24 24",
      body: "<path d=\"M 9.75 0 C 4.374 0 0 4.374 0 9.75 C 0 15.126 4.374 19.5 9.75 19.5 C 15.126 19.5 19.5 15.126 19.5 9.75 C 19.5 4.374 15.126 0 9.75 0 Z M 14.824 6.482 L 8.524 13.982 C 8.455 14.065 8.369 14.131 8.272 14.177 C 8.175 14.224 8.069 14.248 7.962 14.25 L 7.949 14.25 C 7.844 14.25 7.74 14.228 7.644 14.185 C 7.548 14.142 7.462 14.08 7.392 14.002 L 4.692 11.002 C 4.623 10.929 4.57 10.843 4.535 10.749 C 4.5 10.656 4.484 10.556 4.488 10.456 C 4.492 10.356 4.516 10.258 4.559 10.168 C 4.601 10.077 4.661 9.996 4.736 9.93 C 4.81 9.863 4.897 9.811 4.991 9.779 C 5.086 9.746 5.186 9.732 5.286 9.739 C 5.385 9.745 5.483 9.771 5.572 9.816 C 5.662 9.861 5.741 9.923 5.806 9.998 L 7.929 12.357 L 13.676 5.518 C 13.805 5.369 13.987 5.276 14.183 5.261 C 14.38 5.245 14.575 5.307 14.725 5.434 C 14.876 5.561 14.971 5.742 14.99 5.938 C 15.008 6.134 14.949 6.33 14.824 6.482 L 14.824 6.482 Z\" fill=\"currentColor\" fill-rule=\"nonzero\" transform=\"matrix(1 0 0 1 2.250 2.250)\"/>"
    },
    "IONIconCCubeDefault": {
      viewBox: "0 0 24 24",
      body: "<path d=\"M 17.426 4.889 C 17.455 4.872 17.478 4.849 17.495 4.82 C 17.511 4.792 17.519 4.76 17.519 4.727 C 17.519 4.694 17.511 4.662 17.495 4.634 C 17.478 4.605 17.455 4.582 17.426 4.565 L 10.267 0.405 C 9.809 0.14 9.289 0 8.759 0 C 8.23 0 7.709 0.14 7.251 0.405 L 0.093 4.565 C 0.065 4.582 0.041 4.605 0.025 4.634 C 0.009 4.662 0 4.694 0 4.727 C 0 4.76 0.009 4.792 0.025 4.82 C 0.041 4.849 0.065 4.872 0.093 4.889 L 8.666 9.932 C 8.694 9.949 8.727 9.958 8.761 9.958 C 8.794 9.958 8.827 9.949 8.856 9.932 L 17.426 4.889 Z\" fill=\"currentColor\" fill-rule=\"nonzero\" transform=\"matrix(1 0 0 1 3.241 1.499)\"/><path d=\"M 0.281 0.025 C 0.253 0.009 0.22 0 0.187 0 C 0.154 0 0.122 0.009 0.093 0.025 C 0.065 0.042 0.041 0.066 0.025 0.095 C 0.008 0.123 0 0.156 0 0.189 L 0 8.34 C 0.001 8.733 0.104 9.118 0.3 9.459 C 0.496 9.799 0.778 10.082 1.118 10.28 L 8.719 14.838 C 8.747 14.854 8.78 14.863 8.812 14.863 C 8.845 14.863 8.878 14.854 8.906 14.838 C 8.935 14.821 8.958 14.798 8.975 14.769 C 8.991 14.741 9 14.708 9 14.675 L 9 5.218 C 9 5.186 8.991 5.153 8.975 5.125 C 8.958 5.096 8.935 5.073 8.906 5.056 L 0.281 0.025 Z\" fill=\"currentColor\" fill-rule=\"nonzero\" transform=\"matrix(1 0 0 1 2.250 7.638)\"/><path d=\"M 0 5.249 L 0 14.671 C 0 14.704 0.009 14.736 0.025 14.765 C 0.042 14.793 0.065 14.817 0.094 14.833 C 0.122 14.85 0.155 14.859 0.188 14.859 C 0.22 14.859 0.253 14.85 0.281 14.833 L 7.882 10.276 C 8.221 10.078 8.503 9.796 8.699 9.456 C 8.895 9.116 8.999 8.73 9 8.338 L 9 0.187 C 9 0.154 8.991 0.122 8.975 0.093 C 8.958 0.065 8.934 0.041 8.906 0.025 C 8.877 0.009 8.845 0 8.812 0 C 8.779 0 8.747 0.009 8.719 0.025 L 0.094 5.088 C 0.065 5.104 0.042 5.128 0.025 5.156 C 0.009 5.184 0 5.217 0 5.249 L 0 5.249 Z\" fill=\"currentColor\" fill-rule=\"nonzero\" transform=\"matrix(1 0 0 1 12.750 7.640)\"/>"
    },
    "IONIconCCubeSharp": {
      viewBox: "0 0 24 24",
      body: "<path d=\"M 0 0 L 0 9.231 L 9 14.531 L 9 5.344 L 0 0 Z\" fill=\"currentColor\" fill-rule=\"nonzero\" transform=\"matrix(1 0 0 1 2.250 7.967)\"/><path d=\"M 0 14.531 L 9 9.231 L 9 0 L 0 5.344 L 0 14.531 Z\" fill=\"currentColor\" fill-rule=\"nonzero\" transform=\"matrix(1 0 0 1 12.750 7.967)\"/><path d=\"M 18 5.25 L 9 0 L 0 5.25 L 9 10.5 L 18 5.25 Z\" fill=\"currentColor\" fill-rule=\"nonzero\" transform=\"matrix(1 0 0 1 3 1.499)\"/>"
    },
    "IONIconDDocumentDefault": {
      viewBox: "0 0 24 24",
      body: "<path d=\"M 16.312 9 L 9.75 9 C 9.153 9 8.581 8.763 8.159 8.341 C 7.737 7.919 7.5 7.347 7.5 6.75 L 7.5 0.187 C 7.5 0.138 7.48 0.09 7.445 0.055 C 7.41 0.02 7.362 0 7.312 0 L 3 0 C 2.204 0 1.441 0.316 0.879 0.879 C 0.316 1.441 0 2.204 0 3 L 0 18 C 0 18.796 0.316 19.559 0.879 20.121 C 1.441 20.684 2.204 21 3 21 L 13.5 21 C 14.296 21 15.059 20.684 15.621 20.121 C 16.184 19.559 16.5 18.796 16.5 18 L 16.5 9.187 C 16.5 9.138 16.48 9.09 16.445 9.055 C 16.41 9.02 16.362 9 16.312 9 Z\" fill=\"currentColor\" fill-rule=\"nonzero\" transform=\"matrix(1 0 0 1 3.750 1.500)\"/><path d=\"M 6.901 6.768 L 0.16 0.027 C 0.147 0.014 0.13 0.005 0.112 0.002 C 0.094 -0.002 0.075 0 0.058 0.007 C 0.041 0.014 0.026 0.026 0.016 0.041 C 0.006 0.057 0 0.075 0 0.093 L 0 6.178 C 0 6.377 0.079 6.568 0.22 6.709 C 0.36 6.849 0.551 6.928 0.75 6.928 L 6.835 6.928 C 6.853 6.928 6.871 6.923 6.887 6.912 C 6.902 6.902 6.914 6.887 6.921 6.87 C 6.928 6.853 6.93 6.834 6.926 6.816 C 6.923 6.798 6.914 6.781 6.901 6.768 L 6.901 6.768 Z\" fill=\"currentColor\" fill-rule=\"nonzero\" transform=\"matrix(1 0 0 1 12.750 2.073)\"/>"
    },
    "IONIconDDocumentText": {
      viewBox: "0 0 24 24",
      body: "<path d=\"M 16.312 9 L 9.75 9 C 9.153 9 8.581 8.763 8.159 8.341 C 7.737 7.919 7.5 7.347 7.5 6.75 L 7.5 0.187 C 7.5 0.138 7.48 0.09 7.445 0.055 C 7.41 0.02 7.362 0 7.312 0 L 3 0 C 2.204 0 1.441 0.316 0.879 0.879 C 0.316 1.441 0 2.204 0 3 L 0 18 C 0 18.796 0.316 19.559 0.879 20.121 C 1.441 20.684 2.204 21 3 21 L 13.5 21 C 14.296 21 15.059 20.684 15.621 20.121 C 16.184 19.559 16.5 18.796 16.5 18 L 16.5 9.187 C 16.5 9.138 16.48 9.09 16.445 9.055 C 16.41 9.02 16.362 9 16.312 9 Z M 12 16.5 L 4.5 16.5 C 4.301 16.5 4.11 16.421 3.97 16.28 C 3.829 16.14 3.75 15.949 3.75 15.75 C 3.75 15.551 3.829 15.36 3.97 15.22 C 4.11 15.079 4.301 15 4.5 15 L 12 15 C 12.199 15 12.39 15.079 12.53 15.22 C 12.671 15.36 12.75 15.551 12.75 15.75 C 12.75 15.949 12.671 16.14 12.53 16.28 C 12.39 16.421 12.199 16.5 12 16.5 Z M 12 12.75 L 4.5 12.75 C 4.301 12.75 4.11 12.671 3.97 12.53 C 3.829 12.39 3.75 12.199 3.75 12 C 3.75 11.801 3.829 11.61 3.97 11.47 C 4.11 11.329 4.301 11.25 4.5 11.25 L 12 11.25 C 12.199 11.25 12.39 11.329 12.53 11.47 C 12.671 11.61 12.75 11.801 12.75 12 C 12.75 12.199 12.671 12.39 12.53 12.53 C 12.39 12.671 12.199 12.75 12 12.75 Z\" fill=\"currentColor\" fill-rule=\"nonzero\" transform=\"matrix(1 0 0 1 3.750 1.500)\"/><path d=\"M 6.901 6.768 L 0.16 0.027 C 0.147 0.014 0.13 0.005 0.112 0.002 C 0.094 -0.002 0.075 0 0.058 0.007 C 0.041 0.014 0.026 0.026 0.016 0.041 C 0.006 0.057 0 0.075 0 0.093 L 0 6.178 C 0 6.377 0.079 6.568 0.22 6.709 C 0.36 6.849 0.551 6.928 0.75 6.928 L 6.835 6.928 C 6.853 6.928 6.871 6.923 6.887 6.912 C 6.902 6.902 6.914 6.887 6.921 6.87 C 6.928 6.853 6.93 6.834 6.926 6.816 C 6.923 6.798 6.914 6.781 6.901 6.768 L 6.901 6.768 Z\" fill=\"currentColor\" fill-rule=\"nonzero\" transform=\"matrix(1 0 0 1 12.750 2.073)\"/>"
    },
    "IONIconDDocumentsDefault": {
      viewBox: "0 0 24 24",
      body: "<path d=\"M 3.862 4.112 C 3.899 4.112 3.935 4.101 3.966 4.08 C 3.997 4.06 4.021 4.031 4.035 3.997 C 4.049 3.963 4.053 3.925 4.046 3.889 C 4.039 3.853 4.022 3.819 3.996 3.793 L 0.321 0.056 C 0.295 0.029 0.262 0.011 0.225 0.004 C 0.189 -0.004 0.151 0 0.116 0.014 C 0.082 0.028 0.052 0.052 0.032 0.083 C 0.011 0.114 0 0.15 0 0.188 L 0 3.549 C 0 3.698 0.059 3.841 0.165 3.947 C 0.27 4.052 0.413 4.112 0.562 4.112 L 3.862 4.112 Z\" fill=\"currentColor\" fill-rule=\"nonzero\" transform=\"matrix(1 0 0 1 10.125 7.513)\"/><path d=\"M 6.984 5.766 C 6.792 5.576 6.639 5.349 6.534 5.1 C 6.43 4.851 6.376 4.583 6.375 4.312 L 6.375 0 L 3 0 C 2.205 0.002 1.443 0.319 0.881 0.881 C 0.319 1.443 0.002 2.205 0 3 L 0 13.5 C 0 14.296 0.316 15.059 0.879 15.621 C 1.441 16.184 2.204 16.5 3 16.5 L 9.75 16.5 C 10.546 16.5 11.309 16.184 11.871 15.621 C 12.434 15.059 12.75 14.296 12.75 13.5 L 12.75 6.375 L 8.437 6.375 C 8.167 6.375 7.899 6.321 7.65 6.216 C 7.4 6.111 7.174 5.958 6.984 5.766 L 6.984 5.766 Z\" fill=\"currentColor\" fill-rule=\"nonzero\" transform=\"matrix(1 0 0 1 2.250 6.750)\"/><path d=\"M 0.562 4.112 L 3.862 4.112 C 3.899 4.112 3.935 4.101 3.966 4.08 C 3.997 4.06 4.021 4.031 4.035 3.997 C 4.049 3.963 4.053 3.925 4.046 3.889 C 4.039 3.853 4.022 3.819 3.996 3.793 L 0.321 0.056 C 0.295 0.029 0.262 0.011 0.225 0.004 C 0.189 -0.004 0.151 0 0.116 0.014 C 0.082 0.028 0.052 0.052 0.032 0.083 C 0.011 0.114 0 0.15 0 0.188 L 0 3.549 C 0 3.698 0.059 3.841 0.165 3.947 C 0.27 4.052 0.413 4.112 0.562 4.112 Z\" fill=\"currentColor\" fill-rule=\"nonzero\" transform=\"matrix(1 0 0 1 16.875 1.513)\"/><path d=\"M 9.937 6.375 C 9.392 6.371 8.87 6.152 8.484 5.766 C 8.098 5.38 7.879 4.858 7.875 4.312 L 7.875 0 L 2.812 0 C 2.067 0.001 1.352 0.297 0.825 0.825 C 0.297 1.352 0.001 2.067 0 2.812 L 0 4.5 L 1.974 4.5 C 2.226 4.501 2.476 4.552 2.708 4.649 C 2.94 4.747 3.151 4.89 3.328 5.069 L 8.445 10.272 C 8.802 10.634 9.001 11.123 9 11.632 L 9 18 L 11.486 18 C 13.01 18 14.25 16.738 14.25 15.187 L 14.25 6.375 L 9.937 6.375 Z\" fill=\"currentColor\" fill-rule=\"nonzero\" transform=\"matrix(1 0 0 1 7.500 0.750)\"/>"
    },
    "IONIconGGlobeOutline": {
      viewBox: "0 0 24 24",
      body: "<path d=\"M 9.75 -0.75 C 3.951 -0.75 -0.75 3.951 -0.75 9.75 L 0.75 9.75 C 0.75 4.78 4.78 0.75 9.75 0.75 L 9.75 -0.75 Z M -0.75 9.75 C -0.75 15.549 3.951 20.25 9.75 20.25 L 9.75 18.75 C 4.78 18.75 0.75 14.72 0.75 9.75 L -0.75 9.75 Z M 9.75 20.25 C 15.549 20.25 20.25 15.549 20.25 9.75 L 18.75 9.75 C 18.75 14.72 14.72 18.75 9.75 18.75 L 9.75 20.25 Z M 20.25 9.75 C 20.25 3.951 15.549 -0.75 9.75 -0.75 L 9.75 0.75 C 14.72 0.75 18.75 4.78 18.75 9.75 L 20.25 9.75 Z\" fill=\"currentColor\" fill-rule=\"nonzero\" transform=\"matrix(1 0 0 1 2.250 2.249)\"/><path d=\"M 5.281 -0.75 C 3.507 -0.75 1.99 0.645 0.964 2.492 C -0.085 4.381 -0.75 6.947 -0.75 9.75 L 0.75 9.75 C 0.75 7.168 1.365 4.859 2.276 3.22 C 3.21 1.538 4.334 0.75 5.281 0.75 L 5.281 -0.75 Z M -0.75 9.75 C -0.75 12.553 -0.085 15.119 0.964 17.008 C 1.99 18.855 3.507 20.25 5.281 20.25 L 5.281 18.75 C 4.334 18.75 3.21 17.962 2.276 16.28 C 1.365 14.641 0.75 12.332 0.75 9.75 L -0.75 9.75 Z M 5.281 20.25 C 7.056 20.25 8.573 18.855 9.599 17.008 C 10.648 15.119 11.313 12.553 11.313 9.75 L 9.813 9.75 C 9.813 12.332 9.198 14.641 8.287 16.28 C 7.353 17.962 6.229 18.75 5.281 18.75 L 5.281 20.25 Z M 11.313 9.75 C 11.313 6.947 10.648 4.381 9.599 2.492 C 8.573 0.645 7.056 -0.75 5.281 -0.75 L 5.281 0.75 C 6.229 0.75 7.353 1.538 8.287 3.22 C 9.198 4.859 9.813 7.168 9.813 9.75 L 11.313 9.75 Z\" fill=\"currentColor\" fill-rule=\"nonzero\" transform=\"matrix(1 0 0 1 6.719 2.249)\"/><path d=\"M 0.434 -0.612 C 0.096 -0.851 -0.372 -0.772 -0.612 -0.434 C -0.851 -0.096 -0.772 0.372 -0.434 0.612 L 0.434 -0.612 Z M 13.434 0.612 C 13.772 0.372 13.852 -0.096 13.612 -0.434 C 13.372 -0.772 12.904 -0.851 12.566 -0.612 L 13.434 0.612 Z M -0.434 0.612 C 1.485 1.974 3.894 2.782 6.5 2.782 L 6.5 1.282 C 4.204 1.282 2.1 0.571 0.434 -0.612 L -0.434 0.612 Z M 6.5 2.782 C 9.107 2.782 11.515 1.974 13.434 0.612 L 12.566 -0.612 C 10.901 0.571 8.796 1.282 6.5 1.282 L 6.5 2.782 Z\" fill=\"currentColor\" fill-rule=\"nonzero\" transform=\"matrix(1 0 0 1 5.500 5.499)\"/><path d=\"M 12.566 2.643 C 12.904 2.883 13.372 2.803 13.612 2.466 C 13.852 2.128 13.772 1.66 13.434 1.42 L 12.566 2.643 Z M -0.434 1.42 C -0.772 1.66 -0.851 2.128 -0.612 2.466 C -0.372 2.803 0.096 2.883 0.434 2.643 L -0.434 1.42 Z M 13.434 1.42 C 11.515 0.057 9.107 -0.75 6.5 -0.75 L 6.5 0.75 C 8.796 0.75 10.901 1.461 12.566 2.643 L 13.434 1.42 Z M 6.5 -0.75 C 3.894 -0.75 1.485 0.057 -0.434 1.42 L 0.434 2.643 C 2.1 1.461 4.204 0.75 6.5 0.75 L 6.5 -0.75 Z\" fill=\"currentColor\" fill-rule=\"nonzero\" transform=\"matrix(1 0 0 1 5.500 16.469)\"/><path d=\"M -0.75 0 L -0.75 19.5 L 0.75 19.5 L 0.75 0 L -0.75 0 Z\" fill=\"currentColor\" fill-rule=\"nonzero\" transform=\"matrix(1 0 0 1 12 2.249)\"/><path d=\"M 19.5 -0.75 L 0 -0.75 L 0 0.75 L 19.5 0.75 L 19.5 -0.75 Z\" fill=\"currentColor\" fill-rule=\"nonzero\" transform=\"matrix(1 0 0 1 2.250 11.999)\"/>"
    },
    "IONIconHHelpCircle": {
      viewBox: "0 0 24 24",
      body: "<path d=\"M 9 0 C 4.031 0 0 4.031 0 9 C 0 13.969 4.031 18 9 18 C 13.969 18 18 13.969 18 9 C 18 4.031 13.969 0 9 0 Z M 8.719 14.25 C 8.533 14.25 8.352 14.195 8.198 14.092 C 8.044 13.989 7.924 13.843 7.853 13.671 C 7.782 13.5 7.763 13.311 7.799 13.13 C 7.835 12.948 7.925 12.781 8.056 12.65 C 8.187 12.518 8.354 12.429 8.536 12.393 C 8.718 12.357 8.906 12.375 9.078 12.446 C 9.249 12.517 9.395 12.637 9.498 12.792 C 9.601 12.946 9.656 13.127 9.656 13.312 C 9.656 13.561 9.557 13.8 9.382 13.975 C 9.206 14.151 8.967 14.25 8.719 14.25 L 8.719 14.25 Z M 10.286 9.469 C 9.526 9.979 9.422 10.446 9.422 10.875 C 9.422 11.049 9.353 11.216 9.23 11.339 C 9.107 11.462 8.94 11.531 8.766 11.531 C 8.592 11.531 8.425 11.462 8.302 11.339 C 8.179 11.216 8.109 11.049 8.109 10.875 C 8.109 9.848 8.582 9.031 9.554 8.378 C 10.458 7.772 10.969 7.387 10.969 6.542 C 10.969 5.968 10.641 5.531 9.961 5.208 C 9.802 5.132 9.446 5.058 9.008 5.063 C 8.459 5.07 8.032 5.202 7.703 5.466 C 7.084 5.965 7.031 6.508 7.031 6.516 C 7.027 6.602 7.006 6.686 6.969 6.764 C 6.932 6.842 6.881 6.912 6.817 6.97 C 6.753 7.028 6.678 7.073 6.597 7.102 C 6.516 7.132 6.43 7.144 6.343 7.14 C 6.257 7.136 6.173 7.115 6.095 7.078 C 6.017 7.041 5.947 6.99 5.889 6.926 C 5.831 6.862 5.786 6.787 5.757 6.706 C 5.727 6.625 5.715 6.539 5.719 6.452 C 5.724 6.338 5.803 5.312 6.88 4.446 C 7.438 3.997 8.148 3.764 8.989 3.753 C 9.585 3.746 10.144 3.847 10.523 4.026 C 11.658 4.563 12.281 5.458 12.281 6.542 C 12.281 8.128 11.221 8.84 10.286 9.469 Z\" fill=\"currentColor\" fill-rule=\"nonzero\" transform=\"matrix(1 0 0 1 3 3)\"/>"
    },
    "IONIconHHomeDefault": {
      viewBox: "0 0 24 24",
      body: "<path d=\"M 9.265 0.104 C 9.196 0.037 9.103 0 9.006 0 C 8.91 0 8.817 0.037 8.747 0.104 L 0.117 8.348 C 0.081 8.383 0.051 8.425 0.031 8.472 C 0.012 8.518 0.001 8.569 0.001 8.619 L 0 16.357 C 0 16.754 0.158 17.136 0.439 17.417 C 0.721 17.698 1.102 17.857 1.5 17.857 L 6.005 17.857 C 6.204 17.857 6.394 17.777 6.535 17.637 C 6.676 17.496 6.755 17.305 6.755 17.107 L 6.755 10.732 C 6.755 10.632 6.794 10.537 6.865 10.466 C 6.935 10.396 7.03 10.357 7.13 10.357 L 10.88 10.357 C 10.979 10.357 11.075 10.396 11.145 10.466 C 11.215 10.537 11.255 10.632 11.255 10.732 L 11.255 17.107 C 11.255 17.305 11.334 17.496 11.474 17.637 C 11.615 17.777 11.806 17.857 12.005 17.857 L 16.507 17.857 C 16.905 17.857 17.287 17.698 17.568 17.417 C 17.849 17.136 18.007 16.754 18.007 16.357 L 18.007 8.619 C 18.008 8.569 17.997 8.518 17.977 8.472 C 17.958 8.425 17.928 8.383 17.892 8.348 L 9.265 0.104 Z\" fill=\"currentColor\" fill-rule=\"nonzero\" transform=\"matrix(1 0 0 1 2.995 4.644)\"/><path d=\"M 22.261 9.945 L 18.755 6.59 L 18.755 1.5 C 18.755 1.301 18.676 1.11 18.535 0.97 C 18.395 0.829 18.204 0.75 18.005 0.75 L 15.755 0.75 C 15.556 0.75 15.365 0.829 15.225 0.97 C 15.084 1.11 15.005 1.301 15.005 1.5 L 15.005 3 L 12.29 0.404 C 12.036 0.147 11.658 0 11.25 0 C 10.843 0 10.466 0.147 10.212 0.405 L 0.242 9.944 C -0.05 10.225 -0.086 10.687 0.179 10.992 C 0.246 11.069 0.327 11.132 0.419 11.176 C 0.51 11.22 0.61 11.246 0.712 11.25 C 0.813 11.255 0.915 11.239 1.01 11.203 C 1.105 11.167 1.192 11.112 1.266 11.042 L 10.992 1.747 C 11.062 1.681 11.155 1.643 11.251 1.643 C 11.348 1.643 11.441 1.681 11.511 1.747 L 21.238 11.042 C 21.381 11.179 21.573 11.254 21.772 11.25 C 21.97 11.247 22.159 11.164 22.297 11.021 C 22.585 10.723 22.561 10.231 22.261 9.945 Z\" fill=\"currentColor\" fill-rule=\"nonzero\" transform=\"matrix(1 0 0 1 0.751 1.501)\"/>"
    },
    "IONIconKKeyDefault": {
      viewBox: "0 0 24 24",
      body: "<path d=\"M 7.973 5.586 C 7.973 6.195 7.973 6.786 8.166 7.339 C 6.145 9.711 0.811 15.978 0.314 16.456 C 0.215 16.545 0.136 16.653 0.082 16.775 C 0.028 16.896 0 17.027 0 17.16 C 0 17.558 0.244 17.942 0.45 18.158 C 0.759 18.481 2.081 19.705 2.325 19.47 C 3.047 18.767 3.192 18.58 3.487 18.289 C 3.933 17.853 3.441 16.963 3.595 16.602 C 3.75 16.241 3.914 16.17 4.181 16.114 C 4.448 16.058 4.922 16.25 5.292 16.255 C 5.681 16.26 5.892 16.095 6.183 15.824 C 6.417 15.608 6.586 15.406 6.591 15.092 C 6.6 14.67 5.991 14.113 6.445 13.667 C 6.9 13.222 7.556 13.958 8.039 13.902 C 8.522 13.845 9.108 13.175 9.169 12.889 C 9.23 12.603 8.62 11.867 8.714 11.45 C 8.747 11.31 9.033 10.981 9.248 10.935 C 9.464 10.888 10.42 11.258 10.636 11.211 C 10.898 11.155 11.203 10.878 11.452 10.724 C 12.178 11.038 12.839 11.164 13.687 11.164 C 16.898 11.164 19.5 8.661 19.5 5.577 C 19.5 2.492 16.898 0 13.687 0 C 10.477 0 7.973 2.502 7.973 5.586 Z M 16.5 4.5 C 16.5 4.797 16.412 5.087 16.247 5.333 C 16.082 5.58 15.848 5.772 15.574 5.886 C 15.3 5.999 14.998 6.029 14.707 5.971 C 14.416 5.913 14.149 5.77 13.939 5.561 C 13.73 5.351 13.587 5.084 13.529 4.793 C 13.471 4.502 13.501 4.2 13.614 3.926 C 13.728 3.652 13.92 3.418 14.167 3.253 C 14.413 3.088 14.703 3 15 3 C 15.398 3 15.779 3.158 16.061 3.439 C 16.342 3.721 16.5 4.102 16.5 4.5 Z\" fill=\"currentColor\" fill-rule=\"nonzero\" transform=\"matrix(1 0 0 1 2.251 2.251)\"/>"
    },
    "IONIconLLogoApple": {
      viewBox: "0 0 24 24",
      body: "<path d=\"M 13.366 0 C 11.476 0 10.678 0.902 9.361 0.902 C 8.012 0.902 6.982 0.007 5.345 0.007 C 3.742 0.007 2.032 0.985 0.946 2.653 C -0.578 5.004 -0.319 9.432 2.15 13.205 C 3.033 14.555 4.212 16.07 5.759 16.086 L 5.787 16.086 C 7.132 16.086 7.531 15.206 9.381 15.195 L 9.409 15.195 C 11.232 15.195 11.597 16.081 12.936 16.081 L 12.964 16.081 C 14.511 16.065 15.754 14.386 16.637 13.041 C 17.272 12.074 17.509 11.588 17.996 10.493 C 14.425 9.138 13.851 4.075 17.383 2.134 C 16.305 0.784 14.79 0.002 13.362 0.002 L 13.366 0 Z\" fill=\"currentColor\" fill-rule=\"nonzero\" transform=\"matrix(1 0 0 1 2.999 6.414)\"/><path d=\"M 4.302 0 C 3.177 0.076 1.865 0.793 1.096 1.728 C 0.398 2.575 -0.175 3.832 0.05 5.052 L 0.14 5.052 C 1.338 5.052 2.564 4.33 3.28 3.406 C 3.97 2.526 4.493 1.279 4.302 0 Z\" fill=\"currentColor\" fill-rule=\"nonzero\" transform=\"matrix(1 0 0 1 11.647 1.501)\"/>"
    },
    "IONIconLLogoCss3": {
      viewBox: "0 0 24 24",
      body: "<path d=\"M 0 0 L 1.641 18.901 L 8.989 21 L 16.359 18.898 L 18 0 L 0 0 Z M 13.626 15.698 L 9.003 17.016 L 4.388 15.692 L 4.072 12.047 L 6.334 12.047 L 6.495 13.901 L 9.007 14.612 L 9.013 14.625 L 11.519 13.929 L 11.783 10.922 L 6.516 10.922 L 6.328 8.578 L 11.984 8.578 L 12.187 6.187 L 3.562 6.187 L 3.375 3.891 L 14.652 3.891 L 13.626 15.698 Z\" fill=\"currentColor\" fill-rule=\"nonzero\" transform=\"matrix(1 0 0 1 3 1.499)\"/>"
    },
    "IONIconLLogoGoogle": {
      viewBox: "0 0 24 24",
      body: "<path d=\"M 20.48 8.882 L 20.374 8.432 L 10.604 8.432 L 10.604 12.568 L 16.441 12.568 C 15.835 15.446 13.023 16.961 10.725 16.961 C 9.054 16.961 7.292 16.258 6.126 15.127 C 5.51 14.522 5.021 13.8 4.684 13.005 C 4.348 12.21 4.172 11.356 4.166 10.492 C 4.166 8.751 4.949 7.008 6.088 5.862 C 7.227 4.716 8.947 4.075 10.658 4.075 C 12.617 4.075 14.021 5.115 14.546 5.589 L 17.484 2.666 C 16.622 1.909 14.254 0 10.563 0 C 7.716 0 4.985 1.091 2.989 3.08 C 1.02 5.039 0 7.872 0 10.5 C 0 13.128 0.965 15.819 2.873 17.794 C 4.913 19.899 7.801 21 10.776 21 C 13.482 21 16.047 19.94 17.875 18.016 C 19.672 16.122 20.602 13.502 20.602 10.755 C 20.602 9.599 20.485 8.912 20.48 8.882 Z\" fill=\"currentColor\" fill-rule=\"nonzero\" transform=\"matrix(1 0 0 1 1.699 1.500)\"/>"
    },
    "IONIconLLogoInstagram": {
      viewBox: "0 0 24 24",
      body: "<path d=\"M 14.875 1.75 C 16.034 1.753 17.145 2.215 17.965 3.035 C 18.785 3.855 19.247 4.966 19.25 6.125 L 19.25 14.875 C 19.247 16.034 18.785 17.145 17.965 17.965 C 17.145 18.785 16.034 19.247 14.875 19.25 L 6.125 19.25 C 4.966 19.247 3.855 18.785 3.035 17.965 C 2.215 17.145 1.753 16.034 1.75 14.875 L 1.75 6.125 C 1.753 4.966 2.215 3.855 3.035 3.035 C 3.855 2.215 4.966 1.753 6.125 1.75 L 14.875 1.75 L 14.875 1.75 Z M 14.875 0 L 6.125 0 C 2.756 0 0 2.756 0 6.125 L 0 14.875 C 0 18.244 2.756 21 6.125 21 L 14.875 21 C 18.244 21 21 18.244 21 14.875 L 21 6.125 C 21 2.756 18.244 0 14.875 0 L 14.875 0 Z\" fill=\"currentColor\" fill-rule=\"nonzero\" transform=\"matrix(1 0 0 1 1.500 1.500)\"/><path d=\"M 1.312 2.625 C 1.053 2.625 0.799 2.548 0.583 2.404 C 0.367 2.26 0.199 2.055 0.1 1.815 C 0.001 1.575 -0.025 1.311 0.025 1.056 C 0.076 0.802 0.201 0.568 0.384 0.384 C 0.568 0.201 0.802 0.076 1.056 0.025 C 1.311 -0.025 1.575 0.001 1.815 0.1 C 2.055 0.199 2.26 0.367 2.404 0.583 C 2.548 0.799 2.625 1.053 2.625 1.312 C 2.625 1.485 2.592 1.656 2.526 1.815 C 2.46 1.975 2.363 2.119 2.241 2.241 C 2.119 2.363 1.975 2.46 1.815 2.526 C 1.656 2.592 1.485 2.625 1.312 2.625 L 1.312 2.625 Z\" fill=\"currentColor\" fill-rule=\"nonzero\" transform=\"matrix(1 0 0 1 16.375 5.000)\"/><path d=\"M 5.25 1.75 C 5.942 1.75 6.619 1.955 7.195 2.34 C 7.77 2.724 8.219 3.271 8.484 3.911 C 8.749 4.55 8.818 5.254 8.683 5.933 C 8.548 6.612 8.214 7.235 7.725 7.725 C 7.235 8.214 6.612 8.548 5.933 8.683 C 5.254 8.818 4.55 8.749 3.911 8.484 C 3.271 8.219 2.724 7.77 2.34 7.195 C 1.955 6.619 1.75 5.942 1.75 5.25 C 1.751 4.322 2.12 3.432 2.776 2.776 C 3.432 2.12 4.322 1.751 5.25 1.75 L 5.25 1.75 Z M 5.25 0 C 4.212 0 3.197 0.308 2.333 0.885 C 1.47 1.462 0.797 2.282 0.4 3.241 C 0.002 4.2 -0.102 5.256 0.101 6.274 C 0.303 7.293 0.803 8.228 1.538 8.962 C 2.272 9.697 3.207 10.197 4.226 10.399 C 5.244 10.602 6.3 10.498 7.259 10.1 C 8.218 9.703 9.038 9.03 9.615 8.167 C 10.192 7.303 10.5 6.288 10.5 5.25 C 10.5 3.858 9.947 2.522 8.962 1.538 C 7.978 0.553 6.642 0 5.25 0 L 5.25 0 Z\" fill=\"currentColor\" fill-rule=\"nonzero\" transform=\"matrix(1 0 0 1 6.750 6.749)\"/>"
    },
    "IONIconLLogoTwitter": {
      viewBox: "0 0 24 24",
      body: "<path d=\"M 22.5 2.133 C 21.656 2.5 20.763 2.741 19.849 2.85 C 20.81 2.288 21.532 1.394 21.88 0.338 C 20.972 0.868 19.981 1.241 18.948 1.439 C 18.513 0.983 17.99 0.621 17.41 0.373 C 16.831 0.126 16.207 -0.001 15.577 0 C 13.026 0 10.962 2.034 10.962 4.542 C 10.96 4.891 11 5.239 11.081 5.578 C 9.252 5.492 7.46 5.026 5.822 4.208 C 4.183 3.39 2.734 2.24 1.565 0.83 C 1.155 1.521 0.938 2.309 0.937 3.113 C 0.937 4.688 1.759 6.08 3 6.895 C 2.265 6.878 1.545 6.683 0.901 6.328 L 0.901 6.384 C 0.901 8.588 2.495 10.42 4.604 10.838 C 4.207 10.943 3.799 10.997 3.388 10.997 C 3.097 10.997 2.806 10.969 2.52 10.913 C 3.107 12.717 4.814 14.03 6.835 14.067 C 5.193 15.333 3.176 16.018 1.102 16.012 C 0.733 16.012 0.366 15.99 0 15.947 C 2.11 17.294 4.563 18.007 7.066 18 C 15.567 18 20.212 11.077 20.212 5.072 C 20.212 4.875 20.206 4.678 20.197 4.486 C 21.098 3.845 21.878 3.048 22.5 2.133 L 22.5 2.133 Z\" fill=\"currentColor\" fill-rule=\"nonzero\" transform=\"matrix(1 0 0 1 0.750 3.000)\"/>"
    },
    "IONIconNNotificationsDefault": {
      viewBox: "0 0 24 24",
      body: "<path d=\"M 17.636 14.499 C 17.559 14.405 17.482 14.311 17.407 14.221 C 16.376 12.974 15.752 12.221 15.752 8.69 C 15.752 6.862 15.315 5.362 14.453 4.237 C 13.817 3.405 12.958 2.775 11.825 2.309 C 11.811 2.301 11.798 2.29 11.787 2.278 C 11.38 0.914 10.265 0 9.008 0 C 7.751 0 6.636 0.914 6.229 2.276 C 6.218 2.288 6.205 2.299 6.191 2.307 C 3.548 3.395 2.264 5.482 2.264 8.688 C 2.264 12.221 1.641 12.974 0.609 14.22 C 0.534 14.31 0.457 14.402 0.379 14.497 C 0.178 14.74 0.051 15.035 0.012 15.347 C -0.026 15.66 0.026 15.977 0.161 16.261 C 0.451 16.87 1.067 17.249 1.771 17.249 L 16.25 17.249 C 16.95 17.249 17.562 16.871 17.853 16.264 C 17.989 15.98 18.041 15.663 18.003 15.35 C 17.965 15.037 17.837 14.742 17.636 14.499 L 17.636 14.499 Z\" fill=\"currentColor\" fill-rule=\"nonzero\" transform=\"matrix(1 0 0 1 2.992 1.500)\"/><path d=\"M 3.323 2.25 C 4.001 2.249 4.665 2.066 5.246 1.718 C 5.828 1.37 6.304 0.872 6.625 0.275 C 6.64 0.247 6.648 0.215 6.647 0.182 C 6.646 0.15 6.637 0.118 6.62 0.091 C 6.603 0.063 6.58 0.04 6.551 0.024 C 6.523 0.008 6.491 0 6.459 0 L 0.188 0 C 0.156 0 0.124 0.008 0.096 0.024 C 0.067 0.04 0.044 0.063 0.027 0.09 C 0.01 0.118 0.001 0.15 0 0.182 C -0.001 0.214 0.007 0.247 0.022 0.275 C 0.343 0.872 0.819 1.37 1.4 1.718 C 1.981 2.065 2.646 2.249 3.323 2.25 Z\" fill=\"currentColor\" fill-rule=\"nonzero\" transform=\"matrix(1 0 0 1 8.677 20.250)\"/>"
    },
    "IONIconPPersonCircle": {
      viewBox: "0 0 24 24",
      body: "<path d=\"M 9.75 0 C 4.374 0 0 4.374 0 9.75 C 0 15.126 4.374 19.5 9.75 19.5 C 15.126 19.5 19.5 15.126 19.5 9.75 C 19.5 4.374 15.126 0 9.75 0 Z M 7.396 5.476 C 7.99 4.846 8.826 4.5 9.75 4.5 C 10.674 4.5 11.503 4.849 12.099 5.482 C 12.703 6.123 12.997 6.984 12.928 7.911 C 12.789 9.75 11.364 11.25 9.75 11.25 C 8.136 11.25 6.708 9.75 6.572 7.91 C 6.503 6.976 6.797 6.112 7.396 5.476 Z M 9.75 18 C 8.649 18.001 7.558 17.78 6.544 17.352 C 5.529 16.923 4.611 16.295 3.844 15.505 C 4.283 14.879 4.843 14.346 5.491 13.938 C 6.686 13.172 8.198 12.75 9.75 12.75 C 11.302 12.75 12.814 13.172 14.008 13.938 C 14.656 14.346 15.216 14.878 15.656 15.505 C 14.889 16.295 13.971 16.923 12.956 17.352 C 11.942 17.78 10.851 18.001 9.75 18 L 9.75 18 Z\" fill=\"currentColor\" fill-rule=\"nonzero\" transform=\"matrix(1 0 0 1 2.250 2.249)\"/>"
    },
    "IONIconPPersonDefault": {
      viewBox: "0 0 24 24",
      body: "<path d=\"M 8.468 1.527 C 7.555 0.542 6.281 0 4.875 0 C 3.461 0 2.183 0.539 1.275 1.518 C 0.357 2.507 -0.09 3.852 0.015 5.304 C 0.223 8.169 2.403 10.5 4.875 10.5 C 7.347 10.5 9.523 8.17 9.735 5.305 C 9.841 3.866 9.391 2.524 8.468 1.527 Z\" fill=\"currentColor\" fill-rule=\"nonzero\" transform=\"matrix(1 0 0 1 7.125 1.500)\"/><path d=\"M 18 9 L 1.5 9 C 1.284 9.003 1.07 8.957 0.874 8.867 C 0.678 8.777 0.504 8.644 0.366 8.478 C 0.061 8.114 -0.062 7.617 0.029 7.114 C 0.425 4.919 1.66 3.075 3.6 1.781 C 5.324 0.632 7.508 0 9.75 0 C 11.992 0 14.176 0.633 15.9 1.781 C 17.841 3.075 19.076 4.919 19.471 7.113 C 19.562 7.616 19.439 8.114 19.135 8.478 C 18.996 8.644 18.823 8.777 18.626 8.867 C 18.43 8.957 18.216 9.003 18 9 L 18 9 Z\" fill=\"currentColor\" fill-rule=\"nonzero\" transform=\"matrix(1 0 0 1 2.250 13.499)\"/>"
    },
    "IONIconRRocketSharp": {
      viewBox: "0 0 24 24",
      body: "<path d=\"M 20.889 0.285 C 20.881 0.243 20.86 0.205 20.831 0.175 C 20.801 0.144 20.764 0.123 20.723 0.113 C 17.977 -0.558 11.634 1.834 8.197 5.269 C 7.584 5.877 7.025 6.538 6.527 7.243 C 5.467 7.149 4.407 7.227 3.504 7.621 C 0.955 8.743 0.213 11.67 0.006 12.929 C -0.005 12.998 -0.001 13.068 0.019 13.135 C 0.04 13.202 0.075 13.263 0.123 13.314 C 0.171 13.365 0.23 13.404 0.296 13.429 C 0.361 13.453 0.431 13.461 0.501 13.454 L 4.594 13.002 C 4.597 13.311 4.615 13.619 4.649 13.926 C 4.67 14.139 4.764 14.338 4.917 14.488 L 6.501 16.069 C 6.652 16.221 6.851 16.316 7.064 16.337 C 7.369 16.371 7.675 16.389 7.982 16.392 L 7.533 20.48 C 7.526 20.549 7.534 20.62 7.559 20.685 C 7.583 20.751 7.622 20.81 7.673 20.858 C 7.724 20.906 7.785 20.941 7.852 20.961 C 7.919 20.981 7.989 20.986 8.058 20.974 C 9.315 20.773 12.247 20.031 13.362 17.482 C 13.756 16.579 13.836 15.524 13.745 14.47 C 14.452 13.971 15.114 13.412 15.724 12.799 C 19.172 9.369 21.55 3.167 20.889 0.285 Z M 12.284 8.707 C 11.97 8.392 11.755 7.991 11.668 7.555 C 11.581 7.118 11.626 6.666 11.796 6.255 C 11.966 5.843 12.255 5.492 12.625 5.245 C 12.995 4.997 13.43 4.865 13.875 4.865 C 14.32 4.865 14.755 4.997 15.125 5.245 C 15.495 5.492 15.783 5.843 15.954 6.255 C 16.124 6.666 16.168 7.118 16.081 7.555 C 15.995 7.991 15.78 8.392 15.465 8.707 C 15.257 8.916 15.009 9.082 14.736 9.195 C 14.463 9.308 14.17 9.366 13.875 9.366 C 13.579 9.366 13.287 9.308 13.014 9.195 C 12.741 9.082 12.493 8.916 12.284 8.707 Z\" fill=\"currentColor\" fill-rule=\"nonzero\" transform=\"matrix(1 0 0 1 1.500 1.510)\"/><path d=\"M 5.644 2.973 C 5.387 3.231 4.975 3.331 4.479 3.417 C 3.365 3.607 2.381 2.644 2.581 1.517 C 2.657 1.09 2.883 0.492 3.024 0.351 C 3.055 0.321 3.075 0.282 3.082 0.239 C 3.09 0.197 3.083 0.153 3.064 0.115 C 3.045 0.076 3.015 0.044 2.977 0.024 C 2.939 0.004 2.895 -0.004 2.853 0.002 C 2.23 0.078 1.65 0.361 1.206 0.804 C 0.104 1.907 0 6 0 6 C 0 6 4.095 5.896 5.197 4.793 C 5.642 4.349 5.925 3.769 6 3.145 C 6.017 2.949 5.779 2.832 5.644 2.973 Z\" fill=\"currentColor\" fill-rule=\"nonzero\" transform=\"matrix(1 0 0 1 2.250 15.751)\"/>"
    },
    "IONIconSSettingsSharp": {
      viewBox: "0 0 24 24",
      body: "<path d=\"M 10.499 7.031 C 9.757 7.031 9.032 7.251 8.416 7.663 C 7.799 8.075 7.318 8.661 7.035 9.346 C 6.751 10.031 6.676 10.785 6.821 11.513 C 6.966 12.24 7.323 12.908 7.847 13.433 C 8.372 13.957 9.04 14.314 9.767 14.459 C 10.495 14.604 11.249 14.53 11.934 14.246 C 12.619 13.962 13.205 13.481 13.617 12.865 C 14.029 12.248 14.249 11.523 14.249 10.781 C 14.246 9.788 13.85 8.835 13.147 8.133 C 12.445 7.43 11.493 7.034 10.499 7.031 L 10.499 7.031 Z M 18.595 10.781 C 18.593 11.132 18.568 11.482 18.518 11.828 L 20.801 13.615 C 20.9 13.697 20.967 13.812 20.99 13.939 C 21.012 14.066 20.989 14.197 20.924 14.308 L 18.765 18.036 C 18.699 18.146 18.597 18.23 18.476 18.272 C 18.354 18.314 18.222 18.312 18.102 18.267 L 15.419 17.189 C 14.86 17.619 14.248 17.976 13.599 18.251 L 13.198 21.1 C 13.175 21.228 13.109 21.344 13.011 21.428 C 12.912 21.512 12.788 21.56 12.658 21.562 L 8.34 21.562 C 8.213 21.56 8.09 21.514 7.992 21.433 C 7.894 21.352 7.827 21.24 7.8 21.116 L 7.399 18.267 C 6.748 17.995 6.136 17.637 5.58 17.203 L 2.896 18.281 C 2.776 18.327 2.644 18.329 2.523 18.287 C 2.401 18.244 2.299 18.161 2.233 18.051 L 0.074 14.324 C 0.009 14.212 -0.014 14.081 0.008 13.955 C 0.031 13.828 0.098 13.713 0.197 13.631 L 2.48 11.844 C 2.431 11.492 2.405 11.137 2.403 10.781 C 2.405 10.431 2.43 10.081 2.48 9.734 L 0.197 7.947 C 0.098 7.865 0.031 7.75 0.008 7.623 C -0.014 7.497 0.009 7.366 0.074 7.254 L 2.233 3.527 C 2.299 3.417 2.401 3.333 2.522 3.291 C 2.644 3.248 2.776 3.25 2.896 3.296 L 5.58 4.374 C 6.138 3.944 6.75 3.586 7.399 3.311 L 7.8 0.462 C 7.823 0.335 7.889 0.219 7.987 0.134 C 8.086 0.05 8.21 0.003 8.34 0 L 12.658 0 C 12.785 0.002 12.908 0.048 13.006 0.129 C 13.104 0.21 13.172 0.322 13.198 0.447 L 13.599 3.296 C 14.251 3.568 14.864 3.925 15.421 4.359 L 18.102 3.281 C 18.222 3.236 18.354 3.234 18.476 3.276 C 18.597 3.318 18.699 3.402 18.765 3.512 L 20.924 7.239 C 20.989 7.351 21.012 7.482 20.99 7.608 C 20.967 7.735 20.9 7.85 20.801 7.932 L 18.518 9.719 C 18.567 10.071 18.593 10.426 18.595 10.781 L 18.595 10.781 Z\" fill=\"currentColor\" fill-rule=\"nonzero\" transform=\"matrix(1 0 0 1 1.501 1.219)\"/>"
    },
    "IONIconSStatsChart": {
      viewBox: "0 0 24 24",
      body: "<path d=\"M 2.625 9 L 1.125 9 C 0.827 9 0.54 8.881 0.33 8.67 C 0.119 8.46 0 8.173 0 7.875 L 0 1.125 C 0 0.827 0.119 0.54 0.33 0.33 C 0.54 0.119 0.827 0 1.125 0 L 2.625 0 C 2.923 0 3.21 0.119 3.42 0.33 C 3.631 0.54 3.75 0.827 3.75 1.125 L 3.75 7.875 C 3.75 8.173 3.631 8.46 3.42 8.67 C 3.21 8.881 2.923 9 2.625 9 L 2.625 9 Z\" fill=\"currentColor\" fill-rule=\"nonzero\" transform=\"matrix(1 0 0 1 2.250 14.251)\"/><path d=\"M 2.625 13.5 L 1.125 13.5 C 0.827 13.5 0.54 13.381 0.33 13.17 C 0.119 12.96 0 12.673 0 12.375 L 0 1.125 C 0 0.827 0.119 0.54 0.33 0.33 C 0.54 0.119 0.827 0 1.125 0 L 2.625 0 C 2.923 0 3.21 0.119 3.42 0.33 C 3.631 0.54 3.75 0.827 3.75 1.125 L 3.75 12.375 C 3.75 12.673 3.631 12.96 3.42 13.17 C 3.21 13.381 2.923 13.5 2.625 13.5 L 2.625 13.5 Z\" fill=\"currentColor\" fill-rule=\"nonzero\" transform=\"matrix(1 0 0 1 12.750 9.749)\"/><path d=\"M 2.625 18.75 L 1.125 18.75 C 0.827 18.75 0.54 18.631 0.33 18.42 C 0.119 18.21 0 17.923 0 17.625 L 0 1.125 C 0 0.827 0.119 0.54 0.33 0.33 C 0.54 0.119 0.827 0 1.125 0 L 2.625 0 C 2.923 0 3.21 0.119 3.42 0.33 C 3.631 0.54 3.75 0.827 3.75 1.125 L 3.75 17.625 C 3.75 17.923 3.631 18.21 3.42 18.42 C 3.21 18.631 2.923 18.75 2.625 18.75 L 2.625 18.75 Z\" fill=\"currentColor\" fill-rule=\"nonzero\" transform=\"matrix(1 0 0 1 18 4.500)\"/><path d=\"M 2.625 22.5 L 1.125 22.5 C 0.827 22.5 0.54 22.381 0.33 22.17 C 0.119 21.96 0 21.673 0 21.375 L 0 1.125 C 0 0.827 0.119 0.54 0.33 0.33 C 0.54 0.119 0.827 0 1.125 0 L 2.625 0 C 2.923 0 3.21 0.119 3.42 0.33 C 3.631 0.54 3.75 0.827 3.75 1.125 L 3.75 21.375 C 3.75 21.673 3.631 21.96 3.42 22.17 C 3.21 22.381 2.923 22.5 2.625 22.5 L 2.625 22.5 Z\" fill=\"currentColor\" fill-rule=\"nonzero\" transform=\"matrix(1 0 0 1 7.500 0.750)\"/>"
    },
    "IONIconWWalletDefault": {
      viewBox: "0 0 24 24",
      body: "<path d=\"M 2.385 2.624 L 17.385 2.624 C 17.56 2.624 17.735 2.635 17.909 2.657 C 17.85 2.244 17.708 1.847 17.491 1.489 C 17.274 1.132 16.988 0.823 16.648 0.579 C 16.309 0.336 15.923 0.164 15.516 0.073 C 15.108 -0.017 14.686 -0.024 14.275 0.053 L 1.939 2.159 L 1.925 2.159 C 1.151 2.307 0.462 2.745 0 3.384 C 0.696 2.889 1.53 2.623 2.385 2.624 L 2.385 2.624 Z\" fill=\"currentColor\" fill-rule=\"nonzero\" transform=\"matrix(1 0 0 1 2.092 2.249)\"/><path d=\"M 18 0 L 3 0 C 2.205 0.001 1.442 0.317 0.88 0.88 C 0.317 1.442 0.001 2.205 0 3 L 0 12 C 0.001 12.795 0.317 13.558 0.88 14.12 C 1.442 14.683 2.205 14.999 3 15 L 18 15 C 18.795 14.999 19.558 14.683 20.12 14.12 C 20.683 13.558 20.999 12.795 21 12 L 21 3 C 20.999 2.205 20.683 1.442 20.12 0.88 C 19.558 0.317 18.795 0.001 18 0 L 18 0 Z M 15.773 9 C 15.477 9 15.187 8.912 14.94 8.747 C 14.693 8.582 14.501 8.348 14.388 8.074 C 14.274 7.8 14.244 7.498 14.302 7.207 C 14.36 6.916 14.503 6.649 14.713 6.439 C 14.923 6.23 15.19 6.087 15.481 6.029 C 15.772 5.971 16.073 6.001 16.347 6.114 C 16.622 6.228 16.856 6.42 17.021 6.667 C 17.185 6.913 17.273 7.203 17.273 7.5 C 17.273 7.898 17.115 8.279 16.834 8.561 C 16.553 8.842 16.171 9 15.773 9 Z\" fill=\"currentColor\" fill-rule=\"nonzero\" transform=\"matrix(1 0 0 1 1.477 6.000)\"/><path d=\"M 0 8.062 L 0 3.398 C 0 2.383 0.562 0.68 2.515 0.311 C 4.172 0 5.812 0 5.812 0 C 5.812 0 6.891 0.75 6 0.75 C 5.109 0.75 5.133 1.898 6 1.898 C 6.867 1.898 6 3 6 3 L 2.508 6.961 L 0 8.062 Z\" fill=\"currentColor\" fill-rule=\"nonzero\" transform=\"matrix(1 0 0 1 1.500 4.099)\"/>"
    },
    "MoreHoriz": {
      viewBox: "0 0 24 24",
      body: "<path d=\"M 0 0 L 24 0 L 24 24 L 0 24 L 0 0 Z\" fill=\"currentColor\" fill-rule=\"evenodd\"/><path d=\"M 2 0 C 0.9 0 0 0.9 0 2 C 0 3.1 0.9 4 2 4 C 3.1 4 4 3.1 4 2 C 4 0.9 3.1 0 2 0 Z M 14 0 C 12.9 0 12 0.9 12 2 C 12 3.1 12.9 4 14 4 C 15.1 4 16 3.1 16 2 C 16 0.9 15.1 0 14 0 Z M 8 0 C 6.9 0 6 0.9 6 2 C 6 3.1 6.9 4 8 4 C 9.1 4 10 3.1 10 2 C 10 0.9 9.1 0 8 0 Z\" fill=\"currentColor\" fill-rule=\"nonzero\" transform=\"matrix(1 0 0 1 4 10)\"/>"
    },
    "MoreVert": {
      viewBox: "0 0 24 24",
      body: "<path d=\"M 0 0 L 24 0 L 24 24 L 0 24 L 0 0 Z\" fill=\"currentColor\" fill-rule=\"evenodd\"/><path d=\"M 2 4 C 3.1 4 4 3.1 4 2 C 4 0.9 3.1 0 2 0 C 0.9 0 0 0.9 0 2 C 0 3.1 0.9 4 2 4 Z M 2 6 C 0.9 6 0 6.9 0 8 C 0 9.1 0.9 10 2 10 C 3.1 10 4 9.1 4 8 C 4 6.9 3.1 6 2 6 Z M 2 12 C 0.9 12 0 12.9 0 14 C 0 15.1 0.9 16 2 16 C 3.1 16 4 15.1 4 14 C 4 12.9 3.1 12 2 12 Z\" fill=\"currentColor\" fill-rule=\"nonzero\" transform=\"matrix(1 0 0 1 10 4)\"/>"
    },
    "PriorityHigh": {
      viewBox: "0 0 24 24",
      body: "<path d=\"M 0 0 L 24 0 L 24 24 L 0 24 L 0 0 Z\" fill=\"currentColor\" fill-rule=\"evenodd\"/><path d=\"M 2 4 C 3.105 4 4 3.105 4 2 C 4 0.895 3.105 0 2 0 C 0.895 0 0 0.895 0 2 C 0 3.105 0.895 4 2 4 Z\" fill=\"currentColor\" fill-rule=\"nonzero\" transform=\"matrix(1 0 0 1 10 17)\"/><path d=\"M 2 0 C 0.9 0 0 0.9 0 2 L 0 10 C 0 11.1 0.9 12 2 12 C 3.1 12 4 11.1 4 10 L 4 2 C 4 0.9 3.1 0 2 0 Z\" fill=\"currentColor\" fill-rule=\"nonzero\" transform=\"matrix(1 0 0 1 10 3)\"/>"
    },
    "TagFaces": {
      viewBox: "0 0 24 24",
      body: "<path d=\"M 0 0 L 24 0 L 24 24 L 0 24 L 0 0 Z\" fill=\"currentColor\" fill-rule=\"evenodd\"/><path d=\"M 9.99 0 C 4.47 0 0 4.48 0 10 C 0 15.52 4.47 20 9.99 20 C 15.52 20 20 15.52 20 10 C 20 4.48 15.52 0 9.99 0 Z M 10 18 C 5.58 18 2 14.42 2 10 C 2 5.58 5.58 2 10 2 C 14.42 2 18 5.58 18 10 C 18 14.42 14.42 18 10 18 Z M 13.5 9 C 14.33 9 15 8.33 15 7.5 C 15 6.67 14.33 6 13.5 6 C 12.67 6 12 6.67 12 7.5 C 12 8.33 12.67 9 13.5 9 Z M 6.5 9 C 7.33 9 8 8.33 8 7.5 C 8 6.67 7.33 6 6.5 6 C 5.67 6 5 6.67 5 7.5 C 5 8.33 5.67 9 6.5 9 Z M 10 15.5 C 12.03 15.5 13.8 14.39 14.75 12.75 C 14.94 12.42 14.7 12 14.31 12 L 5.69 12 C 5.31 12 5.06 12.42 5.25 12.75 C 6.2 14.39 7.97 15.5 10 15.5 Z\" fill=\"currentColor\" fill-rule=\"nonzero\" transform=\"matrix(1 0 0 1 2.020 2)\"/>"
    }
  };
} catch {}
Object.assign(__ds_scope, { __ds_default_components_icons_icon_data_12stud1 });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/icons/icon-data.js", error: String((e && e.message) || e) }); }

__ds_scope.__ds_default_components_icons_icon_data_12stud1$1nb03e1 = __ds_scope.__ds_default_components_icons_icon_data_12stud1;

// components/icons/Icon.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function Icon({
  name,
  size,
  ...rest
}) {
  const d = __ds_scope.__ds_default_components_icons_icon_data_12stud1$1nb03e1[name];
  if (!d) return null;
  return /*#__PURE__*/React.createElement("svg", _extends({
    width: size,
    height: size,
    viewBox: d.viewBox,
    fill: "none"
    // body strings are emitter-controlled <path> markup — geometry,
    // numeric fills and transforms only; no .fig-authored text reaches them.
    ,
    dangerouslySetInnerHTML: {
      __html: d.body
    }
  }, rest));
}
Object.assign(__ds_scope, { Icon, __ds_default_components_icons_Icon_fio49a: Icon });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/icons/Icon.jsx", error: String((e && e.message) || e) }); }

// components/charts/Gauge.jsx
try { (() => {
function Gauge({
  value = 95,
  caption = 'Based on likes',
  icon = 'TagFaces',
  minLabel = '0%',
  maxLabel = '100%',
  style
}) {
  const v = Math.max(0, Math.min(100, value));
  const r = 100,
    c = Math.PI * r * 1.5;
  return /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative',
      width: '100%',
      maxWidth: 293,
      height: 250,
      margin: '0 auto',
      fontFamily: 'var(--font-sans)',
      ...style
    }
  }, /*#__PURE__*/React.createElement("svg", {
    viewBox: "0 0 220 220",
    style: {
      position: 'absolute',
      left: '50%',
      top: 0,
      width: 212,
      height: 212,
      transform: 'translateX(-50%) rotate(135deg)'
    }
  }, /*#__PURE__*/React.createElement("circle", {
    cx: "110",
    cy: "110",
    r: r,
    fill: "none",
    stroke: "rgb(34,35,75)",
    strokeWidth: "12",
    strokeLinecap: "round",
    strokeDasharray: c + ' 999'
  }), /*#__PURE__*/React.createElement("circle", {
    cx: "110",
    cy: "110",
    r: r,
    fill: "none",
    stroke: "var(--blue-500)",
    strokeWidth: "12",
    strokeLinecap: "round",
    strokeDasharray: c * v / 100 + ' 999',
    style: {
      transition: 'stroke-dasharray var(--dur-slow) var(--ease-out)'
    }
  })), /*#__PURE__*/React.createElement("span", {
    style: {
      position: 'absolute',
      left: '50%',
      top: 82,
      transform: 'translateX(-50%)',
      width: 48,
      height: 48,
      borderRadius: '50%',
      background: 'var(--blue-500)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: 'var(--white)'
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: icon,
    size: 30
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      left: 0,
      right: 0,
      bottom: 0,
      height: 82,
      borderRadius: 20,
      background: 'var(--gradient-card-soft)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 24px',
      boxSizing: 'border-box'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 12,
      color: 'var(--gray-400)'
    }
  }, minLabel), /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontWeight: 700,
      fontSize: 28,
      lineHeight: 1.4,
      color: 'var(--white)'
    }
  }, v, "%"), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 12,
      color: 'var(--gray-400)'
    }
  }, caption)), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 12,
      color: 'var(--gray-400)'
    }
  }, maxLabel)));
}
Object.assign(__ds_scope, { Gauge, __ds_default_components_charts_Gauge_7bo2s7: Gauge });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/charts/Gauge.jsx", error: String((e && e.message) || e) }); }

// components/core/Button.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const VARIANTS = {
  primary: {
    background: 'var(--blue-500)',
    color: 'var(--white)'
  },
  glass: {
    background: 'var(--gradient-button-glass)',
    backdropFilter: 'var(--blur-button)',
    color: 'var(--white)'
  },
  ghost: {
    background: 'var(--surface-ghost)',
    color: 'var(--white)'
  },
  text: {
    background: 'transparent',
    color: 'var(--gray-400)'
  },
  danger: {
    background: 'transparent',
    color: 'var(--red-400)'
  }
};
function Button({
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  icon,
  disabled = false,
  children,
  style,
  ...rest
}) {
  const [hover, setHover] = React.useState(false);
  const h = size === 'lg' ? 45 : size === 'sm' ? 28 : 35;
  const isText = variant === 'text' || variant === 'danger';
  return /*#__PURE__*/React.createElement("button", _extends({
    disabled: disabled,
    onMouseEnter: () => setHover(true),
    onMouseLeave: () => setHover(false),
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 4,
      height: isText ? 'auto' : h,
      padding: isText ? 0 : size === 'sm' ? '0 12px' : '0 24px',
      minWidth: isText ? 0 : 24,
      width: fullWidth ? '100%' : undefined,
      border: 'none',
      borderRadius: 'var(--radius-button)',
      cursor: disabled ? 'not-allowed' : 'pointer',
      font: isText ? 'var(--fw-regular) var(--fs-small)/1.5 var(--font-sans)' : 'var(--text-button)',
      textTransform: 'uppercase',
      letterSpacing: 0,
      whiteSpace: 'nowrap',
      boxSizing: 'border-box',
      opacity: disabled ? 0.4 : 1,
      filter: hover && !disabled && !isText ? 'brightness(1.12)' : 'none',
      transition: 'filter var(--dur-fast) var(--ease-out), opacity var(--dur-fast)',
      ...VARIANTS[variant],
      ...(hover && isText && !disabled ? {
        color: variant === 'danger' ? 'var(--red-400)' : 'var(--white)'
      } : {}),
      ...style
    }
  }, rest), icon ? /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: icon,
    size: isText ? 14 : 14,
    style: {
      color: 'currentColor'
    }
  }) : null, children);
}
Object.assign(__ds_scope, { Button, __ds_default_components_core_Button_51d4zy: Button });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Button.jsx", error: String((e && e.message) || e) }); }

// components/core/IconTile.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const SIZES = {
  xs: {
    box: 25,
    icon: 12.5,
    r: 6
  },
  sm: {
    box: 30,
    icon: 15,
    r: 12
  },
  md: {
    box: 35,
    icon: 24,
    r: 12
  },
  lg: {
    box: 45,
    icon: 22.5,
    r: 12
  }
};
const TONES = {
  blue: {
    bg: 'var(--blue-500)',
    fg: 'var(--white)'
  },
  navy: {
    bg: 'var(--navy-700)',
    fg: 'var(--blue-500)'
  },
  white: {
    bg: 'var(--white)',
    fg: 'var(--blue-500)'
  },
  ghost: {
    bg: 'var(--surface-ghost)',
    fg: 'var(--violet-500)'
  }
};
function IconTile({
  icon,
  size = 'lg',
  tone = 'blue',
  round = false,
  style,
  ...rest
}) {
  const s = SIZES[size] || SIZES.lg,
    t = TONES[tone] || TONES.blue;
  return /*#__PURE__*/React.createElement("span", _extends({
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexShrink: 0,
      width: s.box,
      height: s.box,
      borderRadius: round ? '50%' : s.r,
      background: t.bg,
      color: t.fg,
      boxShadow: 'var(--shadow-tile)',
      transition: 'background var(--dur-base) var(--ease-out), color var(--dur-base) var(--ease-out)',
      ...style
    }
  }, rest), /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: icon,
    size: s.icon
  }));
}
Object.assign(__ds_scope, { IconTile, __ds_default_components_core_IconTile_gxdjd5: IconTile });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/IconTile.jsx", error: String((e && e.message) || e) }); }

// components/core/Input.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function Input({
  label,
  icon,
  iconSrc,
  variant = 'field',
  style,
  inputStyle,
  ...rest
}) {
  const search = variant === 'search';
  return /*#__PURE__*/React.createElement("label", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 4.5,
      fontFamily: 'var(--font-sans)',
      minWidth: 0,
      ...style
    }
  }, label ? /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 14,
      lineHeight: 1.4,
      color: 'var(--white)',
      paddingLeft: 4.5
    }
  }, label) : null, /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 5,
      height: search ? 39.5 : 50,
      padding: search ? '0 12px' : '0 20px',
      borderRadius: search ? 'var(--radius-input)' : 'var(--radius-xl)',
      background: search ? 'var(--surface-input)' : 'var(--gradient-tile)',
      boxShadow: search ? 'inset 0 0 0 0.5px var(--border-input)' : 'inset 0 0 0 1px rgba(226,232,240,0.3)',
      backdropFilter: search ? undefined : 'blur(42px)',
      boxSizing: 'border-box'
    }
  }, iconSrc ? /*#__PURE__*/React.createElement("img", {
    src: iconSrc,
    alt: "",
    style: {
      width: 15,
      height: 15,
      flexShrink: 0,
      opacity: 0.7
    }
  }) : icon ? /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: icon,
    size: 15,
    style: {
      color: 'var(--gray-400)',
      flexShrink: 0
    }
  }) : null, /*#__PURE__*/React.createElement("input", _extends({}, rest, {
    style: {
      flex: 1,
      minWidth: 0,
      background: 'transparent',
      border: 'none',
      outline: 'none',
      color: 'var(--white)',
      font: `var(--fw-regular) ${search ? 12 : 14}px/1.5 var(--font-sans)`,
      ...inputStyle
    }
  }))));
}
Object.assign(__ds_scope, { Input, __ds_default_components_core_Input_2frvhe: Input });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Input.jsx", error: String((e && e.message) || e) }); }

// components/data/Balance.jsx
try { (() => {
function Balance({
  title = 'Credit Balance',
  amount,
  graphSrc,
  onMore,
  style
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative',
      overflow: 'hidden',
      height: 103,
      borderRadius: 20,
      background: 'var(--gradient-balance)',
      backdropFilter: 'var(--blur-card)',
      padding: '18px 15px',
      boxSizing: 'border-box',
      fontFamily: 'var(--font-sans)',
      ...style
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      position: 'absolute',
      right: -18,
      top: -61,
      width: 194,
      height: 212,
      opacity: 0.1,
      background: 'linear-gradient(187.582deg,rgb(255,255,255) -9.19%,rgba(255,255,255,0) 87.52%)',
      clipPath: 'polygon(0 100%, 62.7% 0, 97.1% 0, 100% 100%)'
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative',
      display: 'flex',
      flexDirection: 'column'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 12,
      lineHeight: '20px',
      letterSpacing: 'var(--ls-tight)',
      color: 'var(--gray-100)'
    }
  }, title), /*#__PURE__*/React.createElement("span", {
    style: {
      fontWeight: 700,
      fontSize: 34,
      lineHeight: '42px',
      color: 'var(--white)',
      whiteSpace: 'nowrap'
    }
  }, amount)), /*#__PURE__*/React.createElement("button", {
    type: "button",
    onClick: onMore,
    "aria-label": "More",
    style: {
      position: 'absolute',
      right: 17,
      top: 15,
      width: 24,
      height: 24,
      padding: 0,
      border: 'none',
      background: 'transparent',
      color: 'var(--white)',
      cursor: 'pointer'
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: "MoreHoriz",
    size: 24
  })), graphSrc ? /*#__PURE__*/React.createElement("img", {
    src: graphSrc,
    alt: "",
    style: {
      position: 'absolute',
      right: 20,
      top: 49,
      width: 59,
      height: 17
    }
  }) : null);
}
Object.assign(__ds_scope, { Balance, __ds_default_components_data_Balance_iumpu1: Balance });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/data/Balance.jsx", error: String((e && e.message) || e) }); }

// components/data/InvoiceItem.jsx
try { (() => {
function InvoiceItem({
  date,
  id,
  amount,
  format = 'PDF',
  onDownload,
  style
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 16,
      fontFamily: 'var(--font-sans)',
      ...style
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 4,
      flex: 1,
      minWidth: 0
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontWeight: 500,
      fontSize: 14,
      lineHeight: 1.4,
      color: 'var(--white)'
    }
  }, date), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 12,
      lineHeight: 1.5,
      color: 'var(--gray-400)'
    }
  }, id)), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 12,
      lineHeight: 1.5,
      color: 'var(--gray-400)'
    }
  }, amount), /*#__PURE__*/React.createElement("button", {
    type: "button",
    onClick: onDownload,
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 5,
      padding: 0,
      border: 'none',
      background: 'transparent',
      cursor: 'pointer',
      color: 'var(--white)',
      fontWeight: 700,
      fontSize: 10,
      lineHeight: 1.5,
      fontFamily: 'var(--font-sans)'
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: "IONIconDDocumentText",
    size: 12
  }), format));
}
Object.assign(__ds_scope, { InvoiceItem, __ds_default_components_data_InvoiceItem_1ri8jmn: InvoiceItem });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/data/InvoiceItem.jsx", error: String((e && e.message) || e) }); }

// components/data/MiniStat.jsx
try { (() => {
function MiniStat({
  icon = 'IONIconWWalletDefault',
  label,
  value,
  progress,
  style
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 8,
      minWidth: 100,
      fontFamily: 'var(--font-sans)',
      ...style
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 10
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.IconTile, {
    icon: icon,
    size: "xs",
    tone: "blue"
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 14,
      lineHeight: 1.5,
      color: 'var(--gray-400)'
    }
  }, label)), /*#__PURE__*/React.createElement("span", {
    style: {
      fontWeight: 700,
      fontSize: 18,
      lineHeight: 1.4,
      color: 'var(--white)'
    }
  }, value), progress !== undefined ? /*#__PURE__*/React.createElement(__ds_scope.ProgressBar, {
    value: progress,
    width: "100%"
  }) : null);
}
Object.assign(__ds_scope, { MiniStat, __ds_default_components_data_MiniStat_ntdbvw: MiniStat });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/data/MiniStat.jsx", error: String((e && e.message) || e) }); }

// components/data/StatCard.jsx
try { (() => {
function StatCard({
  label,
  value,
  change,
  trend,
  icon = 'IONIconWWalletDefault',
  style
}) {
  const t = trend ?? (String(change || '').trim().startsWith('-') ? 'down' : 'up');
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: 12,
      height: 80,
      padding: '0 17.5px 0 21.5px',
      borderRadius: 20,
      background: 'var(--gradient-stat)',
      backdropFilter: 'var(--blur-card)',
      WebkitBackdropFilter: 'var(--blur-card)',
      boxSizing: 'border-box',
      fontFamily: 'var(--font-sans)',
      minWidth: 0,
      ...style
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 2,
      minWidth: 0
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontWeight: 500,
      fontSize: 12,
      lineHeight: 1.5,
      color: 'var(--gray-400)',
      whiteSpace: 'nowrap'
    }
  }, label), /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'flex',
      alignItems: 'baseline',
      gap: 5,
      whiteSpace: 'nowrap'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontWeight: 700,
      fontSize: 18,
      lineHeight: 1.4,
      color: 'var(--white)'
    }
  }, value), change ? /*#__PURE__*/React.createElement("span", {
    style: {
      fontWeight: 700,
      fontSize: 14,
      lineHeight: 1.4,
      color: t === 'down' ? 'var(--red-500)' : 'var(--green-500)'
    }
  }, change) : null)), /*#__PURE__*/React.createElement(__ds_scope.IconTile, {
    icon: icon,
    size: "lg",
    tone: "blue"
  }));
}
Object.assign(__ds_scope, { StatCard, __ds_default_components_data_StatCard_4la461: StatCard });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/data/StatCard.jsx", error: String((e && e.message) || e) }); }

// components/data/TransactionItem.jsx
try { (() => {
const C = {
  income: 'var(--green-500)',
  expense: 'var(--red-500)',
  pending: 'var(--gray-400)'
};
function TransactionItem({
  title,
  meta,
  amount,
  type = 'expense',
  category,
  onClick,
  style
}) {
  const ring = C[type];
  const amountColor = type === 'income' ? 'var(--green-500)' : type === 'pending' ? 'var(--white)' : 'var(--gray-400)';
  const rot = type === 'income' ? 'rotate(-90deg)' : type === 'expense' ? 'rotate(90deg)' : 'none';
  return /*#__PURE__*/React.createElement("div", {
    onClick: onClick,
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 14,
      minHeight: 45,
      fontFamily: 'var(--font-sans)',
      cursor: onClick ? 'pointer' : 'default',
      ...style
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 35,
      height: 35,
      borderRadius: '50%',
      boxShadow: `inset 0 0 0 1px ${ring}`,
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: ring,
      flexShrink: 0
    }
  }, type === 'pending' ? /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: "PriorityHigh",
    size: 12
  }) : /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: "IONIconAArrowForward",
    size: 12,
    style: {
      transform: rot
    }
  })), /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 4,
      flex: 1,
      minWidth: 0
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 8,
      minWidth: 0
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 14,
      lineHeight: 1.4,
      color: 'var(--white)',
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      textOverflow: 'ellipsis'
    }
  }, title), category ? /*#__PURE__*/React.createElement("span", {
    style: {
      flexShrink: 0,
      height: 18,
      padding: '0 7px',
      borderRadius: 6,
      background: 'var(--surface-ghost)',
      font: 'var(--fw-regular) 10px/18px var(--font-sans)',
      color: 'var(--gray-300)',
      textTransform: 'uppercase'
    }
  }, category) : null), meta ? /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 14,
      lineHeight: 1.5,
      color: 'var(--gray-400)',
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      textOverflow: 'ellipsis'
    }
  }, meta) : null), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 14,
      lineHeight: 1.5,
      color: amountColor,
      whiteSpace: 'nowrap',
      fontWeight: type === 'income' ? 500 : 400
    }
  }, amount));
}
Object.assign(__ds_scope, { TransactionItem, __ds_default_components_data_TransactionItem_f4kijc: TransactionItem });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/data/TransactionItem.jsx", error: String((e && e.message) || e) }); }

// components/navigation/Avatar.jsx
try { (() => {
function Avatar({
  src,
  name,
  email,
  collapsed = false,
  size = 40,
  style
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: collapsed ? 0 : 15,
      minWidth: 0,
      transition: 'gap var(--dur-slow) var(--ease-out)',
      fontFamily: 'var(--font-sans)',
      ...style
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: size,
      height: size,
      borderRadius: 12,
      flexShrink: 0,
      background: src ? `url(${src}) center/cover no-repeat` : 'var(--violet-600)',
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: 'var(--white)',
      fontWeight: 700,
      fontSize: 14
    }
  }, src ? null : (name || '?').slice(0, 1)), /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 0,
      minWidth: 0,
      overflow: 'hidden',
      maxWidth: collapsed ? 0 : 180,
      opacity: collapsed ? 0 : 1,
      transition: 'opacity var(--dur-base) var(--ease-out), max-width var(--dur-slow) var(--ease-out)'
    }
  }, name ? /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 14,
      lineHeight: 1.4,
      color: 'var(--white)',
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      textOverflow: 'ellipsis'
    }
  }, name) : null, email ? /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 12,
      lineHeight: 1.5,
      color: 'var(--gray-400)',
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      textOverflow: 'ellipsis'
    }
  }, email) : null));
}
Object.assign(__ds_scope, { Avatar, __ds_default_components_navigation_Avatar_1s3t4fs: Avatar });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/navigation/Avatar.jsx", error: String((e && e.message) || e) }); }

// components/navigation/Breadcrumb.jsx
try { (() => {
function Breadcrumb({
  items = ['Pages'],
  current,
  style
}) {
  return /*#__PURE__*/React.createElement("nav", {
    "aria-label": "Breadcrumb",
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 5,
      font: 'var(--fw-regular) 12px/1 var(--font-sans)',
      whiteSpace: 'nowrap',
      ...style
    }
  }, items.map((it, i) => /*#__PURE__*/React.createElement(React.Fragment, {
    key: i
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      color: 'var(--gray-400)'
    }
  }, it), /*#__PURE__*/React.createElement("span", {
    style: {
      color: 'var(--gray-400)'
    }
  }, "/"))), current ? /*#__PURE__*/React.createElement("span", {
    style: {
      color: 'var(--white)'
    }
  }, current) : null);
}
Object.assign(__ds_scope, { Breadcrumb, __ds_default_components_navigation_Breadcrumb_1j6vgds: Breadcrumb });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/navigation/Breadcrumb.jsx", error: String((e && e.message) || e) }); }

// components/navigation/HelpCard.jsx
try { (() => {
function HelpCard({
  title = 'Need help?',
  text = 'Please check our docs',
  cta = 'DOCUMENTATION',
  image,
  collapsed = false,
  onCta,
  style
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative',
      overflow: 'hidden',
      borderRadius: 15,
      background: image ? `url(${image}) center/cover no-repeat, var(--blue-500)` : 'var(--blue-500)',
      padding: collapsed ? 7 : 16,
      display: 'flex',
      flexDirection: 'column',
      gap: collapsed ? 0 : 20.5,
      boxSizing: 'border-box',
      transition: 'padding var(--dur-slow) var(--ease-out)',
      fontFamily: 'var(--font-sans)',
      ...style
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.IconTile, {
    icon: "IONIconHHelpCircle",
    size: "md",
    tone: "white"
  }), collapsed ? null : /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 3.5
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontWeight: 700,
      fontSize: 14,
      lineHeight: 1.4,
      color: 'var(--white)'
    }
  }, title), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 12,
      lineHeight: 1,
      color: 'var(--white)'
    }
  }, text)), /*#__PURE__*/React.createElement(__ds_scope.Button, {
    variant: "glass",
    fullWidth: true,
    onClick: onCta
  }, cta)));
}
Object.assign(__ds_scope, { HelpCard, __ds_default_components_navigation_HelpCard_jlworg: HelpCard });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/navigation/HelpCard.jsx", error: String((e && e.message) || e) }); }

// components/navigation/Logo.jsx
try { (() => {
function Logo({
  name = 'VISION UI FREE',
  short,
  collapsed = false,
  divider = true,
  style
}) {
  const s = short ?? name.split(/\s+/).map(w => w[0]).join('').slice(0, 2);
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: 31.5,
      width: '100%',
      ...style
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative',
      height: 14,
      width: '100%',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      position: 'absolute',
      font: 'var(--fw-regular) 14px/1 var(--font-sans)',
      letterSpacing: 'var(--ls-logo)',
      color: 'var(--white)',
      whiteSpace: 'nowrap',
      opacity: collapsed ? 0 : 1,
      transform: collapsed ? 'scale(0.9)' : 'none',
      transition: 'opacity var(--dur-base) var(--ease-out), transform var(--dur-base) var(--ease-out)'
    }
  }, name), /*#__PURE__*/React.createElement("span", {
    style: {
      position: 'absolute',
      font: 'var(--fw-bold) 14px/1 var(--font-sans)',
      letterSpacing: 'var(--ls-logo)',
      color: 'var(--white)',
      opacity: collapsed ? 1 : 0,
      transition: 'opacity var(--dur-base) var(--ease-out)'
    }
  }, s)), divider ? /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'block',
      height: 1,
      width: '100%',
      background: 'linear-gradient(90deg,rgba(224,225,226,0) 0%,rgba(224,225,226,0.5) 50%,rgba(224,225,226,0.16) 100%)'
    }
  }) : null);
}
Object.assign(__ds_scope, { Logo, __ds_default_components_navigation_Logo_14b58yy: Logo });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/navigation/Logo.jsx", error: String((e && e.message) || e) }); }

// components/navigation/NavItem.jsx
try { (() => {
function NavItem({
  icon,
  label,
  active = false,
  collapsed = false,
  badge,
  onClick,
  style
}) {
  const [hover, setHover] = React.useState(false);
  const bg = active ? 'var(--surface-nav-active)' : hover ? 'rgba(26,31,55,0.55)' : 'transparent';
  return /*#__PURE__*/React.createElement("button", {
    type: "button",
    title: collapsed ? label : undefined,
    onClick: onClick,
    onMouseEnter: () => setHover(true),
    onMouseLeave: () => setHover(false),
    style: {
      position: 'relative',
      display: 'flex',
      alignItems: 'center',
      gap: collapsed ? 0 : 15,
      width: '100%',
      height: 54,
      padding: collapsed ? '12px 7px' : '12px 16px',
      border: 'none',
      borderRadius: 'var(--radius-nav)',
      background: bg,
      boxShadow: active ? 'var(--shadow-tile)' : 'none',
      cursor: 'pointer',
      boxSizing: 'border-box',
      textAlign: 'left',
      transition: 'background var(--dur-base) var(--ease-out), padding var(--dur-slow) var(--ease-out), gap var(--dur-slow) var(--ease-out)',
      ...style
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.IconTile, {
    icon: icon,
    size: "sm",
    tone: active ? 'blue' : 'navy',
    style: {
      transform: hover && !active ? 'translateX(2px)' : 'none',
      transition: 'transform var(--dur-fast) var(--ease-out), background var(--dur-base)'
    }
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      flex: 1,
      minWidth: 0,
      overflow: 'hidden',
      whiteSpace: 'nowrap',
      font: 'var(--fw-regular) 14px/1 var(--font-sans)',
      color: 'var(--white)',
      opacity: collapsed ? 0 : 1,
      maxWidth: collapsed ? 0 : 200,
      transition: 'opacity var(--dur-base) var(--ease-out), max-width var(--dur-slow) var(--ease-out)'
    }
  }, label), badge !== undefined && badge !== null ? collapsed ? /*#__PURE__*/React.createElement(__ds_scope.Badge, {
    variant: "dot",
    tone: "blue",
    style: {
      position: 'absolute',
      top: 12,
      left: 34
    }
  }) : /*#__PURE__*/React.createElement(__ds_scope.Badge, {
    variant: "count",
    tone: "blue"
  }, badge) : null);
}
Object.assign(__ds_scope, { NavItem, __ds_default_components_navigation_NavItem_zxdqgd: NavItem });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/navigation/NavItem.jsx", error: String((e && e.message) || e) }); }

// components/navigation/PageHeader.jsx
try { (() => {
function PageHeader({
  trail = ['Pages'],
  title,
  searchPlaceholder = 'Type here...',
  searchIconSrc,
  userLabel = 'Sign In',
  onSearch,
  actions,
  style
}) {
  return /*#__PURE__*/React.createElement("header", {
    style: {
      display: 'flex',
      alignItems: 'flex-start',
      justifyContent: 'space-between',
      gap: 24,
      flexWrap: 'wrap',
      fontFamily: 'var(--font-sans)',
      ...style
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 6,
      paddingTop: 14.5
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.Breadcrumb, {
    items: trail,
    current: title
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 14,
      lineHeight: 1.4,
      color: 'var(--white)'
    }
  }, title)), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 18
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.Input, {
    variant: "search",
    iconSrc: searchIconSrc,
    placeholder: searchPlaceholder,
    onChange: onSearch,
    style: {
      width: 199
    }
  }), actions ?? /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 4,
      fontSize: 12,
      lineHeight: 1.5,
      color: 'var(--gray-500)'
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: "IONIconPPersonDefault",
    size: 12
  }), userLabel), /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: "IONIconSSettingsSharp",
    size: 12,
    style: {
      color: 'var(--gray-500)'
    }
  }), /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: "IONIconNNotificationsDefault",
    size: 12,
    style: {
      color: 'var(--gray-500)'
    }
  }))));
}
Object.assign(__ds_scope, { PageHeader, __ds_default_components_navigation_PageHeader_408gkf: PageHeader });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/navigation/PageHeader.jsx", error: String((e && e.message) || e) }); }

// components/navigation/SidebarToggle.jsx
try { (() => {
function SidebarToggle({
  collapsed = false,
  onClick,
  style
}) {
  const [hover, setHover] = React.useState(false);
  return /*#__PURE__*/React.createElement("button", {
    type: "button",
    "aria-label": collapsed ? 'Expand sidebar' : 'Collapse sidebar',
    onClick: onClick,
    onMouseEnter: () => setHover(true),
    onMouseLeave: () => setHover(false),
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: 28,
      height: 28,
      padding: 0,
      border: 'none',
      borderRadius: '50%',
      cursor: 'pointer',
      background: hover ? 'var(--blue-500)' : 'var(--navy-700)',
      color: 'var(--white)',
      boxShadow: '0 0 0 3px var(--navy-900)',
      transition: 'background var(--dur-fast) var(--ease-out)',
      ...style
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: "IONIconAArrowForward",
    size: 14,
    style: {
      transform: collapsed ? 'none' : 'rotate(180deg)',
      transition: 'transform var(--dur-slow) var(--ease-out)'
    }
  }));
}
Object.assign(__ds_scope, { SidebarToggle, __ds_default_components_navigation_SidebarToggle_3acbn9: SidebarToggle });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/navigation/SidebarToggle.jsx", error: String((e && e.message) || e) }); }

// components/navigation/Sidebar.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function Sidebar({
  brand = 'VISION UI FREE',
  brandShort,
  sections = [],
  activeId,
  onSelect,
  collapsed,
  defaultCollapsed = false,
  onToggle,
  user,
  help,
  style
}) {
  const [inner, setInner] = React.useState(defaultCollapsed);
  const c = collapsed ?? inner;
  const toggle = () => {
    if (collapsed === undefined) setInner(!c);
    onToggle && onToggle(!c);
  };
  return /*#__PURE__*/React.createElement("aside", {
    style: {
      position: 'relative',
      flexShrink: 0,
      width: c ? 'var(--sidebar-width-collapsed)' : 'var(--sidebar-width)',
      height: '100%',
      borderRadius: 20,
      background: 'var(--gradient-sidebar)',
      backdropFilter: 'var(--blur-card)',
      WebkitBackdropFilter: 'var(--blur-card)',
      boxSizing: 'border-box',
      padding: c ? '36px 22px 24px' : '36px 22px 24px 23px',
      display: 'flex',
      flexDirection: 'column',
      transition: 'width var(--dur-slow) var(--ease-out)',
      fontFamily: 'var(--font-sans)',
      ...style
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.SidebarToggle, {
    collapsed: c,
    onClick: toggle,
    style: {
      position: 'absolute',
      top: 22,
      right: -14,
      zIndex: 2
    }
  }), /*#__PURE__*/React.createElement(__ds_scope.Logo, {
    name: brand,
    short: brandShort,
    collapsed: c
  }), /*#__PURE__*/React.createElement("nav", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 0,
      marginTop: 22,
      flex: 1,
      minHeight: 0,
      overflowY: 'auto',
      overflowX: 'hidden'
    }
  }, sections.map((sec, si) => /*#__PURE__*/React.createElement("div", {
    key: si,
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 12,
      marginTop: si ? 12 : 0
    }
  }, sec.label ? /*#__PURE__*/React.createElement("span", {
    style: {
      height: 18,
      paddingLeft: c ? 0 : 16,
      textAlign: c ? 'center' : 'left',
      font: 'var(--fw-regular) 12px/1.5 var(--font-sans)',
      color: 'var(--white)',
      whiteSpace: 'nowrap',
      overflow: 'hidden'
    }
  }, c ? '•••' : sec.label) : null, sec.items.map(it => /*#__PURE__*/React.createElement(__ds_scope.NavItem, {
    key: it.id,
    icon: it.icon,
    label: it.label,
    badge: it.badge,
    collapsed: c,
    active: it.id === activeId,
    onClick: () => onSelect && onSelect(it.id)
  }))))), help ? /*#__PURE__*/React.createElement(__ds_scope.HelpCard, _extends({}, help, {
    collapsed: c,
    style: {
      marginTop: 24
    }
  })) : null, user ? /*#__PURE__*/React.createElement(__ds_scope.Avatar, _extends({}, user, {
    collapsed: c,
    style: {
      marginTop: 20,
      paddingLeft: c ? 2 : 4
    }
  })) : null);
}
Object.assign(__ds_scope, { Sidebar, __ds_default_components_navigation_Sidebar_5hywdv: Sidebar });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/navigation/Sidebar.jsx", error: String((e && e.message) || e) }); }

// components/photos/PersonPhoto14.jsx
try { (() => {
// figma node: Person Photo 14 — 320×320 square photo symbol, clipped
function PersonPhoto14({
  src = '../../assets/images/avatar-2.png',
  size = 320,
  radius = 0,
  alt = 'Person Photo 14',
  className,
  style
}) {
  return /*#__PURE__*/React.createElement("div", {
    className: className,
    style: {
      width: size,
      height: size,
      borderRadius: radius,
      overflow: 'hidden',
      position: 'relative',
      flexShrink: 0,
      ...style
    }
  }, /*#__PURE__*/React.createElement("img", {
    src: src,
    alt: alt,
    style: {
      width: '100%',
      height: '100%',
      objectFit: 'cover',
      display: 'block'
    }
  }));
}
Object.assign(__ds_scope, { PersonPhoto14, __ds_default_components_photos_PersonPhoto14_l72v64: PersonPhoto14 });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/photos/PersonPhoto14.jsx", error: String((e && e.message) || e) }); }

// components/photos/PersonPhoto16.jsx
try { (() => {
// figma node: Person Photo 16 — 320×320 square photo symbol, clipped
function PersonPhoto16({
  src = '../../assets/images/avatar-3.png',
  size = 320,
  radius = 0,
  alt = 'Person Photo 16',
  className,
  style
}) {
  return /*#__PURE__*/React.createElement("div", {
    className: className,
    style: {
      width: size,
      height: size,
      borderRadius: radius,
      overflow: 'hidden',
      position: 'relative',
      flexShrink: 0,
      ...style
    }
  }, /*#__PURE__*/React.createElement("img", {
    src: src,
    alt: alt,
    style: {
      width: '100%',
      height: '100%',
      objectFit: 'cover',
      display: 'block'
    }
  }));
}
Object.assign(__ds_scope, { PersonPhoto16, __ds_default_components_photos_PersonPhoto16_l72v66: PersonPhoto16 });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/photos/PersonPhoto16.jsx", error: String((e && e.message) || e) }); }

// components/photos/PersonPhoto23.jsx
try { (() => {
// figma node: Person Photo 23 — 320×320 square photo symbol, clipped
function PersonPhoto23({
  src = '../../assets/images/avatar-4.png',
  size = 320,
  radius = 0,
  alt = 'Person Photo 23',
  className,
  style
}) {
  return /*#__PURE__*/React.createElement("div", {
    className: className,
    style: {
      width: size,
      height: size,
      borderRadius: radius,
      overflow: 'hidden',
      position: 'relative',
      flexShrink: 0,
      ...style
    }
  }, /*#__PURE__*/React.createElement("img", {
    src: src,
    alt: alt,
    style: {
      width: '100%',
      height: '100%',
      objectFit: 'cover',
      display: 'block'
    }
  }));
}
Object.assign(__ds_scope, { PersonPhoto23, __ds_default_components_photos_PersonPhoto23_l72v70: PersonPhoto23 });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/photos/PersonPhoto23.jsx", error: String((e && e.message) || e) }); }

// components/photos/PersonPhoto4.jsx
try { (() => {
// figma node: Person Photo 4 — 320×320 square photo symbol, clipped
function PersonPhoto4({
  src = '../../assets/images/avatar-1.png',
  size = 320,
  radius = 0,
  alt = 'Person Photo 4',
  className,
  style
}) {
  return /*#__PURE__*/React.createElement("div", {
    className: className,
    style: {
      width: size,
      height: size,
      borderRadius: radius,
      overflow: 'hidden',
      position: 'relative',
      flexShrink: 0,
      ...style
    }
  }, /*#__PURE__*/React.createElement("img", {
    src: src,
    alt: alt,
    style: {
      width: '100%',
      height: '100%',
      objectFit: 'cover',
      display: 'block'
    }
  }));
}
Object.assign(__ds_scope, { PersonPhoto4, __ds_default_components_photos_PersonPhoto4_n4g7v: PersonPhoto4 });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/photos/PersonPhoto4.jsx", error: String((e && e.message) || e) }); }

// ui_kits/finance-web/AccountsScreen.jsx
try { (() => {
function AccountsScreen({
  onOpenTx
}) {
  const {
    Card,
    CreditCard,
    Balance,
    TransactionItem,
    Button,
    Icon
  } = window.VisionFinanceDesignSystem_6fe7b7;
  const d = window.FIN_DATA,
    f = window.FIN;
  const [sel, setSel] = React.useState(d.accounts[0].id);
  const a = f.acct(sel);
  const tx = d.transactions.filter(t => t.account === sel);
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'minmax(0,1.35fr) minmax(0,1fr)',
      gap: 24,
      alignItems: 'start'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 24
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'minmax(0,1.1fr) minmax(0,1fr)',
      gap: 24
    }
  }, /*#__PURE__*/React.createElement(CreditCard, {
    image: "../../assets/images/credit-card-bg.jpg",
    brand: a.bank,
    number: a.number.slice(0, 15) + 'XXXX',
    validThru: a.validThru,
    cvv: a.cvv
  }), /*#__PURE__*/React.createElement(Card, {
    padding: "25px 24px",
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 22
    }
  }, /*#__PURE__*/React.createElement(Balance, {
    title: a.name + ' balance',
    amount: f.money(a.balance),
    graphSrc: "../../assets/images/balance-graph.svg"
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 8
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      font: 'var(--text-overline)',
      color: 'var(--gray-400)'
    }
  }, "NEWEST"), tx[0] ? /*#__PURE__*/React.createElement(TransactionItem, {
    title: tx[0].merchant,
    meta: f.date(tx[0].date),
    amount: f.money(tx[0].amount, true),
    type: tx[0].amount > 0 ? 'income' : 'expense'
  }) : null))), /*#__PURE__*/React.createElement(Card, {
    title: "Linked accounts",
    action: /*#__PURE__*/React.createElement(Button, null, "Link account")
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit,minmax(240px,1fr))',
      gap: 16
    }
  }, d.accounts.map(x => /*#__PURE__*/React.createElement("button", {
    key: x.id,
    onClick: () => setSel(x.id),
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 14,
      height: 74,
      padding: '0 22px',
      borderRadius: 20,
      border: 'none',
      cursor: 'pointer',
      textAlign: 'left',
      fontFamily: 'var(--font-sans)',
      color: 'var(--white)',
      background: 'var(--gradient-tile)',
      boxShadow: x.id === sel ? 'inset 0 0 0 1.5px var(--blue-500)' : 'inset 0 0 0 1px rgba(226,232,240,0.3)'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      flex: 1,
      gap: 2
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 14
    }
  }, x.name), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 12,
      color: 'var(--gray-400)'
    }
  }, x.bank, " \xB7 \u2022\u2022\u2022\u2022 ", x.number.slice(-4))), /*#__PURE__*/React.createElement("span", {
    style: {
      fontWeight: 700,
      fontSize: 14,
      color: x.balance < 0 ? 'var(--red-500)' : 'var(--white)'
    }
  }, f.money(x.balance))))))), /*#__PURE__*/React.createElement(Card, {
    title: a.name + ' activity',
    action: /*#__PURE__*/React.createElement("span", {
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 6,
        fontSize: 14,
        color: 'var(--gray-400)'
      }
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "IONIconCCalendarOutline",
      size: 15,
      style: {
        color: 'var(--white)'
      }
    }), "1 \u2013 9 Oct 2026")
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 18
    }
  }, tx.length ? tx.map(t => /*#__PURE__*/React.createElement(TransactionItem, {
    key: t.id,
    onClick: () => onOpenTx(t),
    title: t.merchant,
    meta: f.date(t.date),
    category: f.cat(t.category).label,
    amount: f.money(t.amount, true),
    type: t.amount > 0 ? 'income' : 'expense'
  })) : /*#__PURE__*/React.createElement("span", {
    style: {
      color: 'var(--gray-400)',
      fontSize: 14
    }
  }, "No activity yet."))));
}
window.AccountsScreen = AccountsScreen;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/finance-web/AccountsScreen.jsx", error: String((e && e.message) || e) }); }

// ui_kits/finance-web/DashboardScreen.jsx
try { (() => {
const DS = window.VisionFinanceDesignSystem_6fe7b7;
function DashboardScreen({
  onOpenTx,
  onNav
}) {
  const {
    Card,
    StatCard,
    LineChart,
    BarChart,
    Gauge,
    TransactionItem,
    MiniStat,
    Button,
    IconTile
  } = DS;
  const d = window.FIN_DATA,
    f = window.FIN;
  const total = d.accounts.reduce((s, a) => s + a.balance, 0);
  const month = d.transactions.filter(t => t.amount !== null && t.date.startsWith('2026-10'));
  const inc = month.filter(t => t.amount > 0).reduce((s, t) => s + t.amount, 0);
  const out = -month.filter(t => t.amount < 0 && t.category !== 'transfer').reduce((s, t) => s + t.amount, 0);
  const byCat = d.categories.filter(c => !['salary', 'transfer'].includes(c.id)).map(c => ({
    c,
    v: -month.filter(t => t.category === c.id).reduce((s, t) => s + t.amount, 0)
  }));
  const budget = 2400;
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 24
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit,minmax(230px,1fr))',
      gap: 24
    }
  }, /*#__PURE__*/React.createElement(StatCard, {
    label: "Total Balance",
    value: f.money(total),
    icon: "IONIconWWalletDefault"
  }), /*#__PURE__*/React.createElement(StatCard, {
    label: "Income \xB7 Oct",
    value: f.money(inc),
    change: "+6%",
    icon: "IONIconSStatsChart"
  }), /*#__PURE__*/React.createElement(StatCard, {
    label: "Spending \xB7 Oct",
    value: f.money(out),
    change: "-12%",
    trend: "up",
    icon: "IONIconCCartDefault"
  }), /*#__PURE__*/React.createElement(StatCard, {
    label: "Receipts scanned",
    value: "24",
    change: "+3",
    icon: "IONIconDDocumentText"
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'minmax(0,1.9fr) minmax(0,1fr)',
      gap: 24
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative',
      overflow: 'hidden',
      borderRadius: 20,
      minHeight: 344,
      background: 'url(../../assets/images/welcome-jellyfish.jpg) center/cover',
      padding: '36px 31px',
      boxSizing: 'border-box',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 6
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 14,
      color: 'var(--gray-400)'
    }
  }, "Welcome back,"), /*#__PURE__*/React.createElement("span", {
    style: {
      fontWeight: 700,
      fontSize: 28,
      lineHeight: 1.4
    }
  }, d.user.name), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 16,
      lineHeight: 1.5,
      color: 'var(--gray-400)',
      maxWidth: 260
    }
  }, "You spent ", f.money(out), " this month across ", byCat.filter(x => x.v > 0).length, " categories.")), /*#__PURE__*/React.createElement("button", {
    onClick: () => onNav('transactions'),
    style: {
      alignSelf: 'flex-start',
      display: 'flex',
      alignItems: 'center',
      gap: 5,
      background: 'none',
      border: 'none',
      padding: 0,
      color: 'var(--white)',
      fontSize: 12,
      fontFamily: 'var(--font-sans)',
      cursor: 'pointer'
    }
  }, "View transactions ", /*#__PURE__*/React.createElement(DS.Icon, {
    name: "IONIconAArrowForward",
    size: 13
  }))), /*#__PURE__*/React.createElement(Card, {
    title: "Monthly budget",
    subtitle: f.money(out) + ' of ' + f.money(budget),
    padding: "26px 27px"
  }, /*#__PURE__*/React.createElement(Gauge, {
    value: Math.round(out / budget * 100),
    caption: "Of budget used",
    icon: "IONIconWWalletDefault",
    minLabel: "$0",
    maxLabel: '$' + budget.toLocaleString(),
    style: {
      height: 240
    }
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'minmax(0,1.4fr) minmax(0,1fr)',
      gap: 24
    }
  }, /*#__PURE__*/React.createElement(Card, {
    title: "Cash flow",
    subtitle: /*#__PURE__*/React.createElement("span", null, /*#__PURE__*/React.createElement("b", {
      style: {
        color: 'var(--green-500)'
      }
    }, "(+", f.money(inc - out), ")"), " net in October")
  }, /*#__PURE__*/React.createElement(LineChart, {
    height: 300,
    labels: d.cashflow.labels,
    series: [{
      color: 'blue',
      data: d.cashflow.income.map(v => v / 10)
    }, {
      color: 'cyan',
      data: d.cashflow.expense.map(v => v / 10)
    }],
    max: 700
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 20,
      marginTop: 10,
      fontSize: 12,
      color: 'var(--gray-400)'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 6
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 8,
      height: 8,
      borderRadius: '50%',
      background: 'var(--blue-500)'
    }
  }), "Income ($\xD710)"), /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 6
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 8,
      height: 8,
      borderRadius: '50%',
      background: 'var(--cyan-400)'
    }
  }), "Spending ($\xD710)"))), /*#__PURE__*/React.createElement(Card, {
    padding: 16
  }, /*#__PURE__*/React.createElement(BarChart, {
    data: byCat.map(x => Math.max(4, x.v)),
    labels: byCat.map(x => x.c.label),
    max: Math.ceil(Math.max(...byCat.map(x => x.v)) / 100) * 100
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '28px 6px 6px',
      display: 'flex',
      flexDirection: 'column',
      gap: 6
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      font: 'var(--text-card-title)'
    }
  }, "Spending by category"), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 14,
      color: 'var(--gray-400)'
    }
  }, "From receipts and bank sync")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(3,1fr)',
      gap: 16,
      padding: '18px 6px 6px'
    }
  }, byCat.sort((a, b) => b.v - a.v).slice(0, 3).map(x => /*#__PURE__*/React.createElement(MiniStat, {
    key: x.c.id,
    icon: x.c.icon,
    label: x.c.label.split(' ')[0],
    value: f.money(x.v),
    progress: x.v / out * 100
  }))))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'minmax(0,1.4fr) minmax(0,1fr)',
      gap: 24
    }
  }, /*#__PURE__*/React.createElement(Card, {
    title: "Recent transactions",
    subtitle: /*#__PURE__*/React.createElement("span", null, /*#__PURE__*/React.createElement("b", {
      style: {
        color: 'var(--white)'
      }
    }, month.length, " entries"), " this month"),
    action: /*#__PURE__*/React.createElement(Button, {
      onClick: () => onNav('transactions')
    }, "View all")
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 18
    }
  }, d.transactions.filter(t => t.status === 'done').slice(0, 5).map(t => /*#__PURE__*/React.createElement(TransactionItem, {
    key: t.id,
    onClick: () => onOpenTx(t),
    title: t.merchant,
    meta: f.date(t.date),
    category: f.cat(t.category).label,
    amount: f.money(t.amount, true),
    type: t.amount > 0 ? 'income' : 'expense'
  })))), /*#__PURE__*/React.createElement(Card, {
    title: "Where your money is",
    subtitle: "Balances by account"
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 14
    }
  }, d.accounts.map(a => /*#__PURE__*/React.createElement("div", {
    key: a.id,
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 14,
      padding: '16px 18px',
      borderRadius: 20,
      background: 'var(--gradient-row)'
    }
  }, /*#__PURE__*/React.createElement(IconTile, {
    icon: a.type === 'Credit' ? 'IONIconCCardDefault' : 'IONIconWWalletDefault',
    size: "lg",
    tone: a.type === 'Credit' ? 'navy' : 'blue'
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      gap: 2,
      minWidth: 0
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 14
    }
  }, a.name), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 12,
      color: 'var(--gray-400)'
    }
  }, a.bank, " \xB7 \u2022\u2022\u2022\u2022 ", a.number.slice(-4))), /*#__PURE__*/React.createElement("span", {
    style: {
      fontWeight: 700,
      fontSize: 18,
      color: a.balance < 0 ? 'var(--red-500)' : 'var(--white)'
    }
  }, f.money(a.balance))))))));
}
window.DashboardScreen = DashboardScreen;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/finance-web/DashboardScreen.jsx", error: String((e && e.message) || e) }); }

// ui_kits/finance-web/ReceiptsScreen.jsx
try { (() => {
function ReceiptsScreen({
  onOpenTx
}) {
  const {
    Card,
    InvoiceItem,
    Button,
    Badge,
    ProgressBar,
    IconTile
  } = window.VisionFinanceDesignSystem_6fe7b7;
  const d = window.FIN_DATA,
    f = window.FIN;
  const rec = d.transactions.filter(t => t.source === 'receipt');
  const pending = rec.filter(t => t.status === 'processing');
  const [p, setP] = React.useState(35);
  React.useEffect(() => {
    const id = setInterval(() => setP(v => v >= 95 ? 35 : v + 6), 700);
    return () => clearInterval(id);
  }, []);
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'minmax(0,1fr) minmax(0,1.2fr)',
      gap: 24,
      alignItems: 'start'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 24
    }
  }, /*#__PURE__*/React.createElement(Card, {
    title: "Processing",
    subtitle: "Bills sent from your phone"
  }, pending.map(t => /*#__PURE__*/React.createElement("div", {
    key: t.id,
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 14,
      padding: '18px 20px',
      borderRadius: 20,
      background: 'var(--gradient-row)'
    }
  }, /*#__PURE__*/React.createElement(IconTile, {
    icon: "IONIconDDocumentText",
    size: "lg",
    tone: "ghost",
    round: true
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      gap: 8
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 14
    }
  }, "Reading receipt\u2026"), /*#__PURE__*/React.createElement(ProgressBar, {
    value: p,
    width: "100%"
  })), /*#__PURE__*/React.createElement(Badge, {
    variant: "outline"
  }, p, "%")))), /*#__PURE__*/React.createElement(Card, {
    title: "How it works"
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 16
    }
  }, [['IONIconDDocumentDefault', 'Take a screenshot of the bill on your phone'], ['IONIconRRocketSharp', 'It is sent to your finance service'], ['IONIconCCubeDefault', 'The service reads merchant, items and category'], ['IONIconSStatsChart', 'It appears here in your history']].map(([i, t], k) => /*#__PURE__*/React.createElement("span", {
    key: k,
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 14,
      fontSize: 14
    }
  }, /*#__PURE__*/React.createElement(IconTile, {
    icon: i,
    size: "sm",
    tone: "navy"
  }), t))))), /*#__PURE__*/React.createElement(Card, {
    title: "Scanned receipts",
    action: /*#__PURE__*/React.createElement(Button, null, "View all")
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 24
    }
  }, rec.filter(t => t.status === 'done').map(t => /*#__PURE__*/React.createElement("div", {
    key: t.id,
    onClick: () => onOpenTx(t),
    style: {
      cursor: 'pointer'
    }
  }, /*#__PURE__*/React.createElement(InvoiceItem, {
    date: t.merchant,
    id: f.cat(t.category).label + ' · ' + new Date(t.date).toLocaleDateString('en-GB'),
    amount: f.money(t.amount),
    format: "VIEW"
  }))))));
}
window.ReceiptsScreen = ReceiptsScreen;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/finance-web/ReceiptsScreen.jsx", error: String((e && e.message) || e) }); }

// ui_kits/finance-web/Shell.jsx
try { (() => {
const {
  Sidebar,
  PageHeader
} = window.VisionFinanceDesignSystem_6fe7b7;
const NAV = [{
  items: [{
    id: 'dashboard',
    label: 'Dashboard',
    icon: 'IONIconHHomeDefault'
  }, {
    id: 'transactions',
    label: 'Transactions',
    icon: 'IONIconSStatsChart'
  }, {
    id: 'accounts',
    label: 'Accounts',
    icon: 'IONIconWWalletDefault'
  }, {
    id: 'receipts',
    label: 'Receipts',
    icon: 'IONIconDDocumentText',
    badge: 1
  }]
}, {
  label: 'ACCOUNT PAGES',
  items: [{
    id: 'profile',
    label: 'Profile',
    icon: 'IONIconPPersonDefault'
  }, {
    id: 'signin',
    label: 'Sign Out',
    icon: 'IONIconDDocumentDefault'
  }]
}];
const TITLES = {
  dashboard: 'Dashboard',
  transactions: 'Transactions',
  accounts: 'Accounts',
  receipts: 'Receipts',
  profile: 'Profile'
};
function Shell({
  page,
  onNav,
  collapsed,
  onToggle,
  children
}) {
  const u = window.FIN_DATA.user;
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 24,
      padding: 10,
      minHeight: '100vh',
      boxSizing: 'border-box'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'sticky',
      top: 10,
      height: 'calc(100vh - 20px)',
      flexShrink: 0
    }
  }, /*#__PURE__*/React.createElement(Sidebar, {
    brand: "VISION FINANCE",
    brandShort: "VF",
    sections: NAV,
    activeId: page,
    onSelect: onNav,
    collapsed: collapsed,
    onToggle: onToggle,
    help: {
      image: '../../assets/images/help-card-bg.jpg',
      title: 'Scan a bill',
      text: 'Send a receipt from your phone',
      cta: 'HOW IT WORKS'
    },
    user: {
      src: u.avatar,
      name: u.name,
      email: u.email
    }
  })), /*#__PURE__*/React.createElement("main", {
    style: {
      flex: 1,
      minWidth: 0,
      padding: '12px 12px 24px 0',
      display: 'flex',
      flexDirection: 'column',
      gap: 24
    }
  }, /*#__PURE__*/React.createElement(PageHeader, {
    title: TITLES[page],
    searchIconSrc: "../../assets/icons/search.svg",
    searchPlaceholder: "Search transactions...",
    userLabel: u.name
  }), children, /*#__PURE__*/React.createElement("footer", {
    style: {
      marginTop: 'auto',
      display: 'flex',
      justifyContent: 'space-between',
      flexWrap: 'wrap',
      gap: 12,
      fontFamily: 'var(--font-alt)',
      fontSize: 14,
      lineHeight: 1.5,
      color: 'var(--white)'
    }
  }, /*#__PURE__*/React.createElement("span", null, "\xA9 2026, Vision Finance"), /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'flex',
      gap: 44
    }
  }, /*#__PURE__*/React.createElement("a", {
    href: "#",
    style: {
      color: 'var(--white)'
    }
  }, "Privacy"), /*#__PURE__*/React.createElement("a", {
    href: "#",
    style: {
      color: 'var(--white)'
    }
  }, "Help")))));
}
window.Shell = Shell;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/finance-web/Shell.jsx", error: String((e && e.message) || e) }); }

// ui_kits/finance-web/SignInScreen.jsx
try { (() => {
function SignInScreen({
  onSignIn
}) {
  const {
    Input,
    Button,
    Switch
  } = window.VisionFinanceDesignSystem_6fe7b7;
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      minHeight: '100vh',
      background: 'linear-gradient(160.269deg,rgb(15,18,59) 17.24%,rgb(9,13,46) 54.11%,rgb(2,5,21) 80.06%)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      minWidth: 0,
      position: 'relative',
      background: 'url(../../assets/images/auth-hero.jpg) center/cover',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      textAlign: 'center',
      display: 'flex',
      flexDirection: 'column',
      gap: 18
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 20,
      letterSpacing: '0.18em',
      color: 'var(--white)'
    }
  }, "INSPIRED BY THE FUTURE:"), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-display)',
      fontWeight: 700,
      fontSize: 36,
      letterSpacing: '0.18em',
      color: 'var(--white)'
    }
  }, "VISION FINANCE"))), /*#__PURE__*/React.createElement("form", {
    onSubmit: e => {
      e.preventDefault();
      onSignIn();
    },
    style: {
      width: 'min(520px,100%)',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      padding: '0 85px',
      boxSizing: 'border-box',
      gap: 24
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 8
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontWeight: 700,
      fontSize: 30,
      lineHeight: 1.3
    }
  }, "Nice to see you!"), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 14,
      color: 'var(--gray-400)'
    }
  }, "Enter your email and password to sign in")), /*#__PURE__*/React.createElement(Input, {
    label: "Email",
    type: "email",
    placeholder: "Your email...",
    defaultValue: "mark@simmmple.com"
  }), /*#__PURE__*/React.createElement(Input, {
    label: "Password",
    type: "password",
    placeholder: "Your password...",
    defaultValue: "password"
  }), /*#__PURE__*/React.createElement(Switch, {
    defaultChecked: true,
    label: "Remember me"
  }), /*#__PURE__*/React.createElement(Button, {
    size: "lg",
    fullWidth: true,
    type: "submit"
  }, "Sign in"), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 14,
      color: 'var(--gray-400)',
      textAlign: 'center'
    }
  }, "Don't have an account? ", /*#__PURE__*/React.createElement("a", {
    href: "#",
    style: {
      color: 'var(--white)',
      fontWeight: 700
    }
  }, "Sign up"))));
}
window.SignInScreen = SignInScreen;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/finance-web/SignInScreen.jsx", error: String((e && e.message) || e) }); }

// ui_kits/finance-web/TransactionDrawer.jsx
try { (() => {
function TransactionDrawer({
  tx,
  onClose
}) {
  const {
    Card,
    Button,
    Badge,
    IconTile,
    Icon
  } = window.VisionFinanceDesignSystem_6fe7b7;
  const f = window.FIN;
  const open = !!tx;
  const c = tx && f.cat(tx.category),
    a = tx && f.acct(tx.account);
  return /*#__PURE__*/React.createElement("div", {
    onClick: onClose,
    style: {
      position: 'fixed',
      inset: 0,
      zIndex: 20,
      background: open ? 'rgba(2,5,21,0.55)' : 'transparent',
      pointerEvents: open ? 'auto' : 'none',
      transition: 'background var(--dur-base) var(--ease-out)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    onClick: e => e.stopPropagation(),
    style: {
      position: 'absolute',
      top: 10,
      right: 10,
      bottom: 10,
      width: 400,
      maxWidth: 'calc(100% - 20px)',
      transform: open ? 'none' : 'translateX(110%)',
      transition: 'transform var(--dur-slow) var(--ease-out)'
    }
  }, tx ? /*#__PURE__*/React.createElement(Card, {
    style: {
      height: '100%',
      overflowY: 'auto',
      background: 'linear-gradient(127.569deg,rgba(6,11,40,0.98) 19.41%,rgba(10,14,35,0.92) 76.65%)'
    },
    title: tx.merchant,
    subtitle: f.date(tx.date),
    action: /*#__PURE__*/React.createElement("button", {
      onClick: onClose,
      "aria-label": "Close",
      style: {
        width: 37,
        height: 37,
        borderRadius: 12,
        border: 'none',
        background: 'var(--surface-ghost)',
        color: 'var(--white)',
        cursor: 'pointer',
        fontSize: 18
      }
    }, "\xD7")
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 22
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 14
    }
  }, /*#__PURE__*/React.createElement(IconTile, {
    icon: c.icon,
    size: "lg",
    tone: "blue"
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      flex: 1
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 12,
      color: 'var(--gray-400)'
    }
  }, c.label), /*#__PURE__*/React.createElement("span", {
    style: {
      fontWeight: 700,
      fontSize: 34,
      lineHeight: '42px',
      color: tx.amount > 0 ? 'var(--green-500)' : 'var(--white)'
    }
  }, f.money(tx.amount, true)))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 8
    }
  }, tx.source === 'receipt' ? /*#__PURE__*/React.createElement(Badge, {
    variant: "solid",
    tone: "green"
  }, "From receipt") : /*#__PURE__*/React.createElement(Badge, {
    variant: "outline"
  }, "Bank sync"), /*#__PURE__*/React.createElement(Badge, {
    variant: "outline"
  }, a.name, " \u2022\u2022\u2022\u2022 ", a.number.slice(-4))), tx.items ? /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 0,
      padding: '20px 22px',
      borderRadius: 20,
      background: 'var(--gradient-row)'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      font: 'var(--text-overline)',
      color: 'var(--gray-400)',
      marginBottom: 10
    }
  }, "ITEMS READ FROM RECEIPT"), tx.items.map(([n, v], i) => /*#__PURE__*/React.createElement("div", {
    key: i,
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      padding: '9px 0',
      borderBottom: '0.5px solid var(--navy-400)',
      fontSize: 14
    }
  }, /*#__PURE__*/React.createElement("span", null, n), /*#__PURE__*/React.createElement("span", {
    style: {
      color: 'var(--gray-400)'
    }
  }, f.money(v)))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      paddingTop: 12,
      fontWeight: 700,
      fontSize: 14
    }
  }, /*#__PURE__*/React.createElement("span", null, "Total"), /*#__PURE__*/React.createElement("span", null, f.money(Math.abs(tx.amount))))) : null, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 16,
      alignItems: 'center'
    }
  }, /*#__PURE__*/React.createElement(Button, {
    variant: "text",
    icon: "Edit"
  }, "Edit category"), /*#__PURE__*/React.createElement(Button, {
    variant: "danger",
    icon: "Delete"
  }, "Delete")))) : null));
}
window.TransactionDrawer = TransactionDrawer;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/finance-web/TransactionDrawer.jsx", error: String((e && e.message) || e) }); }

// ui_kits/finance-web/TransactionsScreen.jsx
try { (() => {
function TransactionsScreen({
  onOpenTx
}) {
  const {
    Card,
    Button,
    Badge,
    IconTile,
    Icon
  } = window.VisionFinanceDesignSystem_6fe7b7;
  const d = window.FIN_DATA,
    f = window.FIN;
  const [type, setType] = React.useState('all');
  const [cat, setCat] = React.useState('all');
  const rows = d.transactions.filter(t => t.status === 'done').filter(t => type === 'all' || (type === 'in' ? t.amount > 0 : t.amount < 0)).filter(t => cat === 'all' || t.category === cat);
  const th = {
    fontSize: 10,
    lineHeight: 1.5,
    color: 'var(--gray-400)',
    textTransform: 'uppercase',
    fontWeight: 400,
    textAlign: 'left',
    padding: '0 0 12px',
    borderBottom: '0.5px solid var(--navy-400)'
  };
  const td = {
    padding: '14px 12px 14px 0',
    borderBottom: '0.5px solid var(--navy-400)',
    fontSize: 14,
    lineHeight: 1.4,
    verticalAlign: 'middle'
  };
  const Seg = ({
    v,
    l
  }) => /*#__PURE__*/React.createElement(Button, {
    size: "sm",
    variant: type === v ? 'primary' : 'ghost',
    onClick: () => setType(v)
  }, l);
  return /*#__PURE__*/React.createElement(Card, {
    title: "Transactions",
    subtitle: /*#__PURE__*/React.createElement("span", null, /*#__PURE__*/React.createElement("b", {
      style: {
        color: 'var(--white)'
      }
    }, rows.length), " results"),
    action: /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        gap: 8
      }
    }, /*#__PURE__*/React.createElement(Seg, {
      v: "all",
      l: "All"
    }), /*#__PURE__*/React.createElement(Seg, {
      v: "in",
      l: "Income"
    }), /*#__PURE__*/React.createElement(Seg, {
      v: "out",
      l: "Outcome"
    }))
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 8,
      flexWrap: 'wrap',
      marginBottom: 20
    }
  }, /*#__PURE__*/React.createElement("button", {
    onClick: () => setCat('all'),
    style: {
      height: 28,
      padding: '0 12px',
      borderRadius: 8,
      border: 'none',
      cursor: 'pointer',
      fontFamily: 'var(--font-sans)',
      fontSize: 12,
      background: cat === 'all' ? 'var(--navy-700)' : 'transparent',
      color: 'var(--white)',
      boxShadow: 'inset 0 0 0 1px var(--navy-400)'
    }
  }, "All categories"), d.categories.map(c => /*#__PURE__*/React.createElement("button", {
    key: c.id,
    onClick: () => setCat(c.id),
    style: {
      height: 28,
      padding: '0 12px',
      borderRadius: 8,
      border: 'none',
      cursor: 'pointer',
      fontFamily: 'var(--font-sans)',
      fontSize: 12,
      background: cat === c.id ? 'var(--blue-500)' : 'transparent',
      color: 'var(--white)',
      boxShadow: cat === c.id ? 'none' : 'inset 0 0 0 1px var(--navy-400)'
    }
  }, c.label))), /*#__PURE__*/React.createElement("div", {
    style: {
      overflowX: 'auto'
    }
  }, /*#__PURE__*/React.createElement("table", {
    style: {
      width: '100%',
      borderCollapse: 'collapse',
      minWidth: 760
    }
  }, /*#__PURE__*/React.createElement("thead", null, /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("th", {
    style: th
  }, "Merchant"), /*#__PURE__*/React.createElement("th", {
    style: th
  }, "Category"), /*#__PURE__*/React.createElement("th", {
    style: th
  }, "Account"), /*#__PURE__*/React.createElement("th", {
    style: th
  }, "Source"), /*#__PURE__*/React.createElement("th", {
    style: th
  }, "Date"), /*#__PURE__*/React.createElement("th", {
    style: {
      ...th,
      textAlign: 'right'
    }
  }, "Amount"))), /*#__PURE__*/React.createElement("tbody", null, rows.map(t => {
    const c = f.cat(t.category),
      a = f.acct(t.account);
    return /*#__PURE__*/React.createElement("tr", {
      key: t.id,
      onClick: () => onOpenTx(t),
      style: {
        cursor: 'pointer'
      }
    }, /*#__PURE__*/React.createElement("td", {
      style: td
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 14
      }
    }, /*#__PURE__*/React.createElement(IconTile, {
      icon: c.icon,
      size: "sm",
      tone: t.amount > 0 ? 'blue' : 'navy'
    }), t.merchant)), /*#__PURE__*/React.createElement("td", {
      style: {
        ...td,
        color: 'var(--gray-400)'
      }
    }, c.label), /*#__PURE__*/React.createElement("td", {
      style: td
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        display: 'flex',
        flexDirection: 'column'
      }
    }, /*#__PURE__*/React.createElement("span", null, a.name), /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 12,
        color: 'var(--gray-400)'
      }
    }, "\u2022\u2022\u2022\u2022 ", a.number.slice(-4)))), /*#__PURE__*/React.createElement("td", {
      style: td
    }, t.source === 'receipt' ? /*#__PURE__*/React.createElement(Badge, {
      variant: "solid",
      tone: "green"
    }, "Receipt") : /*#__PURE__*/React.createElement(Badge, {
      variant: "outline"
    }, "Bank")), /*#__PURE__*/React.createElement("td", {
      style: {
        ...td,
        color: 'var(--gray-400)'
      }
    }, new Date(t.date).toLocaleDateString('en-GB')), /*#__PURE__*/React.createElement("td", {
      style: {
        ...td,
        textAlign: 'right',
        paddingRight: 0,
        fontWeight: 700,
        color: t.amount > 0 ? 'var(--green-500)' : 'var(--white)'
      }
    }, f.money(t.amount, true)));
  })))));
}
window.TransactionsScreen = TransactionsScreen;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/finance-web/TransactionsScreen.jsx", error: String((e && e.message) || e) }); }

// ui_kits/finance-web/data.js
try { (() => {
// Mock of the finance-service API: receipts are uploaded from phone, parsed server-side into merchant/category/items.
window.FIN_DATA = {
  user: {
    name: 'Mark Johnson',
    email: 'mark@simmmple.com',
    avatar: '../../assets/images/avatar-1.png'
  },
  accounts: [{
    id: 'chk',
    name: 'Main Checking',
    bank: 'Vision Bank',
    number: '7812 2139 0823 4412',
    validThru: '05/27',
    cvv: '09X',
    balance: 18420.55,
    type: 'Debit'
  }, {
    id: 'sav',
    name: 'Savings',
    bank: 'Vision Bank',
    number: '5531 8820 1173 0098',
    validThru: '11/28',
    cvv: '31X',
    balance: 42100.00,
    type: 'Savings'
  }, {
    id: 'cc',
    name: 'Credit Card',
    bank: 'Nova Credit',
    number: '4024 0071 5520 1987',
    validThru: '02/26',
    cvv: '77X',
    balance: -1265.40,
    type: 'Credit'
  }],
  categories: [{
    id: 'food',
    label: 'Food & Dining',
    icon: 'IONIconCCartDefault'
  }, {
    id: 'groceries',
    label: 'Groceries',
    icon: 'IONIconCCubeDefault'
  }, {
    id: 'transport',
    label: 'Transport',
    icon: 'IONIconRRocketSharp'
  }, {
    id: 'bills',
    label: 'Bills & Utilities',
    icon: 'Domain'
  }, {
    id: 'subs',
    label: 'Subscriptions',
    icon: 'IONIconDDocumentsDefault'
  }, {
    id: 'shopping',
    label: 'Shopping',
    icon: 'IONIconCCardDefault'
  }, {
    id: 'salary',
    label: 'Salary',
    icon: 'IONIconWWalletDefault'
  }, {
    id: 'transfer',
    label: 'Transfer',
    icon: 'IONIconKKeyDefault'
  }],
  transactions: [{
    id: 't1',
    merchant: 'Fresh Market',
    category: 'groceries',
    account: 'chk',
    date: '2026-10-09T09:12',
    amount: -86.40,
    source: 'receipt',
    status: 'done',
    items: [['Milk 2L', 3.2], ['Eggs x12', 4.5], ['Chicken breast', 12.9], ['Vegetables', 18.3], ['Rice 5kg', 14.2], ['Coffee beans', 22.1], ['Tax', 11.2]]
  }, {
    id: 't2',
    merchant: 'Payroll — Simmmple Inc.',
    category: 'salary',
    account: 'chk',
    date: '2026-10-08T08:00',
    amount: 5200.00,
    source: 'bank',
    status: 'done'
  }, {
    id: 't3',
    merchant: 'Netflix',
    category: 'subs',
    account: 'cc',
    date: '2026-10-08T00:30',
    amount: -15.49,
    source: 'bank',
    status: 'done'
  }, {
    id: 't4',
    merchant: 'Blue Bottle Coffee',
    category: 'food',
    account: 'cc',
    date: '2026-10-07T16:36',
    amount: -12.80,
    source: 'receipt',
    status: 'done',
    items: [['Latte', 5.5], ['Croissant', 4.2], ['Tip', 3.1]]
  }, {
    id: 't5',
    merchant: 'City Power & Water',
    category: 'bills',
    account: 'chk',
    date: '2026-10-07T10:05',
    amount: -154.50,
    source: 'receipt',
    status: 'done',
    items: [['Electricity', 98.2], ['Water', 41.3], ['Service fee', 15.0]]
  }, {
    id: 't6',
    merchant: 'Metro Transit',
    category: 'transport',
    account: 'cc',
    date: '2026-10-06T07:45',
    amount: -42.00,
    source: 'bank',
    status: 'done'
  }, {
    id: 't7',
    merchant: 'Transfer to Savings',
    category: 'transfer',
    account: 'chk',
    date: '2026-10-05T12:00',
    amount: -1000.00,
    source: 'bank',
    status: 'done'
  }, {
    id: 't8',
    merchant: 'Uniqlo',
    category: 'shopping',
    account: 'cc',
    date: '2026-10-04T18:20',
    amount: -129.90,
    source: 'receipt',
    status: 'done',
    items: [['Jacket', 79.9], ['T-shirt x2', 39.8], ['Tax', 10.2]]
  }, {
    id: 't9',
    merchant: 'Freelance — Creative Tim',
    category: 'salary',
    account: 'sav',
    date: '2026-10-03T14:10',
    amount: 1700.00,
    source: 'bank',
    status: 'done'
  }, {
    id: 't10',
    merchant: 'Receipt scan',
    category: null,
    account: null,
    date: '2026-10-09T10:41',
    amount: null,
    source: 'receipt',
    status: 'processing'
  }],
  cashflow: {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    income: [5200, 5400, 5200, 6100, 5200, 6900, 5200, 5800, 6500, 6900, 0, 0],
    expense: [3100, 2800, 3500, 3300, 4200, 3900, 3600, 4100, 3700, 2400, 0, 0]
  }
};
window.FIN = {
  money: (v, sign) => {
    if (v === null || v === undefined) return '—';
    const s = Math.abs(v).toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
    return (sign ? v < 0 ? '-' : '+' : v < 0 ? '-' : '') + '$' + s;
  },
  date: iso => {
    const d = new Date(iso);
    return d.toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    }) + ', at ' + d.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  },
  cat: id => window.FIN_DATA.categories.find(c => c.id === id),
  acct: id => window.FIN_DATA.accounts.find(a => a.id === id)
};
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/finance-web/data.js", error: String((e && e.message) || e) }); }

if (__ds_scope.__ds_default_components_icons_icon_data_12stud1$1nb03e1 === undefined) __ds_scope.__ds_default_components_icons_icon_data_12stud1$1nb03e1 = __ds_scope.__ds_default_components_icons_icon_data_12stud1;

__ds_ns.BarChart = __ds_scope.BarChart;

__ds_ns.Gauge = __ds_scope.Gauge;

__ds_ns.LineChart = __ds_scope.LineChart;

__ds_ns.Badge = __ds_scope.Badge;

__ds_ns.Button = __ds_scope.Button;

__ds_ns.Card = __ds_scope.Card;

__ds_ns.IconTile = __ds_scope.IconTile;

__ds_ns.Input = __ds_scope.Input;

__ds_ns.ProgressBar = __ds_scope.ProgressBar;

__ds_ns.Switch = __ds_scope.Switch;

__ds_ns.AvatarsGroup = __ds_scope.AvatarsGroup;

__ds_ns.Balance = __ds_scope.Balance;

__ds_ns.CreditCard = __ds_scope.CreditCard;

__ds_ns.InvoiceItem = __ds_scope.InvoiceItem;

__ds_ns.MiniStat = __ds_scope.MiniStat;

__ds_ns.StatCard = __ds_scope.StatCard;

__ds_ns.TransactionItem = __ds_scope.TransactionItem;

__ds_ns.Icon = __ds_scope.Icon;

__ds_ns.Avatar = __ds_scope.Avatar;

__ds_ns.Breadcrumb = __ds_scope.Breadcrumb;

__ds_ns.HelpCard = __ds_scope.HelpCard;

__ds_ns.Logo = __ds_scope.Logo;

__ds_ns.NavItem = __ds_scope.NavItem;

__ds_ns.PageHeader = __ds_scope.PageHeader;

__ds_ns.Sidebar = __ds_scope.Sidebar;

__ds_ns.SidebarToggle = __ds_scope.SidebarToggle;

__ds_ns.PersonPhoto14 = __ds_scope.PersonPhoto14;

__ds_ns.PersonPhoto16 = __ds_scope.PersonPhoto16;

__ds_ns.PersonPhoto23 = __ds_scope.PersonPhoto23;

__ds_ns.PersonPhoto4 = __ds_scope.PersonPhoto4;

})();
