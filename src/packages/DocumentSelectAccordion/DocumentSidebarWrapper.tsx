export const DocumentSidebarWrapper = (p: { children: React.ReactNode }) => {
  return (
    <div style={{ background: '#ffffff', border: 'solid 1px #b1b4b6' }}>
      {p.children}
    </div>
  );
};
