Animated collapsible dark sidebar — the app's primary navigation.

```jsx
<Sidebar sections={[{items:[{id:"dash",label:"Dashboard",icon:"IONIconHHomeDefault"}]}]} activeId="dash" onSelect={setId} user={{name:"Mark",src:"…"}} help={{image:"…"}}/>
```

264px ↔ 88px, 350ms ease-out. Controlled (collapsed + onToggle) or uncontrolled (defaultCollapsed). Place in a sticky wrapper with height calc(100vh - 20px).
